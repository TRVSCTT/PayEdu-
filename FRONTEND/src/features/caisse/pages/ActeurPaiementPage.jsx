import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';
import { caisseService } from '../../../services/caisseService';
import { formatMoney, formatDate } from '../../../utils/formatters';

export function ActeurPaiementPage() {
  const navigate = useNavigate();
  const [selectedPaiement, setSelectedPaiement] = useState(null);

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['caisse-queue'],
    queryFn: caisseService.getQueue,
  });

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Retour">
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <h1 className="text-3xl font-bold text-text">Acteur paiement</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className={cx(buttonStyles({ variant: 'secondary' }), 'bg-white border-border hover:bg-gray-50')}>
            Historique
          </button>
          <button className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90')}>
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      <section className="space-y-2 shrink-0">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-text">Filtre</span>
          <div className="flex items-center gap-4">
            <button className="text-xs font-semibold text-text hover:underline transition-colors">
              Sélectionner
            </button>
            <button className="text-text-muted hover:text-text transition-colors flex items-center gap-1 text-xs">
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <SelectFilter label="File" options={['Tout', 'N°55']} />
          <SelectFilter label="Type Acteur" options={['Tout', 'Etudiant', 'Parent']} />
          <SelectFilter label="Statut" options={['Tout', 'En attente', 'Validé']} />
          <SelectFilter label="Etablissement" options={['Tous', 'IUT Douala']} />
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
        <div className="flex flex-col w-1/3 min-w-[320px]">
          <div className="bg-black text-white px-6 py-4 rounded-xl font-bold text-lg mb-4 text-center">
            <span className="text-sm font-medium opacity-80 block mb-1">Total</span>
            {queue.length}
          </div>
          
          <div className="bg-white border border-border rounded-xl flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : queue.length === 0 ? (
              <div className="text-center py-10 text-text-muted">La liste est vide.</div>
            ) : (
              <div className="divide-y divide-border">
                {queue.map((p, index) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPaiement(p)}
                    className={cx(
                      'w-full flex items-center gap-4 px-4 py-3 transition hover:bg-gray-50 text-left',
                      selectedPaiement?.id === p.id ? 'bg-primary-light/30' : ''
                    )}
                  >
                    <span className="text-text-secondary text-sm w-4">{index + 1}</span>
                    <div className={cx("h-10 w-10 rounded-full flex items-center justify-center font-bold border", 
                      index % 2 === 0 ? "bg-white text-text border-text" : "bg-black text-white border-black"
                    )}>
                      {index % 2 === 0 ? 'T' : 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-sm text-text truncate">
                        {p.apprenant_matricule || "Matricule non défini"}
                      </p>
                      <p className="text-xs text-text-secondary truncate">{p.objet_paiement || "Paiement"}</p>
                    </div>
                    <span className="text-xs font-medium text-text-muted">Aperçu</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Details */}
        <div className={cx(cardStyles('flex flex-col flex-1 overflow-hidden p-8'))}>
          {!selectedPaiement ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              Sélectionnez un acteur pour voir les détails
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-xl font-medium text-text-secondary">Enregistrement N° {selectedPaiement.id.substring(0, 8).toUpperCase()}</h2>
                <h2 className="text-xl font-bold text-text">Total paiement: {formatMoney(selectedPaiement.montant)}</h2>
              </div>
              
              <div className="flex-1 space-y-1">
                <DottedRow label="Nom et prénom" value={`${selectedPaiement.apprenant_nom || ''} ${selectedPaiement.apprenant_prenom || ''}`.trim() || "Non défini"} />
                <DottedRow label="Tuteur/Contact d'urgence" value="Non défini" />
                <DottedRow label="Etablissement" value={selectedPaiement.etablissement_nom || "Non défini"} />
                <DottedRow label="Matricule" value={selectedPaiement.apprenant_matricule || "Non défini"} />
                <DottedRow label="Objet du paiement" value={selectedPaiement.objet_paiement || "Non défini"} />
                <DottedRow label="Date" value={formatDate(selectedPaiement.created_at)} />
                <DottedRow label="Lieu" value={selectedPaiement.ville_paiement ? `${selectedPaiement.ville_paiement}` : "Non défini"} />
                <DottedRow label="Heure" value={new Date(selectedPaiement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <DottedRow label="Montant du paiement" value={formatMoney(selectedPaiement.montant)} />
                <DottedRow label="Origine de paiement" value="Non défini" />
                <DottedRow label="Statut" value={selectedPaiement.statut === 'en_file_caisse' ? 'En file d\'attente' : 'Validé'} />
                <DottedRow label="Absence rdv" value="0" />
                <DottedRow label="Déplacement rdv" value="Aucun" />
                <DottedRow label="N° de passage" value="Non défini" />
              </div>

              <div className="mt-8 pt-4 flex gap-4">
                <button className={cx(buttonStyles({ variant: 'secondary' }), 'flex-1 border-border py-4 bg-white')}>
                  Voir tous les détails
                </button>
                <button className={cx(buttonStyles({ variant: 'primary' }), 'flex-1 bg-black text-white hover:bg-black/90 py-4')}>
                  Suivant
                </button>
              </div>
              <button className="text-sm font-medium text-text-secondary hover:text-text transition mt-4 text-center w-full">
                Fermer
              </button>
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
        className="app-input h-9 text-xs py-0 pl-3 pr-8 bg-white border-border"
      >
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

function DottedRow({ label, value }) {
  return (
    <div className="flex items-end gap-2 text-sm mb-3">
      <span className="text-text-secondary whitespace-nowrap">{label}:</span>
      <div className="flex-1 border-b-[1.5px] border-dotted border-gray-400 mb-1 mx-1 min-w-[20px]"></div>
      <span className="font-medium text-text whitespace-nowrap">{value}</span>
    </div>
  )
}
