import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Hourglass, LifeBuoy, ReceiptText, RefreshCcw } from 'lucide-react'
import { cardStyles, buttonStyles, StatusBadge, PageHeader } from '../../../components/ui/designSystem'

export function PaymentPendingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-2xl space-y-6">
        <PageHeader
          eyebrow="En attente"
          title="Enregistrement en cours"
          description="Le paiement a été reçu mais reste en attente de validation ou de rapprochement côté plateforme."
        />

        <section className={cardStyles('overflow-hidden')}>
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warning-light text-warning">
              <Hourglass className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <StatusBadge status="pending" tone="warning" />
              <p className="max-w-xl text-sm leading-6 text-text-secondary">
                Votre transaction est en cours de traitement. Le reçu sera confirmé dès que la validation sera terminée.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border bg-background p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <button onClick={() => navigate('/apprenant/paiements/recapitulatif')} className={buttonStyles({ variant: 'secondary', block: true })}>
              Voir le détail
            </button>
            <button onClick={() => navigate('/apprenant/paiements/nouveau')} className={buttonStyles({ variant: 'secondary', block: true })}>
              <RefreshCcw className="h-4 w-4" />
              Réessayer
            </button>
            <Link to="/apprenant/recu" className={buttonStyles({ variant: 'primary', block: true })}>
              <ReceiptText className="h-4 w-4" />
              Reçu
            </Link>
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
