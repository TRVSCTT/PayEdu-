/**
 * PublicRoute.jsx
 * Rôle : Empêche l'accès aux pages publiques (ex: login) si l'utilisateur est déjà connecté.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { getRoleDashboardPath } from '../../utils/getRoleDashboardPath';

export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirige l'utilisateur connecté vers son espace
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return children;
}
