import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ObjetPaiementCreate(BaseModel):
    libelle: str = Field(..., max_length=120)
    montant: Decimal = Field(..., gt=0)
    echeance: Optional[date] = None
    phase: Optional[str] = Field(None, max_length=60)


class ObjetPaiementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    libelle: str
    montant: Decimal
    echeance: Optional[date] = None
    phase: Optional[str] = None


class QuitusDeposerRequest(BaseModel):
    """Dépôt d'un quitus par l'établissement, pour un apprenant précis."""
    apprenant_id: uuid.UUID
    url_fichier: str = Field(..., max_length=500)
    taille_octets: Optional[int] = None


class QuitusOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    objet_paiement_id: uuid.UUID
    url_fichier: str
    deposee_le: datetime