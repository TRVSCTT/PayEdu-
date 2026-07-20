/**
 * getRoleDashboardPath.js
 * Rôle : Retourne le chemin du tableau de bord approprié selon le rôle.
 */
import { USER_ROLES } from "../constants/roles";

export function getRoleDashboardPath(role) {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "/admin";
    case USER_ROLES.ESTABLISHMENT_MANAGER:
      return "/etablissement";
    case USER_ROLES.LEARNER:
      return "/apprenant";
    case USER_ROLES.CASHIER:
      return "/caisse";
    default:
      return "/connexion";
  }
}
