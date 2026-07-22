import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, MapPin, QrCode, X } from 'lucide-react'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { appointmentService } from '../../../services/appointmentService'
import { cardStyles, buttonStyles, PageHeader, StatusBadge } from '../../../components/ui/designSystem'
import { formatDate } from '../../../utils/formatters'

export function AppointmentsPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApt, setSelectedApt] = useState(null)
  const [movingApt, setMovingApt] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments()
        setAppointments(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const formatDateTime = (dateString) => formatDate(dateString, { dateStyle: 'medium', timeStyle: 'short' })

  const formattedAppointments = appointments.map((apt, index) => ({
    ...apt,
    isFirst: index === 0,
    isLast: index === appointments.length - 1,
  }))

  const MOCK_APPOINTMENTS = [
    {
      id: 'mock-1',
      dateStr: '30 sept 2026 - 10h30',
      location: 'Agence UBA, Douala - Ange Raphaël',
      status: 'Planifié',
      isFirst: true,
      isLast: false,
    },
    {
      id: 'mock-2',
      dateStr: '30 sept 2026 - 10h30',
      location: 'Agence UBA, Douala - Ange Raphaël',
      status: 'Planifié',
      isFirst: false,
      isLast: true,
    },
  ]

  const displayAppointments = formattedAppointments.length > 0 ? formattedAppointments : MOCK_APPOINTMENTS

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <PageHeader
        eyebrow="Rendez-vous"
        title="Vos rendez-vous de validation"
        description="Les créneaux et les lieux restent regroupés dans une vue claire, adaptée au mobile."
      />

      <main className="space-y-4">
        {isLoading ? (
          <div className={cardStyles('p-6 text-center text-sm text-text-secondary')}>Chargement de vos rendez-vous…</div>
        ) : (
          displayAppointments.map((apt) => (
            <div key={apt.id} className="grid gap-4 lg:grid-cols-[64px_minmax(0,1fr)]">
              <div className="relative flex flex-col items-center pt-6">
                {!apt.isLast && <div className="absolute top-9 h-full w-0.5 bg-primary/20" />}
                <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white" />
              </div>

              <article className={cardStyles('p-5')}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-text">{apt.dateStr || (apt.date_rdv ? formatDateTime(apt.date_rdv) : 'Date non définie')}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="h-4 w-4" />
                      <p>{apt.lieu || apt.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.statut || apt.status} tone="primary" />
                </div>

                <div className="mt-5 flex gap-3">
                  <button onClick={() => setSelectedApt(apt)} className={buttonStyles({ variant: 'secondary', block: true })}>
                    Afficher
                  </button>
                  <button className={buttonStyles({ variant: 'primary', block: true })}>Confirmer</button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setMovingApt(apt)
                      setSelectedSlot(null)
                    }}
                    className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                  >
                    Déplacer
                  </button>
                </div>
              </article>
            </div>
          ))
        )}
      </main>

      {selectedApt && (
        <ModalShell onClose={() => setSelectedApt(null)} title="Rendez-vous de validation">
          <div className="flex justify-center">
            <QrCode className="h-44 w-44 text-primary" strokeWidth={1} />
          </div>
          <p className="text-center text-sm font-semibold text-text-secondary">QR code d’accès - À présenter à l’agence</p>

          <div className="space-y-3">
            <DetailRow label="Date" value="26 juin 2026" />
            <DetailRow label="Heure" value="10:00 AM" />
            <DetailRow label="Lieu" value="UBA, Douala - Ange Raphaël" />
            <DetailRow label="Statut" value="Planifié" />
            <DetailRow label="N° de passage" value="26.200" />
          </div>

          <div className="space-y-3">
            <button className={buttonStyles({ variant: 'primary', block: true })}>
              <Download className="h-4 w-4" />
              Télécharger le reçu
            </button>
            <button onClick={() => navigate('/recu')} className={buttonStyles({ variant: 'secondary', block: true })}>
              Afficher le reçu
            </button>
          </div>
        </ModalShell>
      )}

      {movingApt && (
        <ModalShell onClose={() => setMovingApt(null)} title="Déplacer le rendez-vous">
          <p className="text-center text-sm text-text-secondary">Choisissez un nouveau créneau :</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedSlot('slot1')}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedSlot === 'slot1' ? 'border-primary bg-primary text-white' : 'border-border bg-white hover:bg-primary-light'
              }`}
            >
              <span className="block text-sm font-semibold">mar. 30 juin</span>
              <span className={`mt-1 block text-sm ${selectedSlot === 'slot1' ? 'text-white/80' : 'text-text-muted'}`}>09:00</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlot('slot2')}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedSlot === 'slot2' ? 'border-primary bg-primary text-white' : 'border-border bg-white hover:bg-primary-light'
              }`}
            >
              <span className="block text-sm font-semibold">jeu. 01 juil</span>
              <span className={`mt-1 block text-sm ${selectedSlot === 'slot2' ? 'text-white/80' : 'text-text-muted'}`}>13:00</span>
            </button>
          </div>

          <button
            onClick={() => setMovingApt(null)}
            disabled={!selectedSlot}
            className={buttonStyles({ variant: 'primary', block: true })}
          >
            Confirmer le déplacement
          </button>
          <button onClick={() => setMovingApt(null)} className="text-center text-sm font-semibold text-text-secondary transition hover:text-primary">
            Annuler
          </button>
        </ModalShell>
      )}
    </div>
  )
}

function ModalShell({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text/50 p-4 backdrop-blur-sm sm:items-center">
      <div className={cardStyles('relative w-full max-w-lg p-6 sm:p-8')}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition hover:bg-primary-light">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-4 py-3">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className="text-sm font-semibold text-text">{value}</span>
  </div>
)
