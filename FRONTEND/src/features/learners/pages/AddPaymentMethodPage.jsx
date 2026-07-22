import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, CreditCard, Smartphone } from 'lucide-react'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { walletService } from '../../../services/walletService'
import { buttonStyles, cardStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'

export function AddPaymentMethodPage() {
  const navigate = useNavigate()
  const [methodType, setMethodType] = useState('mobile')
  const [operator, setOperator] = useState('Orange')
  const [phone, setPhone] = useState('')
  const [fundsOrigin, setFundsOrigin] = useState('')
  const [holderName, setHolderName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      await walletService.addPaymentMethod({
        type_methode: methodType,
        fournisseur: operator,
        numero_masque: phone,
        nom_titulaire: holderName,
        origine_fonds: fundsOrigin || null,
      })
      navigate('/apprenant/portefeuille')
    } catch (err) {
      setError("Erreur lors de l'enregistrement du moyen de paiement.")
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader title="Enregistrement d’un moyen de paiement" description="Ajoutez un compte mobile ou une carte bancaire dans un formulaire simple et sécurisé." />

      <section className={cardStyles('p-5 sm:p-6')}>
        <div className="flex rounded-2xl border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMethodType('mobile')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${methodType === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-white'}`}
          >
            Compte mobile
          </button>
          <button
            type="button"
            onClick={() => setMethodType('card')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${methodType === 'card' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-white'}`}
          >
            Carte bancaire
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          {methodType === 'mobile' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Opérateur">
                  <select value={operator} onChange={(e) => setOperator(e.target.value)} className="app-select">
                    <option value="Orange">Orange</option>
                    <option value="MTN">MTN</option>
                    <option value="Camtel">Camtel</option>
                  </select>
                </Field>
                <Field label="Numéro">
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XX XX XX XX" className="app-input" />
                </Field>
              </div>

              <Field label="Origine des fonds">
                <select value={fundsOrigin} onChange={(e) => setFundsOrigin(e.target.value)} className="app-select">
                  <option value="">Sélectionnez</option>
                  <option value="Personnel">Personnel</option>
                  <option value="Parent">Parent</option>
                  <option value="Autre">Autre</option>
                </select>
              </Field>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Numéro de carte" className="sm:col-span-2">
                  <input type="text" placeholder="0000 0000 0000 0000" className="app-input" />
                </Field>
                <Field label="Expiration">
                  <div className="relative">
                    <input type="text" placeholder="MM/AA" className="app-input pr-10" />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  </div>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="CVV">
                  <input type="text" placeholder="..." className="app-input" />
                </Field>
                <Field label="Origine des fonds" className="sm:col-span-2">
                  <select value={fundsOrigin} onChange={(e) => setFundsOrigin(e.target.value)} className="app-select">
                    <option value="">Sélectionnez</option>
                    <option value="Personnel">Personnel</option>
                    <option value="Parent">Parent</option>
                    <option value="Autre">Autre</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          <Field label="Nom du titulaire">
            <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Nom complet" className="app-input" />
          </Field>

          {error ? <p className="app-error">{error}</p> : null}

          <button type="submit" disabled={isSaving} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </section>
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="app-label">{label}</label>
      {children}
    </div>
  )
}
