import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.objet_paiement import ObjetPaiement
from app.models.quitus import Quitus
from app.schemas.catalogue import ObjetPaiementCreate, QuitusDeposerRequest


# --- Établissement : catalogue de frais ---------------------------------------

def creer_objet_paiement(
    db: Session, etablissement_id: uuid.UUID, data: ObjetPaiementCreate
) -> ObjetPaiement:
    objet = ObjetPaiement(
        etablissement_id=etablissement_id,
        libelle=data.libelle,
        montant=data.montant,
        echeance=data.echeance,
        phase=data.phase,
    )
    db.add(objet)
    db.commit()
    db.refresh(objet)
    return objet


def lister_objets_paiement(db: Session, etablissement_id: uuid.UUID) -> list[ObjetPaiement]:
    result =  db.execute(
        select(ObjetPaiement).where(ObjetPaiement.etablissement_id == etablissement_id)
    )
    return list(result.scalars().all())


# --- Établissement : dépôt de quitus pour un apprenant ------------------------

def deposer_quitus(
    db: Session, objet_paiement_id: uuid.UUID, data: QuitusDeposerRequest
) -> Quitus:
    result =  db.execute(select(ObjetPaiement).where(ObjetPaiement.id == objet_paiement_id))
    if result.scalar_one_or_none() is None:
        raise HTTPException(404, "Objet de paiement introuvable")

    # Un seul quitus par couple (objet_paiement, apprenant) — on remplace si déjà déposé
    existant =  db.execute(
        select(Quitus).where(
            Quitus.objet_paiement_id == objet_paiement_id, Quitus.apprenant_id == data.apprenant_id
        )
    )
    quitus = existant.scalar_one_or_none()
    if quitus is not None:
        quitus.url_fichier = data.url_fichier
        quitus.taille_octets = data.taille_octets
    else:
        quitus = Quitus(
            objet_paiement_id=objet_paiement_id,
            apprenant_id=data.apprenant_id,
            url_fichier=data.url_fichier,
            taille_octets=data.taille_octets,
        )
        db.add(quitus)
    db.commit()
    db.refresh(quitus)
    return quitus


# --- Apprenant : consultation de ses quitus disponibles -----------------------

def lister_quitus_apprenant(db: Session, apprenant_id: uuid.UUID) -> list[Quitus]:
    result =  db.execute(select(Quitus).where(Quitus.apprenant_id == apprenant_id))
    return list(result.scalars().all())


def obtenir_quitus_pour_objet(
    db: Session, objet_paiement_id: uuid.UUID, apprenant_id: uuid.UUID
) -> Quitus | None:
    result =  db.execute(
        select(Quitus).where(
            Quitus.objet_paiement_id == objet_paiement_id, Quitus.apprenant_id == apprenant_id
        )
    )
    return result.scalar_one_or_none()