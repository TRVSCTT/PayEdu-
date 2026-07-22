import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.models.user import RoleUtilisateur


# --- Inscription (une classe par rôle car les champs requis diffèrent) -------

class AdminCreate(BaseModel):
    email: EmailStr
    mot_de_passe: str = Field(..., min_length=8)
    nom: str
    prenom: str


class EtablissementCreate(BaseModel):
    """Crée à la fois l'établissement et son compte gestionnaire (rôle etablissement)."""
    nom_etablissement: str
    code_etablissement: str = Field(..., max_length=20)
    ville: Optional[str] = None
    email: EmailStr
    mot_de_passe: str = Field(..., min_length=8)
    nom: str
    prenom: str


class ApprenantCreate(BaseModel):
    etablissement_id: Optional[uuid.UUID] = None
    matricule: str = Field(..., max_length=30)
    email: Optional[EmailStr] = None
    mot_de_passe: str = Field(..., min_length=8)
    nom: str
    prenom: str
    telephone: Optional[str] = None
    filiere: Optional[str] = None
    niveau: Optional[str] = None


class CaisseCreate(BaseModel):
    etablissement_id: uuid.UUID
    email: EmailStr
    mot_de_passe: str = Field(..., min_length=8)
    nom: str
    prenom: str


# --- Connexion -----------------------------------------------------------------

class LoginRequest(BaseModel):
    """identifiant = email (admin/établissement/caisse) ou matricule (apprenant)."""
    identifiant: str
    mot_de_passe: str

    @model_validator(mode="after")
    def _nettoyer(self):
        self.identifiant = self.identifiant.strip()
        return self


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleUtilisateur


# --- TOTP ------------------------------------------------------------------------

class TOTPSetupOut(BaseModel):
    provisioning_uri: str
    qrcode_base64: str


class TOTPVerifyRequest(BaseModel):
    code_totp: str = Field(..., min_length=6, max_length=6)


# --- Sortie ------------------------------------------------------------------------

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: Optional[str] = None
    matricule: Optional[str] = None
    nom: str
    prenom: str
    role: RoleUtilisateur
    etablissement_id: Optional[uuid.UUID] = None
    etablissement_nom: Optional[str] = None
    est_actif: bool