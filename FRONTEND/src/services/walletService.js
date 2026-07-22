import { apiClient } from '../lib/axios';

export const walletService = {
  /**
   * Récupère la liste des moyens de paiement sauvegardés
   */
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/wallet');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du portefeuille", error);
      throw error;
    }
  },

  /**
   * Ajoute un nouveau moyen de paiement
   * @param {Object} data 
   */
  addPaymentMethod: async (data) => {
    try {
      const response = await apiClient.post('/wallet', data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout au portefeuille", error);
      throw error;
    }
  }
};
