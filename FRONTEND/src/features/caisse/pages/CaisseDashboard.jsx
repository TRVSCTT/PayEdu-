import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { PageHeader, StatCard, cardStyles, buttonStyles } from '../../../components/ui/designSystem';
import { Wallet, CheckCircle, Clock, History } from 'lucide-react';
import { useAuth } from '../../../store/authStore';

export function CaisseDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title={`Espace Caisse / Banque`}
      description="Gérez les encaissements, validez les paiements en attente et consultez l'historique des transactions du guichet."
      actions={
        <button className={buttonStyles({ variant: 'primary' })}>
          Nouvel Encaissement
        </button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          icon={Clock} 
          label="Paiements" 
          value="En Attente" 
          helper="Validations nécessaires au guichet" 
          tone="info" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Validés" 
          value="Aujourd'hui" 
          helper="Total des reçus confirmés" 
          tone="success" 
        />
        <StatCard 
          icon={Wallet} 
          label="Fonds" 
          value="Collectés" 
          helper="Montant cumulé de la journée" 
          tone="primary" 
        />
        <StatCard 
          icon={History} 
          label="Historique" 
          value="Global" 
          helper="Toutes les transactions" 
          tone="secondary" 
        />
      </section>

      <section className={cardStyles('p-6')}>
        <PageHeader
          title="Opérations Récentes"
          description="Liste des derniers étudiants s'étant présentés au guichet pour règlement."
        />
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-sm font-medium">Aucun paiement en attente pour le moment</p>
          <p className="text-xs text-gray-400 mt-1">Les étudiants ayant choisi le paiement en présentiel apparaîtront ici.</p>
        </div>
      </section>
    </DashboardLayout>
  );
}
