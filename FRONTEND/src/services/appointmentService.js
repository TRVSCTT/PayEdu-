import { apiClient } from '../lib/axios';

export const appointmentService = {
  /**
   * Récupère la liste des rendez-vous de l'apprenant
   */
  getAppointments: async () => {
    try {
      const response = await apiClient.get('/appointments');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous", error);
      throw error;
    }
  }
};
