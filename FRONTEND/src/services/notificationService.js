import { apiClient } from '../lib/axios';

export const notificationService = {
  listerNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  obtenirNombreNonLus: async () => {
    const response = await apiClient.get('/notifications/non-lus/count');
    return response.data.count;
  },

  marquerToutLu: async () => {
    const response = await apiClient.patch('/notifications/marquer-tout-lu');
    return response.data;
  },

  creerNotificationTest: async () => {
    const response = await apiClient.post('/notifications/test');
    return response.data;
  }
};
