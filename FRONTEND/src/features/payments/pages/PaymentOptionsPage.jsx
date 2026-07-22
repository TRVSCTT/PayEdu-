import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft, CreditCard, Globe2, Smartphone, WalletCards } from 'lucide-react'
import { usePaymentContext } from './../context/PaymentContext'
import { paymentService } from '../../../services/paymentService'
import { Stepper, PageHeader, cardStyles, buttonStyles, StatusBadge } from '../../../components/ui/designSystem'
import { formatMoney } from '../../../utils/formatters'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function PaymentOptionsPage() {
  const navigate = useNavigate()
  const { paymentData, updatePaymentData } = usePaymentContext()

  const [optionType, setOptionType] = useState('mobile')
  const [selectedSavedCard, setSelectedSavedCard] = useState(null)
  const [operator, setOperator] = useState('Orange')
  const [numero, setNumero] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [fundsOrigin, setFundsOrigin] = useState('')
  const [holderName, setHolderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    paymentService.obtenirProfil().then(setUserProfile).catch(console.error)
  }, [])

  const handleContinue = async () => {
    if (!userProfile?.etablissement_id) {
      toast.error("Impossible de récupérer l'établissement. Êtes-vous connecté ?")
      return
    }

    const finalOperator = selectedSavedCard ? selectedSavedCard : operator
    const finalNumero = selectedSavedCard
      ? selectedSavedCard === 'orange'
        ? '600000000'
        : '650000000'
      : optionType === 'mobile'
        ? numero
        : cardNumber

    if (optionType === 'mobile' && !selectedSavedCard && !finalNumero) {
      toast.error('Veuillez entrer un numéro de compte valide')
      return
    }

    if (optionType === 'carte' && !finalNumero) {
      toast.error('Veuillez entrer un numéro de carte valide')
      return
    }

    try {
      setIsLoading(true)
      const moyenPaiementBackend = optionType === 'carte' ? 'carte_bancaire' : finalOperator.toLowerCase() === 'orange' ? 'orange_money' : 'mtn_momo'
      const validObjetKeys = ['frais_inscription', 'frais_pension', 'frais_examen']
      const finalObjetPaiement = validObjetKeys.includes(paymentData.objet_paiement) ? paymentData.objet_paiement : 'frais_inscription'

      const paiement = await paymentService.initierPaiement({
        etablissement_id: userProfile.etablissement_id,
        objet_paiement: finalObjetPaiement,
        moyen_paiement: moyenPaiementBackend,
      })

      await paymentService.confirmerInformations(paiement.id, {
        infos_confirmees: {
          nom: userProfile?.nom || 'Apprenant PayEdu',
          matricule: userProfile?.matricule || '000000',
        },
      })

      const definePayload = {
        numero_compte_paiement: finalNumero,
      }

      if (moyenPaiementBackend === 'carte_bancaire') {
        definePayload.email_paiement = userProfile?.email || 'test@payedu.com'
        definePayload.adresse_paiement = 'Adresse par défaut'
        definePayload.ville_paiement = 'Douala'
        definePayload.code_postal_paiement = '00000'
      }

      await paymentService.definirMoyenPaiement(paiement.id, definePayload)

      updatePaymentData({
        paiement_id: paiement.id,
        moyen_paiement: moyenPaiementBackend,
        numero_compte_paiement: finalNumero,
      })

      navigate('/apprenant/paiements/recapitulatif', { state: { operator: finalOperator } })
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || "Erreur lors de l'initialisation du paiement")
    } finally {
      setIsLoading(false)
    }
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
          <h2 className="text-xl font-semibold text-text">Choisissez une option de paiement</h2>
        </div>
      </div>

      <PageHeader
        description="Choisissez le canal de paiement, puis renseignez les informations nécessaires pour la validation."
      />

      <section className={cardStyles('p-5 sm:p-6')}>
        <div className="flex rounded-2xl border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setOptionType('mobile')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${optionType === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-white'}`}
          >
            Compte mobile
          </button>
          <button
            type="button"
            onClick={() => setOptionType('carte')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${optionType === 'carte' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-white'}`}
          >
            Carte bancaire
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {optionType === 'mobile' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="app-label">Opérateur</label>
                <select value={operator} onChange={(e) => setOperator(e.target.value)} className="app-select">
                  <option value="Orange">Orange</option>
                  <option value="MTN">MTN</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="app-label">Numéro</label>
                <input
                  type="text"
                  placeholder="6XX XX XX XX"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="app-input"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="app-label">Numéro de carte</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="app-input"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="app-label">Date d'expiration</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="app-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="app-label">CVV</label>
                  <input type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} className="app-input" />
                </div>
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="app-label">Origine des fonds</label>
              <select value={fundsOrigin} onChange={(e) => setFundsOrigin(e.target.value)} className="app-select">
                <option value="">Sélectionnez</option>
                <option value="Personnel">Personnel</option>
                <option value="Parent">Parent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="app-label">Nom du titulaire</label>
              <input
                type="text"
                placeholder="Nom complet"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="app-input"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Moyens enregistrés</h3>
          <StatusBadge status="confirmed" label="Disponibles" tone="success" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSelectedSavedCard('orange')}
            className={cardStyles(`p-4 text-left transition ${selectedSavedCard === 'orange' ? 'border-primary bg-primary-light shadow-sm' : ''}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Mobile</p>
                <h4 className="mt-2 text-lg font-semibold text-text">Orange</h4>
                <p className="mt-1 text-sm text-text-secondary">Compte enregistré</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Smartphone className="h-5 w-5" />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSavedCard('mtn')}
            className={cardStyles(`p-4 text-left transition ${selectedSavedCard === 'mtn' ? 'border-primary bg-primary-light shadow-sm' : ''}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Mobile</p>
                <h4 className="mt-2 text-lg font-semibold text-text">MTN</h4>
                <p className="mt-1 text-sm text-text-secondary">Compte enregistré</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
                <Globe2 className="h-5 w-5" />
              </span>
            </div>
          </button>
        </div>
      </section>

      <section className={cardStyles('p-5 sm:p-6')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Récapitulatif</p>
            <p className="mt-1 text-sm text-text-secondary">Le montant sera confirmé à l’étape suivante.</p>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-text">{formatMoney(paymentData.montant_total)}</p>
        </div>

        <div className="mt-5">
          <button onClick={handleContinue} disabled={isLoading} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            {isLoading ? 'Enregistrement…' : 'Continuer'}
          </button>
        </div>
      </section>
    </div>
  )
}
