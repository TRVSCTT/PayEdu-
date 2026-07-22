import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { caisseSchema } from '../schemas/caisseSchema';
import { useRegisterCaisse } from '../../auth/hooks/useRegisterCaisse';
import { handleApiError } from '../../../utils/handleApiError';
import { useAuth } from '../../../store/authStore';

export function RegisterCaissePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: performRegister, isPending } = useRegisterCaisse();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(caisseSchema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        etablissement_id: user?.sub, // L'ID de l'établissement connecté
      };

      await performRegister(payload);
      toast.success('Compte caisse créé avec succès !');
      navigate('/etablissement');
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  const InputLabel = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0F172A] mb-1.5">
      {children}
    </label>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/etablissement')}
            className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-gray-50 transition-colors mr-4 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A]">Nouveau Guichetier</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
          <p className="text-sm text-gray-500 mb-6">
            Créez un compte pour un employé de banque ou un guichetier. Ce compte lui permettra d'encaisser et valider les paiements.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <InputLabel htmlFor="nom">Nom de famille</InputLabel>
              <input
                id="nom"
                type="text"
                placeholder="Ex: Ndi"
                {...register('nom')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.nom ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]`}
              />
              {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom.message}</p>}
            </div>

            <div>
              <InputLabel htmlFor="prenom">Prénom</InputLabel>
              <input
                id="prenom"
                type="text"
                placeholder="Ex: Paul"
                {...register('prenom')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.prenom ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]`}
              />
              {errors.prenom && <p className="mt-1 text-xs text-red-500">{errors.prenom.message}</p>}
            </div>

            <div>
              <InputLabel htmlFor="email">Email d'accès (Identifiant)</InputLabel>
              <input
                id="email"
                type="email"
                placeholder="guichet1@afriland.cm"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <InputLabel htmlFor="mot_de_passe">Mot de passe temporaire</InputLabel>
              <div className="relative">
                <input
                  id="mot_de_passe"
                  type={showPassword ? "text" : "password"}
                  {...register('mot_de_passe')}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.mot_de_passe ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.mot_de_passe && <p className="mt-1 text-xs text-red-500">{errors.mot_de_passe.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-4 rounded-xl text-white font-medium bg-[#1D4ED8] hover:bg-[#1E3A8A] transition-colors shadow flex justify-center items-center disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Créer le compte Caisse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
