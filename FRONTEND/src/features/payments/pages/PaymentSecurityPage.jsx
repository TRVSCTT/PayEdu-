import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fingerprint, ScanFace, ShieldCheck } from 'lucide-react'
import { Stepper, PageHeader, cardStyles, buttonStyles } from '../../../components/ui/designSystem'

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function PaymentSecurityPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} currentStep={4} />

      <PageHeader
        eyebrow="Sécurité"
        title="Vérification avant accès au paiement"
        description="Cette étape confirme votre identité avant d’ouvrir le parcours de règlement des frais."
      />

      <section className={cardStyles('p-6 sm:p-8')}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="app-label">Mot de passe</label>
            <input type="password" className="app-input" />
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-primary transition hover:text-primary-dark">
                Mot de passe oublié
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="app-label mb-0">Code de sécurité</label>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Temps restant</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="app-input h-12 px-0 text-center text-lg font-semibold"
                />
              ))}
            </div>
            <p className="app-help text-center">Le code est envoyé pour confirmer l’opération en cours.</p>
          </div>

          <div className="pt-2">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Autre moyen d’accès</p>
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white text-text transition hover:bg-primary-light">
                <ScanFace className="h-6 w-6" />
              </button>
              <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white text-text transition hover:bg-primary-light">
                <Fingerprint className="h-6 w-6" />
              </button>
            </div>
          </div>

          <button type="button" onClick={() => navigate('/apprenant/paiements/nouveau')} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            Accéder
          </button>
        </form>
      </section>
    </div>
  )
}
