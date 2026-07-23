"""
Endpoints du catalogue de frais et des quitus.

  POST /objets-paiement                       Établissement crée un frais (libellé, montant, échéance)
  GET  /objets-paiement                        Apprenant consulte les frais de son établissement
  POST /objets-paiement/{id}/quitus            Établissement dépose un quitus pour un apprenant précis
  GET  /quitus/moi                             Apprenant consulte ses quitus déjà déposés
"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select  # noqa: F401
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_apprenant, get_current_etablissement
from app.core.database import get_db
from app.models.user import User
from app.schemas.catalogue import ObjetPaiementCreate, ObjetPaiementOut, QuitusDeposerRequest, QuitusOut
from app.services import catalogue_service

router = APIRouter(tags=["catalogue"])


@router.post("/objets-paiement", response_model=ObjetPaiementOut, status_code=201)
def creer_objet_paiement(
    data: ObjetPaiementCreate,
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement),
):
    return  catalogue_service.creer_objet_paiement(db, etablissement.etablissement_id, data)


@router.get("/objets-paiement", response_model=list[ObjetPaiementOut])
def lister_objets_paiement(
    db: Session = Depends(get_db),
    apprenant: User = Depends(get_current_apprenant),
):
    """L'apprenant ne voit que les frais de son propre établissement."""
    return  catalogue_service.lister_objets_paiement(db, apprenant.etablissement_id)


@router.post("/objets-paiement/{objet_paiement_id}/quitus", response_model=QuitusOut, status_code=201)
def deposer_quitus(
    objet_paiement_id: uuid.UUID,
    data: QuitusDeposerRequest,
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement),
):
    """La scolarité dépose le quitus d'un apprenant précis pour cet objet de paiement."""
    return  catalogue_service.deposer_quitus(db, objet_paiement_id, data)


@router.get("/quitus/moi", response_model=list[QuitusOut])
def mes_quitus(
    db: Session = Depends(get_db),
    apprenant: User = Depends(get_current_apprenant),
):
    return  catalogue_service.lister_quitus_apprenant(db, apprenant.id)