import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import { cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';

export function GestionEtablissementPage() {
  const navigate = useNavigate();
  const [selectedEtab, setSelectedEtab] = useState('IUT de Douala');
  const [selectedEvent, setSelectedEvent] = useState(0);

  const etablissements = [
    'IUT de Douala', 'Université de Douala', 'ENSET de Douala', 
    'ENSPD', 'ESSEC', 'IUC', 'UCAC', 'IUGG', 'DIT', 'ISMA'
  ];

  const events = [
    { title: 'IUT DOUALA', subtitle: "Concours d'entrée 1ère année", date1: '30/06', date2: '20/07' },
    { title: 'IUT DOUALA', subtitle: "Concours d'entrée 1ère année", date1: '30/06', date2: '20/07' },
    { title: 'IUT DOUALA', subtitle: "Concours d'entrée 1ère année", date1: '30/06', date2: '20/07' },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Retour">
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <h1 className="text-3xl font-bold text-text">Gestion établissement</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-text">Demande de collaboration: 02</span>
          <button className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90 flex items-center gap-2')}>
            <Plus className="w-4 h-4" /> Collaboration
          </button>
        </div>
      </div>

      {/* Filters and KPI */}
      <div className="flex gap-4 shrink-0">
        <div className="bg-black text-white rounded-xl flex flex-col justify-center items-center px-4 min-w-[130px] h-[76px]">
          <span className="text-[10px] text-white/80 mb-[2px]">Etablissements</span>
          <span className="text-sm font-bold leading-none mb-1">10</span>
          <span className="text-[9px] text-white/80 mb-[2px]">Total étudiants</span>
          <span className="text-sm font-bold leading-none">25 000</span>
        </div>

        <div className="flex-1 border border-border rounded-2xl p-3 flex flex-col justify-between bg-white">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-text ml-2">Filtre</span>
            <button className="text-text-muted hover:text-text transition-colors flex items-center gap-1 text-[10px] mr-2">
              Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <SelectFilter label="Ville" options={['Douala']} />
            <SelectFilter label="Etablissements" options={['Toutes']} />
            <SelectFilter label="Frais de paiement" options={['Tous']} />
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Col 1: Liste établissements */}
        <div className="w-[200px] border border-border rounded-2xl bg-white overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b border-border text-center bg-white">
            <h3 className="font-bold text-text text-sm">Liste établissements</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {etablissements.map((e, i) => (
               <button 
                 key={i}
                 onClick={() => setSelectedEtab(e)}
                 className={cx("w-full p-4 text-center text-xs font-semibold transition-colors", 
                 selectedEtab === e ? "bg-black text-white" : "bg-white text-text hover:bg-gray-50")}
               >
                 {e}
               </button>
            ))}
          </div>
        </div>

        {/* Col 2: Info Etablissement */}
        <div className="flex-[1.2] border border-border rounded-2xl bg-white p-6 flex flex-col overflow-y-auto shrink-0 relative">
          <h2 className="text-center font-bold text-xl text-text mb-8 px-8 leading-snug">
            Institue Universitaire de Technologie de Douala
          </h2>
          
          <div className="space-y-4 text-xs text-text flex-1 ml-4">
            <div>
              <span className="font-bold">Responsable scolarité :</span><br/>
              MBARGA BENJAMIN PIERRE AIME
            </div>
            <div>
              <span className="font-bold">Nombre approximatif d'étudiants :</span><br/>
              6 000
            </div>
            <div>
              <span className="font-bold">Phases de paiement :</span><br/>
              02 - 30/05 au 20/06 et 02/09 au 04/10
            </div>
            <div>
              <span className="font-bold">Frais de paiement :</span><br/>
              Inscription spéciale - Visite médicale - Tranche1 - Tranche 2 - Carte étudiant
            </div>
            <div>
              <span className="font-bold">Niveau :</span><br/>
              1 - 2 - 3 - 4 - 5 - 6
            </div>
            <div>
              <span className="font-bold">Ville :</span><br/>
              Douala, Cameroun
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button className="text-xs text-text-secondary hover:text-text">Arrêter la collaboration</button>
            <div className="flex gap-4 w-full max-w-[260px]">
              <button className={cx(buttonStyles({ variant: 'secondary' }), 'flex-1 bg-white border-border py-2')}>Précédent</button>
              <button className={cx(buttonStyles({ variant: 'primary' }), 'flex-1 bg-black text-white hover:bg-black/90 py-2')}>Suivant</button>
            </div>
            <button className="text-xs text-text font-bold mt-2">Fermer</button>
          </div>
        </div>

        {/* Col 3: Events */}
        <div className="flex-1 border border-border rounded-2xl bg-white p-4 flex flex-col min-w-[320px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <button className="p-1 border border-border rounded-md hover:bg-gray-50"><ChevronLeft className="w-4 h-4 text-text-secondary" /></button>
            <h2 className="text-[11px] text-text-secondary font-medium">Semaine dernière: du 06 au 11 juillet 2026</h2>
            <button className="p-1 border border-border rounded-md hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-text-secondary" /></button>
          </div>

          <div className="mb-4">
            <select className="app-input w-full h-9 text-xs bg-white border-border rounded-lg pl-3">
              <option>Type d'évènements</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {events.map((ev, i) => (
              <button 
                key={i}
                onClick={() => setSelectedEvent(i)}
                className={cx("w-full text-left p-4 rounded-xl border flex justify-between items-center transition-colors", 
                  selectedEvent === i ? "bg-black text-white border-black" : "bg-white text-text border-border hover:bg-gray-50"
                )}
              >
                <div>
                  <div className="font-bold text-sm mb-1">{ev.title}</div>
                  <div className={cx("text-xs", selectedEvent === i ? "text-white/80" : "text-text-secondary")}>{ev.subtitle}</div>
                </div>
                <div className={cx("text-right text-[10px] space-y-1", selectedEvent === i ? "text-white/60" : "text-text-muted")}>
                  <div>{ev.date1}</div>
                  <div>{ev.date2}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-4 text-[11.5px] leading-relaxed text-text text-justify px-2">
            <span className="font-bold">L'institut Universitaire de Technologie de Douala</span>, lance son <span className="font-bold">concours d'entrée en niveau 1</span> qui aura lieu <span className="font-bold">mardi 11 janvier 2026</span>. A cet effet les différents candidats devrons s'acquitter de frais d'inscription pour passer les examens. Ils devrons à la banque payer des frais d'inscription à hauteur de <span className="font-bold">10 000 franc cfa</span> et des frais de prise en charge de dossier de <span className="font-bold">5 000 francs cfa</span>. La période de mise en condition s'étend du <span className="font-bold">30/06 au 20/07 2026</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectFilter({ label, options, value, onChange, className = '' }) {
  return (
    <div className={cx('flex flex-col gap-1 px-2', className)}>
      <span className="text-[10px] text-text-secondary">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="app-input h-8 text-xs py-0 pl-2 pr-6 bg-white border-border rounded-md"
      >
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}
