import { useEffect, useState } from 'react'
import { FileText, FolderOpen, MoreVertical, Plus } from 'lucide-react'
import { paymentService } from '../../../services/paymentService'
import { fraisService } from '../../../services/fraisService'
import { cardStyles, EmptyState, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('Tout')
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const tabs = ['Tout', 'Facture', 'Reçus', 'Importé', 'Quitus']

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [histData, fraisData] = await Promise.all([paymentService.obtenirHistorique(), fraisService.listerFrais()])
        const paiementsAcquittes = (histData || []).filter((p) => p.statut === 'acquittee')

        const recus = paiementsAcquittes.map((p) => ({
          id: `recu-${p.id}`,
          title: 'Paiement effectué',
          description: `Paiement de ${formatMoney(p.montant)} (${p.objet_paiement})`,
          dateStr: formatDate(p.created_at, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'Reçus',
        }))

        const unpaidFrais = (fraisData || []).filter((f) => !paiementsAcquittes.some((p) => p.objet_paiement.includes(f.titre)))
        const factures = unpaidFrais.map((f) => ({
          id: `facture-${f.id}`,
          title: `Facture : ${f.titre}`,
          description: `Montant : ${formatMoney(f.montant)}`,
          dateStr: `Échéance : ${formatDate(f.date_echeance, { dateStyle: 'medium' })}`,
          type: 'Facture',
        }))

        const pending = (histData || [])
          .filter((p) => p.statut !== 'acquittee')
          .map((p) => ({
            id: `pending-${p.id}`,
            title: 'Paiement en cours',
            description: `Tentative de ${formatMoney(p.montant)} (${p.objet_paiement})`,
            dateStr: formatDate(p.created_at, { dateStyle: 'medium' }),
            type: 'Facture',
          }))

        setDocuments([...recus, ...factures, ...pending])
      } catch (error) {
        console.error('Erreur de récupération des documents', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const filteredDocs = activeTab === 'Tout' ? documents : documents.filter((doc) => doc.type === activeTab)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Documents"
        title="Reçus, factures et pièces associées"
        description="Tout ce qui touche à vos paiements reste regroupé dans un espace simple à parcourir."
      />

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              activeTab === tab ? 'border-primary bg-primary text-white shadow-sm' : 'border-border bg-white text-text-secondary hover:bg-primary-light'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="text-sm font-semibold text-primary transition hover:text-primary-dark">Sélectionner</button>
      </div>

      <section className="space-y-3">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary')}>Chargement de vos documents…</div>
        ) : filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <article key={doc.id} className={cardStyles('flex items-center gap-4 p-4')}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-text">{doc.title}</h3>
                <p className="mt-1 truncate text-sm text-text-secondary">{doc.description}</p>
                <p className="mt-2 text-xs text-text-muted">{doc.dateStr}</p>
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition hover:bg-primary-light hover:text-text">
                <MoreVertical className="h-5 w-5" />
              </button>
            </article>
          ))
        ) : (
          <EmptyState icon={FolderOpen} title="Aucun document trouvé" description="Aucun document ne correspond à cette catégorie pour le moment." />
        )}
      </section>

      <button className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white shadow-medium transition hover:bg-primary-light">
        <Plus className="h-6 w-6 text-primary" />
      </button>
    </div>
  )
}
