/**
 * queryClient.js
 * Rôle : Configuration centrale du QueryClient pour TanStack Query.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // On évite de recharger à chaque changement d'onglet
      retry: 1, // On ne retente qu'une seule fois en cas d'erreur
      staleTime: 5 * 60 * 1000, // Les données sont considérées "fraîches" pendant 5 minutes
    },
  },
});
