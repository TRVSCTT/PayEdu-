import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, RefreshCw, Loader2, QrCode, X } from 'lucide-react';
import { cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';
import { caisseService } from '../../../services/caisseService';
import { formatMoney, formatDate } from '../../../utils/formatters';
import { toast } from 'sonner';

export function CaisseEnregistrementPage() {
  const queryClient = useQueryClient();
  const [filterStatut, setFilterStatut] = useState('En attente');
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignalForm, setShowSignalForm] = useState(false);
  const [signalReason, setSignalReason] = useState('');

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['caisse-queue'],
    queryFn: caisseService.getQueue,
    refetchInterval: 10000 // Rafraîchir toutes les 10s
  });

  const validateMutation = useMutation({
    mutationFn: () => caisseService.validatePayment(selectedPaiement.id),
    onSuccess: () => {
      toast.success('Paiement validé avec succès');
      setShowConfirmModal(false);
      setSelectedPaiement(null);
      queryClient.invalidateQueries({ queryKey: ['caisse-queue'] });
      queryClient.invalidateQueries({ queryKey: ['caisse-stats'] });
    },
    onError: () => {
      toast.error('Erreur lors de la validation');
    }
  });

  const signalMutation = useMutation({
    mutationFn: () => caisseService.reportIssue(selectedPaiement.id, signalReason),
    onSuccess: () => {
      toast.success('Signalement envoyé');
      setShowSignalForm(false);
      setSignalReason('');
    },
    onError: () => {
      toast.error('Erreur lors du signalement');
    }
  });

  const handleValidateClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmValidate = () => {
    validateMutation.mutate();
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Enregistrement</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-text">Signalement en attente: 0</span>
          <button className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90')}>
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      <section className="space-y-2 shrink-0">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-text">Filtre</span>
          <button className="text-text-muted hover:text-text transition-colors flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Réinitialiser
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SelectFilter label="File" options={["N°55"]} />
          <SelectFilter label="Statut" value={filterStatut} onChange={setFilterStatut} options={['En attente', 'Validé']} />
          <SelectFilter label="Établissement" options={['Tous', 'IUT Douala']} />
          <div className="flex gap-2">
            <SelectFilter label="Date" options={['Toutes']} className="flex-1" />
            <SelectFilter label="Mois" options={['Mois']} className="w-20" />
          </div>
          <SelectFilter label="Phase" options={['1', '2']} />
        </div>
      </section>

      {/* Main split view */}
      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left pane: List */}
        <div className="flex flex-col w-1/2 min-w-[350px]">
          <div className="bg-text text-white px-6 py-4 rounded-t-2xl font-bold text-lg">
            <span className="text-sm font-medium opacity-80 block mb-1">Total</span>
            {queue.length}
          </div>
          <div className={cx(cardStyles('p-0 rounded-t-none flex-1 overflow-y-auto'))}>
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : queue.length === 0 ? (
              <div className="text-center py-10 text-text-muted">La file d'attente est vide.</div>
            ) : (
              <div className="divide-y divide-border">
                {queue.map((p, index) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPaiement(p); setShowSignalForm(false); }}
                    className={cx(
                      'w-full flex items-center gap-4 px-4 py-3 transition hover:bg-gray-50 text-left',
                      selectedPaiement?.id === p.id ? 'bg-primary-light/30' : ''
                    )}
                  >
                    <span className="text-text-muted text-sm w-6">{index + 1}</span>
                    <div className="h-10 w-10 rounded-full bg-text text-white flex items-center justify-center font-bold">
                      {index % 2 === 0 ? 'T' : 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-text truncate">{p.id.substring(0, 13).toUpperCase()}</p>
                      <p className="text-xs text-text-secondary truncate">Tranche 1 - Tranche 2</p>
                    </div>
                    <span className="text-xs font-medium text-text-muted">Aperçu</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Details */}
        <div className={cx(cardStyles('flex flex-col flex-1 overflow-hidden relative'))}>
          {!selectedPaiement ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              Sélectionnez un enregistrement pour voir les détails
            </div>
          ) : showSignalForm ? (
            <div className="p-8 flex flex-col h-full">
              <h2 className="text-lg font-semibold text-text mb-6">Enregistrement N° {selectedPaiement.id.substring(0, 8)}</h2>
              <p className="text-sm text-text-secondary mb-2">Description du problème</p>
              <textarea
                value={signalReason}
                onChange={(e) => setSignalReason(e.target.value)}
                className="flex-1 w-full border border-border rounded-xl p-4 resize-none mb-4 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Expliquez le problème rencontré..."
              />
              <p className="text-xs text-text-muted text-right mb-4">{signalReason.length}/10000 caractères max</p>
              <button 
                className="text-sm font-medium text-text-muted hover:text-text transition text-center mb-6 underline"
                onClick={() => setShowSignalForm(false)}
              >
                Afficher les détails sur l'enregistrement
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSignalForm(false)}
                  className={cx(buttonStyles({ variant: 'secondary', block: true }), 'border-border py-3')}
                >
                  Annuler
                </button>
                <button 
                  onClick={() => signalMutation.mutate()}
                  disabled={signalMutation.isPending || !signalReason.trim()}
                  className={cx(buttonStyles({ variant: 'primary', block: true }), 'bg-black text-white hover:bg-black/90 py-3')}
                >
                  {signalMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col h-full overflow-y-auto">
              <h2 className="text-lg font-semibold text-text mb-8">Enregistrement N° {selectedPaiement.id.substring(0, 8)}</h2>
              
              <div className="flex gap-8">
                {/* Infos */}
                <div className="flex-1 space-y-4">
                  <InfoRow label="Bénéficiaire" value="IUT de douala" />
                  <InfoRow label="Payeur" value="Jack Essomba" />
                  <InfoRow label="Date" value={formatDate(selectedPaiement.created_at)} />
                  <InfoRow label="Heure" value={new Date(selectedPaiement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                  <InfoRow label="Lieu" value="Douala" />
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-4 py-2 border border-text text-text rounded-full text-sm font-medium flex items-center gap-2">
                      Quitus 1 <CheckCircleFilled />
                    </span>
                    <span className="px-4 py-2 border border-border text-text-muted rounded-full text-sm">Quitus 2</span>
                    <span className="px-4 py-2 border border-border text-text-muted rounded-full text-sm">Quitus 3</span>
                    <span className="px-4 py-2 border border-border text-text-muted rounded-full text-sm">Quitus 4</span>
                  </div>
                </div>

                {/* QR & Scanner */}
                <div className="w-48 flex flex-col items-center">
                  <span className="text-sm font-medium text-text mb-2">Quitus 3</span>
                  <div className="w-40 h-40 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-gray-50 mb-4">
                    <QrCode className="w-16 h-16 text-border" />
                  </div>
                  <button className={cx(buttonStyles({ variant: 'primary', block: true }), 'bg-black text-white hover:bg-black/90')}>
                    Scanner
                  </button>
                  <h3 className="text-2xl font-bold text-text mt-6 text-center">{formatMoney(selectedPaiement.montant)}</h3>
                </div>
              </div>

              <div className="mt-auto pt-8 flex items-center gap-4">
                <button 
                  onClick={() => setShowSignalForm(true)}
                  className={cx(buttonStyles({ variant: 'secondary' }), 'flex-1 border-border py-4')}
                >
                  Signaler
                </button>
                <button 
                  onClick={handleValidateClick}
                  className={cx(buttonStyles({ variant: 'primary' }), 'flex-1 bg-black text-white hover:bg-black/90 py-4')}
                >
                  Enregistrer
                </button>
              </div>
              <button className="text-sm font-medium text-text-muted hover:text-text transition mt-4 underline text-center w-full">
                Arrêter pour aujourd'hui
              </button>

              {/* Modal de confirmation superposée */}
              {showConfirmModal && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center p-6">
                  <div className="bg-white rounded-2xl shadow-xl border border-border p-8 w-full max-w-md relative">
                    <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text">
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold text-text mb-4 text-center">Confirmation de l'enregistrement</h3>
                    <p className="text-sm text-text-secondary text-center mb-8">
                      Cliquer sur suivant pour confirmer cet enregistrement et passer au suivant. Un rendez-vous sera automatiquement envoyé à l'apprenant ainsi que des informations supplémentaires en plus.
                    </p>
                    <button 
                      onClick={handleConfirmValidate}
                      disabled={validateMutation.isPending}
                      className={cx(buttonStyles({ variant: 'primary', block: true }), 'bg-black text-white hover:bg-black/90')}
                    >
                      {validateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ label, options, value, onChange, className = '' }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <span className="text-xs text-text-secondary">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="app-input h-10 text-sm py-0 pl-3 pr-8 bg-white border-border"
      >
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <span className="text-sm font-medium text-text-secondary col-span-1">{label}</span>
      <span className="text-sm font-semibold text-text col-span-2">{value}</span>
    </div>
  )
}

function CheckCircleFilled() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#111827"/>
      <path d="M11.3332 5.5L6.74984 10.0833L4.6665 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
