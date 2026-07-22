import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, CreditCard, ReceiptText, Wallet } from 'lucide-react'
import { paymentService } from '../../../services/paymentService'
import { fraisService } from '../../../services/fraisService'
import { buttonStyles, cardStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'

export function LearnerDashboard() {
  const [historique, setHistorique] = useState([])
  const [frais, setFrais] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histData, fraisData] = await Promise.all([
          paymentService.obtenirHistorique(),
          fraisService.listerFrais(),
        ])
        setHistorique(histData || [])
        setFrais(fraisData || [])
      } catch (error) {
        console.error('Erreur chargement dashboard', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const paiementsAcquittes = historique.filter((p) => p.statut === 'acquittee')
  const prochainFrais = frais.find((f) => !paiementsAcquittes.some((p) => p.objet_paiement.includes(f.titre)))

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className={cardStyles('p-6')}>
          <div className="h-5 w-44 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-6 h-28 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace apprenant"
        title="Suivez vos paiements en un coup d’œil."
        description="Les frais à venir, les paiements récents et l’état des transactions restent visibles dans une interface sobre et rassurante."
        actions={
          <Link to="/apprenant/paiements/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Effectuer un paiement
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-3xl border border-primary/10 bg-primary p-6 text-white shadow-elevated sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Paiement immédiat</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {prochainFrais ? formatMoney(prochainFrais.montant) : 'Aucun montant dû'}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                  {prochainFrais
                    ? `Le prochain frais identifié correspond à "${prochainFrais.titre}".`
                    : "Vous n'avez aucun frais en attente pour le moment."}
                </p>
              </div>
              <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 sm:inline-flex">
                {prochainFrais ? 'À payer' : 'À jour'}
              </span>
            </div>

            {prochainFrais ? (
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Échéance</p>
                  <p className="mt-1 text-sm font-semibold">{formatDate(prochainFrais.date_echeance, { dateStyle: 'medium' })}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Type de frais</p>
                  <p className="mt-1 text-sm font-semibold">{prochainFrais.titre}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Statut</p>
                  <p className="mt-1"><StatusBadge status="pending" label="En attente" tone="warning" className="border-white/15 bg-white/10 text-white" /></p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm leading-6 text-white/80">
                  Vous pouvez tout de même accéder aux options de paiement libre ou vérifier un reçu existant.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/apprenant/paiements/nouveau"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-gray-100 sm:w-auto"
              >
                {prochainFrais ? 'Payer maintenant' : 'Faire un paiement libre'}
              </Link>
              <Link
                to="/apprenant/recu"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
              >
                Vérifier un reçu
              </Link>
            </div>
          </div>
        </article>

        <div className="grid gap-4">
          <StatMini icon={Wallet} label="Frais à régler" value={frais.length.toString()} helper="Liste des frais publiés par l’établissement" />
          <StatMini icon={ReceiptText} label="Paiements confirmés" value={paiementsAcquittes.length.toString()} helper="Transactions déjà validées" />
          <StatMini icon={CreditCard} label="Dernière activité" value={historique.length ? 'Disponible' : 'Aucune'} helper="Les récents paiements sont consultables" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className={cardStyles('p-6')}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Période de paiement</p>
              <h3 className="mt-2 text-lg font-semibold text-text">Frais disponibles</h3>
            </div>
            <Link to="/apprenant/paiements/nouveau" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
              Voir tout
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {frais.length > 0 ? (
              frais.map((item) => {
                const isPaye = paiementsAcquittes.some((p) => p.objet_paiement.includes(item.titre))
                return (
                  <article key={item.id || item.code} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{item.code}</p>
                    <h4 className="mt-2 text-sm font-semibold text-text">{item.titre}</h4>
                    <p className="mt-1 text-xs text-text-muted">Échéance {formatDate(item.date_echeance, { dateStyle: 'medium' })}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <span className="text-base font-semibold text-text">{formatMoney(item.montant)}</span>
                      <StatusBadge status={isPaye ? 'confirmed' : 'pending'} label={isPaye ? 'Réglé' : 'En attente'} tone={isPaye ? 'success' : 'warning'} />
                    </div>
                  </article>
                )
              })
            ) : (
              <p className="text-sm text-text-secondary sm:col-span-2">Aucun frais défini par l’établissement.</p>
            )}
          </div>
        </div>

        <div className={cardStyles('p-6')}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Derniers paiements</p>
              <h3 className="mt-2 text-lg font-semibold text-text">Historique récent</h3>
            </div>
            <Link to="/apprenant/histoire" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
              Voir tout
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {historique.length > 0 ? (
              historique.slice(0, 5).map((paiement) => {
                const statusTone =
                  paiement.statut === 'acquittee'
                    ? 'success'
                    : String(paiement.statut || '').includes('attente')
                      ? 'warning'
                      : 'neutral'

                return (
                  <article
                    key={paiement.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition hover:bg-white"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                        {paiement.objet_paiement ? paiement.objet_paiement.substring(0, 2).toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">{paiement.objet_paiement}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(paiement.created_at, { dateStyle: 'medium' })} · {paiement.reference_transaction || 'Référence à venir'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-text">{formatMoney(paiement.montant)}</p>
                      <div className="mt-1 flex justify-end">
                        <StatusBadge status={paiement.statut} tone={statusTone} />
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-text-secondary">
                Aucun paiement récent.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function StatMini({ icon: Icon, label, value, helper }) {
  return (
    <article className={cardStyles('p-5')}>
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-text">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{helper}</p>
        </div>
      </div>
    </article>
  )
}
