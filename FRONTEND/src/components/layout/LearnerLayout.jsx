import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, FileText, Settings, User, Bell } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { paymentService } from '../../services/paymentService';
import { notificationService } from '../../services/notificationService';

export function LearnerLayout() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchProfilAndNotifs = async () => {
      try {
        const [profilData, count] = await Promise.all([
          paymentService.obtenirProfil(),
          notificationService.obtenirNombreNonLus()
        ]);
        setProfil(profilData);
        setUnreadNotifications(count);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    if (user) {
      fetchProfilAndNotifs();
    }
  }, [user]);

  const location = useLocation();
  const isProfilePage = location.pathname === '/apprenant/profil';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      {/* Top Header */}
      {!isProfilePage && (
        <header className="bg-[#fafafa] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {/* Generate avatar using UI Faces or an initial-based avatar */}
            <img 
              src={`https://ui-avatars.com/api/?name=${profil?.prenom || 'User'}+${profil?.nom || ''}&background=000&color=fff&size=150`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              Bonjour {profil?.prenom ? `${profil.prenom} ${profil.nom}` : (user?.prenom || 'Jack')}
            </h1>
            <p className="text-sm text-gray-500">{profil?.etablissement_nom || "Chargement..."}</p>
          </div>
        </div>
        <Link to="/apprenant/notifications" className="relative p-2">
          <Bell className="w-6 h-6 text-gray-800" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white border border-white">
              {unreadNotifications}
            </span>
          )}
        </Link>
      </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-between items-center px-6 py-3 pb-safe z-50 rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <NavItem to="/apprenant" icon={<Home />} label="Accueil" />
        <NavItem to="/apprenant/paiements" icon={<CreditCard />} label="Paiement" />
        <NavItem to="/apprenant/documents" icon={<FileText />} label="Document" />
        <NavItem to="/apprenant/parametres" icon={<Settings />} label="Paramètre" />
        <NavItem to="/apprenant/profil" icon={<User />} label="Profil" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/apprenant"}
      className={({ isActive }) =>
        `flex flex-col items-center space-y-1 ${isActive ? 'text-black' : 'text-gray-400'}`
      }
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
