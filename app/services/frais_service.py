import uuid
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.frais import Frais
from app.schemas.frais import FraisCreate

class FraisService:
    def creer_frais(self, db: Session, etablissement_id: uuid.UUID, data: FraisCreate) -> Frais:
        nouveau_frais = Frais(
            etablissement_id=etablissement_id,
            **data.model_dump()
        )
        db.add(nouveau_frais)
        db.commit()
        db.refresh(nouveau_frais)
        return nouveau_frais

    def lister_frais_par_etablissement(self, db: Session, etablissement_id: uuid.UUID, filiere: str = None, niveau: str = None) -> List[Frais]:
        query = select(Frais).where(
            Frais.etablissement_id == etablissement_id,
            Frais.est_actif == True
        )
        
        # Filtres optionnels
        if filiere:
            query = query.where((Frais.filiere == filiere) | (Frais.filiere == None))
        if niveau:
            query = query.where((Frais.niveau == niveau) | (Frais.niveau == None))
            
        result = db.execute(query.order_by(Frais.date_echeance))
        return result.scalars().all()

frais_service = FraisService()
