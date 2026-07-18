import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "PayEdu"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    CINETPAY_APIKEY: str |None = None
    CINETPAY_SITE_ID: str |None = None
    CINETPAY_NOTIFY_URL: str = "https://localhost:8000/payments/webhooks/cinetpay"
    CINETPAY_RETURN_URL: str = "https://localhost:5173/paiement/retour"
    USE_MOCK_CINETPAY: bool = True  # False une fois ton compte marchand CinetPay validé
 
    SECRET_KEY: str = "change-me-in-production-at-least-32-chars!!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = "postgresql://postgres:Scotty237@localhost:5432/PayEdu_db"
    SYNC_DATABASE_URL: str = "postgresql://postgres:Scotty237@localhost:5432/PayEdu_db"

    ALLOWED_ORIGINS: str = "http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:8001,http://localhost:8001"

    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    @property
    def origins_list(self) -> List[str]:
        configured_value = os.getenv("ALLOWED_ORIGINS", self.ALLOWED_ORIGINS or "")
        raw_origins = [
            item.strip().strip('"').strip("'").rstrip("/")
            for item in configured_value.split(",")
            if item and item.strip()
        ]

        fallback_origins = [
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "http://localhost:30050",
            "http://localhost:5173",
        ]

        origins: List[str] = []
        seen = set()
        for origin in [*raw_origins, *fallback_origins]:
            if origin and origin not in seen:
                origins.append(origin)
                seen.add(origin)
        return origins

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()