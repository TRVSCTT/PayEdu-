import React from 'react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function ParametresCaissePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Configurez les préférences de votre compte Caisse et vos notifications."
      />
      <div className={cardStyles('p-6 text-center text-text-muted')}>
        Cette page est en cours de construction. Vous pourrez bientôt y gérer vos paramètres.
      </div>
    </div>
  );
}
