from fastapi.testclient import TestClient
from app.main import app

try:
    with TestClient(app) as client:
        response = client.get("/")
        print("GET / -> Status Code:", response.status_code)
        print("GET / -> Response:", response.json())
except Exception as e:
    print("Error during TestClient startup:", e)
