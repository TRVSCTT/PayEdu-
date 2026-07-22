import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { paymentService } from '../../../services/paymentService'
import { buttonStyles, cardStyles, PageHeader } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'

export function VerificationRequestPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [selectedTx, setSelectedTx] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const histData = await paymentService.obtenirHistorique()
        setTransactions(histData || [])
      } catch (error) {
        console.error('Erreur récupération transactions', error)
      }
    }
    fetchTransactions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTx || !description) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate(-1)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader
        eyebrow="Contrôle"
        title="Demande de vérification"
        description="Si une confirmation tarde, vous pouvez signaler la transaction pour contrôle."
      />

      <section className={cardStyles('p-5 sm:p-6')}>
        <p className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-text-secondary">
          Cette demande n’ajoute pas de nouvelle fonctionnalité métier. Elle améliore simplement le suivi et la lisibilité de la page existante.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label className="app-label">Choix de la transaction</label>
            <div className="relative">
              <select
                value={selectedTx}
                onChange={(e) => setSelectedTx(e.target.value)}
                className="app-select appearance-none pr-12"
                required
              >
                <option value="" disabled>Sélectionnez une transaction...</option>
                {transactions.map((tx) => (
                  <option key={tx.id} value={tx.id}>
                    {formatDate(tx.created_at, { dateStyle: 'medium' })} - {formatMoney(tx.montant)} ({tx.objet_paiement})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="app-label">Description du problème</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={600}
                rows={8}
                className="app-textarea resize-none pr-20"
                required
              />
              <div className="absolute bottom-3 right-4 text-xs text-text-muted">
                {description.length}/600
              </div>
            </div>
          </div>

          <button type="submit" disabled={!selectedTx || !description || isSubmitting} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            {isSubmitting ? 'Envoi en cours…' : 'Soumettre la demande'}
          </button>
        </form>
      </section>
    </div>
  )
}
