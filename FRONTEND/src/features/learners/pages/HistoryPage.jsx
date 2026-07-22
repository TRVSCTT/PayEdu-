import { useEffect, useState } from 'react'
import { FileText, History } from 'lucide-react'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { paymentService } from '../../../services/paymentService'
import { cardStyles, EmptyState, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'

export function HistoryPage() {
  const [historique, setHistorique] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const histData = await paymentService.obtenirHistorique()
        setHistorique(histData || [])
      } catch (error) {
        console.error('Erreur chargement historique', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <PageHeader
        eyebrow="Historique"
        title="Vos paiements récents"
        description="Chaque transaction apparaît avec un statut lisible, une date claire et un montant formaté."
      />

      <section className="space-y-3">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary')}>Chargement de l’historique…</div>
        ) : historique.length > 0 ? (
          historique.map((payment) => {
            const statusTone =
              payment.statut === 'acquittee'
                ? 'success'
                : String(payment.statut || '').includes('attente')
                  ? 'warning'
                  : 'neutral'

            return (
              <article key={payment.id} className={cardStyles('flex items-start gap-4 p-4 transition hover:border-primary/15 hover:bg-primary-light/30')}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text">Facture</h3>
                    <StatusBadge status={payment.statut} tone={statusTone} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    Paiement de {formatMoney(payment.montant_total || payment.montant)} ({payment.objet_paiement})
                  </p>
                  <p className="mt-2 text-xs text-text-muted">{formatDate(payment.created_at, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </article>
            )
          })
        ) : (
          <EmptyState
            icon={History}
            title="Aucun historique disponible"
            description="Les paiements apparaîtront ici dès qu’une transaction aura été enregistrée."
          />
        )}
      </section>
    </div>
  )
}
