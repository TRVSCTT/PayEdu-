import { useLocation, Link, Navigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CreditCard, FileText, Tag } from 'lucide-react'
import { cardStyles, buttonStyles, StatusBadge, PageHeader } from '../../../components/ui/designSystem'
import { formatMoney } from '../../../utils/formatters'

export function PaymentDraftPage() {
  const location = useLocation()
  const payment = location.state?.payment

  if (!payment) {
    return <Navigate to="/apprenant/paiements/nouveau" replace />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Brouillon"
        title="Le paiement a été créé comme brouillon"
        description="Vérifiez les informations ci-dessous avant la prochaine étape."
      />

      <section className={cardStyles('overflow-hidden')}>
        <div className="flex items-start gap-3 border-b border-border bg-warning-light/60 px-5 py-4 sm:px-6">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <h3 className="text-base font-semibold text-text">Le paiement n’est pas encore confirmé.</h3>
            <p className="mt-1 text-sm text-text-secondary">Le brouillon reste modifiable tant que la validation finale n’a pas été effectuée.</p>
          </div>
        </div>

        <dl className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <DetailRow label="Identifiant" value={payment.id} icon={Tag} />
          <DetailRow label="Objet" value={String(payment.objet_paiement || '').replaceAll('_', ' ')} icon={FileText} />
          <DetailRow label="Moyen souhaité" value={String(payment.moyen_paiement || '').replaceAll('_', ' ')} icon={CreditCard} />
          <DetailRow label="Montant appliqué" value={formatMoney(payment.montant)} icon={CreditCard} highlight />
          <DetailRow label="Statut" value={String(payment.statut || '').toUpperCase()} icon={Tag} />
        </dl>

        <div className="border-t border-border bg-background p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button disabled className={buttonStyles({ variant: 'primary', block: true })}>
              Payer maintenant
            </button>
            <Link to="/apprenant" className={buttonStyles({ variant: 'secondary', block: true })}>
              Retour
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function DetailRow({ label, value, icon: Icon, highlight = false }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? 'bg-primary-light' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        {Icon ? <Icon className={`mt-0.5 h-4 w-4 ${highlight ? 'text-primary' : 'text-text-muted'}`} /> : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{label}</p>
          <p className="mt-2 text-sm font-semibold text-text">{value}</p>
        </div>
      </div>
    </div>
  )
}
