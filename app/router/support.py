import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.message import SupportMessage
from app.models.user import User, RoleUtilisateur
from app.schemas.message import MessageCreate, MessageOut

router = APIRouter(prefix="/support", tags=["support"])

@router.post("/messages", response_model=MessageOut, status_code=201)
def envoyer_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Permet à un apprenant d'envoyer un message au support, ou au support de répondre."""
    nouveau_message = SupportMessage(
        expediteur_id=current_user.id,
        destinataire_id=data.destinataire_id, # Peut être None si l'apprenant écrit au support général
        etablissement_id=current_user.etablissement_id,
        contenu=data.contenu
    )
    db.add(nouveau_message)
    db.commit()
    db.refresh(nouveau_message)
    
    out = MessageOut.model_validate(nouveau_message)
    out.est_moi = True
    return out

@router.get("/messages", response_model=List[MessageOut])
def recuperer_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Récupère l'historique des messages pour l'utilisateur connecté.
    Si c'est un apprenant, il voit sa conversation avec le support.
    Si c'est un admin/caisse, il devrait utiliser l'endpoint `/conversations/{apprenant_id}` pour cibler.
    Mais cet endpoint sert de base.
    """
    # Pour un apprenant, on voit tous les messages qu'il a envoyés ou qu'on lui a envoyés
    result = db.execute(
        select(SupportMessage)
        .where(
            or_(
                SupportMessage.expediteur_id == current_user.id,
                SupportMessage.destinataire_id == current_user.id,
                # Si c'est un apprenant, il peut aussi voir les réponses du support qui lui sont directement adressées
            )
        )
        .order_by(SupportMessage.created_at.asc())
    )
    messages = result.scalars().all()
    
    # Marquer 'est_moi' pour le frontend
    out_messages = []
    for m in messages:
        out = MessageOut.model_validate(m)
        out.est_moi = (m.expediteur_id == current_user.id)
        out_messages.append(out)
        
    return out_messages

@router.get("/conversations", response_model=List[dict])
def lister_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    (Côté Admin/Caisse)
    Renvoie la liste des apprenants ayant initié une conversation.
    Pour l'instant, on renvoie une liste simplifiée (id, nom, prenom, dernier message).
    """
    if current_user.role not in [RoleUtilisateur.ADMIN, RoleUtilisateur.CAISSE, RoleUtilisateur.ETABLISSEMENT]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
        
    # Ceci est une version simplifiée. En réalité, on ferait un group by.
    result = db.execute(
        select(SupportMessage.expediteur_id)
        .where(SupportMessage.destinataire_id.is_(None)) # Messages destinés au support
        .distinct()
    )
    apprenants_ids = result.scalars().all()
    
    conversations = []
    for a_id in apprenants_ids:
        apprenant = db.execute(select(User).where(User.id == a_id)).scalar_one_or_none()
        if apprenant:
            conversations.append({
                "apprenant_id": apprenant.id,
                "nom": apprenant.nom,
                "prenom": apprenant.prenom,
                "matricule": apprenant.matricule
            })
            
    return conversations

@router.get("/conversations/{apprenant_id}", response_model=List[MessageOut])
def recuperer_conversation_apprenant(
    apprenant_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """(Côté Admin/Caisse) Récupère l'historique avec un apprenant précis."""
    if current_user.role not in [RoleUtilisateur.ADMIN, RoleUtilisateur.CAISSE, RoleUtilisateur.ETABLISSEMENT]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
        
    result = db.execute(
        select(SupportMessage)
        .where(
            or_(
                SupportMessage.expediteur_id == apprenant_id,
                SupportMessage.destinataire_id == apprenant_id
            )
        )
        .order_by(SupportMessage.created_at.asc())
    )
    messages = result.scalars().all()
    
    out_messages = []
    for m in messages:
        out = MessageOut.model_validate(m)
        out.est_moi = (m.expediteur_id == current_user.id)
        out_messages.append(out)
        
    return out_messages
