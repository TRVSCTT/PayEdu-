import { CalendarRange, CreditCard, History, Wallet } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buttonStyles, cx } from './designSystem'

const TABS = [
  { label: 'Payer', to: '/apprenant/paiements/nouveau', match: '/paiements', icon: CreditCard },
  { label: 'Portefeuille', to: '/apprenant/portefeuille', match: '/portefeuille', icon: Wallet },
  { label: 'Historique', to: '/apprenant/histoire', match: '/histoire', icon: History },
  { label: 'RDV', to: '/apprenant/rdv', match: '/rdv', icon: CalendarRange },
]

export function TopNavTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-white p-2 shadow-soft sm:grid-cols-4">
      {TABS.map((tab) => {
        const active = currentPath.includes(tab.match)
        const Icon = tab.icon

        return (
          <button
            key={tab.to}
            type="button"
            onClick={() => navigate(tab.to)}
            className={cx(
              buttonStyles({ variant: active ? 'primary' : 'ghost', size: 'sm', block: true }),
              'justify-center',
              !active && 'text-text-secondary',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
