/**
 * paymentApi.js
 * Rôle : Centralise les appels API liés aux paiements.
 */
import { apiClient } from '../../../lib/axios';
import { API_ROUTES } from '../../../constants/apiRoutes';

export async function createPaymentDraft(paymentPayload) {
  const response = await apiClient.post(API_ROUTES.PAYMENTS.CREATE, paymentPayload);
  return response.data;
}
