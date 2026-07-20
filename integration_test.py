from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def run_tests():
    uid = uuid.uuid4().hex[:6]
    
    print(f"--- 1. Création d'un Admin ({uid}) ---")
    admin_data = {
        "email": f"admin_{uid}@payedu.com",
        "mot_de_passe": "password123",
        "nom": "Admin",
        "prenom": "Super"
    }
    response = client.post("/auth/register/admin", json=admin_data)
    print("Admin status:", response.status_code)
    if response.status_code != 201:
        print(response.json())
        return
        
    print("\n--- 2. Login Admin ---")
    login_data = {
        "identifiant": f"admin_{uid}@payedu.com",
        "mot_de_passe": "password123"
    }
    response = client.post("/auth/login", json=login_data)
    print("Login Admin status:", response.status_code)
    if response.status_code != 200:
        print(response.json())
        return
    admin_token = response.json().get("access_token")

    print("\n--- 3. Création Etablissement ---")
    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    etab_data = {
        "nom_etablissement": f"Université {uid}",
        "code_etablissement": f"UD{uid}",
        "email": f"gestion_{uid}@ud.cm",
        "mot_de_passe": "password123",
        "nom": "Gestionnaire",
        "prenom": "Principal"
    }
    response = client.post("/auth/register/etablissement", json=etab_data, headers=headers_admin)
    print("Etablissement status:", response.status_code)
    if response.status_code != 201:
        print(response.json())
        return
    etab_user_id = response.json().get("etablissement_id")

    print("\n--- 4. Login Etablissement ---")
    response = client.post("/auth/login", json={
        "identifiant": f"gestion_{uid}@ud.cm",
        "mot_de_passe": "password123"
    })
    print("Login Etab status:", response.status_code)
    etab_token = response.json().get("access_token")

    print("\n--- 5. Création Apprenant ---")
    headers_etab = {"Authorization": f"Bearer {etab_token}"}
    apprenant_data = {
        "etablissement_id": etab_user_id,
        "matricule": f"MAT{uid}",
        "email": f"student_{uid}@ud.cm",
        "mot_de_passe": "student123",
        "nom": "Doe",
        "prenom": "John",
        "filiere": "Informatique",
        "niveau": "L1"
    }
    response = client.post("/auth/register/apprenant", json=apprenant_data, headers=headers_etab)
    print("Apprenant status:", response.status_code)
    if response.status_code != 201:
        print(response.json())
        return
    
    print("\n--- 6. Login Apprenant ---")
    response = client.post("/auth/login", json={
        "identifiant": f"MAT{uid}",
        "mot_de_passe": "student123"
    })
    print("Login Apprenant status:", response.status_code)
    apprenant_token = response.json().get("access_token")

    print("\n--- 7. Initier Paiement (Brouillon) ---")
    headers_apprenant = {"Authorization": f"Bearer {apprenant_token}"}
    payment_data = {
        "etablissement_id": etab_user_id,
        "objet_paiement": "frais_inscription",
        "montant": 50000,
        "moyen_paiement": "orange_money"
    }
    response = client.post("/payments", json=payment_data, headers=headers_apprenant)
    print("Init Paiement status:", response.status_code)
    print(response.json())

    print("\n--- TEST TERMINE AVEC SUCCES ! ---")

if __name__ == "__main__":
    run_tests()
