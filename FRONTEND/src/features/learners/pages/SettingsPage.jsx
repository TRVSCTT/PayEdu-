import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, HelpCircle } from 'lucide-react'
import { cardStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { useTheme } from '../../../store/themeStore'

export function SettingsPage() {
  const [language, setLanguage] = useState('Français')
  const [biometrics, setBiometrics] = useState(true)
  const [location, setLocation] = useState(true)
  const [alerts, setAlerts] = useState(true)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Réglages"
        title="Préférences et sécurité"
        description="Gérez l’apparence, la langue, les permissions et les accès d’aide dans un espace unique."
        actions={<StatusBadge status="confirmed" label="Paramètres actifs" tone="primary" />}
      />

      <SettingsSection title="Apparence">
        <SettingRow
          label="Langue"
          onClick={() => setShowLanguageModal(true)}
          rightElement={
            <span className="flex items-center gap-2 text-sm font-semibold text-text-muted">
              {language}
              <ChevronRight className="h-4 w-4" />
            </span>
          }
        />
        <SettingRow
          label="Mode sombre"
          rightElement={
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                {isDarkMode ? 'Activé' : 'Désactivé'}
              </span>
              <Toggle isChecked={isDarkMode} onChange={toggleTheme} ariaLabel="Basculer le mode sombre" />
            </div>
          }
        />
        <SettingRow label="Taille de police" rightElement={<ChevronRight className="h-4 w-4 text-text-muted" />} isLast />
      </SettingsSection>

      <SettingsSection title="Permission et sécurité">
        <SettingRow label="Biométrie & Face ID" rightElement={<Toggle isChecked={biometrics} onChange={() => setBiometrics(!biometrics)} />} />
        <SettingRow label="Localisation" rightElement={<Toggle isChecked={location} onChange={() => setLocation(!location)} />} />
        <SettingRow label="Alertes" rightElement={<Toggle isChecked={alerts} onChange={() => setAlerts(!alerts)} />} />
        <SettingRow label="Mots de passe et code de sécurité" rightElement={<ChevronRight className="h-4 w-4 text-text-muted" />} isLast />
      </SettingsSection>

      <SettingsSection title="Aide et support">
        <SettingRow label="Support & aide" onClick={() => navigate('/apprenant/parametres/support')} rightElement={<HelpCircle className="h-4 w-4 text-text-muted" />} />
        <SettingRow label="Assistant technique" onClick={() => navigate('/apprenant/parametres/assistant')} rightElement={<ChevronRight className="h-4 w-4 text-text-muted" />} />
        <SettingRow label="Demande de contrôle" onClick={() => navigate('/apprenant/parametres/controle')} rightElement={<ChevronRight className="h-4 w-4 text-text-muted" />} />
        <SettingRow label="À propos de l'application" onClick={() => navigate('/apprenant/parametres/apropos')} rightElement={<ChevronRight className="h-4 w-4 text-text-muted" />} isLast />
      </SettingsSection>

      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/50 p-4 backdrop-blur-sm sm:items-center">
          <div className={cardStyles('w-full max-w-md p-6 sm:p-8')}>
            <h2 className="text-2xl font-semibold text-text">Langues</h2>
            <p className="mt-2 text-sm text-text-secondary">Choisissez la langue de l’application.</p>

            <div className="mt-6 space-y-3">
              {['Français', 'Anglais'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                    language === item ? 'border-primary bg-primary-light' : 'border-border bg-surface hover:bg-primary-light/40'
                  }`}
                >
                  <span className="text-base font-semibold text-text">{item}</span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${language === item ? 'border-primary' : 'border-border'}`}>
                    {language === item ? <span className="h-3 w-3 rounded-full bg-primary" /> : null}
                  </span>
                </button>
              ))}
            </div>

            <button onClick={() => setShowLanguageModal(false)} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
      <div className={cardStyles('overflow-hidden')}>{children}</div>
    </section>
  )
}

function SettingRow({ label, rightElement, isLast, onClick }) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      {...(onClick ? { type: 'button', onClick } : {})}
      className={`flex w-full items-center justify-between gap-4 border-b border-border px-4 py-4 text-left transition ${
        onClick ? 'hover:bg-primary-light/40' : ''
      } ${isLast ? 'border-b-0' : ''}`}
    >
      <span className="text-sm font-medium text-text">{label}</span>
      {rightElement}
    </Component>
  )
}

function Toggle({ isChecked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isChecked}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`flex h-7 w-12 items-center rounded-full p-1 transition ${isChecked ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
