import { apiClient } from '../lib/axios';

export const supportService = {
  envoyerMessage: async (contenu, destinataire_id = null) => {
    const data = {
      contenu,
      destinataire_id
    };
    const response = await apiClient.post('/support/messages', data);
    return response.data;
  },

  recupererMessages: async () => {
    const response = await apiClient.get('/support/messages');
    return response.data;
  }
};
