/**
 * RegisterLearnerPage.jsx
 * Rôle : Interface de création d'apprenant, reprenant la maquette Figma.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { learnerSchema } from '../schemas/learnerSchema';
import { useRegisterLearner } from '../hooks/useRegisterLearner';
import { handleApiError } from '../../../utils/handleApiError';
import { useAuth } from '../../../store/authStore';
import { StepProgressBar } from '../../../components/ui/StepProgressBar';
import { Loader2, ChevronLeft, Eye, EyeOff, Calendar } from 'lucide-react';

const STEPS = [
  { label: 'Identité' },
  { label: 'Informations Académiques' },
  { label: 'Tuteur légal' },
  { label: 'Sécurité' }
];

export function RegisterLearnerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: performRegister, isPending } = useRegisterLearner();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(learnerSchema),
    mode: 'onTouched'
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) {
      // Étape 1 : Nom, Prénom, Email (les autres champs visuels ne sont pas dans le backend)
      fieldsToValidate = ['nom', 'prenom', 'email'];
    } else if (currentStep === 1) {
      // Étape 2 : Matricule, Filière, Niveau, Contact
      fieldsToValidate = ['matricule', 'filiere', 'niveau', 'telephone'];
    } else if (currentStep === 2) {
      // Étape 3 : Tuteur légal (ignoré par le backend actuel)
      setCurrentStep(3);
      return;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      // On ne prend QUE les champs utiles au backend
      const payload = {
        matricule: data.matricule,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        filiere: data.filiere,
        niveau: data.niveau,
        mot_de_passe: data.mot_de_passe,
        etablissement_id: user?.sub,
      };
      
      Object.keys(payload).forEach(key => {
        if (!payload[key]) {
          delete payload[key];
        }
      });

      await performRegister(payload);
      toast.success("Apprenant créé avec succès !");
      navigate(user ? '/etablissement' : '/connexion'); 
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
          onClick={() => { if(currentStep > 0) prevStep(); else navigate('/connexion'); }}
          className="w-10 h-10 rounded-full border border-gray-border flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="flex flex-col items-center justify-center mb-4 text-center">
            <h1 className="text-[28px] font-extrabold text-[#1a3b8b] tracking-wider uppercase mb-1">ETUTRANSFERT</h1>
            <p className="text-sm text-gray-500">Simplifions le paiement des frais d'études</p>
          </div>
          <h2 className="text-2xl font-semibold tracking-wide">Inscription</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <StepProgressBar steps={STEPS} currentStep={currentStep} />

      {/* Form Content */}
      <div className="flex-1 px-6 overflow-y-auto pb-24">
        <form id="learner-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-sm mx-auto">
          
          {/* STEP 1 : Identité */}
          <div className={currentStep === 0 ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div>
                <InputLabel htmlFor="nom">Nom</InputLabel>
                <input
                  id="nom"
                  type="text"
                  {...register('nom')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.nom ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
                {errors.nom && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.nom.message}</p>}
              </div>

              <div>
                <InputLabel htmlFor="prenom">Prénom</InputLabel>
                <input
                  id="prenom"
                  type="text"
                  {...register('prenom')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.prenom ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
                {errors.prenom && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.prenom.message}</p>}
              </div>

              {/* Champs visuels selon la maquette (Non envoyés au backend pour respecter l'instruction) */}
              <div>
                <InputLabel htmlFor="pseudo">Pseudo</InputLabel>
                <input
                  id="pseudo"
                  type="text"
                  placeholder="(Non requis par le backend)"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors placeholder:text-gray-400 placeholder:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <InputLabel htmlFor="date_naissance">Date Naissance</InputLabel>
                  <div className="relative">
                    <input
                      id="date_naissance"
                      type="date"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="relative">
                  <InputLabel htmlFor="lieu_naissance">Lieu De Naissance</InputLabel>
                  <input
                    id="lieu_naissance"
                    type="text"
                    placeholder="Ex: Douala"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <InputLabel htmlFor="email">Email</InputLabel>
                <input
                  id="email"
                  type="email"
                  placeholder="exemple@icloud.com"
                  {...register('email')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.email ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
                {errors.email && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* STEP 2 : Informations Académiques */}
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div>
                <InputLabel htmlFor="matricule">Matricule</InputLabel>
                <input
                  id="matricule"
                  type="text"
                  {...register('matricule')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.matricule ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
                {errors.matricule && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.matricule.message}</p>}
              </div>

              <div>
                <InputLabel htmlFor="filiere">Filière</InputLabel>
                <input
                  id="filiere"
                  type="text"
                  {...register('filiere')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.filiere ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
              </div>

              <div>
                <InputLabel htmlFor="niveau">Niveau</InputLabel>
                <select
                  id="niveau"
                  {...register('niveau')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.niveau ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors bg-white appearance-none`}
                >
                  <option value="">Sélectionner</option>
                  <option value="L1">Licence 1</option>
                  <option value="L2">Licence 2</option>
                  <option value="L3">Licence 3</option>
                  <option value="M1">Master 1</option>
                  <option value="M2">Master 2</option>
                </select>
              </div>

              <div>
                <InputLabel htmlFor="telephone">Contact</InputLabel>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-text-main focus-within:border-text-main">
                  <div className="flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    +237
                  </div>
                  <input
                    id="telephone"
                    type="text"
                    {...register('telephone')}
                    placeholder="6XX XX XX XX"
                    className="w-full px-3 py-2.5 focus:outline-none text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 : Tuteur légal */}
          <div className={currentStep === 2 ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <p className="text-xs text-center text-text-main font-medium mb-4">
                Insérer les informations d'une personne de confiance en cas de problème.
                <br/><span className="text-gray-500">(NB: Ces informations sont facultatives dans le backend actuel)</span>
              </p>
              
              <div>
                <InputLabel htmlFor="tuteur_nom">Nom du tuteur</InputLabel>
                <input
                  id="tuteur_nom"
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors"
                />
              </div>

              <div>
                <InputLabel htmlFor="tuteur_prenom">Prénoms du tuteur</InputLabel>
                <input
                  id="tuteur_prenom"
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors"
                />
              </div>
            </div>
          </div>

          {/* STEP 4 : Sécurité */}
          <div className={currentStep === 3 ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <div>
                <InputLabel htmlFor="mot_de_passe">Mot de passe</InputLabel>
                <div className="relative">
                  <input
                    id="mot_de_passe"
                    type={showPassword ? "text" : "password"}
                    {...register('mot_de_passe')}
                    className={`w-full px-3 py-2.5 rounded-lg border ${errors.mot_de_passe ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                </div>
                <p className="mt-1.5 text-[10px] text-gray-500">
                  Min. 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.
                </p>
                {errors.mot_de_passe && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.mot_de_passe.message}</p>}
              </div>

              <div>
                <InputLabel htmlFor="confirm_mot_de_passe">Confirmer le mot de passe</InputLabel>
                <input
                  id="confirm_mot_de_passe"
                  type="password"
                  {...register('confirm_mot_de_passe')}
                  className={`w-full px-3 py-2.5 rounded-lg border ${errors.confirm_mot_de_passe ? 'border-danger-DEFAULT' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-text-main focus:border-text-main transition-colors`}
                />
                {errors.confirm_mot_de_passe && <p className="mt-1 text-xs text-danger-DEFAULT">{errors.confirm_mot_de_passe.message}</p>}
              </div>

              <div className="space-y-3 pt-4">
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-text-main focus:ring-text-main" />
                  <span className="text-xs text-text-main">Je certifie l'exactitude des informations inscris</span>
                </label>
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-text-main focus:ring-text-main" />
                  <span className="text-xs text-text-main">J'accepte les Conditions Générales d'Utilisation</span>
                </label>
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-text-main focus:ring-text-main" />
                  <span className="text-xs text-text-main">J'accepte la Politique de Confidentialité</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer / Bouton d'action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100">
        <div className="max-w-sm mx-auto">
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3.5 rounded-xl text-white font-medium text-base bg-[#1a3b8b] hover:bg-[#152e6b] transition-colors shadow-lg"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              form="learner-form"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl text-white font-medium text-base bg-[#1a3b8b] hover:bg-[#152e6b] transition-colors disabled:opacity-70 shadow-lg flex justify-center items-center"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Créer mon compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
