import uuid  # noqa: F401

from fastapi import HTTPException
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.core.security import (
    creer_access_token,
    generer_secret_totp,
    hasher_mot_de_passe,
    verifier_mot_de_passe,
)
from app.models.user import Etablissement, RoleUtilisateur, User
from app.schemas.user import (
    AdminCreate,
    ApprenantCreate,
    CaisseCreate,
    EtablissementCreate,
    LoginRequest,
    TokenResponse,
    UserUpdate
)


def _verifier_unicite(db: Session, email: str | None = None, matricule: str | None = None) -> None:
    conditions = [c for c in [User.email == email if email else None, User.matricule == matricule if matricule else None] if c is not None]
    if not conditions:
        return
    result = db.execute(select(User).where(or_(*conditions)))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(409, "Un compte existe déjà avec cet email ou ce matricule")


def creer_admin(db: Session, data: AdminCreate) -> User:
    _verifier_unicite(db, email=data.email)
    user = User(
        email=data.email,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        role=RoleUtilisateur.ADMIN,
        nom=data.nom,
        prenom=data.prenom,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def creer_etablissement(db:Session, data: EtablissementCreate) -> User:
    _verifier_unicite(db, email=data.email)

    result = db.execute(select(Etablissement).where(Etablissement.code == data.code_etablissement))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(409, "Un établissement existe déjà avec ce code")

    etablissement = Etablissement(nom=data.nom_etablissement, code=data.code_etablissement, ville=data.ville)
    db.add(etablissement)
    db.flush()  # pour obtenir etablissement.id sans committer déjà

    user = User(
        email=data.email,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        role=RoleUtilisateur.ETABLISSEMENT,
        nom=data.nom,
        prenom=data.prenom,
        etablissement_id=etablissement.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def creer_apprenant(db: Session, data: ApprenantCreate) -> User:
    _verifier_unicite(db, email=data.email, matricule=data.matricule)

    user = User(
        email=data.email,
        matricule=data.matricule,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        role=RoleUtilisateur.APPRENANT,
        nom=data.nom,
        prenom=data.prenom,
        telephone=data.telephone,
        filiere=data.filiere,
        niveau=data.niveau,
        etablissement_id=data.etablissement_id,
        totp_secret=generer_secret_totp(),  # provisionné dès la création du compte
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def creer_caisse(db: Session, data: CaisseCreate) -> User:
    _verifier_unicite(db, email=data.email)

    user = User(
        email=data.email,
        mot_de_passe_hash=hasher_mot_de_passe(data.mot_de_passe),
        role=RoleUtilisateur.CAISSE,
        nom=data.nom,
        prenom=data.prenom,
        etablissement_id=data.etablissement_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authentifier(db: Session, data: LoginRequest) -> TokenResponse:
    result = db.execute(
        select(User).where(or_(User.email == data.identifiant, User.matricule == data.identifiant))
    )
    user = result.scalar_one_or_none()

    if user is None or not verifier_mot_de_passe(data.mot_de_passe, user.mot_de_passe_hash):
        raise HTTPException(401, "Identifiant ou mot de passe incorrect")
    if not user.est_actif:
        raise HTTPException(403, "Compte désactivé")

    token = creer_access_token(user.id, user.role)
    return TokenResponse(access_token=token, role=user.role)

def modifier_profil(db: Session, user: User, data: UserUpdate) -> User:
    if data.email is not None and data.email != user.email:
        _verifier_unicite(db, email=data.email)
        user.email = data.email
    if data.telephone is not None:
        user.telephone = data.telephone
    if data.filiere is not None:
        user.filiere = data.filiere
    if data.niveau is not None:
        user.niveau = data.niveau
        
    db.commit()
    db.refresh(user)
    return user

def supprimer_compte(db: Session, user: User) -> None:
    user.est_actif = False
    db.commit()