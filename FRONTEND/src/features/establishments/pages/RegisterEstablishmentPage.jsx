import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, School, UserPlus } from 'lucide-react'
import { establishmentSchema } from '../schemas/establishmentSchema'
import { useRegisterEstablishment } from '../hooks/useRegisterEstablishment'
import { handleApiError } from '../../../utils/handleApiError'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { buttonStyles, cardStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'

export function RegisterEstablishmentPage() {
  const navigate = useNavigate()
  const { mutateAsync: performRegister, isPending } = useRegisterEstablishment()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(establishmentSchema),
  })

  const onSubmit = async (data) => {
    try {
      await performRegister(data)
      toast.success("Établissement et compte gestionnaire créés avec succès !")
      reset()
    } catch (error) {
      const apiError = handleApiError(error)
      toast.error(apiError.message)
    }
  }

  return (
    <DashboardLayout
      title="Créer un nouvel établissement"
      description="Ajoutez un établissement et son gestionnaire dans un formulaire lisible, cohérent et mobile-friendly."
      actions={
        <StatusBadge status="confirmed" label="Création sécurisée" tone="primary" />
      }
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Informations de l’établissement"
          description="Les champs ci-dessous servent à configurer l’établissement et le compte gestionnaire en une seule opération."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <School className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-text">Données de l’établissement</h3>
                <p className="text-sm text-text-secondary">Identifiez clairement la structure à configurer.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom de l'établissement" error={errors.nom_etablissement?.message}>
                <input type="text" {...register('nom_etablissement')} className="app-input" />
              </Field>

              <Field label="Code établissement" error={errors.code_etablissement?.message}>
                <input type="text" {...register('code_etablissement')} className="app-input" />
              </Field>
            </div>

            <Field label="Ville (optionnel)">
              <input type="text" {...register('ville')} className="app-input" />
            </Field>
          </section>

          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
                <UserPlus className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-text">Compte gestionnaire</h3>
                <p className="text-sm text-text-secondary">Le compte créé pourra administrer l’établissement dès l’enregistrement.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom du gestionnaire" error={errors.nom?.message}>
                <input type="text" {...register('nom')} className="app-input" />
              </Field>
              <Field label="Prénom du gestionnaire" error={errors.prenom?.message}>
                <input type="text" {...register('prenom')} className="app-input" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail (identifiant)" error={errors.email?.message}>
                <input type="email" {...register('email')} className="app-input" />
              </Field>
              <Field label="Mot de passe provisoire" error={errors.mot_de_passe?.message}>
                <input type="password" {...register('mot_de_passe')} className="app-input" />
              </Field>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link to="/admin" className={buttonStyles({ variant: 'secondary', size: 'lg', block: true })}>
              Annuler
            </Link>
            <button type="submit" disabled={isPending} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Créer l’établissement
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="app-label">{label}</label>
      {children}
      {error ? <p className="app-error">{error}</p> : null}
    </div>
  )
}
