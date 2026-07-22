import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID 
from app.core.database import Base

from datetime import datetime



class ObjetPaiement(Base):
    __tablename__ = "objets_paiement"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissements.id"), nullable=False, index=True)

    libelle = Column(String(100), nullable=False)
    montant = Column(Numeric(12, 2), nullable=False)
    echeance = Column(DateTime, nullable=True)
    phase = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)