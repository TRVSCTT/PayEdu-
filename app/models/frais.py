import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, String, Numeric, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

class Frais(Base):
    __tablename__ = "frais"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissements.id"), nullable=False, index=True)
    
    code = Column(String(50), nullable=False) # ex: 'IS', 'P1', 'VM'
    titre = Column(String(100), nullable=False) # ex: 'Inscription spéciale'
    montant = Column(Numeric(12, 2), nullable=False)
    date_echeance = Column(DateTime, nullable=False)
    
    # Pour simplifier, on applique les frais à toutes les filières/niveaux ou on laisse null
    filiere = Column(String(100), nullable=True) 
    niveau = Column(String(50), nullable=True)
    
    est_actif = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
