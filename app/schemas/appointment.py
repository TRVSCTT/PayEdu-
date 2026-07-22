from typing import Optional
from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

from app.models.appointment import StatutRDV

class AppointmentBase(BaseModel):
    date_rdv: datetime
    lieu: str
    statut: Optional[StatutRDV] = StatutRDV.PLANIFIE

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentOut(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    apprenant_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
