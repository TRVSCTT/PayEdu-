"""
Endpoints d'authentification — PayEdu.

  POST /auth/register/admin            Créer un admin (à protéger/désactiver en prod, ou seed only)
  POST /auth/register/etablissement     Créer un établissement + son compte gestionnaire (réservé admin)
  POST /auth/register/apprenant         Créer un compte apprenant (réservé établissement)
  POST /auth/register/caisse            Créer un compte caisse (réservé établissement)
  POST /auth/login                      Connexion (email ou matricule + mot de passe) → JWT
  GET  /auth/totp/setup                 Génère/renvoie le QR code TOTP de l'utilisateur connecté
  GET  /auth/me                         Profil de l'utilisateur connecté
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    generer_qrcode_totp_base64,
    get_current_admin,
    get_current_etablissement,
    get_current_user,
)

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import (
    AdminCreate,
    ApprenantCreate,
    CaisseCreate,
    EtablissementCreate,
    LoginRequest,
    TOTPSetupOut,
    TokenResponse,
    UserOut,
    UserUpdate
)
from app.services import user_service

router = APIRouter(prefix="/auth", tags=["authentification"])


@router.post("/register/admin", response_model=UserOut, status_code=201)
def creer_admin(data: AdminCreate, db: Session = Depends(get_db)):
    # À restreindre fortement en production (script de seed, ou protégé par une clé d'installation).
    return  user_service.creer_admin(db, data)


@router.post("/register/etablissement", response_model=UserOut, status_code=201)
def creer_etablissement(
    data: EtablissementCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return  user_service.creer_etablissement(db, data)


@router.post("/register/apprenant", response_model=UserOut, status_code=201)
def creer_apprenant(
    data: ApprenantCreate,
    db: Session = Depends(get_db),
):
    return  user_service.creer_apprenant(db, data)


@router.post("/register/caisse", response_model=UserOut, status_code=201)
def creer_caisse(
    data: CaisseCreate,
    db: Session = Depends(get_db),
    etablissement: User = Depends(get_current_etablissement),
):
    return  user_service.creer_caisse(db, data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return  user_service.authentifier(db, data)


@router.get("/totp/setup", response_model=TOTPSetupOut)
def configurer_totp(user: User = Depends(get_current_user)):
    """L'apprenant scanne ce QR code une seule fois avec son app d'authentification
    (ou l'application tierce de l'établissement) pour activer les codes à 10 secondes."""
    if not user.totp_secret:
        from fastapi import HTTPException
        raise HTTPException(400, "Aucun secret TOTP associé à ce compte")

    uri, qrcode_base64 = generer_qrcode_totp_base64(user.totp_secret, identifiant=user.matricule or user.email)
    return TOTPSetupOut(provisioning_uri=uri, qrcode_base64=qrcode_base64)


@router.get("/me", response_model=UserOut)
def profil(user: User = Depends(get_current_user)):
    user_out = UserOut.model_validate(user)
    if user.etablissement:
        user_out.etablissement_nom = user.etablissement.nom
    return user_out

@router.patch("/me", response_model=UserOut)
def modifier_profil(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = user_service.modifier_profil(db, user, data)
    user_out = UserOut.model_validate(updated_user)
    if updated_user.etablissement:
        user_out.etablissement_nom = updated_user.etablissement.nom
    return user_out