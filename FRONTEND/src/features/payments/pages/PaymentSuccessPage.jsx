import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, FileCheck2, RefreshCcw, LifeBuoy, ReceiptText } from 'lucide-react'
import { usePaymentContext } from '../context/PaymentContext'
import { cardStyles, buttonStyles, StatusBadge, PageHeader } from '../../../components/ui/designSystem'
import { maskReference } from '../../../utils/formatters'

export function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { paymentData } = usePaymentContext()

  const reference = paymentData?.paiement_id ? maskReference(paymentData.paiement_id) : 'Référence en cours'

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-2xl space-y-6">
        <PageHeader
          eyebrow="Confirmation"
          title="Paiement confirmé"
          description="Votre transaction a été acceptée. Le reçu et le détail de l’opération restent accessibles."
        />

        <section className={cardStyles('overflow-hidden')}>
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success-light text-success">
              <FileCheck2 className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <StatusBadge status="confirmed" tone="success" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Référence</p>
              <p className="text-2xl font-semibold tracking-tight text-text">{reference}</p>
              <p className="max-w-xl text-sm leading-6 text-text-secondary">
                La prochaine étape consiste à conserver le reçu ou à consulter le détail complet de la transaction.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border bg-background p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <Link to="/apprenant/recu" className={buttonStyles({ variant: 'primary', block: true })}>
              Télécharger le reçu
              <ReceiptText className="h-4 w-4" />
            </Link>
            <button onClick={() => navigate('/apprenant/paiements/recapitulatif')} className={buttonStyles({ variant: 'secondary', block: true })}>
              Voir le détail
            </button>
            <button onClick={() => navigate('/apprenant/paiements/nouveau')} className={buttonStyles({ variant: 'secondary', block: true })}>
              <RefreshCcw className="h-4 w-4" />
              Nouveau paiement
            </button>
            <Link to="/apprenant/parametres/support" className={buttonStyles({ variant: 'secondary', block: true })}>
              <LifeBuoy className="h-4 w-4" />
              Assistance
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
