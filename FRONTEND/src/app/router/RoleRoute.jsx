/**
 * RoleRoute.jsx
 * Rôle : Restreint l'accès à une route à certains rôles spécifiques.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { getRoleDashboardPath } from '../../utils/getRoleDashboardPath';

export function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirige vers le dashboard approprié si le rôle est incorrect, ou vers la connexion
    const redirectPath = user ? getRoleDashboardPath(user.role) : '/connexion';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
