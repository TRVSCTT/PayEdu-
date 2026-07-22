import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, CreditCard, Info, AlertTriangle } from 'lucide-react'
import { notificationService } from '../../../services/notificationService'
import { cardStyles, EmptyState, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate } from '../../../utils/formatters'

export function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.listerNotifications()
        setNotifications(data || [])
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleToutLu = async () => {
    try {
      await notificationService.marquerToutLu()
      setNotifications(notifications.map((n) => ({ ...n, est_lu: true })))
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications', error)
    }
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'PAIEMENT':
        return <CreditCard className="h-5 w-5" />
      case 'ALERTE':
        return <AlertTriangle className="h-5 w-5" />
      case 'CONFIRMATION':
        return <Bell className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const iconTone = (type) => (type === 'PAIEMENT' ? 'primary' : type === 'ALERTE' ? 'warning' : 'info')

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader title="Notifications" description="Gardez un œil sur les alertes de paiement, confirmations et messages système." />

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['Tout', 'Système', 'Paiement', 'Confirmation', 'Alerte'].map((label, index) => (
          <button
            key={label}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              index === 0 ? 'border-primary bg-primary text-white shadow-sm' : 'border-border bg-white text-text-secondary hover:bg-primary-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleToutLu} className="text-sm font-semibold text-primary transition hover:text-primary-dark">
          Tout lu
        </button>
      </div>

      <main className="space-y-3">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary')}>Chargement…</div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <article
              key={notif.id}
              className={cardStyles(`flex items-start gap-4 p-4 ${notif.est_lu ? 'opacity-90' : 'border-primary/15 bg-primary-light/40'}`)}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${notif.est_lu ? 'bg-gray-100 text-text-muted' : 'bg-primary text-white'}`}>
                {getIconForType(notif.type_notification)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-text">{notif.titre}</h3>
                  <StatusBadge status={notif.type_notification} tone={iconTone(notif.type_notification)} />
                </div>
                <p className="mt-1 text-sm text-text-secondary">{notif.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
                  <span>{formatDate(notif.created_at, { dateStyle: 'medium' })}</span>
                  <span>{formatDate(notif.created_at, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              {!notif.est_lu && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
            </article>
          ))
        ) : (
          <EmptyState icon={Bell} title="Aucune notification" description="Les alertes apparaîtront ici au fur et à mesure des mises à jour." />
        )}
      </main>

      <div className="flex justify-center">
        <button
          onClick={async () => {
            try {
              await notificationService.creerNotificationTest()
              const data = await notificationService.listerNotifications()
              setNotifications(data || [])
            } catch (e) {
              console.error(e)
            }
          }}
          className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
        >
          + Ajouter une notification test
        </button>
      </div>
    </div>
  )
}
