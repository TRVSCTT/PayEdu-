/**
 * useRegisterLearner.js
 * Rôle : Hook React Query pour gérer la création d'un apprenant par l'établissement.
 */
import { useMutation } from '@tanstack/react-query';
import { registerLearner } from '../../auth/api/authApi';

export function useRegisterLearner() {
  return useMutation({
    mutationFn: async (data) => {
      return await registerLearner(data);
    },
    onError: (error) => {
      console.error('Erreur inscription apprenant:', error);
    }
  });
}
