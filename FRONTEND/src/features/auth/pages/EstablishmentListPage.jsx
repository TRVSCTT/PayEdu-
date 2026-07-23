import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Loader2, Search } from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminService } from '../../../services/adminService';
import { cardStyles, PageHeader } from '../../../components/ui/designSystem';

export function EstablishmentListPage() {
  const { data: etablissements, isLoading } = useQuery({
    queryKey: ['admin-etablissements'],
    queryFn: adminService.getEtablissements
  });

  return (
    <DashboardLayout
      title="Écoles Partenaires"
      description="Gérez les établissements scolaires enregistrés sur PayEdu."
    >
      <div className={cardStyles('p-6')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <PageHeader title="Liste des Établissements" />
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher une école..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !etablissements || etablissements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun établissement partenaire trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Nom de l'école</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Contact Direction</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Email</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Téléphone</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Adresse</th>
                </tr>
              </thead>
              <tbody>
                {etablissements.map((ecole) => (
                  <tr key={ecole.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{ecole.nom_etablissement || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{ecole.nom} {ecole.prenom}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{ecole.email || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{ecole.telephone || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{ecole.adresse || '-'}</td>
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
