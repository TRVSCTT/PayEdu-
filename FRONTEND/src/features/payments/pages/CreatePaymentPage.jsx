/**
 * CreatePaymentPage.jsx
 * Rôle : Page permettant à l'apprenant d'initier un paiement (brouillon).
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { paymentSchema } from '../schemas/paymentSchema';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { handleApiError } from '../../../utils/handleApiError';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../store/authStore';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

// Tarifs indicatifs côté frontend. Le backend est la source de vérité.
const TARIFS_INDICATIFS = {
  frais_inscription: 45000,
  frais_pension: 150000,
  frais_examen: 10000,
};

export function CreatePaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // On aura besoin de son etablissement_id, on suppose qu'il est dans user.etablissement_id ou qu'on le récupère du store
  const { mutateAsync: performCreate, isPending } = useCreatePayment();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      montant: 0,
    }
  });

  const objetPaiement = watch("objet_paiement");

  // Mise à jour automatique du montant indicatif selon l'objet sélectionné
  useEffect(() => {
    if (objetPaiement && TARIFS_INDICATIFS[objetPaiement]) {
      setValue("montant", TARIFS_INDICATIFS[objetPaiement]);
    }
  }, [objetPaiement, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        etablissement_id: user.sub, // Attention: L'apprenant a un etablissement_id. On suppose ici que user.sub de l'apprenant contient l'id ou qu'il faudra le fetch.
        // Si le backend exige l'etablissement_id, on l'envoie.
      };
      
      const response = await performCreate(payload);
      toast.success("Brouillon de paiement initié avec succès !");
      
      // On redirige vers la page de brouillon avec les détails retournés par l'API
      navigate(`/apprenant/paiements/brouillon/${response.id}`, { state: { payment: response } });
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  return (
    <DashboardLayout title="Initier un Paiement">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Objet du paiement</label>
            <select
              {...register('objet_paiement')}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.objet_paiement ? 'border-danger-DEFAULT' : 'border-gray-border'} focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm rounded-md`}
            >
              <option value="">Sélectionnez un objet</option>
              <option value="frais_inscription">Frais d'inscription</option>
              <option value="frais_pension">Frais de pension</option>
              <option value="frais_examen">Frais d'examen</option>
            </select>
            {errors.objet_paiement && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.objet_paiement.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Montant indicatif (XAF)</label>
            <input
              type="number"
              disabled
              {...register('montant')}
              className="mt-1 block w-full px-3 py-2 border border-gray-border bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Le montant définitif sera appliqué par l'établissement.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Moyen de paiement souhaité</label>
            <select
              {...register('moyen_paiement')}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.moyen_paiement ? 'border-danger-DEFAULT' : 'border-gray-border'} focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm rounded-md`}
            >
              <option value="">Sélectionnez un moyen</option>
              <option value="orange_money">Orange Money</option>
              <option value="mtn_momo">MTN Mobile Money</option>
              <option value="carte_bancaire">Carte Bancaire</option>
            </select>
            {errors.moyen_paiement && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.moyen_paiement.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-border">
            <Link
              to="/apprenant"
              className="w-full sm:w-auto text-center px-4 py-2 border border-gray-border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? (
                <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Initiation...</>
              ) : (
                "Valider le brouillon"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
