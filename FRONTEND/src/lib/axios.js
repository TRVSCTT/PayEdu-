/**
 * axios.js
 * Rôle : Configuration centrale de l'instance Axios avec intercepteurs.
 */
import axios from "axios";
import { storageService } from "../services/storageService";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs globalement
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si l'API renvoie 401 (Non Autorisé), on peut déconnecter l'utilisateur
    if (error.response && error.response.status === 401) {
      storageService.removeToken();
      
      // On redirige l'utilisateur vers la page de connexion s'il n'y est pas déjà
      if (window.location.pathname !== '/connexion') {
        window.location.href = '/connexion';
      }
    }
    
    return Promise.reject(error);
  }
);
