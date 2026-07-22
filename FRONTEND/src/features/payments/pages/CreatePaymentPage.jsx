import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, School, ShieldCheck, ReceiptText } from 'lucide-react'
import { usePaymentContext } from './../context/PaymentContext'
import { fraisService } from '../../../services/fraisService'
import { paymentService } from '../../../services/paymentService'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { Stepper, PageHeader, cardStyles, buttonStyles, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function CreatePaymentPage() {
  const navigate = useNavigate()
  const { updatePaymentData } = usePaymentContext()
  const [selectedFees, setSelectedFees] = useState([])
  const [availableFees, setAvailableFees] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const [fraisData, histData] = await Promise.all([fraisService.listerFrais(), paymentService.obtenirHistorique()])
        const paiementsAcquittes = (histData || []).filter((p) => p.statut === 'acquittee')
        const unpaidFees = (fraisData || []).filter((f) => !paiementsAcquittes.some((p) => p.objet_paiement.includes(f.titre)))
        setAvailableFees(unpaidFees)
      } catch (error) {
        console.error('Erreur chargement des frais', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFees()
  }, [])

  const toggleFee = (id) => {
    setSelectedFees((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const totalAmount = selectedFees.reduce((sum, id) => {
    const fee = availableFees.find((f) => f.id === id)
    return sum + (fee ? fee.montant : 0)
  }, 0)

  const handleContinue = () => {
    const objetPaiement = selectedFees.map((id) => availableFees.find((f) => f.id === id)?.titre).join(', ')
    updatePaymentData({
      objet_paiement: objetPaiement || 'Frais de scolarité',
      montant_total: totalAmount,
    })

    navigate('/apprenant/paiements/quitus', { state: { totalAmount, selectedFees } })
  }

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <Stepper steps={STEPS} currentStep={2} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Étape 3</p>
          <h2 className="text-xl font-semibold text-text">Choix des frais à payer</h2>
        </div>
      </div>

      <PageHeader
        description="Sélectionnez un ou plusieurs frais à régler. Le total est calculé automatiquement avant de poursuivre."
      />

      <section className="space-y-3">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary')}>Chargement des frais…</div>
        ) : availableFees.length > 0 ? (
          availableFees.map((fee) => {
            const selected = selectedFees.includes(fee.id)

            return (
              <button
                key={fee.id}
                type="button"
                onClick={() => toggleFee(fee.id)}
                className={cardStyles(
                  `flex w-full items-center gap-4 p-4 text-left transition hover:border-primary/15 hover:bg-primary-light/40 ${
                    selected ? 'border-primary bg-primary-light shadow-sm' : ''
                  }`,
                )}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                    selected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                  }`}
                >
                  {selected ? '✓' : null}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-text">{fee.titre}</h3>
                  <p className="mt-1 text-xs text-text-muted">Échéance {formatDate(fee.date_echeance, { dateStyle: 'medium' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text">{formatMoney(fee.montant)}</p>
                  <StatusBadge status="pending" label="À régler" tone="warning" className="mt-2" />
                </div>
              </button>
            )
          })
        ) : (
          <div className={cardStyles('p-6 text-center')}>
            <ReceiptText className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-semibold text-text">Aucun frais en attente</p>
            <p className="mt-1 text-sm text-text-secondary">Votre établissement n’a pas publié de frais disponibles pour le moment.</p>
          </div>
        )}
      </section>

      <section className={cardStyles('p-5 sm:p-6')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Total sélectionné</p>
            <p className="mt-1 text-sm text-text-secondary">Le montant s’actualise au fur et à mesure de votre sélection.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight text-text">{formatMoney(totalAmount)}</p>
            <p className="text-xs text-text-muted">{selectedFees.length} frais sélectionné{selectedFees.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button onClick={handleContinue} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            Continuer
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
