import { Outlet, Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, University } from 'lucide-react'
import { BrandLink, PageHeader, StatusBadge, cardStyles } from '../ui/designSystem'

export function AuthLayout() {
  return (
    <div className="app-page">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
        <aside className="relative hidden overflow-hidden rounded-3xl border border-border bg-primary p-8 text-white shadow-elevated lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(15,157,138,0.22),_transparent_30%)]" />
          <div className="relative space-y-8">
            <BrandLink />
            <PageHeader
              eyebrow="Plateforme financière universitaire"
              title="Une expérience de paiement claire, moderne et rassurante."
              description="Les étudiants, parents et tuteurs avancent étape par étape, avec des statuts compréhensibles et des reçus vérifiables."
            />
            <div className="grid gap-4">
              <article className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Sécurité visible</h3>
                    <p className="mt-1 text-sm leading-6 text-white/80">
                      Chaque écran garde les informations sensibles lisibles, avec une hiérarchie nette.
                    </p>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
                    <University className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Pensé pour le monde académique</h3>
                    <p className="mt-1 text-sm leading-6 text-white/80">
                      Les parcours de paiement et les reçus restent cohérents sur mobile comme sur ordinateur.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div>
              <StatusBadge status="confirmed" label="Reçus vérifiables" tone="success" className="border-white/15 bg-white/10 text-white" />
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Le site évite les ambiguïtés: étapes, montants, statut et prochaine action sont visibles immédiatement.
              </p>
            </div>
            <Link
              to="/"
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:inline-flex"
            >
              Accueil
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>

        <section className="flex min-h-screen flex-col justify-center py-4 sm:py-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <BrandLink />
            <Link to="/" className="app-button-tertiary px-3 py-2 text-xs text-primary">
              Accueil
            </Link>
          </div>

          <div className={cardStyles('mx-auto w-full max-w-xl p-5 sm:p-8 lg:max-w-none')}>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}
