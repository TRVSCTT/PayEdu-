import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class MessageCreate(BaseModel):
    contenu: str = Field(..., min_length=1, max_length=1000)
    # destinataire_id is optional. If missing, it goes to the general support (admin)
    destinataire_id: Optional[uuid.UUID] = None

class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    expediteur_id: uuid.UUID
    destinataire_id: Optional[uuid.UUID] = None
    contenu: str
    est_lu: bool
    created_at: datetime
    
    # Add a field to easily tell the frontend if the message was sent by the current user
    # This will be populated by the router logic
    est_moi: Optional[bool] = None
