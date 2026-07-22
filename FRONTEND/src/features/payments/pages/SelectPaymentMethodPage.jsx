import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CreditCard, Phone, ShieldCheck } from 'lucide-react'
import { Stepper, PageHeader, cardStyles, buttonStyles, StatusBadge } from '../../../components/ui/designSystem'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function SelectPaymentMethodPage() {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState('mobile')

  const handleContinue = () => {
    navigate('/apprenant/paiements/options')
  }

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} currentStep={3} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Étape 4</p>
          <h2 className="text-xl font-semibold text-text">Choisissez un moyen de paiement</h2>
        </div>
      </div>

      <PageHeader
        description="Le mode sélectionné doit rester lisible, simple à confirmer et adapté aux opérations mobiles."
      />

      <section className="grid gap-4">
        <button
          type="button"
          onClick={() => setSelectedMethod('mobile')}
          className={cardStyles(`flex items-center gap-4 p-5 text-left transition ${selectedMethod === 'mobile' ? 'border-primary bg-primary-light shadow-sm' : 'hover:border-primary/15 hover:bg-primary-light/40'}`)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <Phone className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-text">Compte mobile</h3>
            <p className="mt-1 text-sm text-text-secondary">Orange Money, MTN MoMo ou autre compte mobile autorisé.</p>
          </div>
          <StatusBadge status={selectedMethod === 'mobile' ? 'confirmed' : 'pending'} label={selectedMethod === 'mobile' ? 'Sélectionné' : 'Disponible'} tone={selectedMethod === 'mobile' ? 'success' : 'neutral'} />
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('visa')}
          className={cardStyles(`flex items-center gap-4 p-5 text-left transition ${selectedMethod === 'visa' ? 'border-primary bg-primary-light shadow-sm' : 'hover:border-primary/15 hover:bg-primary-light/40'}`)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-text">Carte bancaire</h3>
            <p className="mt-1 text-sm text-text-secondary">Paiement par carte avec vérification et sécurisation du flux.</p>
          </div>
          <StatusBadge status={selectedMethod === 'visa' ? 'confirmed' : 'pending'} label={selectedMethod === 'visa' ? 'Sélectionné' : 'Disponible'} tone={selectedMethod === 'visa' ? 'success' : 'neutral'} />
        </button>
      </section>

      <section className={cardStyles('p-5')}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-text">Paiement guidé</h3>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Le moyen sélectionné sera utilisé pour les étapes de vérification et de confirmation suivantes.
            </p>
          </div>
        </div>
      </section>

      <div className="pt-2">
        <button onClick={handleContinue} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
          Continuer
        </button>
      </div>
    </div>
  )
}
