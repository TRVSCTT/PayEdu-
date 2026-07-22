import { useMutation } from '@tanstack/react-query';
import { registerCaisse } from '../api/authApi';

export function useRegisterCaisse() {
  return useMutation({
    mutationFn: async (caisseData) => {
      return await registerCaisse(caisseData);
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la caisse:', error);
    }
  });
}
