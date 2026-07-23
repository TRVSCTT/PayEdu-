import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Loader2, Search } from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { etablissementService } from '../../../services/etablissementService';
import { cardStyles, PageHeader } from '../../../components/ui/designSystem';

export function StudentListPage() {
  const { data: apprenants, isLoading } = useQuery({
    queryKey: ['etablissement-apprenants'],
    queryFn: etablissementService.getApprenants
  });

  return (
    <DashboardLayout
      title="Liste des Apprenants"
      description="Consultez et gérez les étudiants inscrits dans votre établissement."
    >
      <div className={cardStyles('p-6')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <PageHeader title="Apprenants Inscrits" />
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher (matricule, nom...)" 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !apprenants || apprenants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun apprenant trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Matricule</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Nom & Prénom</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Filière / Niveau</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Email</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {apprenants.map((apprenant) => (
                  <tr key={apprenant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{apprenant.matricule}</td>
                    <td className="py-3 px-4 text-sm">{apprenant.nom} {apprenant.prenom}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {apprenant.filiere || '-'} / {apprenant.niveau || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{apprenant.email || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{apprenant.telephone || '-'}</td>
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
