# Guide de Création des Utilisateurs et Tests (PayEdu)

Ce document explique comment créer les différents types de comptes (Admin, Établissement, Caisse, Apprenant) afin de pouvoir tester l'ensemble du flux de paiement et les différents tableaux de bord.

## 1. Créer un Administrateur (Super Admin)

L'administrateur a le contrôle global de la plateforme. Son rôle est principalement de créer les établissements.

**Requête API :** `POST /auth/register/admin`
**Aucune authentification requise** (Cette route est ouverte pour l'initialisation, elle devra être sécurisée en production).

**Payload JSON :**
```json
{
  "email": "admin@payedu.com",
  "mot_de_passe": "password123",
  "nom": "Admin",
  "prenom": "Super"
}
```

> Une fois créé, connectez-vous avec cet email via `/auth/login` (ou l'interface de connexion) pour obtenir un Token JWT d'Admin.

---

## 2. Créer un Établissement

Seul un **Administrateur connecté** peut créer un compte Établissement.

**Requête API :** `POST /auth/register/etablissement`
**Authentification :** Token JWT de l'Admin (Bearer Token)

**Payload JSON :**
```json
{
  "email": "contact@iut.cm",
  "mot_de_passe": "password123",
  "nom_etablissement": "IUT de Douala"
}
```

> Ce compte servira au Responsable de l'établissement. Connectez-vous avec cet email pour obtenir un Token JWT d'Établissement.

---

## 3. Créer un Compte Caisse

Seul un **Établissement connecté** peut créer un compte Caisse qui lui sera rattaché.

**Requête API :** `POST /auth/register/caisse`
**Authentification :** Token JWT de l'Établissement (Bearer Token)

**Payload JSON :**
```json
{
  "email": "caisse@iut.cm",
  "mot_de_passe": "password123",
  "nom": "Guichet",
  "prenom": "Principal"
}
```

> Ce compte sera utilisé par le caissier de l'établissement pour encaisser et valider les paiements dans la file d'attente.

---

## 4. Créer un Apprenant (Étudiant)

La création d'un apprenant est ouverte (inscription publique via le site web). Il devra ensuite être rattaché à un établissement lors de la configuration de son profil.

**Requête API :** `POST /auth/register/apprenant`
**Aucune authentification requise**.

**Payload JSON :**
```json
{
  "email": "etudiant@example.com",
  "mot_de_passe": "password123",
  "nom": "Mballa",
  "prenom": "Jean"
}
```

> Lors de la connexion (`/auth/login`), l'étudiant reçoit un token et peut configurer son TOTP pour les validations rapides.

---

## 🚀 Étape suivante : Les Tests

### Comment tester efficacement depuis l'Interface Utilisateur (Frontend) ?

1. **Lancer le backend et le frontend** : Assurez-vous que FastAPI et Vite (React) tournent.
2. **Inscription Apprenant** : Allez sur la page d'inscription et créez un compte apprenant classique.
3. **Inscription Admin** : Vous pouvez créer l'admin via Swagger UI (`http://localhost:8000/docs`).
4. **Créer l'Écosystème** : 
   - Connectez-vous en Admin -> Créez un Établissement.
   - Déconnectez-vous, connectez-vous en Établissement -> Créez un compte Caisse.
5. **Simuler un paiement** :
   - Connectez-vous en Apprenant. Initiez un paiement (génération du Code QR / File d'attente).
   - Ouvrez un autre navigateur ou une fenêtre de navigation privée.
   - Connectez-vous avec le compte **Caisse**.
   - Allez sur "RDV / Agenda" ou "Enregistrement" pour voir l'étudiant en attente et valider son paiement !
