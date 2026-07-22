import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentOut, AppointmentCreate

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.get("", response_model=List[AppointmentOut])
def lister_rdv(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Récupère la liste des rendez-vous de l'apprenant, triée par date."""
    appointments = db.query(Appointment).filter(Appointment.apprenant_id == user.id).order_by(Appointment.date_rdv.asc()).all()
    return appointments

@router.post("", response_model=AppointmentOut)
def planifier_rdv(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Planifie un nouveau rendez-vous pour l'apprenant (utile pour les tests ou une API complète)."""
    new_rdv = Appointment(
        apprenant_id=user.id,
        **data.model_dump()
    )
    db.add(new_rdv)
    db.commit()
    db.refresh(new_rdv)
    return new_rdv
