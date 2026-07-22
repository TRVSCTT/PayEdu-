import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Upload } from 'lucide-react'
import { TopNavTabs } from '../../../components/ui/TopNavTabs'
import { Stepper, PageHeader, cardStyles, buttonStyles, StatusBadge } from '../../../components/ui/designSystem'

const RECEIPTS = [
  { id: 'is', title: 'Inscription spéciale' },
  { id: 't1', title: 'Tranche 1' },
  { id: 't2', title: 'Tranche 2' },
  { id: 'vm', title: 'Visite médicale' },
  { id: 'ce', title: 'Carte étudiant' },
]

const STEPS = [
  { label: 'Université' },
  { label: 'Bénéficiaire' },
  { label: 'Type de frais' },
  { label: 'Moyen de paiement' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
]

export function UploadReceiptPage() {
  const navigate = useNavigate()
  const [selectedReceipts, setSelectedReceipts] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState({})
  const fileInputRef = useRef(null)
  const [currentUploadId, setCurrentUploadId] = useState(null)

  const toggleReceipt = (id) => {
    setSelectedReceipts((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const triggerUpload = (e, id) => {
    e.stopPropagation()
    setCurrentUploadId(id)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && currentUploadId) {
      setUploadedFiles((prev) => ({
        ...prev,
        [currentUploadId]: file.name,
      }))

      if (!selectedReceipts.includes(currentUploadId)) {
        setSelectedReceipts((prev) => [...prev, currentUploadId])
      }
    }

    e.target.value = ''
    setCurrentUploadId(null)
  }

  const handleContinue = () => {
    navigate('/apprenant/paiements/methode')
  }

  return (
    <div className="space-y-6">
      <TopNavTabs />

      <Stepper steps={STEPS} currentStep={4} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Étape 5</p>
          <h2 className="text-xl font-semibold text-text">Joindre les quitus correspondants</h2>
        </div>
      </div>

      <PageHeader description="Ajoutez les justificatifs requis pour garder le dossier clair avant la validation finale." />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <section className="space-y-3">
        {RECEIPTS.map((receipt) => {
          const hasFile = Boolean(uploadedFiles[receipt.id])
          const isSelected = selectedReceipts.includes(receipt.id)

          return (
            <button
              key={receipt.id}
              type="button"
              onClick={() => toggleReceipt(receipt.id)}
              className={cardStyles(`flex w-full items-center gap-4 p-4 text-left transition ${hasFile ? 'border-success/30 bg-success-light/50' : ''}`)}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-white'
                }`}
              >
                {isSelected ? '✓' : null}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-text">{receipt.title}</h3>
                {uploadedFiles[receipt.id] ? <p className="mt-1 truncate text-xs text-success">{uploadedFiles[receipt.id]}</p> : <p className="mt-1 text-xs text-text-muted">Aucun fichier sélectionné</p>}
              </div>
              <div
                className="flex shrink-0 items-center justify-center"
                onClick={(e) => triggerUpload(e, receipt.id)}
                role="button"
                tabIndex={0}
              >
                {hasFile ? (
                  <StatusBadge status="confirmed" label="Ajouté" tone="success" />
                ) : (
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text transition hover:bg-primary-light">
                    <Upload className="h-5 w-5" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </section>

      <div className="pt-2">
        <button onClick={handleContinue} className={buttonStyles({ variant: 'primary', size: 'lg', block: true })}>
          Continuer
        </button>
      </div>
    </div>
  )
}
