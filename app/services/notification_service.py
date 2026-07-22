import uuid
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, update

from app.models.notification import Notification, TypeNotification
from app.schemas.notification import NotificationCreate

class NotificationService:
    def creer_notification(self, db: Session, data: NotificationCreate) -> Notification:
        nouvelle_notif = Notification(**data.model_dump())
        db.add(nouvelle_notif)
        db.commit()
        db.refresh(nouvelle_notif)
        return nouvelle_notif

    def lister_pour_utilisateur(self, db: Session, user_id: uuid.UUID) -> List[Notification]:
        result = db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )
        return result.scalars().all()
        
    def obtenir_nombre_non_lus(self, db: Session, user_id: uuid.UUID) -> int:
        result = db.execute(
            select(Notification).where(
                Notification.user_id == user_id, 
                Notification.est_lu == False
            )
        )
        return len(result.scalars().all())

    def marquer_tout_comme_lu(self, db: Session, user_id: uuid.UUID):
        db.execute(
            update(Notification)
            .where(Notification.user_id == user_id, Notification.est_lu == False)
            .values(est_lu=True)
        )
        db.commit()

notification_service = NotificationService()
