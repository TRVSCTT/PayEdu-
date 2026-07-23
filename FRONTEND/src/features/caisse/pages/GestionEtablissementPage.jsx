import React from 'react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function GestionEtablissementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion établissement"
        description="Gérez les informations et les paramètres liés à votre établissement d'affectation."
      />
      <div className={cardStyles('p-6 text-center text-text-muted')}>
        Cette page est en cours de construction. Vous pourrez bientôt y gérer votre établissement.
      </div>
    </div>
  );
}
