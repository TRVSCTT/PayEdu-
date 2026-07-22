"""
Modèles SQLAlchemy pour le module de paiement (PayEdu).

Hypothèses d'intégration à adapter à ton projet existant :
- `app.db.base.Base` est la Base déclarative SQLAlchemy déjà utilisée ailleurs.
- Il existe déjà des tables `users` et `etablissements` (clés étrangères ci-dessous).
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum as SAEnum, ForeignKey, JSON, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class MoyenPaiement(str, enum.Enum):
    ORANGE_MONEY = "orange_money"
    MTN_MOMO = "mtn_momo"
    CARTE_BANCAIRE = "carte_bancaire"


class StatutPaiement(str, enum.Enum):
    BROUILLON = "brouillon"                    # Formulaire 1 rempli
    INFO_VERIFIEE = "info_verifiee"             # Formulaire 2 confirmé
    MOYEN_DEFINI = "moyen_defini"                # Formulaire 3 rempli, prêt pour récap
    EN_ATTENTE_OPERATEUR = "en_attente_operateur"  # Autorisé, en attente du webhook opérateur
    PROFORMA = "proforma"                        # Paiement opérateur confirmé
    EN_FILE_CAISSE = "en_file_caisse"             # QR codes générés, en attente à la caisse
    ACQUITTEE = "acquittee"                       # Validé par la caisse, terminé
    ECHOUEE = "echouee"                            # Rejeté par l'opérateur ou expiré
    ANNULEE = "annulee"                            # Annulé par l'apprenant


class TypeQRCode(str, enum.Enum):
    INFOS_APPRENANT = "infos_apprenant"
    COMPTE_PAIEMENT = "compte_paiement"
    MONTANT = "montant"
    IDENTIFIANT_TRANSACTION = "identifiant_transaction"


class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    apprenant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissements.id"), nullable=False, index=True)

    objet_paiement_id = Column(UUID(as_uuid=True), ForeignKey("objets_paiement.id"), nullable=False)
    montant = Column(Numeric(12, 2), nullable=False)
    moyen_paiement = Column(SAEnum(MoyenPaiement,values_callable=lambda enum_cls: [e.value for e in enum_cls]), nullable=True)
    numero_compte_paiement = Column(String(20), nullable=True)

    email_paiement=Column(String(150),nullable=True)
    adresse_paiement=Column(String(255),nullable=True)
    ville_paiement=Column(String(100),nullable=True)
    code_postal_paiement=Column(String(20),nullable=True)

    quitus_id = Column(UUID(as_uuid=True), ForeignKey("quitus.id"), nullable = True)



    infos_extraites = Column(JSON, nullable=True)   # Sortie OCR brute
    infos_confirmees = Column(JSON, nullable=True)   # Après validation par l'apprenant

    statut = Column(SAEnum(StatutPaiement , values_callable=lambda enum_cls: [e.value for e in enum_cls]), nullable=False, default=StatutPaiement.BROUILLON, index=True)

    reference_transaction = Column(String(64), unique=True, nullable=True)  # Générée par PayEdu
    reference_operateur = Column(String(64), nullable=True, index=True)      # Retournée par Orange/MTN
    motif_echec = Column(Text, nullable=True)
    numero_recu = Column(String(64), nullable=True, unique=True)  # Générée par PayEdu après validation caisse

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    autorise_at = Column(DateTime, nullable=True)
    acquitte_at = Column(DateTime, nullable=True)

    qr_codes = relationship("PaiementQRCode", back_populates="paiement", cascade="all, delete-orphan")


class PaiementQRCode(Base):
    __tablename__ = "paiement_qrcodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paiement_id = Column(UUID(as_uuid=True), ForeignKey("paiements.id"), nullable=False, index=True)
    type_code = Column(SAEnum(TypeQRCode), nullable=False)
    contenu = Column(Text, nullable=False)
    scanne = Column(String(1), default="0")  # "0" ou "1" — flag simple, pas de booléen SQLAlchemy requis
    scanne_at = Column(DateTime, nullable=True)

    paiement = relationship("Paiement", back_populates="qr_codes")
