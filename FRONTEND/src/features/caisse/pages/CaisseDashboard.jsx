import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { PageHeader, cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';
import { caisseService } from '../../../services/caisseService';
import { formatMoney } from '../../../utils/formatters';

export function CaisseDashboard() {
  const navigate = useNavigate();
  const [filterEtab, setFilterEtab] = useState('Tous');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['caisse-stats'],
    queryFn: caisseService.getStats
  });

  const chartData = stats?.volume_par_etablissement || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <PageHeader
          title="Dashboard"
          description="Vue d'ensemble des encaissements et validations"
        />
        <button className={buttonStyles({ variant: 'primary' })}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard 
              title="Enregistrement du jour" 
              value={formatMoney(stats?.total_encaisse || 0)} 
              sub={`${stats?.valides || 0} enregistrements`} 
            />
            <KpiCard 
              title="En attente" 
              value={`${stats?.en_attente || 0}`} 
              sub="Enregistrements / Files" 
            />
            <KpiCard 
              title="Enregistrement validé" 
              value={`${stats?.valides || 0}`} 
              sub="Messagerie" 
            />
            <KpiCard 
              title="Distribution du jour" 
              value={`${stats?.distribution_jour || 0}`} 
              sub="Absents" 
            />
          </section>

          {/* Filters */}
          <section className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-text">Filtre</span>
              <button className="text-text-muted hover:text-text transition-colors flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Réinitialiser
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectFilter label="Établissement" value={filterEtab} onChange={setFilterEtab} options={['Tous', 'IUT Douala', 'Université Yde 1']} />
              <SelectFilter label="Phase de paiement" options={['Toutes', 'Tranche 1', 'Tranche 2']} />
              <SelectFilter label="Ville" options={['Toutes', 'Douala', 'Yaoundé']} />
              <div className="flex gap-2">
                <SelectFilter label="Date" options={['Toutes', "Aujourd'hui"]} className="flex-1" />
                <SelectFilter label="Mois" options={['Mois', 'Janvier']} className="w-24" />
              </div>
            </div>
          </section>

          {/* Main Content Area */}
          <section className="grid gap-6 lg:grid-cols-12 items-start">
            
            {/* Left Column: Total Gain & Actions */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-text text-white p-6 rounded-2xl shadow-sm text-center">
                <p className="text-sm text-white/70 font-medium mb-1">Total gain</p>
                <h3 className="text-2xl font-bold tracking-tight">{formatMoney(stats?.total_encaisse || 0)}</h3>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-text mb-3">Accès rapide</p>
                <button onClick={() => navigate('/caisse/acteurs')} className={cx(buttonStyles({ variant: 'secondary', block: true }), 'justify-center border-border hover:bg-gray-50')}>Acteur paiement</button>
                <button onClick={() => navigate('/caisse/agenda')} className={cx(buttonStyles({ variant: 'secondary', block: true }), 'justify-center border-border hover:bg-gray-50')}>RDV / Agenda</button>
                <button onClick={() => navigate('/caisse/rapports')} className={cx(buttonStyles({ variant: 'secondary', block: true }), 'justify-center border-border hover:bg-gray-50')}>Stats et rapport</button>
                <button onClick={() => navigate('/caisse/etablissement')} className={cx(buttonStyles({ variant: 'secondary', block: true }), 'justify-center border-border hover:bg-gray-50')}>Gestion établissement</button>
                <button onClick={() => navigate('/caisse/messagerie')} className={cx(buttonStyles({ variant: 'secondary', block: true }), 'justify-center border-border hover:bg-gray-50')}>Messagerie</button>
              </div>
            </div>

            {/* Middle Column: Chart */}
            <div className={cx(cardStyles('p-6'), 'lg:col-span-6 h-[400px] flex flex-col')}>
              <h3 className="text-center font-medium text-text mb-6">Volume paiement par établissement</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={true} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6B7280' }} 
                    />
                    <YAxis 
                      axisLine={true} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6B7280' }} 
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => formatMoney(value)}
                    />
                    <Bar dataKey="pv" fill="#111827" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[10px] text-text-muted flex justify-between">
                <span>0</span>
                <span>V.Paiements / Université</span>
              </div>
            </div>

            {/* Right Column: Lists */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Etablissements List */}
              <div className={cx(cardStyles('p-0 overflow-hidden'))}>
                <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-gray-50/50">
                  <span className="text-xs font-semibold text-text">Etablissements</span>
                  <span className="text-xs font-semibold text-text">Nbre étudiants</span>
                </div>
                <div className="divide-y divide-border">
                  {chartData.map((etab, i) => (
                    <ListItem key={i} name={etab.name} count="Actif" />
                  ))}
                </div>
              </div>

              {/* Gains Progress */}
              <div className={cx(cardStyles('p-4'))}>
                <div className="text-center mb-4">
                  <h3 className="text-sm font-semibold text-text">Gain par établissement</h3>
                  <p className="text-xs text-text-muted">Ce mois</p>
                </div>
                <div className="space-y-4">
                  {chartData.map((etab, i) => (
                    <ProgressItem key={i} name={etab.name} percent={etab.pv > 0 ? 100 : 0} />
                  ))}
                </div>
              </div>

            </div>

          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value, sub }) {
  return (
    <div className={cardStyles('p-5 flex flex-col justify-center')}>
      <h4 className="text-sm text-text-secondary font-medium mb-2">{title}</h4>
      <p className="text-2xl font-bold text-text mb-1">{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
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

function ListItem({ name, count }) {
  return (
    <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors">
      <span className="text-xs text-text">{name}</span>
      <span className="text-xs text-text-secondary">{count}</span>
    </div>
  );
}

function ProgressItem({ name, percent }) {
  return (
    <div>
      <span className="text-xs text-text mb-1 block">{name}</span>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-text rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
