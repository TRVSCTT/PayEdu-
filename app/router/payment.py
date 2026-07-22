"""
Endpoints du module paiement — PayEdu.

Résumé des routes (préfixe /payments) :

  POST   /payments                              Phase 2 · Formulaire 1 : créer le brouillon
  PATCH  /payments/{id}/informations             Phase 2 · Formulaire 2 : confirmer les infos du quitus
  PATCH  /payments/{id}/moyen-paiement            Phase 2 · Formulaire 3 : définir le compte mobile money
  GET    /payments/{id}/recapitulatif             Phase 3 : récapitulatif avant confirmation
  POST   /payments/{id}/autoriser                 Phase 3 : autorisation TOTP + initialisation CinetPay
  GET    /payments/{id}                           Consultation du statut (utile en polling pendant l'attente)
  POST   /payments/webhooks/cinetpay              Webhook CinetPay (notify_url) — PAS d'authentification JWT
  GET    /payments/caisse/queue                   File d'attente caisse (paiements prêts à valider)
  POST   /payments/caisse/{id}/scan/{type_code}   Scan d'un des 4 QR codes par la caisse
  POST   /payments/caisse/{id}/finaliser          Finalisation caisse → facture acquittée

Dépendances supposées déjà existantes ailleurs dans le projet :
  - app.db.session.get_db
  - app.core.security.get_current_apprenant (JWT, rôle apprenant)
  - app.core.security.get_current_caisse (JWT, rôle caisse/établissement)
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Form
from sqlalchemy import select
from sqlalchemy.orm import  Session

from app.core.dependencies import get_current_apprenant, get_current_caisse
from app.core.database import get_db
from app.models.payment import Paiement, StatutPaiement, TypeQRCode
from app.schemas.payment import (
    PaiementAutorisation,
    PaiementAutorisationOut,
    PaiementFormulaire1,
    PaiementFormulaire2Confirmation,
    PaiementFormulaire3,
    PaiementOut,
    PaiementRecapitulatif,
)
from app.services import payment_service

router = APIRouter(prefix="/payments", tags=["paiements"])


# --- Phase 2 : les 3 formulaires ---------------------------------------------

@router.post("", response_model=PaiementOut, status_code=201)
def initier_paiement(
    data: PaiementFormulaire1,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """Formulaire 1 : établissement, objet du paiement, moyen de paiement souhaité."""
    return payment_service.creer_brouillon(db, apprenant.id, data)


@router.patch("/{paiement_id}/informations", response_model=PaiementOut)
def confirmer_informations(
    paiement_id: uuid.UUID,
    data: PaiementFormulaire2Confirmation,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """Formulaire 2 : l'apprenant valide (ou corrige) les infos extraites du quitus."""
    return  payment_service.confirmer_informations(db, paiement_id, apprenant.id, data)


@router.patch("/{paiement_id}/moyen-paiement", response_model=PaiementOut)
def definir_moyen_paiement(
    paiement_id: uuid.UUID,
    data: PaiementFormulaire3,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """Formulaire 3 : numéro du compte mobile money qui servira au checkout CinetPay."""
    return  payment_service.definir_moyen_paiement(db, paiement_id, apprenant.id, data)


# --- Phase 3 : récapitulatif, autorisation -----------------------------------

@router.get("/{paiement_id}/recapitulatif", response_model=PaiementRecapitulatif)
async def recapitulatif(
    paiement_id: uuid.UUID,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    return  payment_service.obtenir_recapitulatif(db, paiement_id, apprenant.id)


@router.post("/{paiement_id}/autoriser", response_model=PaiementAutorisationOut)
def autoriser_paiement(
    paiement_id: uuid.UUID,
    data: PaiementAutorisation,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """Vérifie le code TOTP puis initialise la transaction chez CinetPay.

    Le frontend doit rediriger l'apprenant vers `payment_url` renvoyée ici
    (page de checkout hébergée par CinetPay) pour qu'il confirme le paiement
    sur son téléphone.
    """
    paiement, payment_url = payment_service.autoriser_paiement(db, paiement_id, apprenant.id, data)
    return PaiementAutorisationOut(id=paiement.id, statut=paiement.statut, payment_url=payment_url)


@router.get("/historique", response_model=list[PaiementOut])
def historique_paiements(
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """(Côté Apprenant) Historique de tous ses paiements."""
    result = db.execute(
        select(Paiement)
        .where(Paiement.apprenant_id == apprenant.id)
        .order_by(Paiement.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{paiement_id}", response_model=PaiementOut)
def consulter_paiement(
    paiement_id: uuid.UUID,
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """Permet au frontend de faire du polling pendant l'écran 'paiement en cours'."""
    result = db.execute(
        select(Paiement).where(Paiement.id == paiement_id, Paiement.apprenant_id == apprenant.id)
    )
    paiement = result.scalar_one_or_none()
    if paiement is None:
        from fastapi import HTTPException
        raise HTTPException(404, "Paiement introuvable")
    return paiement


# --- Webhook CinetPay ---------------------------------------------------------

@router.post("/webhooks/cinetpay", status_code=200, include_in_schema=False)
def webhook_cinetpay(
    cpm_trans_id: Annotated[str, Form()],
    cpm_site_id: Annotated[str | None, Form()] = None,
    db: Session = Depends(get_db),
):
    """notify_url appelée par CinetPay en POST x-www-form-urlencoded.

    Aucune dépendance JWT ici : CinetPay n'est pas un utilisateur authentifié
    de ton application. La sécurité vient du fait qu'on ignore tout le corps
    de la requête à part cpm_trans_id, et qu'on revérifie la transaction
    directement auprès de CinetPay (voir payment_service.traiter_webhook_cinetpay).
    Pense à whitelister les IP de CinetPay au niveau de ton reverse proxy /
    firewall en production (leur documentation fournit la liste).
    """
    payment_service.traiter_webhook_cinetpay(db, cpm_trans_id)
    return {"code": "00", "message": "OK"}  # CinetPay attend une réponse 200 simple


# --- Côté caisse ---------------------------------------------------------------

@router.get("/caisse/queue", response_model=list[PaiementOut])
def file_attente_caisse(
    db: Session = Depends(get_db),
    caisse=Depends(get_current_caisse),
):
    result = db.execute(
        select(Paiement).where(
            Paiement.etablissement_id == caisse.etablissement_id,
            Paiement.statut == StatutPaiement.EN_FILE_CAISSE,
        )
    )
    return result.scalars().all()


@router.post("/caisse/{paiement_id}/scan/{type_code}")
def scanner_qrcode(
    paiement_id: uuid.UUID,
    type_code: TypeQRCode,
    db: Session = Depends(get_db),
    caisse=Depends(get_current_caisse),
):
    return  payment_service.scanner_qrcode_caisse(db, paiement_id, type_code)


@router.post("/caisse/{paiement_id}/finaliser", response_model=PaiementOut)
def finaliser_caisse(
    paiement_id: uuid.UUID,
    db: Session = Depends(get_db),
    caisse=Depends(get_current_caisse),
):
    return  payment_service.finaliser_caisse(db, paiement_id)