/**
 * PaymentDraftPage.jsx
 * Rôle : Affiche le récapitulatif du brouillon créé par l'API.
 */
import { useLocation, Link, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { FileText, Calendar, CreditCard, Tag, AlertCircle } from 'lucide-react';

export function PaymentDraftPage() {
  const location = useLocation();
  const payment = location.state?.payment;

  if (!payment) {
    // Si on accède directement à l'URL sans passer par la création, 
    // l'idéal serait de faire un fetch, mais comme l'API de getPayment n'est pas confirmée, on redirige
    return <Navigate to="/apprenant/paiements/nouveau" replace />;
  }

  return (
    <DashboardLayout title="Récapitulatif du Paiement (Brouillon)">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-2xl mx-auto">
        <div className="px-4 py-5 sm:px-6 bg-primary-light/30 flex items-start">
          <AlertCircle className="h-5 w-5 text-primary-DEFAULT mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Le paiement a été créé comme brouillon.
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Il n'a pas encore été confirmé. Vérifiez les informations ci-dessous.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-border px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-border">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Identifiant
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                {payment.id}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Objet
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                {payment.objet_paiement.replace('_', ' ')}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" /> Moyen souhaité
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                {payment.moyen_paiement.replace('_', ' ')}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Montant appliqué
              </dt>
              <dd className="mt-1 text-lg font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                {Number(payment.montant).toLocaleString('fr-FR')} FCFA
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> Statut
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                  {payment.statut}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 sm:mb-0 text-center sm:text-left">
            La confirmation du paiement sera disponible lors de l'intégration du prestataire de paiement.
          </p>
          <div className="flex space-x-3 w-full sm:w-auto">
            <Link
              to="/apprenant"
              className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-gray-border shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Retour
            </Link>
            <button
              disabled
              className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-DEFAULT opacity-50 cursor-not-allowed"
            >
              Payer maintenant
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
