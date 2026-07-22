import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class StatutRDV(str, enum.Enum):
    PLANIFIE = "planifie"
    CONFIRME = "confirme"
    PASSE = "passe"
    ANNULE = "annule"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    apprenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    date_rdv = Column(DateTime, nullable=False)
    lieu = Column(String(255), nullable=False)
    
    statut = Column(SAEnum(StatutRDV, values_callable=lambda obj: [e.value for e in obj]), nullable=False, default=StatutRDV.PLANIFIE)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation avec User
    apprenant = relationship("User")
