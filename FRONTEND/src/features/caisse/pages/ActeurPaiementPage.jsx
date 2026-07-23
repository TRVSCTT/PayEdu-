import React from 'react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function ActeurPaiementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Acteur paiement"
        description="Gérez les différents acteurs impliqués dans les processus de paiement."
      />
      <div className={cardStyles('p-6 text-center text-text-muted')}>
        Cette page est en cours de construction. Vous pourrez bientôt y gérer les acteurs de paiement.
      </div>
    </div>
  );
}
