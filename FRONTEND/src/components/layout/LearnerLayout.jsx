import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Bell, CreditCard, FileText, Home, Settings, User } from 'lucide-react'
import { useAuth } from '../../store/authStore'
import { paymentService } from '../../services/paymentService'
import { notificationService } from '../../services/notificationService'
import { cx } from '../ui/designSystem'

export function LearnerLayout() {
  const { user } = useAuth()
  const [profil, setProfil] = useState(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    const fetchProfilAndNotifs = async () => {
      try {
        const [profilData, count] = await Promise.all([
          paymentService.obtenirProfil(),
          notificationService.obtenirNombreNonLus(),
        ])
        setProfil(profilData)
        setUnreadNotifications(count)
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error)
      }
    }

    if (user) {
      fetchProfilAndNotifs()
    }
  }, [user])

  const location = useLocation()
  const isProfilePage = location.pathname === '/apprenant/profil'

  return (
    <div className="app-page flex flex-col">
      {!isProfilePage && (
        <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 overflow-hidden rounded-2xl border border-border bg-primary-light">
                <img
                  src={`https://ui-avatars.com/api/?name=${profil?.prenom || 'User'}+${profil?.nom || ''}&background=123B5D&color=fff&size=150`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Bonjour</p>
                <h1 className="text-lg font-semibold leading-tight text-text">
                  {profil?.prenom ? `${profil.prenom} ${profil.nom}` : user?.prenom || 'Étudiant'}
                </h1>
                <p className="text-sm text-text-secondary">{profil?.etablissement_nom || 'Chargement…'}</p>
              </div>
            </div>

            <Link
              to="/apprenant/notifications"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-danger px-1 text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          </div>
        </header>
      )}

      <main className={cx('flex-1 pb-24', !isProfilePage && 'pt-4')}>
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-5 gap-1 px-2 py-2 pb-safe">
          <NavItem to="/apprenant" icon={Home} label="Accueil" end />
          <NavItem to="/apprenant/paiements" icon={CreditCard} label="Paiement" />
          <NavItem to="/apprenant/documents" icon={FileText} label="Documents" />
          <NavItem to="/apprenant/parametres" icon={Settings} label="Réglages" />
          <NavItem to="/apprenant/profil" icon={User} label="Profil" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx(
          'flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors',
          isActive ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-gray-100 hover:text-text',
        )
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}
