/**
 * useRegisterEstablishment.js
 * Rôle : Hook React Query pour gérer la création d'un établissement par l'admin.
 */
import { useMutation } from '@tanstack/react-query';
import { registerEstablishment } from '../../auth/api/authApi';

export function useRegisterEstablishment() {
  return useMutation({
    mutationFn: async (data) => {
      return await registerEstablishment(data);
    },
    onError: (error) => {
      console.error('Erreur inscription établissement:', error);
    }
  });
}
