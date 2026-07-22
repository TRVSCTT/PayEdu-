import { apiClient } from '../lib/axios';

export const paymentService = {
  /**
   * Récupérer le profil pour avoir l'etablissement_id
   */
  obtenirProfil: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Étape 1 : Créer le brouillon de paiement
   * @param {Object} data - { etablissement_id, objet_paiement, moyen_paiement }
   */
  initierPaiement: async (data) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  /**
   * Étape 3 : Définir le moyen de paiement et le numéro de compte
   * @param {string} paiementId
   * @param {Object} data - { numero_compte_paiement }
   */
  definirMoyenPaiement: async (paiementId, data) => {
    const response = await apiClient.patch(`/payments/${paiementId}/moyen-paiement`, data);
    return response.data;
  },

  /**
   * Récupérer le récapitulatif
   * @param {string} paiementId
   */
  obtenirRecapitulatif: async (paiementId) => {
    const response = await apiClient.get(`/payments/${paiementId}/recapitulatif`);
    return response.data;
  },

  /**
   * Autoriser le paiement avec le code PIN / TOTP
   * @param {string} paiementId
   * @param {Object} data - { code_totp }
   */
  autoriserPaiement: async (paiementId, data) => {
    const response = await apiClient.post(`/payments/${paiementId}/autoriser`, data);
    return response.data;
  },

  /**
   * Consulter le statut d'un paiement en cours
   * @param {string} paiementId
   */
  consulterPaiement: async (paiementId) => {
    const response = await apiClient.get(`/payments/${paiementId}`);
    return response.data;
  },
};
