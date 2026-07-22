import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Clock3, CreditCard, ShieldCheck, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { PageHeader, StatCard, cardStyles, buttonStyles } from '../../../components/ui/designSystem'

export function AdminDashboard() {
  return (
    <DashboardLayout
      title="Tableau de bord administrateur"
      description="Gardez une vue d’ensemble sur les établissements, les paiements et les paramètres globaux de la plateforme."
      actions={
        <Link to="/admin/etablissements/nouveau" className={buttonStyles({ variant: 'primary' })}>
          <Building2 className="h-4 w-4" />
          Créer un établissement
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CreditCard} label="Total encaissé" value="Centralisé" helper="Les montants apparaîtront dès la synchronisation des données" tone="primary" />
        <StatCard icon={CheckCircle2} label="Transactions" value="Suivies" helper="Vue unifiée des paiements confirmés" tone="success" />
        <StatCard icon={Clock3} label="En attente" value="Lisible" helper="Statuts visibles pour les équipes de contrôle" tone="warning" />
        <StatCard icon={ShieldCheck} label="Conformité" value="Rassurante" helper="Navigation et accès sécurisés" tone="info" />
      </section>

      <section className={cardStyles('p-6')}>
        <PageHeader
          title="Accès rapides"
          description="Les actions disponibles restent concentrées pour éviter toute confusion dans les flux d’administration."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admin/etablissements/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Créer un établissement
          </Link>
          <button className={buttonStyles({ variant: 'secondary' })}>Consulter les transactions</button>
          <button className={buttonStyles({ variant: 'secondary' })}>Ouvrir les rapports</button>
        </div>
      </section>
    </DashboardLayout>
  )
}
