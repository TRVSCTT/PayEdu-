/**
 * RegisterEstablishmentPage.jsx
 * Rôle : Page permettant à l'administrateur de créer un établissement et son gestionnaire.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { establishmentSchema } from '../schemas/establishmentSchema';
import { useRegisterEstablishment } from '../hooks/useRegisterEstablishment';
import { handleApiError } from '../../../utils/handleApiError';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

export function RegisterEstablishmentPage() {
  const navigate = useNavigate();
  const { mutateAsync: performRegister, isPending } = useRegisterEstablishment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(establishmentSchema)
  });

  const onSubmit = async (data) => {
    try {
      await performRegister(data);
      toast.success("Établissement et compte gestionnaire créés avec succès !");
      reset(); // On réinitialise pour en créer un autre potentiellement
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  return (
    <DashboardLayout title="Créer un nouvel Établissement">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border-b border-gray-border pb-4 mb-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informations de l'établissement</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                <input
                  type="text"
                  {...register('nom_etablissement')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nom_etablissement ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.nom_etablissement && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.nom_etablissement.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Code (ex: IUT-DLA)</label>
                <input
                  type="text"
                  {...register('code_etablissement')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.code_etablissement ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.code_etablissement && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.code_etablissement.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ville (optionnel)</label>
              <input
                type="text"
                {...register('ville')}
                className="mt-1 block w-full px-3 py-2 border border-gray-border rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>

          <div className="pb-4 mb-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Compte Gestionnaire</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom du gestionnaire</label>
                <input
                  type="text"
                  {...register('nom')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nom ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.nom && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.nom.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom du gestionnaire</label>
                <input
                  type="text"
                  {...register('prenom')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.prenom ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.prenom && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail (Identifiant)</label>
                <input
                  type="email"
                  {...register('email')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.email && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe provisoire</label>
                <input
                  type="password"
                  {...register('mot_de_passe')}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.mot_de_passe ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.mot_de_passe && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.mot_de_passe.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/admin"
              className="px-4 py-2 border border-gray-border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? (
                <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Création...</>
              ) : (
                "Créer l'établissement"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
