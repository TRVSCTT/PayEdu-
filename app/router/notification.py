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

@router.post("/test", response_model=NotificationOut)
def creer_notification_test(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Créer une notification de test pour l'utilisateur connecté (Utile pour tester l'UI)."""
    from app.schemas.notification import NotificationCreate
    from app.models.notification import TypeNotification
    
    data = NotificationCreate(
        user_id=user.id,
        titre="Bienvenue sur PayEdu !",
        message="Ceci est une notification générée depuis le backend pour tester le système.",
        type_notification=TypeNotification.SYSTEME
    )
    return notification_service.creer_notification(db, data)

@router.post("/seed/{matricule}", response_model=NotificationOut)
def seed_notification(
    matricule: str,
    titre: str = "Test de notification",
    message: str = "Ceci est un test de notification généré sans authentification.",
    db: Session = Depends(get_db)
):
    """(DÉBOGAGE) Créer une notification pour un apprenant via son matricule sans être connecté."""
    from sqlalchemy import select
    from app.schemas.notification import NotificationCreate
    from app.models.notification import TypeNotification
    
    result = db.execute(select(User).where(User.matricule == matricule))
    user = result.scalar_one_or_none()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(404, "Utilisateur introuvable")
        
    data = NotificationCreate(
        user_id=user.id,
        titre=titre,
        message=message,
        type_notification=TypeNotification.ALERTE
    )
    return notification_service.creer_notification(db, data)
