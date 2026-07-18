"""
Modèles pour l'authentification et les 4 rôles de PayEdu.

Choix de conception : un seul modèle User avec un champ role, plutôt que
4 tables séparées. C'est plus simple à gérer pour l'authentification (un seul
point d'entrée JWT), et un rôle comme "caisse" n'a besoin que de quelques
champs en plus, pas d'une table entière. Si ton cahier des charges exige des
identifiants caisse totalement séparés du concept d'utilisateur (poste fixe
partagé, pas de notion de personne), dis-le-moi et on isolera ça.
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum as SAEnum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class RoleUtilisateur(str, enum.Enum):
    ADMIN = "admin"                  # Super admin PayEdu
    ETABLISSEMENT = "etablissement"  # Gestionnaire de l'établissement (dashboard)
    APPRENANT = "apprenant"          # Étudiant / tuteur
    CAISSE = "caisse"                # Poste de caisse (PC, enregistrement des paiements)


class Etablissement(Base):
    __tablename__ = "etablissements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String(150), nullable=False)
    code = Column(String(20), unique=True, nullable=False)  # ex: "IUT-DOUALA"
    ville = Column(String(100), nullable=True)
    telephone = Column(String(20), nullable=True)
    email_contact = Column(String(150), nullable=True)
    est_actif = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    utilisateurs = relationship("User", back_populates="etablissement")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Identifiants de connexion : email pour admin/établissement/caisse,
    # matricule pour l'apprenant (les deux sont acceptés au login, voir schemas).
    email = Column(String(150), unique=True, nullable=True, index=True)
    matricule = Column(String(30), unique=True, nullable=True, index=True)

    mot_de_passe_hash = Column(String(255), nullable=False)
    role = Column(SAEnum(RoleUtilisateur, values_callable=lambda enum_cls: [e.value for e in enum_cls]), nullable=False, index=True)

    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    telephone = Column(String(20), nullable=True)

    # Null pour ADMIN, obligatoire pour les 3 autres rôles
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissements.id"), nullable=True)

    # Champs spécifiques à l'apprenant
    filiere = Column(String(100), nullable=True)
    niveau = Column(String(20), nullable=True)

    # TOTP : secret provisionné à la création du compte, utilisé pour
    # l'autorisation finale du paiement (voir core/security.py)
    totp_secret = Column(String(32), nullable=True)

    est_actif = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    etablissement = relationship("Etablissement", back_populates="utilisateurs")