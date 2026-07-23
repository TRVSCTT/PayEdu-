from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.core.database import engine, Base
from app.core.config import settings  # noqa: F401
from app.router import payment, user, frais, notification, wallet, appointment, support, etablissement

app = FastAPI(
    title="PayEdu",
    version= '1.0.0',
    description="Appli de paiement des frais d'etudes"

)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment.router)
app.include_router(user.router)
app.include_router(frais.router)
app.include_router(notification.router)
app.include_router(wallet.router)
app.include_router(appointment.router)
app.include_router(support.router)
app.include_router(etablissement.router)

@app.get('/')
def root():
    return{'message': 'PayEdu is running'}


@app.get('/test')
def serve_test_frontend():
    frontend_path = Path(__file__).resolve().parent.parent / 'frontend_test' / 'test.html'
    return FileResponse(frontend_path)