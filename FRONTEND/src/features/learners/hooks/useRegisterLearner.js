/**
 * useRegisterLearner.js
 * Rôle : Hook React Query pour gérer la création d'un apprenant par l'établissement.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerLearner } from '../../auth/api/authApi';

export function useRegisterLearner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await registerLearner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etablissement-stats'] });
      queryClient.invalidateQueries({ queryKey: ['etablissement-apprenants'] });
    },
    onError: (error) => {
      console.error('Erreur inscription apprenant:', error);
    }
  });
}
