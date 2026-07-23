import React from 'react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function RapportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stats et rapport"
        description="Analysez les statistiques d'encaissement et générez des rapports."
      />
      <div className={cardStyles('p-6 text-center text-text-muted')}>
        Cette page est en cours de construction. Vous pourrez bientôt y consulter vos statistiques avancées.
      </div>
    </div>
  );
}
