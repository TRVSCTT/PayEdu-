import { apiClient } from '../lib/axios';

export const fraisService = {
  /**
   * (Côté Etablissement) Créer un frais
   */
  creerFrais: async (data) => {
    const response = await apiClient.post('/frais', data);
    return response.data;
  },

  /**
   * (Côté Apprenant) Lister les frais de l'établissement
   */
  listerFrais: async () => {
    const response = await apiClient.get('/frais');
    return response.data;
  }
};
