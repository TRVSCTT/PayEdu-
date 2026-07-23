import { apiClient } from '../lib/axios';

export const etablissementService = {
  getStats: async () => {
    const response = await apiClient.get('/etablissement/stats');
    return response.data;
  },
  
  getApprenants: async () => {
    const response = await apiClient.get('/etablissement/apprenants');
    return response.data;
  },
  
  getPaiements: async () => {
    const response = await apiClient.get('/etablissement/paiements');
    return response.data;
  },
  
  getFrais: async () => {
    const response = await apiClient.get('/etablissement/frais');
    return response.data;
  }
};
