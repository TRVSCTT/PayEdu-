import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, WalletCards, FileText, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { PageHeader, StatCard, cardStyles, buttonStyles } from '../../../components/ui/designSystem'
import { etablissementService } from '../../../services/etablissementService'
import { formatMoney } from '../../../utils/formatters'

export function EstablishmentDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['etablissement-stats'],
    queryFn: etablissementService.getStats
  });

  return (
    <DashboardLayout
      title="Espace établissement"
      description="Pilotez les apprenants, les campagnes de frais et le suivi des paiements dans une interface claire."
      actions={
        <div className="flex gap-2">
          <Link to="/etablissement/apprenants/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Ajouter un apprenant
          </Link>
          <Link to="/etablissement/caisses/nouveau" className={buttonStyles({ variant: 'secondary' })}>
            Ajouter un guichet
          </Link>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard 
            icon={Users} 
            label="Apprenants" 
            value={stats?.total_apprenants || 0} 
            helper="Étudiants inscrits dans l'établissement" 
            tone="secondary" 
          />
          <StatCard 
            icon={WalletCards} 
            label="Fonds Encaissés" 
            value={formatMoney(stats?.total_paiements_encaisses || 0)} 
            helper={`${stats?.nombre_paiements_du_jour || 0} paiements aujourd'hui`} 
            tone="primary" 
          />
          <StatCard 
            icon={FileText} 
            label="Fonds en Attente" 
            value={formatMoney(stats?.total_paiements_en_attente || 0)} 
            helper="Brouillons et paiements en cours" 
            tone="info" 
          />
          <StatCard 
            icon={LayoutDashboard} 
            label="Configuration" 
            value="Active" 
            helper="L'espace établissement est opérationnel" 
            tone="success" 
          />
        </section>
      )}

      <section className={cardStyles('p-6 mt-6')}>
        <PageHeader
          title="Raccourcis utiles"
          description="Accédez rapidement aux outils essentiels de gestion."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/etablissement/apprenants" className={buttonStyles({ variant: 'primary' })}>
            Voir les apprenants
          </Link>
          <Link to="/etablissement/frais" className={buttonStyles({ variant: 'secondary' })}>
            Gérer les Frais (Scolarité)
          </Link>
          <Link to="/etablissement/paiements" className={buttonStyles({ variant: 'secondary' })}>
            Historique des paiements
          </Link>
        </div>
      </section>
    </DashboardLayout>
  )
}
