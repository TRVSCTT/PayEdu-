import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field , EmailStr

from app.models.payment import MoyenPaiement, StatutPaiement


class PaiementFormulaire1(BaseModel):
    """Étape 1 : sélection établissement, objet et moyen de paiement + quitus (fichier séparé, voir endpoint)."""
    etablissement_id: uuid.UUID
    objet_paiement_id: uuid.UUID
    moyen_paiement: MoyenPaiement


class InfosExtraites(BaseModel):
    """Champs extraits du quitus (OCR) et validés par l'apprenant à l'étape 2."""
    nom: str
    matricule: str
    filiere: Optional[str] = None
    niveau: Optional[str] = None
    date_naissance: Optional[str] = None


class PaiementFormulaire2Confirmation(BaseModel):
    infos_confirmees: InfosExtraites


class PaiementFormulaire3(BaseModel):
    """Étape 3 : uniquement le numéro du compte mobile money.

    Volontairement, aucun code PIN n'est demandé ici : Orange Money et MTN MoMo
    valident la transaction via une notification USSD envoyée directement au
    téléphone de l'apprenant. Faire transiter un code PIN par ton API serait
    à la fois inutile et risqué en matière de sécurité.
    """
    numero_compte_paiement: str = Field(..., min_length=8, max_length=20)
    email_paiement: Optional[EmailStr]=None
    adresse_paiement:Optional[str]= Field(None , max_length=255)
    ville_paiement:Optional[str]= Field(None , max_length=100)
    code_postal_paiement: Optional[str]=Field(None , max_length=20)


class PaiementRecapitulatif(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    objet_paiement_id: uuid.UUID
    montant: Decimal
    moyen_paiement: MoyenPaiement
    numero_compte_paiement: Optional[str] = None
    statut: StatutPaiement


class PaiementAutorisation(BaseModel):
    """Autorisation finale : code TOTP généré par l'application tierce de l'établissement."""
    code_totp: str = Field(..., min_length=6, max_length=6)

class PaiementAutorisationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    statut: StatutPaiement
    payment_url: Optional[str] = None  # URL de checkout CinetPay (si paiement en ligne)

class PaiementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    statut: StatutPaiement
    montant: Decimal
    objet_paiement_id: uuid.UUID
    moyen_paiement: Optional[MoyenPaiement] = None
    reference_transaction: Optional[str] = None
    numero_recu: Optional[str] = None
    motif_echec: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class WebhookCinetPay(BaseModel):
    """CinetPay poste cpm_trans_id en x-www-form-urlencoded sur ta notify_url.

    Conformément à sa documentation, CinetPay ne transmet PAS le statut réel
    dans la notification (pour éviter le man-in-the-middle) : seul le
    cpm_trans_id (= ton transaction_id) est garanti. Le vrai statut doit être
    récupéré en rappelant l'API /payment/check.
    """
    cpm_trans_id: str
    cpm_site_id: Optional[str] = None