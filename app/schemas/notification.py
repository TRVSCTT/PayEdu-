import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.notification import TypeNotification

class NotificationCreate(BaseModel):
    user_id: uuid.UUID
    titre: str
    message: str
    type_notification: TypeNotification

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    titre: str
    message: str
    type_notification: TypeNotification
    est_lu: bool
    created_at: datetime
