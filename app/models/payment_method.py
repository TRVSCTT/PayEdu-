import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class TypeMethodePaiement(str, enum.Enum):
    MOBILE = "mobile"
    CARD = "card"


class SavedPaymentMethod(Base):
    __tablename__ = "saved_payment_methods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    apprenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    type_methode = Column(SAEnum(TypeMethodePaiement, values_callable=lambda obj: [e.value for e in obj]), nullable=False)
    fournisseur = Column(String(50), nullable=False)  # ex: Orange, MTN, VISA
    
    numero_masque = Column(String(50), nullable=False) # ex: 699XXXXXX ou ****739
    nom_titulaire = Column(String(150), nullable=False)
    origine_fonds = Column(String(50), nullable=True) # Personnel, Parent, etc.
    
    is_default = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation avec User
    apprenant = relationship("User")
