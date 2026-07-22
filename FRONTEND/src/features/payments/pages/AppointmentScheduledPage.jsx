import { Link, useNavigate } from 'react-router-dom'
import { CalendarCheck2, FileText, MapPin } from 'lucide-react'
import { cardStyles, buttonStyles, StatusBadge, PageHeader } from '../../../components/ui/designSystem'

export function AppointmentScheduledPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-2xl space-y-6">
        <PageHeader
          eyebrow="Rendez-vous"
          title="Rendez-vous planifié"
          description="La validation est programmée et reste visible dans une interface simple à relire."
        />

        <section className={cardStyles('overflow-hidden')}>
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light text-primary">
              <CalendarCheck2 className="h-12 w-12" />
            </div>
            <StatusBadge status="confirmed" tone="success" />
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-text">Validation programmée</h2>
              <p className="max-w-xl text-sm leading-6 text-text-secondary">
                Rendez-vous prévu le 29 juin 2026 à 10:30. Présentez-vous 1h avant l’heure indiquée pour un traitement fluide.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border bg-background p-5 sm:grid-cols-2 sm:p-6">
            <button onClick={() => navigate('/apprenant/rdv')} className={buttonStyles({ variant: 'primary', block: true })}>
              Voir mon rendez-vous
            </button>
            <Link to="/apprenant/documents" className={buttonStyles({ variant: 'secondary', block: true })}>
              <FileText className="h-4 w-4" />
              Mes documents
            </Link>
          </div>

          <div className="border-t border-border p-5">
            <button
              onClick={() => navigate('/apprenant')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
            >
              <MapPin className="h-4 w-4" />
              Retour à l’accueil
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
