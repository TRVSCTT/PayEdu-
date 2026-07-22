from typing import Generator

import io
import base64
import qrcode
import uuid
import pyotp


from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials ,HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session 
from sqlalchemy import select

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.user import User , RoleUtilisateur

bearer_scheme = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generer_secret_totp() -> str:
    return pyotp.random_base32()


def generer_qrcode_totp_base64(secret: str, identifiant: str) -> tuple[str, str]:
    """Retourne (provisioning_uri, image_qrcode_base64) à afficher une seule fois
    lors de la configuration du TOTP par l'apprenant (scan avec son app d'authentification)."""
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=identifiant, issuer_name="PayEdu")
    image = qrcode.make(uri)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return uri, base64.b64encode(buffer.getvalue()).decode()


def verifier_code_totp(db: Session, user_id: uuid.UUID, code: str) -> bool:
    """Utilisée pour l'autorisation finale du paiement (Phase 3)."""
    result = db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.totp_secret:
        return False
    # valid_window=1 tolère un décalage d'une période (30s) avant/après, pour l'horloge du téléphone
    return pyotp.TOTP(user.totp_secret).verify(code, valid_window=1)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        try:
            user_uuid = uuid.UUID(user_id)
        except (ValueError, TypeError):
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_uuid).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)):
    if getattr(current_user, "is_active", True) is False:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

"""
def require_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != role and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        return current_user

    return role_checker
"""

def _exiger_role(role_attendu: RoleUtilisateur):
    def dependance(user: User = Depends(get_current_user)) -> User:
        if user.role != role_attendu:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Accès réservé au rôle {role_attendu.value}")
        return user
    return dependance


get_current_admin = _exiger_role(RoleUtilisateur.ADMIN)
get_current_etablissement = _exiger_role(RoleUtilisateur.ETABLISSEMENT)
get_current_apprenant = _exiger_role(RoleUtilisateur.APPRENANT)
get_current_caisse = _exiger_role(RoleUtilisateur.CAISSE)