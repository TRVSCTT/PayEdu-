from pydantic import BaseModel

class EtablissementStatsOut(BaseModel):
    total_apprenants: int
    total_paiements_encaisses: float
    total_paiements_en_attente: float
    nombre_paiements_du_jour: int
