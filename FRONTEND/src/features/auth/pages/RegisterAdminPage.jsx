/**
 * RegisterAdminPage.jsx
 * Rôle : Page publique d'inscription pour un nouvel administrateur.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { adminSchema } from '../schemas/adminSchema';
import { useRegisterAdmin } from '../hooks/useRegisterAdmin';
import { handleApiError } from '../../../utils/handleApiError';
import { Loader2 } from 'lucide-react';

export function RegisterAdminPage() {
  const navigate = useNavigate();
  const { mutateAsync: performRegister, isPending } = useRegisterAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(adminSchema)
  });

  const onSubmit = async (data) => {
    try {
      await performRegister(data);
      toast.success("Compte administrateur créé avec succès !");
      navigate('/connexion');
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Créer un compte Adminstateur</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              {...register('nom')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.nom ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
            />
            {errors.nom && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.nom.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              {...register('prenom')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.prenom ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
            />
            {errors.prenom && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.prenom.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            {...register('email')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
          />
          {errors.email && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            {...register('mot_de_passe')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.mot_de_passe ? 'border-danger-DEFAULT' : 'border-gray-border'} rounded-md shadow-sm sm:text-sm`}
          />
          {errors.mot_de_passe && <p className="mt-1 text-sm text-danger-DEFAULT">{errors.mot_de_passe.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark disabled:opacity-50"
        >
          {isPending ? (
            <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Inscription...</>
          ) : (
            "Créer le compte"
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Déjà un compte ? <Link to="/connexion" className="text-primary-DEFAULT hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}
