import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Calendar, ChevronLeft, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import { learnerSchema } from '../schemas/learnerSchema'
import { useRegisterLearner } from '../hooks/useRegisterLearner'
import { handleApiError } from '../../../utils/handleApiError'
import { useAuth } from '../../../store/authStore'
import { StepProgressBar } from '../../../components/ui/StepProgressBar'
import { PageHeader, buttonStyles, cardStyles, StatusBadge } from '../../../components/ui/designSystem'

const STEPS = [
  { label: 'Identité' },
  { label: 'Informations académiques' },
  { label: 'Tuteur légal' },
  { label: 'Sécurité' },
]

export function RegisterLearnerPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mutateAsync: performRegister, isPending } = useRegisterLearner()
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(learnerSchema),
    mode: 'onTouched',
  })

  const nextStep = async () => {
    let fieldsToValidate = []
    if (currentStep === 0) {
      fieldsToValidate = ['nom', 'prenom', 'email']
    } else if (currentStep === 1) {
      fieldsToValidate = ['matricule', 'filiere', 'niveau', 'telephone']
    } else if (currentStep === 2) {
      setCurrentStep(3)
      return
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async (data) => {
    try {
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
      }

      Object.keys(payload).forEach((key) => {
        if (!payload[key]) {
          delete payload[key]
        }
      })

      await performRegister(payload)
      toast.success('Apprenant créé avec succès !')
      navigate(user ? '/etablissement' : '/connexion')
    } catch (error) {
      const apiError = handleApiError(error)
      toast.error(apiError.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentStep > 0) {
                prevStep()
              } else {
                navigate('/connexion')
              }
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Inscription apprenant</p>
            <h1 className="text-2xl font-semibold text-text">Créer un profil étudiant</h1>
          </div>
        </div>

        <StatusBadge status="confirmed" label="Formulaire guidé" tone="primary" />
        <PageHeader description="Les champs sont répartis par étapes pour rendre l’inscription plus simple sur mobile et sur ordinateur." />
      </div>

      <StepProgressBar steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {currentStep === 0 && (
          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <SectionTitle title="Identité" description="Commencez par les informations personnelles de base." />

            <Field label="Nom" error={errors.nom?.message}>
              <input id="nom" type="text" {...register('nom')} className="app-input" />
            </Field>

            <Field label="Prénom" error={errors.prenom?.message}>
              <input id="prenom" type="text" {...register('prenom')} className="app-input" />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pseudo">
                <input id="pseudo" type="text" placeholder="(Non requis par le backend)" className="app-input" />
              </Field>
              <Field label="Date naissance">
                <div className="relative">
                  <input id="date_naissance" type="date" className="app-input pr-12" />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </div>
              </Field>
            </div>

            <Field label="Lieu de naissance">
              <input id="lieu_naissance" type="text" placeholder="Ex: Douala" className="app-input" />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input id="email" type="email" placeholder="exemple@icloud.com" {...register('email')} className="app-input" />
            </Field>
          </section>
        )}

        {currentStep === 1 && (
          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <SectionTitle title="Informations académiques" description="Ces données aident à retrouver rapidement le dossier de l’étudiant." />

            <Field label="Matricule" error={errors.matricule?.message}>
              <input id="matricule" type="text" {...register('matricule')} className="app-input" />
            </Field>

            <Field label="Filière" error={errors.filiere?.message}>
              <input id="filiere" type="text" {...register('filiere')} className="app-input" />
            </Field>

            <Field label="Niveau" error={errors.niveau?.message}>
              <select id="niveau" {...register('niveau')} className="app-select">
                <option value="">Sélectionner</option>
                <option value="L1">Licence 1</option>
                <option value="L2">Licence 2</option>
                <option value="L3">Licence 3</option>
                <option value="M1">Master 1</option>
                <option value="M2">Master 2</option>
              </select>
            </Field>

            <Field label="Contact" error={errors.telephone?.message}>
              <div className="flex overflow-hidden rounded-xl border border-border bg-white focus-within:ring-4 focus-within:ring-primary/15">
                <div className="flex items-center gap-1 border-r border-border bg-background px-3 text-sm font-semibold text-text-muted">
                  +237
                </div>
                <input id="telephone" type="text" {...register('telephone')} placeholder="6XX XX XX XX" className="flex-1 border-0 bg-transparent px-3 py-3 outline-none" />
              </div>
            </Field>
          </section>
        )}

        {currentStep === 2 && (
          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <SectionTitle title="Tuteur légal" description="Ces informations restent facultatives dans le backend actuel." />
            <p className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-text-secondary">
              Ajoutez un contact de confiance pour compléter le dossier, surtout lorsque l’inscription est faite par un parent ou un tuteur.
            </p>

            <Field label="Nom du tuteur">
              <input id="tuteur_nom" type="text" className="app-input" />
            </Field>

            <Field label="Prénoms du tuteur">
              <input id="tuteur_prenom" type="text" className="app-input" />
            </Field>
          </section>
        )}

        {currentStep === 3 && (
          <section className={cardStyles('space-y-5 p-5 sm:p-6')}>
            <SectionTitle title="Sécurité" description="Choisissez un mot de passe fort et confirmez-le avant de finaliser l’inscription." />

            <Field label="Mot de passe" error={errors.mot_de_passe?.message}>
              <div className="relative">
                <input
                  id="mot_de_passe"
                  type={showPassword ? 'text' : 'password'}
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
            </Field>

            <Field label="Confirmer le mot de passe" error={errors.confirm_mot_de_passe?.message}>
              <input id="confirm_mot_de_passe" type="password" {...register('confirm_mot_de_passe')} className={`app-input ${errors.confirm_mot_de_passe ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`} />
            </Field>

            <div className="space-y-3 pt-1">
              {[
                "Je certifie l'exactitude des informations inscrites",
                "J'accepte les Conditions Générales d'Utilisation",
                "J'accepte la Politique de Confidentialité",
              ].map((label) => (
                <label key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20" />
                  <span className="text-sm leading-6 text-text-secondary">{label}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {currentStep < STEPS.length - 1 ? (
            <>
              <button type="button" onClick={nextStep} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
                Suivant
              </button>
            </>
          ) : (
            <button type="submit" disabled={isPending} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Créer mon compte
            </button>
          )}
        </div>
      </form>
    </div>
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

function SectionTitle({ title, description }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {description ? <p className="text-sm leading-6 text-text-secondary">{description}</p> : null}
    </div>
  )
}
