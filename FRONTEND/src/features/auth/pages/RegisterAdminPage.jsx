import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react'
import { adminSchema } from '../schemas/adminSchema'
import { useRegisterAdmin } from '../hooks/useRegisterAdmin'
import { handleApiError } from '../../../utils/handleApiError'
import { buttonStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'

export function RegisterAdminPage() {
  const navigate = useNavigate()
  const { mutateAsync: performRegister, isPending } = useRegisterAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
  })

  const onSubmit = async (data) => {
    try {
      await performRegister(data)
      toast.success('Compte administrateur créé avec succès !')
      navigate('/connexion')
    } catch (error) {
      const apiError = handleApiError(error)
      toast.error(apiError.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="confirmed" label="Création administrateur" tone="primary" />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Portail sécurisé
          </span>
        </div>

        <PageHeader
          title="Créer un compte administrateur"
          description="Cet accès permet d’administrer les établissements, les bénéficiaires et les paramètres globaux."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="app-label" htmlFor="nom">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              {...register('nom')}
              className={`app-input ${errors.nom ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            />
            {errors.nom ? <p className="app-error">{errors.nom.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="app-label" htmlFor="prenom">
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              {...register('prenom')}
              className={`app-input ${errors.prenom ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
            />
            {errors.prenom ? <p className="app-error">{errors.prenom.message}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="app-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`app-input ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
          />
          {errors.email ? <p className="app-error">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="app-label" htmlFor="mot_de_passe">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            type="password"
            autoComplete="new-password"
            {...register('mot_de_passe')}
            className={`app-input ${errors.mot_de_passe ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
          />
          {errors.mot_de_passe ? <p className="app-error">{errors.mot_de_passe.message}</p> : null}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
          <Link to="/connexion" className={buttonStyles({ variant: 'secondary', size: 'lg', block: true })}>
            Annuler
          </Link>
          <button type="submit" disabled={isPending} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Créer le compte
          </button>
        </div>
      </form>
    </div>
  )
}
