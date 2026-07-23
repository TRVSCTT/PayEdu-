import { apiClient } from '../lib/axios';

export const caisseService = {
  getStats: async () => {
    const response = await apiClient.get('/payments/caisse/stats');
    return response.data;
  },

  getQueue: async () => {
    const response = await apiClient.get('/payments/caisse/queue');
    return response.data;
  },

  getEtablissements: async () => {
    try {
      // Pour l'instant on tente d'appeler la route admin. Si la caisse n'a pas les droits, on gérera l'erreur.
      // Une route dédiée /caisse/etablissements serait préférable côté backend.
      const response = await apiClient.get('/admin/etablissements');
      return response.data;
    } catch (error) {
      // Fallback vide si erreur de droits
      console.error("Impossible de récupérer les établissements", error);
      return [];
    }
  },

  validatePayment: async (paiementId) => {
    const response = await apiClient.post(`/payments/caisse/${paiementId}/finaliser`);
    return response.data;
  },

  // Ce n'est pas encore implémenté côté backend, mais on laisse le stub
  reportIssue: async (paiementId, description) => {
    // Pour l'instant, ça pourrait envoyer un message au support avec le contexte
    const response = await apiClient.post('/support/messages', {
      contenu: `Signalement concernant le paiement ${paiementId} : ${description}`
    });
    return response.data;
  }
};
