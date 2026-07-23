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
