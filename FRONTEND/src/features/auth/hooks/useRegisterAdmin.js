/**
 * useRegisterAdmin.js
 * Rôle : Hook React Query pour gérer la création d'un administrateur.
 */
import { useMutation } from '@tanstack/react-query';
import { registerAdministrator } from '../api/authApi';

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: async (adminData) => {
      return await registerAdministrator(adminData);
    },
    onError: (error) => {
      console.error('Erreur inscription admin:', error);
    }
  });
}
