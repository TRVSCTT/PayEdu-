from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_frontend_page_is_served():
    response = client.get("/test")

    assert response.status_code == 200
    assert "PayEdu" in response.text
