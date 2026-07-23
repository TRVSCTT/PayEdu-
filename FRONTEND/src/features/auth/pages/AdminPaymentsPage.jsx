import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { WalletCards, Loader2, Search } from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminService } from '../../../services/adminService';
import { cardStyles, PageHeader } from '../../../components/ui/designSystem';
import { formatMoney, formatDate } from '../../../utils/formatters';

export function AdminPaymentsPage() {
  const { data: paiements, isLoading } = useQuery({
    queryKey: ['admin-paiements'],
    queryFn: adminService.getPaiements
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'TERMINE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Validé</span>;
      case 'EN_FILE_CAISSE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">En Caisse</span>;
      case 'EN_ATTENTE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">En Attente</span>;
      case 'ECHOUE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Échoué</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{statut}</span>;
    }
  };

  return (
    <DashboardLayout
      title="Toutes les transactions"
      description="Supervisez l'ensemble des flux financiers traités par PayEdu."
    >
      <div className={cardStyles('p-6')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <PageHeader title="Flux Financiers Globaux" />
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher une transaction..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !paiements || paiements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <WalletCards className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucune transaction enregistrée sur la plateforme.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Date</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Référence</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">École & Objet</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Montant</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((paiement) => (
                  <tr key={paiement.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(paiement.created_at)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{paiement.reference}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {paiement.objet_libelle || 'Paiement'}
                      <div className="text-xs text-gray-400 font-medium">Pour: {paiement.etudiant_nom_complet || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-900">{formatMoney(paiement.montant)}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(paiement.statut)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
