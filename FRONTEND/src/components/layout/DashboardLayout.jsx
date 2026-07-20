/**
 * DashboardLayout.jsx
 * Rôle : Layout principal pour les espaces connectés (barre de navigation, menu latéral).
 */
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { LogOut, User } from 'lucide-react';

export function DashboardLayout({ title }) {
  const { user, removeAuthenticationData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthenticationData();
    navigate('/connexion');
  };

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col">
      <header className="bg-white border-b border-gray-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-dark">ETUTRANSFERT</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-text-muted">
                <User className="h-5 w-5 mr-1" />
                <span>Rôle : <span className="font-semibold capitalize">{user?.role}</span></span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-danger-DEFAULT bg-danger-light hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-DEFAULT"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-6 px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-text-main">{title}</h2>
          </div>
        )}
        <div className="px-4 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
