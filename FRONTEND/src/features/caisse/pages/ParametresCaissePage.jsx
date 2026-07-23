import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, cardStyles } from '../../../components/ui/designSystem';

export function ParametresCaissePage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
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
