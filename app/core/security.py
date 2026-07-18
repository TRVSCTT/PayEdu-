import io
import base64
import uuid

try:
    import pyotp
except ImportError:  # pragma: no cover
    pyotp = None

try:
    import qrcode
except ImportError:  # pragma: no cover
    qrcode = None
from app.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from app.models.user import RoleUtilisateur
from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _normalize_password(password: str) -> str:
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(_normalize_password(password))


def hasher_mot_de_passe(password: str) -> str:
    return pwd_context.hash(_normalize_password(password))


def verifier_mot_de_passe(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        return pwd_context.verify(_normalize_password(plain_password), hashed_password)
    except (UnknownHashError, ValueError):
        return False

def generer_secret_totp() -> str:
    if pyotp is None:
        raise RuntimeError("pyotp package is not installed")
    return pyotp.random_base32()


def generer_qrcode_totp_base64(secret: str, identifiant: str) -> tuple[str, str]:
    """Retourne (provisioning_uri, image_qrcode_base64) à afficher une seule fois
    lors de la configuration du TOTP par l'apprenant (scan avec son app d'authentification)."""
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=identifiant, issuer_name="PayEdu")
    if qrcode is None:
        raise RuntimeError("qrcode package is not installed")
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


def creer_access_token(user_id: uuid.UUID | str, role: RoleUtilisateur, expires_delta: timedelta | None = None) -> str:
    to_encode = {
        "sub": str(user_id),
        "role": role.value,
    }

    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


