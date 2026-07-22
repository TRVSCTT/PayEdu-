import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronLeft, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { loginSchema } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'
import { useAuth } from '../../../store/authStore'
import { handleApiError } from '../../../utils/handleApiError'
import { getRoleDashboardPath } from '../../../utils/getRoleDashboardPath'
import { buttonStyles, cardStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'

export function LoginPage() {
  const { storeAuthenticationData } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync: performLogin, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      const response = await performLogin(data)
      storeAuthenticationData(response.access_token, response.role)
      toast.success('Connexion réussie !')
      navigate(getRoleDashboardPath(response.role), { replace: true })
    } catch (error) {
      const apiError = handleApiError(error)
      toast.error(apiError.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary/15 hover:bg-primary-light hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
          Retour à l’accueil
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="confirmed" label="Accès sécurisé" tone="primary" />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Paiement étudiant
          </span>
        </div>

        <PageHeader
          title="Connexion à votre compte"
          description="Accédez à vos paiements, reçus, notifications et informations de profil dans une interface claire et rassurante."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="identifiant" className="app-label">
            Identifiant
          </label>
          <input
            id="identifiant"
            type="text"
            placeholder="Email, matricule ou téléphone"
            autoComplete="username"
            {...register('identifiant')}
            className={`app-input ${errors.identifiant ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
          />
          <p className="app-help">Utilisez l’identifiant communiqué par votre établissement.</p>
          {errors.identifiant ? <p className="app-error">{errors.identifiant.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="mot_de_passe" className="app-label">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="mot_de_passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('mot_de_passe')}
              className={`app-input pr-12 ${errors.mot_de_passe ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-3 flex items-center text-text-muted transition hover:text-text"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="app-help">Le mot de passe protège vos informations de paiement et votre profil.</p>
          {errors.mot_de_passe ? <p className="app-error">{errors.mot_de_passe.message}</p> : null}
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button type="submit" disabled={isPending} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
            Continuer
          </button>
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <button type="button" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
              Mot de passe oublié
            </button>
            <p className="text-sm text-text-secondary">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="font-semibold text-primary transition hover:text-primary-dark">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
