import uuid
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.schemas.notification import NotificationOut
from app.services.notification_service import notification_service
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationOut])
def lister_notifications(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Récupère l'historique des notifications de l'utilisateur."""
    return notification_service.lister_pour_utilisateur(db, user.id)

@router.get("/non-lus/count")
def compter_non_lus(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Récupère le nombre de notifications non lues."""
    count = notification_service.obtenir_nombre_non_lus(db, user.id)
    return {"count": count}

@router.patch("/marquer-tout-lu")
def marquer_tout_lu(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Marque toutes les notifications de l'utilisateur comme lues."""
    notification_service.marquer_tout_comme_lu(db, user.id)
    return {"message": "Toutes les notifications ont été marquées comme lues."}
