/**
 * authApi.js
 * Rôle : Centralise les appels API liés à l'authentification et aux inscriptions.
 */
import { apiClient } from '../../../lib/axios';
import { API_ROUTES } from '../../../constants/apiRoutes';

export async function loginUser(credentials) {
  const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
  return response.data; // { access_token, token_type, role, ... }
}

export async function registerAdministrator(adminData) {
  const response = await apiClient.post(API_ROUTES.AUTH.REGISTER_ADMIN, adminData);
  return response.data;
}

export async function registerEstablishment(establishmentData) {
  const response = await apiClient.post(API_ROUTES.AUTH.REGISTER_ESTABLISHMENT, establishmentData);
  return response.data;
}

export async function registerLearner(learnerData) {
  const response = await apiClient.post(API_ROUTES.AUTH.REGISTER_LEARNER, learnerData);
  return response.data;
}
