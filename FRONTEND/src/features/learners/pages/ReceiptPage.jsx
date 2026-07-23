import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CreditCard, GraduationCap, Download, ReceiptText, ShieldCheck, Loader2 } from 'lucide-react'
import { buttonStyles, cardStyles, StatusBadge, PageHeader } from '../../../components/ui/designSystem'
import { formatDate, formatMoney } from '../../../utils/formatters'
import { generatePDF } from '../../../utils/generatePDF'

export function ReceiptPage() {
  const navigate = useNavigate()
  const receiptRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGenerating(true)
      await generatePDF(receiptRef.current, `Recu_PayEdu_${receiptData.transaction}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const receiptData = {
    nom: 'Dominiek Joël',
    matricule: 'IUT202600123',
    filiere: 'Génie logiciel - licence',
    montant: 350000,
    objectif: 'Tranche 2',
    transaction: 'PAY-2026-3651',
    dateRdv: '2026-06-29T10:00:00Z',
    lieu: 'UBA Douala, Ange Raphaël',
    dateEmission: '2026-07-10T00:00:00Z',
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader
        eyebrow="Reçu électronique"
        title="Reçu de paiement"
        description="Mise en page prête à imprimer avec les informations de transaction essentielles et le code de vérification."
      />

      <section className={cardStyles('overflow-hidden p-6 sm:p-8')}>
        <div className="flex flex-col gap-6">
          <div ref={receiptRef} className="flex flex-col gap-6 bg-white p-4 -m-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <GraduationCap className="h-7 w-7" />
                <CreditCard className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full bg-white p-0.5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold uppercase tracking-[0.18em] text-text">ETUTRANSFERT - IUTD</h1>
                <p className="text-sm text-text-secondary">Transaction simple, traçable et vérifiable</p>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="text-center">
              <StatusBadge status="confirmed" tone="success" />
              <h2 className="mt-4 text-2xl font-semibold text-text">Reçu de paiement</h2>
              <p className="mt-2 text-sm text-text-secondary">Document officiel - Validation des frais de paiement</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ReceiptRow label="Nom et prénom" value={receiptData.nom} />
              <ReceiptRow label="Matricule" value={receiptData.matricule} />
              <ReceiptRow label="Filière" value={receiptData.filiere} />
              <ReceiptRow label="Montant payé" value={formatMoney(receiptData.montant)} highlight />
              <ReceiptRow label="Objectif" value={receiptData.objectif} />
              <ReceiptRow label="N° de transaction" value={receiptData.transaction} />
              <ReceiptRow label="Date et heure du rendez-vous" value={receiptData.dateRdv} />
              <ReceiptRow label="Lieu" value={receiptData.lieu} />
              <ReceiptRow label="Date d’émission" value={receiptData.dateEmission} />
            </div>

            <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Vérification</p>
                <p className="mt-2 text-sm font-semibold text-text">Code QR ou référence</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Statut</p>
                <p className="mt-2"><StatusBadge status="confirmed" tone="success" /></p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Date</p>
                <p className="mt-2 text-sm font-semibold text-text">{formatDate(receiptData.dateEmission, { dateStyle: 'long' })}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <button onClick={() => window.print()} className={buttonStyles({ variant: 'secondary', block: true })}>
              Imprimer
            </button>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating}
              className={buttonStyles({ variant: 'primary', block: true })}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Télécharger PDF
            </button>
            <button className={buttonStyles({ variant: 'secondary', block: true })}>
              <ShieldCheck className="h-4 w-4" />
              Vérifier
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReceiptRow({ label, value, highlight = false }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? 'bg-primary-light' : 'bg-white'}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-text">{value}</p>
    </div>
  )
}
