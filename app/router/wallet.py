import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.payment_method import SavedPaymentMethod
from app.schemas.payment_method import PaymentMethodOut, PaymentMethodCreate

router = APIRouter(prefix="/wallet", tags=["wallet"])

@router.get("", response_model=List[PaymentMethodOut])
def lister_moyens_paiement(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Récupère la liste des moyens de paiement sauvegardés de l'apprenant."""
    methods = db.query(SavedPaymentMethod).filter(SavedPaymentMethod.apprenant_id == user.id).all()
    return methods

@router.post("", response_model=PaymentMethodOut)
def ajouter_moyen_paiement(
    data: PaymentMethodCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Ajoute un nouveau moyen de paiement au portefeuille."""
    
    # Masquer le numéro si ce n'est pas déjà fait (sécurité de base)
    # Pour un numéro de carte (ex: 1234567890123456 -> ******3456)
    # Pour un mobile (ex: 699123456 -> ******3456)
    numero_str = str(data.numero_masque)
    if not numero_str.startswith("*") and len(numero_str) > 4:
        numero_str = "*" * 6 + numero_str[-4:]
        data.numero_masque = numero_str

    new_method = SavedPaymentMethod(
        apprenant_id=user.id,
        **data.model_dump()
    )
    db.add(new_method)
    db.commit()
    db.refresh(new_method)
    return new_method
