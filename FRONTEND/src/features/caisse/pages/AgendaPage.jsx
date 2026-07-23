import React from 'react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function AgendaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="RDV / Agenda"
        description="Consultez et gérez les rendez-vous planifiés avec les apprenants."
      />
      <div className={cardStyles('p-6 text-center text-text-muted')}>
        Cette page est en cours de construction. Vous pourrez bientôt y gérer votre agenda de rendez-vous.
      </div>
    </div>
  );
}
