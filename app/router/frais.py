import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_apprenant, get_current_etablissement
from app.core.database import get_db
from app.schemas.frais import FraisCreate, FraisOut
from app.services.frais_service import frais_service

router = APIRouter(prefix="/frais", tags=["frais"])

@router.post("", response_model=FraisOut, status_code=201)
def creer_frais(
    data: FraisCreate,
    db: Session = Depends(get_db),
    etablissement=Depends(get_current_etablissement),
):
    """(Côté Etablissement) Créer un nouveau type de frais."""
    return frais_service.creer_frais(db, etablissement.id, data)


@router.get("", response_model=List[FraisOut])
def lister_frais(
    db: Session = Depends(get_db),
    apprenant=Depends(get_current_apprenant),
):
    """(Côté Apprenant) Récupère tous les frais liés à son établissement."""
    if not apprenant.etablissement_id:
        raise HTTPException(400, "L'apprenant n'est rattaché à aucun établissement.")
        
    return frais_service.lister_frais_par_etablissement(
        db, 
        apprenant.etablissement_id,
        filiere=apprenant.filiere,
        niveau=apprenant.niveau
    )
