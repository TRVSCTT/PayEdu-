import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

class TypeNotification(str, enum.Enum):
    SYSTEME = "SYSTEME"
    PAIEMENT = "PAIEMENT"
    CONFIRMATION = "CONFIRMATION"
    ALERTE = "ALERTE"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    titre = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type_notification = Column(SAEnum(TypeNotification, values_callable=lambda enum_cls: [e.value for e in enum_cls]), nullable=False, default=TypeNotification.SYSTEME)
    
    est_lu = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
