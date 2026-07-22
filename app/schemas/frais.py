import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class FraisCreate(BaseModel):
    code: str
    titre: str
    montant: float
    date_echeance: datetime
    filiere: Optional[str] = None
    niveau: Optional[str] = None

class FraisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    etablissement_id: uuid.UUID
    code: str
    titre: str
    montant: float
    date_echeance: datetime
    filiere: Optional[str] = None
    niveau: Optional[str] = None
    est_actif: bool
    created_at: datetime
