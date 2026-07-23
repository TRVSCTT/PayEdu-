import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings2, Loader2, Plus } from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { etablissementService } from '../../../services/etablissementService';
import { cardStyles, PageHeader, buttonStyles } from '../../../components/ui/designSystem';
import { formatMoney, formatDate } from '../../../utils/formatters';

export function FeesManagementPage() {
  const { data: frais, isLoading } = useQuery({
    queryKey: ['etablissement-frais'],
    queryFn: etablissementService.getFrais
  });

  return (
    <DashboardLayout
      title="Gestion des Frais"
      description="Configurez les frais de scolarité, d'inscription et autres paiements exigibles."
      actions={
        <button className={buttonStyles({ variant: 'primary' })}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Frais
        </button>
      }
    >
      <div className={cardStyles('p-6')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <PageHeader title="Catalogue des Frais" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !frais || frais.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Settings2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun type de frais n'a été configuré.</p>
            <button className={`${buttonStyles({ variant: 'primary' })} mt-4`}>
              Créer le premier frais
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Intitulé</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Montant (XAF)</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Paiement Partiel</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Obligatoire</th>
                  <th className="py-3 px-4 font-semibold text-sm text-gray-500">Date limite</th>
                </tr>
              </thead>
              <tbody>
                {frais.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">
                      {item.titre}
                      <div className="text-xs text-gray-400 font-normal">Niveau: {item.niveau_cible || 'Tous'}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-900">{formatMoney(item.montant)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.autoriser_paiement_partiel ? 'Oui' : 'Non'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.est_obligatoire ? (
                        <span className="text-orange-600 font-medium">Oui</span>
                      ) : 'Non'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.date_limite ? formatDate(item.date_limite) : 'Aucune'}
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
