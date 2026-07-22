/**
 * apiRoutes.js
 * Centralise tous les endpoints de l'API Backend.
 * Ne jamais écrire directement un endpoint dans un composant.
 */

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER_ADMIN: "/auth/register/admin",
    REGISTER_ESTABLISHMENT: "/auth/register/etablissement",
    REGISTER_LEARNER: "/auth/register/apprenant",
    REGISTER_CAISSE: "/auth/register/caisse",
  },
  PAYMENTS: {
    CREATE: "/payments",
  },
};
