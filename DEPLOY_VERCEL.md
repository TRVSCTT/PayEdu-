# Guide de Déploiement Complet sur Vercel (Frontend + Backend)

Vercel est une excellente plateforme. Comme vous avez choisi de déployer le frontend ET le backend sur Vercel, la meilleure méthode consiste à créer **deux projets distincts** sur Vercel, pointant tous les deux vers votre même dépôt GitHub.

## Étape 1 : Préparation du code (Déjà fait !)
Nous venons d'ajouter un fichier `vercel.json` à la racine de votre projet pour configurer le backend Python (FastAPI). Nous avons aussi mis à jour les CORS dans `app/main.py` pour accepter les requêtes de Vercel.

**Poussez le code sur GitHub :**
Si ce n'est pas déjà fait, assurez-vous que toutes vos modifications (y compris `vercel.json`) sont sur votre branche principale (`main` ou `yohandev`).

---

## Étape 2 : Déployer le Backend (L'API) sur Vercel

1. Allez sur le tableau de bord Vercel ([vercel.com](https://vercel.com)) et cliquez sur **Add New... > Project**.
2. Importez votre dépôt GitHub `PayEdu-`.
3. Dans la configuration du projet :
   - **Project Name** : `payedu-api` (ou un nom de votre choix).
   - **Framework Preset** : Laissez sur `Other`.
   - **Root Directory** : Laissez à la racine (`./`). Vercel lira le fichier `vercel.json` pour déployer l'API Python.
   - **Environment Variables** : Ajoutez l'URL de votre base de données PostgreSQL de production (ex: Neon, Supabase, Render PostgreSQL) sous la clé `DATABASE_URL`.
   - Laissez vide si c'est pour du test avec SQLite, mais Vercel étant *Serverless*, la base de données SQLite sera réinitialisée à chaque requête. **Il vous faut absolument une base de données PostgreSQL externe.**
4. Cliquez sur **Deploy**.
5. Une fois déployé, notez l'URL de votre API (ex: `https://payedu-api.vercel.app`).

---

## Étape 3 : Déployer le Frontend (React/Vite) sur Vercel

1. Retournez sur le tableau de bord Vercel et cliquez de nouveau sur **Add New... > Project**.
2. Importez **exactement le même dépôt GitHub** (`PayEdu-`).
3. Dans la configuration du projet :
   - **Project Name** : `payedu-app` (ou un nom de votre choix).
   - **Root Directory** : Cliquez sur *Edit* et sélectionnez le dossier `FRONTEND`.
   - **Framework Preset** : Vercel va automatiquement détecter `Vite`.
   - **Environment Variables** : Ajoutez une nouvelle variable :
     - **Name** : `VITE_API_BASE_URL`
     - **Value** : `https://payedu-api.vercel.app` *(Remplacez par l'URL obtenue à l'étape 2)*.
4. Cliquez sur **Deploy**.

## C'est terminé ! 🎉
Votre application est maintenant en ligne. 

*Note importante sur la base de données* : Le backend sur Vercel est "serverless" (sans serveur persistant). Si vous utilisez actuellement le fichier local `payedu.db` (SQLite), les données s'effaceront très vite sur Vercel. Il faudra créer une base de données PostgreSQL gratuite sur [Neon.tech](https://neon.tech/) ou [Supabase](https://supabase.com/) et coller le lien dans `DATABASE_URL` côté Vercel pour le Backend.
