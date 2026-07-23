import uuid

from sqlalchemy import Column, DateTime,ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID 

from app.core.database import Base
from datetime import datetime







class Quitus(Base):
    __tablename__ = "quitus"
    __tableargs__ = (
        UniqueConstraint("objet_paiement_id", "apprenant_id", name="uq_quitus_paiement_id"),
    )
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    objet_paiement_id = Column(UUID(as_uuid=True), ForeignKey("objets_paiement.id"), nullable=False, index=True)
    apprenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    url_fichier= Column(String(255), nullable=False)
    taille_octets = Column(Integer , nullable=True)
    deposee_le= Column(DateTime, default=datetime.utcnow)