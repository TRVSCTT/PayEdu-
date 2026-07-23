from pydantic import BaseModel

class AdminStatsOut(BaseModel):
    total_etablissements: int
    total_apprenants: int
    total_volume_financier: float
    total_transactions: int
    transactions_en_attente: int
