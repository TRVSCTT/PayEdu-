import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Clock3, CreditCard, Users, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { PageHeader, StatCard, cardStyles, buttonStyles } from '../../../components/ui/designSystem'
import { adminService } from '../../../services/adminService'
import { formatCurrency } from '../../../utils/formatters'

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats
  });

  return (
    <DashboardLayout
      title="Tableau de bord administrateur"
      description="Gardez une vue d’ensemble sur les établissements, les paiements et les paramètres globaux de la plateforme."
      actions={
        <Link to="/admin/etablissements/nouveau" className={buttonStyles({ variant: 'primary' })}>
          <Building2 className="h-4 w-4 mr-2" />
          Créer un établissement
        </Link>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard 
            icon={CreditCard} 
            label="Volume Financier" 
            value={formatCurrency(stats?.total_volume_financier || 0)} 
            helper="Montant total traité sur PayEdu" 
            tone="primary" 
          />
          <StatCard 
            icon={Building2} 
            label="Écoles Partenaires" 
            value={stats?.total_etablissements || 0} 
            helper="Établissements enregistrés" 
            tone="success" 
          />
          <StatCard 
            icon={Users} 
            label="Apprenants" 
            value={stats?.total_apprenants || 0} 
            helper="Total d'étudiants inscrits" 
            tone="info" 
          />
          <StatCard 
            icon={Clock3} 
            label="Transactions" 
            value={stats?.total_transactions || 0} 
            helper={`${stats?.transactions_en_attente || 0} en attente ou brouillon`} 
            tone="warning" 
          />
        </section>
      )}

      <section className={cardStyles('p-6 mt-6')}>
        <PageHeader
          title="Accès rapides"
          description="Les actions disponibles restent concentrées pour éviter toute confusion dans les flux d’administration."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admin/etablissements/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Créer un établissement
          </Link>
          <Link to="/admin/etablissements" className={buttonStyles({ variant: 'secondary' })}>
            Voir les établissements
          </Link>
          <Link to="/admin/paiements" className={buttonStyles({ variant: 'secondary' })}>
            Consulter toutes les transactions
          </Link>
        </div>
      </section>
    </DashboardLayout>
  )
}
