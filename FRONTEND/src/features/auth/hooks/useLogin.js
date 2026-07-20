/**
 * useLogin.js
 * Rôle : Hook React Query pour gérer l'appel à l'API de connexion.
 */
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { handleApiError } from '../../../utils/handleApiError';

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      return await loginUser(credentials);
    },
    onError: (error) => {
      // Les erreurs seront gérées par le composant (ex: affichage d'un toast ou message)
      console.error('Erreur de connexion:', error);
    }
  });
}
