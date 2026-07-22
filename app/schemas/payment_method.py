from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

from app.models.payment_method import TypeMethodePaiement

class PaymentMethodBase(BaseModel):
    type_methode: TypeMethodePaiement
    fournisseur: str
    numero_masque: str
    nom_titulaire: str
    origine_fonds: Optional[str] = None
    is_default: Optional[bool] = False

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodOut(PaymentMethodBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    apprenant_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
