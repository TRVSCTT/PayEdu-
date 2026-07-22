import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lock,
  Receipt,
  ShieldCheck,
  Smartphone,
  University,
} from 'lucide-react'
import { BrandLink, PageHeader, SectionHeader, Stepper, cardStyles, buttonStyles, StatCard, StatusBadge } from '../../../components/ui/designSystem'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

const ADVANTAGES = [
  {
    icon: Smartphone,
    title: 'Paiement à distance',
    description: 'Les étudiants, parents et tuteurs paient sans se déplacer, avec un parcours guidé clair.',
  },
  {
    icon: Receipt,
    title: 'Reçu vérifiable',
    description: 'Chaque transaction génère un reçu traçable et facile à vérifier au besoin.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité renforcée',
    description: 'L’interface rassure, explique chaque étape et met en avant les statuts de paiement.',
  },
  {
    icon: Clock3,
    title: 'Suivi en temps réel',
    description: 'Le statut du paiement reste lisible pendant tout le parcours jusqu’à la confirmation.',
  },
]

export function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(15,157,138,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_30%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-3">
          <BrandLink />
          <div className="hidden items-center gap-3 sm:flex">
            <StatusBadge status="confirmed" label="Plateforme sécurisée" tone="success" />
            <Link to="/connexion" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
              Connexion
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="space-y-8">
            <PageHeader
              eyebrow="Paiement universitaire et financier"
              title="Payer les frais d’études avec un parcours simple, rassurant et vérifiable."
              description="ETUTRANSFERT aide les étudiants, candidats, parents et tuteurs à régler les frais universitaires, les frais d’examen et les frais de concours sans friction."
              actions={
                <>
                  <Link to="/connexion" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
                    Effectuer un paiement
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/connexion" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
                    Vérifier un reçu
                  </Link>
                </>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {ADVANTAGES.map((item) => (
                <article key={item.title} className={cardStyles('p-5')}>
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className={cardStyles('overflow-hidden p-6 sm:p-8')}>
              <SectionHeader
                title="Comment ça fonctionne"
                description="Un parcours progressif, lisible sur mobile comme sur ordinateur."
              />
              <div className="mt-6">
                <Stepper steps={STEPS} currentStep={3} />
              </div>
              <div className="mt-6 rounded-2xl bg-primary-light p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Paiement guidé et sécurisé</h3>
                    <p className="text-sm leading-6 text-primary/90">
                      Chaque étape affiche les informations utiles, la progression et les messages de validation au bon moment.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <StatCard icon={University} label="Universités partenaires" value="Centralisé" helper="Une seule interface pour plusieurs établissements" tone="secondary" />
              <StatCard icon={Receipt} label="Reçus" value="Vérifiables" helper="Chaque transaction reste traçable" tone="info" />
              <StatCard icon={CheckCircle2} label="Statuts" value="Lisibles" helper="Badges, icônes et libellés explicites" tone="success" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
