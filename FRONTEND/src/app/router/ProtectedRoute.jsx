/**
 * ProtectedRoute.jsx
 * Rôle : Empêche l'accès aux utilisateurs non connectés.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirige vers la connexion en gardant la page demandée en mémoire
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
}
