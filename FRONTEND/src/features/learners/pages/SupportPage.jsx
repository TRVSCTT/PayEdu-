import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LifeBuoy, Search } from 'lucide-react'
import { buttonStyles, cardStyles, PageHeader } from '../../../components/ui/designSystem'

export function SupportPage() {
  const navigate = useNavigate()
  const faqItems = [
    "Comment effectuer un paiement ?",
    'Quand est-ce que je reçois mon reçu ?',
    'Comment déplacer un rendez-vous ?',
    "Mon paiement n'est pas confirmé",
  ]

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader title="Support et aide" description="Accédez rapidement aux réponses, au guide utilisateur et à l’assistance technique." />

      <div className="relative">
        <input type="text" placeholder="Décrivez votre problème" className="app-input pr-12" />
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Aide et support</h2>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={cardStyles('flex w-full items-center justify-between gap-4 p-4 text-left transition hover:border-primary/15 hover:bg-primary-light/40')}
            >
              <span className="text-sm font-semibold text-text">{item}</span>
              <ChevronRight className="h-5 w-5 text-text-muted" />
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        <button onClick={() => navigate('/apprenant/parametres/assistant')} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
          Contacter l'assistant
        </button>
        <button className={buttonStyles({ variant: 'secondary', size: 'lg', block: true })}>Guide utilisateur</button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button className="text-sm font-semibold text-text-secondary transition hover:text-primary">Conditions Générales d'Utilisation</button>
        <button className="text-sm font-semibold text-text-secondary transition hover:text-primary">Politique de Confidentialité</button>
      </div>
    </div>
  )
}
