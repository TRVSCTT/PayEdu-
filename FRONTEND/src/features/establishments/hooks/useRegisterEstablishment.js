/**
 * useRegisterEstablishment.js
 * Rôle : Hook React Query pour gérer la création d'un établissement par l'admin.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerEstablishment } from '../../auth/api/authApi';

export function useRegisterEstablishment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await registerEstablishment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-etablissements'] });
    },
    onError: (error) => {
      console.error('Erreur inscription établissement:', error);
    }
  });
}
