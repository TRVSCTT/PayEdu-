from typing import List
from datetime import datetime, date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_etablissement
from app.models.user import User, RoleUtilisateur
from app.models.payment import Paiement, StatutPaiement
from app.models.frais import Frais
from app.schemas.user import UserOut
from app.schemas.payment import PaiementOut
from app.schemas.frais import FraisOut
from app.schemas.etablissement import EtablissementStatsOut

router = APIRouter(prefix="/etablissement", tags=["etablissement"])

@router.get("/stats", response_model=EtablissementStatsOut)
def obtenir_statistiques(
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement)
):
    """(Côté Etablissement) Obtenir les indicateurs clés pour le tableau de bord."""
    
    # 1. Nombre total d'apprenants inscrits dans cette école
    result_apprenants = db.execute(
        select(func.count(User.id))
        .where(User.etablissement_id == etablissement.id, User.role == RoleUtilisateur.APPRENANT)
    )
    total_apprenants = result_apprenants.scalar() or 0

    # 2. Total encaissé (Paiements TERMINES)
    result_encaisses = db.execute(
        select(func.sum(Paiement.montant))
        .where(Paiement.etablissement_id == etablissement.id, Paiement.statut == StatutPaiement.TERMINE)
    )
    total_encaisses = result_encaisses.scalar() or 0.0

    # 3. Total en attente (Paiements EN_FILE_CAISSE, EN_ATTENTE)
    result_attente = db.execute(
        select(func.sum(Paiement.montant))
        .where(
            Paiement.etablissement_id == etablissement.id,
            Paiement.statut.in_([StatutPaiement.EN_ATTENTE, StatutPaiement.EN_FILE_CAISSE, StatutPaiement.BROUILLON])
        )
    )
    total_attente = result_attente.scalar() or 0.0

    # 4. Nombre de paiements traités aujourd'hui
    aujourd_hui = date.today()
    result_du_jour = db.execute(
        select(func.count(Paiement.id))
        .where(
            Paiement.etablissement_id == etablissement.id,
            Paiement.statut == StatutPaiement.TERMINE,
            func.date(Paiement.updated_at) == aujourd_hui
        )
    )
    paiements_du_jour = result_du_jour.scalar() or 0

    return EtablissementStatsOut(
        total_apprenants=total_apprenants,
        total_paiements_encaisses=float(total_encaisses),
        total_paiements_en_attente=float(total_attente),
        nombre_paiements_du_jour=paiements_du_jour
    )


@router.get("/apprenants", response_model=List[UserOut])
def lister_apprenants(
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement)
):
    """(Côté Etablissement) Lister tous les apprenants inscrits dans cet établissement."""
    result = db.execute(
        select(User)
        .where(User.etablissement_id == etablissement.id, User.role == RoleUtilisateur.APPRENANT)
        .order_by(User.nom.asc())
    )
    apprenants = result.scalars().all()
    
    # Validation pour inclure le nom de l'établissement (optionnel)
    out = []
    for a in apprenants:
        dto = UserOut.model_validate(a)
        dto.etablissement_nom = etablissement.nom
        out.append(dto)
    return out


@router.get("/paiements", response_model=List[PaiementOut])
def lister_paiements_etablissement(
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement)
):
    """(Côté Etablissement) Historique global des paiements de l'établissement."""
    result = db.execute(
        select(Paiement)
        .where(Paiement.etablissement_id == etablissement.id)
        .order_by(Paiement.created_at.desc())
    )
    return result.scalars().all()


@router.get("/frais", response_model=List[FraisOut])
def lister_frais_etablissement(
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement)
):
    """(Côté Etablissement) Lister les frais configurés par l'école."""
    result = db.execute(
        select(Frais)
        .where(Frais.etablissement_id == etablissement.id)
        .order_by(Frais.created_at.desc())
    )
    return result.scalars().all()
