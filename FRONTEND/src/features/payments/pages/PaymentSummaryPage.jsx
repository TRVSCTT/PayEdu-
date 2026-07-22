import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft, CheckCircle2, Delete, Loader2, ShieldCheck } from 'lucide-react'
import { usePaymentContext } from './../context/PaymentContext'
import { paymentService } from '../../../services/paymentService'
import { Stepper, PageHeader, cardStyles, buttonStyles, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate, formatMoney, maskReference } from '../../../utils/formatters'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function PaymentSummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { paymentData } = usePaymentContext()
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [pinCode, setPinCode] = useState('')
  const [summaryData, setSummaryData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const operator = location.state?.operator?.toLowerCase() || paymentData.moyen_paiement || 'orange'
  const pinLength = operator.includes('mtn') ? 5 : 4
  const amount = summaryData ? summaryData.montant : paymentData.montant_total

  useEffect(() => {
    const fetchSummary = async () => {
      if (!paymentData.paiement_id) return
      try {
        const data = await paymentService.obtenirRecapitulatif(paymentData.paiement_id)
        setSummaryData(data)
      } catch (error) {
        toast.error("Erreur lors de la récupération du récapitulatif")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [paymentData.paiement_id])

  const handleKeypadPress = async (val) => {
    if (val === 'delete') {
      setPinCode((prev) => prev.slice(0, -1))
      return
    }

    if (pinCode.length >= pinLength) {
      return
    }

    const newPin = pinCode + val
    setPinCode(newPin)

    if (newPin.length === pinLength) {
      try {
        const response = await paymentService.autoriserPaiement(paymentData.paiement_id, {
          code_totp: newPin.padStart(pinLength, '0'),
        })

        setShowSecurityModal(false)
        if (response.payment_url) {
          window.location.href = response.payment_url
        } else {
          navigate('/apprenant/paiements/succes')
        }
      } catch (error) {
        setPinCode('')
        toast.error(error.response?.data?.detail || 'Code de sécurité invalide')
      }
    }
  }

  if (isLoading && paymentData.paiement_id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 text-sm text-text-secondary shadow-soft">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Chargement du récapitulatif…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} currentStep={5} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Étape 6</p>
          <h2 className="text-xl font-semibold text-text">Récapitulatif avant paiement</h2>
        </div>
      </div>

      <PageHeader description="Vérifiez chaque information avant de confirmer l’opération. Le total reste mis en avant pour faciliter la lecture." />

      <section className={cardStyles('overflow-hidden')}>
        <div className="border-b border-border bg-background px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Bénéficiaire</p>
              <p className="mt-1 text-lg font-semibold text-text">IUT de Douala</p>
            </div>
            <StatusBadge status={summaryData?.statut || 'pending'} tone={summaryData?.statut === 'acquittee' ? 'success' : 'warning'} />
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <SummaryField label="Payeur" value="Jack Essomba" />
          <SummaryField label="Matricule / dossier" value={maskReference(summaryData?.matricule || paymentData.numero_compte_paiement || '000000')} />
          <SummaryField label="Type de frais" value={summaryData ? summaryData.objet_paiement : paymentData.objet_paiement} />
          <SummaryField label="Moyen de paiement" value={summaryData ? summaryData.moyen_paiement : paymentData.moyen_paiement} />
          <SummaryField label="Date" value={formatDate(new Date(), { dateStyle: 'long' })} />
          <SummaryField label="Lieu" value="Douala" />
        </div>

        <div className="border-t border-border bg-primary p-5 text-white sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Montant total</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{formatMoney(amount)}</p>
              <p className="mt-1 text-sm text-white/75">Le total à payer reste visible avant validation finale.</p>
            </div>
          </div>
        </div>
      </section>

      <button onClick={() => setShowSecurityModal(true)} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
        Payer {formatMoney(amount)}
        <ShieldCheck className="h-4 w-4" />
      </button>

      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4 backdrop-blur-sm">
          <div className={cardStyles('w-full max-w-md p-6 sm:p-8')}>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-text">Sécurité</h3>
              <p className="mt-2 text-sm text-text-secondary">Saisissez le code de sécurité pour confirmer la transaction.</p>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pinLength }).map((_, index) => (
                <div
                  key={index}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg font-semibold ${
                    pinCode.length > index ? 'border-primary bg-primary text-white' : 'border-border bg-background text-text-muted'
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num.toString())}
                  className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl border border-border bg-white text-xl font-semibold text-text transition hover:bg-primary-light"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl border border-border bg-white text-xl font-semibold text-text transition hover:bg-primary-light"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('delete')}
                className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl border border-border bg-white text-text transition hover:bg-primary-light"
              >
                <Delete className="h-6 w-6" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="mt-6 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-gray-100"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryField({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-text">{value}</p>
    </div>
  )
}
