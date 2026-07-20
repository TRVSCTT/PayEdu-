# ETUTRANSFERT - Frontend

Application web permettant aux étudiants de payer en ligne leurs frais universitaires.
Frontend construit avec **React 19**, **Vite**, **Tailwind CSS v4** et **TanStack Query**.

## Fonctionnalités implémentées (En phase avec le Backend)

* **Authentification et Autorisation :**
  * Connexion multi-rôles (Admin, Établissement, Apprenant).
  * Gestion du JWT (stockage sécurisé, décodage).
  * Routes privées avec vérification des rôles.
* **Gestion des Utilisateurs (Administrateur) :**
  * Création d'un compte Administrateur.
  * Création d'un Établissement (incluant le compte Gestionnaire).
* **Gestion des Apprenants (Établissement) :**
  * Inscription d'un nouvel Apprenant par le gestionnaire de l'établissement.
* **Paiements (Apprenant) :**
  * Initiation d'un paiement (brouillon).
  * Affichage du récapitulatif du paiement initié.

## Technologies Utilisées

* **React** (v19) : Bibliothèque UI.
* **Vite** : Outil de build rapide.
* **Tailwind CSS** (v4) : Framework CSS utilitaire pour le design (Couleurs basées sur la maquette Figma).
* **TanStack Query** (v5) : Gestion d'état asynchrone et requêtes API.
* **Axios** : Client HTTP (avec intercepteur pour le token JWT).
* **React Hook Form & Zod** : Gestion et validation des formulaires.
* **React Router Dom** : Routage côté client.
* **Lucide React** : Icônes.
* **Sonner** : Notifications (Toast).

## Architecture Clean (Dossiers)

```
src/
├── app/            # Configuration globale (Providers, Router, App.jsx)
├── components/     # Composants réutilisables et Layouts
├── constants/      # Constantes (Routes API, Rôles)
├── features/       # Fonctionnalités regroupées par domaine
│   ├── auth/
│   ├── establishments/
│   ├── learners/
│   └── payments/
├── lib/            # Configuration des bibliothèques externes (Axios, QueryClient)
├── services/       # Services transverses (ex: storageService pour le JWT)
├── styles/         # Fichiers CSS globaux (index.css)
└── utils/          # Fonctions utilitaires
```

## Démarrage rapide

### Prérequis
- Node.js (v18+)
- npm ou yarn

### Installation

1. Accédez au répertoire `FRONTEND`
2. Installez les dépendances :
   ```bash
   npm install
   ```

### Configuration
1. Créez un fichier `.env` à la racine de `FRONTEND`
2. Ajoutez l'URL de votre backend :
   ```env
   VITE_API_URL=http://localhost:8000
   ```

### Lancement
Démarrez le serveur de développement :
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.
