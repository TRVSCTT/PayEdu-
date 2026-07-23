from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User, RoleUtilisateur
from app.models.payment import Paiement, StatutPaiement
from app.schemas.user import UserOut
from app.schemas.payment import PaiementOut
from app.schemas.admin import AdminStatsOut

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=AdminStatsOut)
def obtenir_statistiques_globales(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """(Côté Admin) Obtenir les indicateurs clés globaux de la plateforme."""
    
    # 1. Total des établissements
    result_ecoles = db.execute(
        select(func.count(User.id))
        .where(User.role == RoleUtilisateur.ETABLISSEMENT)
    )
    total_etablissements = result_ecoles.scalar() or 0

    # 2. Total des apprenants (toutes écoles confondues)
    result_apprenants = db.execute(
        select(func.count(User.id))
        .where(User.role == RoleUtilisateur.APPRENANT)
    )
    total_apprenants = result_apprenants.scalar() or 0

    # 3. Volume financier total encaissé (Paiements TERMINES)
    result_volume = db.execute(
        select(func.sum(Paiement.montant))
        .where(Paiement.statut == StatutPaiement.TERMINE)
    )
    total_volume_financier = result_volume.scalar() or 0.0

    # 4. Total des transactions
    result_transactions = db.execute(select(func.count(Paiement.id)))
    total_transactions = result_transactions.scalar() or 0
    
    # 5. Transactions en attente globale
    result_attente = db.execute(
        select(func.count(Paiement.id))
        .where(Paiement.statut.in_([StatutPaiement.EN_ATTENTE, StatutPaiement.EN_FILE_CAISSE]))
    )
    transactions_en_attente = result_attente.scalar() or 0

    return AdminStatsOut(
        total_etablissements=total_etablissements,
        total_apprenants=total_apprenants,
        total_volume_financier=float(total_volume_financier),
        total_transactions=total_transactions,
        transactions_en_attente=transactions_en_attente
    )


@router.get("/etablissements", response_model=List[UserOut])
def lister_etablissements(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """(Côté Admin) Lister tous les établissements inscrits."""
    result = db.execute(
        select(User)
        .where(User.role == RoleUtilisateur.ETABLISSEMENT)
        .order_by(User.nom_etablissement.asc())
    )
    return result.scalars().all()


@router.get("/paiements", response_model=List[PaiementOut])
def lister_paiements_globaux(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """(Côté Admin) Historique de tous les paiements de toutes les écoles."""
    result = db.execute(
        select(Paiement)
        .order_by(Paiement.created_at.desc())
    )
    return result.scalars().all()
