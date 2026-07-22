import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expediteur_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Si le destinataire_id est nul, le message est adressé au support "général" de l'établissement
    destinataire_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissements.id"), nullable=True)

    contenu = Column(Text, nullable=False)
    est_lu = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    expediteur = relationship("User", foreign_keys=[expediteur_id])
    destinataire = relationship("User", foreign_keys=[destinataire_id])
