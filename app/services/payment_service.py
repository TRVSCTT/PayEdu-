"""
Logique métier du module de paiement.

Ce fichier suppose l'existence, ailleurs dans ton projet, de :
- `app.db.session.get_db` / `AsyncSessionLocal` (session SQLAlchemy async)
- `app.core.security.verifier_code_totp(user_id, code) -> bool`
- Une table de tarification réelle (ici simulée par TARIFS, à remplacer)
"""

import uuid
from datetime import datetime
from decimal import Decimal  # noqa: F401

from fastapi import HTTPException
from sqlalchemy import  func , select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal  # noqa: F401
from app.core.security import verifier_code_totp
from app.models.objet_paiement import ObjetPaiement
from app.models.payment import  Paiement, PaiementQRCode, StatutPaiement, TypeQRCode  #MoyenPaiement
from app.schemas.payment import (
    PaiementAutorisation,
    PaiementFormulaire1,
    PaiementFormulaire2Confirmation,
    PaiementFormulaire3,
    MoyenPaiement
)
from app.services.cinetpay import CinetPayError, get_cinetpay_client
from app.services.qrcode_services import generer_contenus_qrcodes



def _recuperer_paiement(db: Session, paiement_id: uuid.UUID, apprenant_id: uuid.UUID) -> Paiement:
    result = db.execute(
        select(Paiement).where(Paiement.id == paiement_id, Paiement.apprenant_id == apprenant_id)
    )
    paiement = result.scalar_one_or_none()
    if paiement is None:
        raise HTTPException(404, "Paiement introuvable")
    return paiement


def _exiger_statut(paiement: Paiement, attendu: StatutPaiement) -> None:
    if paiement.statut != attendu:
        raise HTTPException(
            409, f"Action impossible : le paiement est au statut '{paiement.statut.value}'"
        )


# --- Phase 2, formulaire 1 : sélection établissement / objet / moyen ---------

def creer_brouillon(db: Session, apprenant_id: uuid.UUID, data: PaiementFormulaire1) -> Paiement:
    result = db.execute(
        select(ObjetPaiement.montant).where(
            ObjetPaiement.id == data.objet_paiement_id,
            ObjetPaiement.etablissement_id == data.etablissement_id
        )
    )
    montant = result.scalar_one_or_none()
    if montant is None:
        raise HTTPException(400, "Objet de paiement inconnu")

    paiement = Paiement(
        apprenant_id=apprenant_id,
        etablissement_id=data.etablissement_id,
        objet_paiement_id=data.objet_paiement_id,
        moyen_paiement=data.moyen_paiement,
        montant=montant,
        statut=StatutPaiement.BROUILLON,
    )
    db.add(paiement)
    db.commit()
    db.refresh(paiement)
    return paiement


# --- Phase 2, formulaire 2 : vérification des infos extraites du quitus -----

def confirmer_informations(
    db: Session, paiement_id: uuid.UUID, apprenant_id: uuid.UUID, data: PaiementFormulaire2Confirmation
) -> Paiement:
    paiement = _recuperer_paiement(db, paiement_id, apprenant_id)
    _exiger_statut(paiement, StatutPaiement.BROUILLON)

    paiement.infos_confirmees = data.infos_confirmees.model_dump()
    paiement.statut = StatutPaiement.INFO_VERIFIEE
    db.commit()
    db.refresh(paiement)
    return paiement


# --- Phase 2, formulaire 3 : numéro du compte mobile money ------------------

def definir_moyen_paiement(
    db: Session, paiement_id: uuid.UUID, apprenant_id: uuid.UUID, data: PaiementFormulaire3
) -> Paiement:
    paiement =_recuperer_paiement(db, paiement_id, apprenant_id)
    _exiger_statut(paiement, StatutPaiement.INFO_VERIFIEE)

    if paiement.moyen_paiement == MoyenPaiement.CARTE_BANCAIRE:
        champs_requis = {
            "email_paiement":data.email_paiement,
            "adresse_paiement":data.adresse_paiement,
            "ville_paiement":data.ville_paiement,
            "code_postal_paiement":data.code_postal_paiement
        }
        manquants = [ nom for nom , valeur in champs_requis.items() if not valeur]
        if manquants:
            raise HTTPException(
                400,
                f"Paiement par carte : champs requis manquants : {','.join(manquants)}",
            )



    paiement.numero_compte_paiement = data.numero_compte_paiement
    paiement.statut = StatutPaiement.MOYEN_DEFINI
    db.commit()
    db.refresh(paiement)
    return paiement


# --- Phase 3 : récapitulatif -------------------------------------------------

def obtenir_recapitulatif(db: Session, paiement_id: uuid.UUID, apprenant_id: uuid.UUID) -> Paiement:
    paiement = _recuperer_paiement(db, paiement_id, apprenant_id)
    _exiger_statut(paiement, StatutPaiement.MOYEN_DEFINI)
    return paiement


# --- Phase 3 : autorisation finale (TOTP) par cinetpay---

def autoriser_paiement(
    db: Session,
    paiement_id: uuid.UUID,
    apprenant_id: uuid.UUID,
    data: PaiementAutorisation,
) -> tuple[Paiement, str]:
    """Vérifie le TOTP, initialise la transaction chez CinetPay, renvoie (paiement, payment_url).

    payment_url est l'URL de checkout hébergée par CinetPay : c'est elle que
    ton frontend doit ouvrir/rediriger pour que l'apprenant choisisse et
    confirme son moyen de paiement (Orange Money, MTN MoMo, carte...).
    """
    paiement = _recuperer_paiement(db, paiement_id, apprenant_id)
    _exiger_statut(paiement, StatutPaiement.MOYEN_DEFINI)

    if not verifier_code_totp(db,apprenant_id, data.code_totp):
        raise HTTPException(401, "Code de sécurité invalide ou expiré")

    objet = (db.execute(
        select(ObjetPaiement).where(ObjetPaiement.id==paiement.objet_paiement_id)
    )).scalar_one_or_none()
    libelle_objet = objet.libelle if objet else "Paiement PayEdu"

    infos = paiement.infos_confirmees or {}
    nom_complet = infos.get("nom", "Apprenant PayEdu").split(" ", 1)
    prenom_client = nom_complet[0]
    nom_client = nom_complet[1] if len(nom_complet) > 1 else "N/A"

    reference_transaction = str(uuid.uuid4())
    client = get_cinetpay_client()
    try:
        resultat = client.initier_paiement(
            transaction_id=reference_transaction,
            montant=float(paiement.montant),
            description=f"{libelle_objet} - {infos.get('matricule', '')}",
            numero_client=paiement.numero_compte_paiement,
            nom_client=nom_client,
            prenom_client=prenom_client,
            moyen_paiement=paiement.moyen_paiement.value,
            email_client=paiement.email_paiement,
            adresse_client=paiement.adresse_paiement,
            ville_client=paiement.ville_paiement,
            code_postal_client=paiement.code_postal_paiement,
        )
    except CinetPayError as exc:
        raise HTTPException(502, f"Impossible d'initialiser le paiement : {exc}") from exc

    paiement.reference_transaction = reference_transaction
    paiement.statut = StatutPaiement.EN_ATTENTE_OPERATEUR
    paiement.autorise_at = datetime.utcnow()
    db.commit()
    db.refresh(paiement)

    return paiement, resultat["payment_url"]


# --- Webhook opérateur --------------------------------------------------------

def traiter_webhook_cinetpay(db: Session, cpm_trans_id: str) -> Paiement:
    """Traite la notification CinetPay (notify_url).

    Important : on NE FAIT JAMAIS confiance au contenu POSTé par la
    notification elle-même (c'est la recommandation officielle de CinetPay
    contre le man-in-the-middle). On récupère uniquement le transaction_id,
    puis on rappelle l'API de vérification pour connaître le statut réel.
    """
    result =db.execute(select(Paiement).where(Paiement.reference_transaction == cpm_trans_id))
    paiement = result.scalar_one_or_none()
    if paiement is None:
        raise HTTPException(404, "Transaction inconnue")

    # Notification déjà traitée (CinetPay peut appeler plusieurs fois) : ne rien refaire.
    if paiement.statut not in (StatutPaiement.EN_ATTENTE_OPERATEUR,):
        return paiement

    client = get_cinetpay_client()
    try:
        verification =client.verifier_transaction(cpm_trans_id)
    except CinetPayError as exc:
        # On ne change pas le statut ici : CinetPay rappellera, ou le polling de secours le fera.
        paiement.motif_echec = str(exc)
        db.commit()
        return paiement

    statut_cinetpay = verification["statut"]

    if statut_cinetpay == "ACCEPTED":
        paiement.reference_operateur = verification.get("reference_operateur")
        contenus = generer_contenus_qrcodes(paiement)
        for type_code, contenu in contenus.items():
            db.add(PaiementQRCode(paiement_id=paiement.id, type_code=type_code, contenu=contenu))
        paiement.statut = StatutPaiement.EN_FILE_CAISSE
    elif statut_cinetpay == "REFUSED":
        paiement.statut = StatutPaiement.ECHOUEE
        paiement.motif_echec = "Paiement refusé par l'opérateur (CinetPay)"
    # "WAITING_FOR_CUSTOMER" : l'apprenant n'a pas encore validé sur son téléphone,
    # on laisse le statut EN_ATTENTE_OPERATEUR — CinetPay renotifiera.

    db.commit()
    db.refresh(paiement)
    return paiement


# --- Côté caisse : scan des QR codes puis finalisation ------------------------

def scanner_qrcode_caisse(db: Session, paiement_id: uuid.UUID, type_code: TypeQRCode) -> PaiementQRCode:
    result = db.execute(
        select(PaiementQRCode).where(
            PaiementQRCode.paiement_id == paiement_id, PaiementQRCode.type_code == type_code
        )
    )
    qrcode_obj = result.scalar_one_or_none()
    if qrcode_obj is None:
        raise HTTPException(404, "QR code introuvable pour ce paiement")

    qrcode_obj.scanne = "1"
    qrcode_obj.scanne_at = datetime.utcnow()
    db.commit()
    db.refresh(qrcode_obj)
    return qrcode_obj

def _generer_numero_recu(db:Session)-> str:
    """Format PAY-{annee}-{compteur sur  chiffres} , ex: PAY-2026-OO42."""
    annee = datetime.utcnow().year
    compteur = db.query(func.count()).filter(
        Paiement.numero_recu.like(f"PAY-{annee}-%")
    ).scalar() + 1
    return f"PAY-{annee}-{compteur:04d}"


def finaliser_caisse(db: Session, paiement_id: uuid.UUID) -> Paiement:
    result = db.execute(select(Paiement).where(Paiement.id == paiement_id))
    paiement = result.scalar_one_or_none()
    if paiement is None:
        raise HTTPException(404, "Paiement introuvable")
    _exiger_statut(paiement, StatutPaiement.EN_FILE_CAISSE)

    result_qr = db.execute(select(PaiementQRCode).where(PaiementQRCode.paiement_id == paiement_id))
    qrcodes = result_qr.scalars().all()
    if any(qr.scanne != "1" for qr in qrcodes):
        raise HTTPException(409, "Les 4 QR codes doivent être scannés avant validation")

    paiement.statut = StatutPaiement.ACQUITTEE
    paiement.acquitte_at = datetime.utcnow()
    paiement.numero_recu = _generer_numero_recu(db)
    db.commit()
    db.refresh(paiement)
    return paiement
