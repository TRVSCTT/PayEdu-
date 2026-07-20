/**
 * LoginPage.jsx
 * Rôle : Page publique de connexion.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../../../store/authStore';
import { handleApiError } from '../../../utils/handleApiError';
import { getRoleDashboardPath } from '../../../utils/getRoleDashboardPath';
import { Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { storeAuthenticationData } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: performLogin, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await performLogin(data);
      storeAuthenticationData(response.access_token, response.role);
      toast.success("Connexion réussie !");
      navigate(getRoleDashboardPath(response.role), { replace: true });
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    }
  };

  const InputLabel = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text-main mb-1.5">
      {children}
    </label>
  );

  return (
    <div className="min-h-screen bg-white text-text-main flex flex-col font-sans">
      {/* Header : Back Button & Logo */}
      <div className="pt-6 px-4 pb-4">
        <button 
          onClick={() => navigate('/')} // Ou la page précédente s'il y a un historique
          className="w-10 h-10 rounded-full border border-gray-border flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center mt-2 mb-2">
          <div className="flex flex-col items-center justify-center mb-6 text-center mt-4">
            <h1 className="text-[28px] font-extrabold text-[#1a3b8b] tracking-wider uppercase mb-1">ETUTRANSFERT</h1>
            <p className="text-sm text-gray-500">Simplifions le paiement des frais d'études</p>
          </div>
          <h2 className="text-2xl font-medium tracking-wide mb-2 text-center">Connexion</h2>
          <p className="text-text-main text-base text-center">Accédez à votre compte</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 mt-8 overflow-y-auto pb-24">
        <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-sm mx-auto">
          
          <div>
            <InputLabel htmlFor="identifiant">Identifiant (Email, matricule...)</InputLabel>
            <input
              id="identifiant"
              type="text"
              placeholder="exemple@icloud.com"
              {...register('identifiant')}
              className={`w-full px-3 py-3 rounded-lg border ${errors.identifiant ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
            />
            {errors.identifiant && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.identifiant.message}</p>}
          </div>

          <div>
            <InputLabel htmlFor="mot_de_passe">Mot de passe</InputLabel>
            <div className="relative">
              <input
                id="mot_de_passe"
                type={showPassword ? "text" : "password"}
                {...register('mot_de_passe')}
                className={`w-full px-3 py-3 rounded-lg border ${errors.mot_de_passe ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.mot_de_passe && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.mot_de_passe.message}</p>}
          </div>

          <div className="text-center pt-2 flex flex-col space-y-3">
            <a href="#" className="text-sm text-text-main hover:underline">
              Mot de passe oublié
            </a>
            <div>
              <span className="text-sm text-gray-500">Pas encore de compte ? </span>
              <Link to="/inscription" className="text-sm text-text-main font-medium hover:underline">
                S'inscrire
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* Footer / Bouton d'action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100">
        <div className="max-w-sm mx-auto">
          <button
            type="submit"
            form="login-form"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl text-white font-medium text-base bg-[#1a3b8b] hover:bg-[#152e6b] transition-colors disabled:opacity-70 shadow-lg flex justify-center items-center"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
