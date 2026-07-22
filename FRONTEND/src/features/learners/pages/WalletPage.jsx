import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, WalletCards } from 'lucide-react'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { walletService } from '../../../services/walletService'
import { PageHeader, cardStyles, buttonStyles, EmptyState } from '../../../components/ui/designSystem'

export function WalletPage() {
  const navigate = useNavigate()
  const [methods, setMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await walletService.getPaymentMethods()
        setMethods(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMethods()
  }, [])

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <PageHeader title="Portefeuille" description="Retrouvez vos moyens de paiement enregistrés dans une interface claire et mobile-friendly." />

      <section className="grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary sm:col-span-2')}>Chargement de votre portefeuille…</div>
        ) : methods.length > 0 ? (
          methods.map((method) => (
            <article key={method.id} className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary p-5 text-white shadow-elevated">
              <div className="absolute right-4 top-4 h-4 w-4 rounded-full bg-white/80" />
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Moyen enregistré</p>
                  <h3 className="mt-2 text-2xl font-semibold">{method.fournisseur}</h3>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wider text-white/90">{method.numero_masque}</p>
                  <p className="mt-1 text-xs text-white/70">{method.nom_titulaire}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="sm:col-span-2">
            <EmptyState icon={WalletCards} title="Aucun moyen de paiement enregistré" description="Ajoutez un moyen de paiement pour accélérer vos prochains règlements." />
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button onClick={() => navigate('/apprenant/portefeuille/nouveau')} className={buttonStyles({ variant: 'primary' })}>
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>
    </div>
  )
}
