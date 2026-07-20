/**
 * useCreatePayment.js
 * Rôle : Hook React Query pour gérer la création d'un brouillon de paiement.
 */
import { useMutation } from '@tanstack/react-query';
import { createPaymentDraft } from '../api/paymentApi';

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (paymentPayload) => {
      return await createPaymentDraft(paymentPayload);
    },
    onError: (error) => {
      console.error('Erreur initiation paiement:', error);
    }
  });
}
