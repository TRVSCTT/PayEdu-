import uuid

from jose import jwt

from app.core.config import settings
from app.core.security import creer_access_token, hasher_mot_de_passe, verifier_mot_de_passe


def test_long_password_hash_and_verify():
    long_password = "a" * 100

    hashed = hasher_mot_de_passe(long_password)

    assert hashed != ""
    assert verifier_mot_de_passe(long_password, hashed) is True


def test_unknown_hash_format_returns_false():
    assert verifier_mot_de_passe("secret", "not-a-valid-hash") is False


def test_access_token_contains_user_identity_and_role():
    user_id = uuid.uuid4()

    token = creer_access_token(user_id, "admin")
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

    assert payload["sub"] == str(user_id)
    assert payload["role"] == "admin"
