import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, Info, ShieldCheck } from 'lucide-react'
import { cardStyles, PageHeader } from '../../../components/ui/designSystem'

export function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader eyebrow="À propos" title="À propos de l'application" description="Un produit pensé pour simplifier les paiements universitaires avec une interface crédible et rassurante." />

      <section className={cardStyles('p-6 sm:p-8')}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-white shadow-elevated">
            <span className="text-3xl font-bold tracking-tighter">PE</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text">PayEdu</h2>
            <p className="mt-1 text-sm text-text-muted">Version 1.0.0</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <AboutRow icon={ShieldCheck} title="Paiement sécurisé" description="Vos transactions restent protégées et clairement présentées." />
          <AboutRow icon={Info} title="Suivi en temps réel" description="Les statuts de paiement, reçus et informations utiles restent visibles." />
          <AboutRow icon={Heart} title="Pensé pour vous" description="Une interface fluide, sobre et adaptée aux usages mobiles." />
        </div>
      </section>

      <div className="text-center text-xs text-text-muted">
        <p>© 2026 PayEdu. Tous droits réservés.</p>
        <p className="mt-1">Conçu pour le Cameroun et l’écosystème académique.</p>
        <p className="mt-2 font-medium text-text-secondary">Fait par (ONOBIONO ELOGO dave yohan)</p>
      </div>
    </div>
  )
}

function AboutRow({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
      </div>
    </div>
  )
}
