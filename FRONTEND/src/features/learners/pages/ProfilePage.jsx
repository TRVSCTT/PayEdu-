import { useEffect, useState } from 'react'
import { useAuth } from '../../../store/authStore'
import { paymentService } from '../../../services/paymentService'
import { LogOut, Pencil, Trash2 } from 'lucide-react'
import { cardStyles, buttonStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'

export function ProfilePage() {
  const { user, removeAuthenticationData } = useAuth()
  const [profil, setProfil] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await paymentService.obtenirProfil()
        setProfil(data)
        setFormData({
          email: data.email || '',
          telephone: data.telephone || '',
          filiere: data.filiere || '',
          niveau: data.niveau || '',
        })
      } catch (error) {
        console.error('Erreur de récupération du profil', error)
      }
    }
    fetchProfil()
  }, [])

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSaving(true)
        const updated = await paymentService.modifierProfil(formData)
        setProfil(updated)
        setIsEditing(false)
      } catch (error) {
        console.error('Erreur lors de la modification', error)
        alert('Une erreur est survenue lors de la modification.')
      } finally {
        setIsSaving(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleLogout = () => {
    removeAuthenticationData()
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")
    if (confirmDelete) {
      try {
        await paymentService.supprimerCompte()
        removeAuthenticationData()
      } catch (error) {
        console.error('Erreur lors de la suppression', error)
        alert('Une erreur est survenue lors de la suppression de votre compte.')
      }
    }
  }

  const displayName = profil?.prenom ? `${profil.prenom} ${profil.nom}`.toUpperCase() : (user?.prenom || 'JACK ESSOMBA').toUpperCase()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profil"
        title={displayName}
        description={profil?.etablissement_nom || 'IUT de Douala'}
        actions={<StatusBadge status="confirmed" label={isEditing ? 'Mode édition' : 'Profil actif'} tone="primary" />}
      />

      <section className={cardStyles('overflow-hidden')}>
        <div className="flex flex-col gap-6 border-b border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-border bg-primary-light">
              <img
                src={`https://ui-avatars.com/api/?name=${profil?.prenom || 'User'}+${profil?.nom || ''}&background=123B5D&color=fff&size=150`}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Compte connecté</p>
              <p className="mt-1 text-lg font-semibold text-text">{displayName}</p>
              <p className="text-sm text-text-secondary">{profil?.matricule || 'Matricule non renseigné'}</p>
            </div>
          </div>

          <button onClick={handleEditToggle} disabled={isSaving} className={buttonStyles({ variant: 'secondary' })}>
            <Pencil className="h-4 w-4" />
            {isSaving ? 'Enregistrement…' : isEditing ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:p-6">
          <InfoRow
            label="Email"
            value={profil?.email || user?.email || 'Non renseigné'}
            isEditing={isEditing}
            editValue={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
            type="email"
          />
          <InfoRow
            label="Numéro"
            value={profil?.telephone || user?.telephone || 'Non renseigné'}
            isEditing={isEditing}
            editValue={formData.telephone}
            onChange={(val) => setFormData({ ...formData, telephone: val })}
            type="tel"
          />
          <InfoRow label="Date et lieu de naissance" value="10/04/2007 - Yde" />
          <InfoRow
            label="Filière"
            value={profil?.filiere || 'Non renseigné'}
            isEditing={isEditing}
            editValue={formData.filiere}
            onChange={(val) => setFormData({ ...formData, filiere: val })}
          />
          <InfoRow
            label="Niveau"
            value={profil?.niveau || 'Non renseigné'}
            isEditing={isEditing}
            editValue={formData.niveau}
            onChange={(val) => setFormData({ ...formData, niveau: val })}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ContactCard nom="MBIEZE" telephone="+237 677548933" email="jacques@gmail.com" title="Responsable académique" />
        <ContactCard nom="MBIEZE" telephone="+237 677548933" email="jacques@gmail.com" title="Encadreur académique" />
      </section>

      <div className="grid gap-3">
        <button onClick={handleLogout} className={buttonStyles({ variant: 'secondary', block: true })}>
          <LogOut className="h-4 w-4" />
          Me déconnecter
        </button>
        <button onClick={handleDeleteAccount} className={buttonStyles({ variant: 'danger', block: true })}>
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value, isEditing, editValue, onChange, type = 'text' }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-border bg-white p-4 sm:grid-cols-[1fr_1.2fr] sm:items-center">
      <span className="text-sm font-semibold text-text-secondary">{label}</span>
      {isEditing && onChange ? (
        <input type={type} value={editValue} onChange={(e) => onChange(e.target.value)} className="app-input text-right" />
      ) : (
        <span className="text-sm font-semibold text-text sm:text-right">{value}</span>
      )}
    </div>
  )
}

function ContactCard({ nom, telephone, email, title }) {
  return (
    <article className={cardStyles('overflow-hidden')}>
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</p>
      </div>
      <div className="space-y-3 p-5">
        <FieldRow label="Nom" value={nom} />
        <FieldRow label="Téléphone" value={telephone} />
        <FieldRow label="Email" value={email} />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border bg-background p-3">
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-primary-light">Appeler</button>
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-primary-light">Message</button>
        <button className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-primary-light">Email</button>
      </div>
    </article>
  )
}

function FieldRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-text">{value}</span>
    </div>
  )
}
