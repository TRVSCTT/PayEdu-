import { apiClient } from '../lib/axios';

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  
  getEtablissements: async () => {
    const response = await apiClient.get('/admin/etablissements');
    return response.data;
  },
  
  getPaiements: async () => {
    const response = await apiClient.get('/admin/paiements');
    return response.data;
  }
};
