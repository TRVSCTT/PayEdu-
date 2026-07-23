import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';
import { caisseService } from '../../../services/caisseService';

export function AgendaPage() {
  const navigate = useNavigate();
  const [selectedPaiement, setSelectedPaiement] = useState(null);

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['caisse-queue'],
    queryFn: caisseService.getQueue,
  });

  const { days, weekTitle } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const weekDays = [];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push({
        name: dayNames[i],
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        fullDate: d
      });
    }
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    return { 
      days: weekDays, 
      weekTitle: `Cette semaine: du ${monday.getDate().toString().padStart(2, '0')} au ${sunday.getDate().toString().padStart(2, '0')} ${monthNames[sunday.getMonth()]} ${sunday.getFullYear()}` 
    };
  }, []);

  const calendarData = useMemo(() => {
    const data = {};
    queue.forEach(p => {
      const d = new Date(p.created_at);
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      const hour = d.getHours();
      let slotIndex = 0; // 09:00
      if (hour >= 11 && hour < 13) slotIndex = 1; // 11:00
      else if (hour >= 13 && hour < 16) slotIndex = 2; // 13:00
      else if (hour >= 16) slotIndex = 3; // 16:00
      
      const key = `${dayIndex}-${slotIndex}`;
      data[key] = (data[key] || 0) + 1;
      
      const totalKey = `${dayIndex}-total`;
      data[totalKey] = (data[totalKey] || 0) + 1;
    });
    return data;
  }, [queue]);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Retour">
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <h1 className="text-3xl font-bold text-text">RDV / Agenda</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-text hover:underline cursor-pointer">Voir les statistiques du jour</span>
          <button className={cx(buttonStyles({ variant: 'secondary' }), 'bg-white border-border hover:bg-gray-50 flex items-center gap-2')}>
            Repousser tous les rdv <ChevronDown className="w-4 h-4" />
          </button>
          <button className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90')}>
            Ajustement
          </button>
        </div>
      </div>

      {/* Filters and KPI row */}
      <div className="flex gap-4 items-end shrink-0">
        <div className="flex gap-2 h-[68px]">
          <div className="bg-white border border-border rounded-xl flex flex-col justify-center items-center px-6 min-w-[140px]">
            <span className="text-sm text-text-secondary mb-1">Temps restant</span>
            <span className="text-xl font-bold text-text">01:00:00</span>
          </div>
          <div className="bg-black text-white rounded-xl flex flex-col justify-center items-center px-6 min-w-[120px]">
            <span className="text-sm text-white/80 mb-1">Total restant</span>
            <span className="text-2xl font-bold">{queue.length}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-semibold text-text">Filtre</span>
            <button className="text-text-muted hover:text-text transition-colors flex items-center gap-1 text-xs">
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <SelectFilter label="File" options={['Tous']} />
            <SelectFilter label="Heure" options={['Toutes']} />
            <div className="flex gap-2 col-span-2">
              <SelectFilter label="Date" options={['Toutes']} className="flex-1" />
              <SelectFilter label="Mois" options={['Mois']} className="w-24" />
            </div>
            <SelectFilter label="Etablissement" options={['Tous']} />
            <SelectFilter label="Phase" options={['1']} />
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Col 1: Passage List */}
        <div className="w-[180px] border border-border rounded-2xl bg-white overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b border-border bg-white text-center">
            <h3 className="font-bold text-lg text-text">N° Passage</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
               <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : queue.length === 0 ? (
               <div className="p-4 text-center text-sm text-text-muted">Aucun rdv</div>
            ) : (
              queue.map((p, i) => (
                 <button 
                   key={p.id}
                   onClick={() => setSelectedPaiement(p)}
                   className={cx("w-full p-4 text-center text-sm font-semibold transition-colors", 
                   selectedPaiement?.id === p.id ? "bg-black text-white" : "bg-white text-text hover:bg-gray-50")}
                 >
                   {p.id.substring(0, 8).toUpperCase()}
                 </button>
              ))
            )}
          </div>
        </div>

        {/* Col 2: Info paiement */}
        <div className="w-[320px] border border-border rounded-2xl bg-white p-6 flex flex-col overflow-y-auto shrink-0">
          {!selectedPaiement ? (
            <div className="flex-1 flex items-center justify-center text-text-muted text-center text-sm">
              Sélectionnez un passage pour voir les détails
            </div>
          ) : (
            <>
              <h3 className="text-center text-sm font-medium text-text underline mb-6 underline-offset-4">Informations paiement</h3>
              <h4 className="text-center font-bold text-xl text-text mb-6">N° {selectedPaiement.id.substring(0, 8).toUpperCase()}</h4>
              
              <div className="space-y-4 text-center text-xs text-text font-semibold flex-1">
                <p>{`${selectedPaiement.apprenant_nom || ''} ${selectedPaiement.apprenant_prenom || ''}`.trim() || 'Nom non défini'}</p>
                <p>{selectedPaiement.etablissement_nom || 'Établissement non défini'}</p>
                <p>{selectedPaiement.apprenant_matricule || 'Matricule non défini'}</p>
                <p>{selectedPaiement.objet_paiement || 'Objet non défini'}</p>
                <p>{formatDate(selectedPaiement.created_at)}</p>
                <p>{selectedPaiement.ville_paiement || 'Lieu non défini'}</p>
                <p>{new Date(selectedPaiement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{formatMoney(selectedPaiement.montant)}</p>
                <p>Origine: {selectedPaiement.moyen_paiement || 'Non défini'}</p>
              </div>

              <div className="mt-8 text-center text-text-secondary text-sm font-medium mb-6">
                En attente de scanne
              </div>

              <div className="flex gap-4 mb-4">
                <button className={cx(buttonStyles({ variant: 'secondary' }), 'flex-1 bg-white border-border')}>Suivant</button>
                <button className={cx(buttonStyles({ variant: 'primary' }), 'flex-1 bg-black text-white hover:bg-black/90')}>Effectué</button>
              </div>
              <button className="text-sm font-medium text-text-secondary hover:text-text transition text-center w-full">Arrêter</button>
            </>
          )}
        </div>

        {/* Col 3: Calendar */}
        <div className="flex-1 border border-border rounded-2xl bg-white p-6 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-8 px-4">
            <button className="p-2 border border-border rounded-lg hover:bg-gray-50"><ChevronLeft className="w-5 h-5 text-text-secondary" /></button>
            <h2 className="text-lg text-text-secondary font-medium">{weekTitle}</h2>
            <button className="p-2 border border-border rounded-lg hover:bg-gray-50"><ChevronRight className="w-5 h-5 text-text-secondary" /></button>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
            <div className="grid grid-cols-[60px_1fr]">
              {/* Headers */}
              <div className="col-start-2 grid grid-cols-7 mb-4">
                {days.map((d, i) => (
                  <div key={i} className="text-center flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-text">{d.name}</span>
                    <span className="text-[10px] text-text-secondary">{d.date}</span>
                  </div>
                ))}
              </div>

              {/* Time labels + Grid body */}
              <div className="col-span-2 flex">
                {/* Left times */}
                <div className="w-[60px] flex flex-col">
                  {['09:00', '11:00', '13:00', '16:00'].map((t, i) => (
                    <div key={i} className="flex items-center justify-center text-xs font-semibold text-text h-16">{t}</div>
                  ))}
                  <div className="flex items-end justify-center text-xs font-semibold text-text h-20 pb-4">Total</div>
                </div>
                
                {/* Grid Box */}
                <div className="flex-1 border border-text rounded-2xl overflow-hidden grid grid-cols-7 bg-white">
                  {days.map((d, colIndex) => (
                    <div key={colIndex} className={cx("flex flex-col", colIndex < 6 ? "border-r border-border" : "")}>
                      {['09:00', '11:00', '13:00', '16:00'].map((t, rowIndex) => {
                        const count = calendarData[`${colIndex}-${rowIndex}`];
                        return (
                          <div key={rowIndex} className={cx("h-16 border-b border-border flex items-center justify-center font-bold text-lg", 
                            count ? "bg-black text-white" : ""
                          )}>
                            {count || ''}
                          </div>
                        )
                      })}
                      {/* Total cell */}
                      <div className="h-20 flex items-center justify-center font-bold text-xl text-text">
                        {calendarData[`${colIndex}-total`] || ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
        className="app-input h-9 text-xs py-0 pl-3 pr-8 bg-white border-border rounded-lg"
      >
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}
