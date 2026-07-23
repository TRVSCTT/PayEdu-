import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, School, UserPlus, UserRound } from 'lucide-react'
import { USER_ROLES } from '../../constants/roles'
import { useAuth } from '../../store/authStore'
import { BrandLink, PageHeader, buttonStyles, cx } from '../ui/designSystem'

const MENU_BY_ROLE = {
  [USER_ROLES.ADMIN]: [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/admin/etablissements/nouveau', label: 'Nouvel établissement', icon: School },
  ],
  [USER_ROLES.ESTABLISHMENT_MANAGER]: [
    { to: '/etablissement', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/etablissement/apprenants/nouveau', label: 'Nouvel apprenant', icon: UserPlus },
  ],
  [USER_ROLES.CASHIER]: [
    { to: '/caisse', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  ],
}

export function DashboardLayout({ title, description, actions, children }) {
  const { user, removeAuthenticationData } = useAuth()
  const navigate = useNavigate()
  const menuItems = MENU_BY_ROLE[user?.role] || []

  const handleLogout = () => {
    removeAuthenticationData()
    navigate('/connexion')
  }

  return (
    <div className="app-page lg:grid lg:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-surface/90 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-full flex-col px-5 py-6">
          <BrandLink />
          <div className="mt-6 rounded-2xl bg-primary-light p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Espace connecté</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{user?.role || 'Utilisateur'}</p>
                <p className="text-xs text-text-secondary">Navigation rapide et sécurisée</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                      isActive
                        ? 'border-primary/15 bg-primary text-white shadow-sm'
                        : 'border-transparent text-text-secondary hover:border-border hover:bg-gray-100 hover:text-text',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Profil</p>
              <p className="mt-2 text-sm font-semibold text-text">{user?.role || 'Compte connecté'}</p>
            </div>

            <button onClick={handleLogout} className={buttonStyles({ variant: 'danger', block: true })}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border bg-surface/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <BrandLink />
            </div>

            <div className="hidden flex-1 items-center justify-between gap-4 lg:flex">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">ETUTRANSFERT</p>
                <p className="text-sm text-text-secondary">Espaces administratifs et partenaires financiers</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="app-chip">{user?.role || 'Espace connecté'}</span>
                <button onClick={handleLogout} className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={handleLogout} className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {(title || description || actions) && (
              <PageHeader
                title={title || 'Tableau de bord'}
                description={description}
                actions={actions}
              />
            )}

            <div className={cx(title || description || actions ? 'mt-6' : '', 'space-y-6')}>
              {children}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
