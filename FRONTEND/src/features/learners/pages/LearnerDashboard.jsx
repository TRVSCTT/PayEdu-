import { Link } from 'react-router-dom';

export function LearnerDashboard() {
  return (
    <div className="px-6 py-2 space-y-8 max-w-lg mx-auto">
      {/* Black Card: Immediate Payment */}
      <div className="bg-[#0a0a0a] text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        <p className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">PAIEMENT IMMEDIAT</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">350 000 FCFA</h2>
        <div className="inline-block bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          Dans 20 jours
        </div>
        <p className="text-sm text-gray-300 mb-6">Pension - 1ère tranche  15 oct. 2026</p>
        <Link 
          to="/apprenant/paiements/nouveau"
          className="block w-full bg-white text-black text-center font-medium py-3.5 rounded-xl text-lg hover:bg-gray-100 transition-colors"
        >
          Payer maintenant
        </Link>
      </div>

      {/* Période de paiement */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-medium text-gray-900">Période de paiement</h3>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Voir tout</a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-1">INSCRIPTION</p>
              <p className="text-sm font-medium text-gray-900 leading-tight mb-2">INSCRIPTION SPECIALE</p>
              <p className="text-[10px] text-gray-500 mb-3">Échéance 30 sept. 2026</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">5 000 FCA</p>
            </div>
            <span className="inline-block bg-black text-white text-[10px] px-3 py-1 rounded-full self-start font-medium">Réglé</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-1">PENSION</p>
              <p className="text-sm font-medium text-gray-900 leading-tight mb-2">TRANCHE 1</p>
              <p className="text-[10px] text-gray-500 mb-3">Échéance 30 sept. 2026</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">350 000 FCFA</p>
            </div>
            <span className="inline-block bg-black text-white text-[10px] px-3 py-1 rounded-full self-start font-medium">Réglé</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-1">PENSION</p>
              <p className="text-sm font-medium text-gray-900 leading-tight mb-2">TRANCHE 2</p>
              <p className="text-[10px] text-gray-500 mb-3">Échéance 30 sept. 2026</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">200 000 FCFA</p>
            </div>
            <span className="inline-block bg-black text-white text-[10px] px-3 py-1 rounded-full self-start font-medium">En attente</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-1">VISITE MEDICALE</p>
              <p className="text-sm font-medium text-gray-900 leading-tight mb-2">VISITE MEDICALE</p>
              <p className="text-[10px] text-gray-500 mb-3">Échéance 30 sept. 2026</p>
              <p className="text-lg font-semibold text-gray-900 mb-3">5 000 FCFA</p>
            </div>
            <span className="inline-block bg-black text-white text-[10px] px-3 py-1 rounded-full self-start font-medium">En attente</span>
          </div>
        </div>
      </section>

      {/* Derniers paiements */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-medium text-gray-900">Derniers paiements</h3>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Voir tout</a>
        </div>
        <div className="space-y-3">
          {/* Item 1 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0">
                IS
              </div>
              <div>
                <p className="text-[15px] font-medium text-gray-900">Inscription spéciale</p>
                <div className="flex items-center text-[11px] text-gray-500 space-x-2 mt-0.5">
                  <span>30 sept. 2026</span>
                  <span>PAY-2026123456</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-medium text-gray-900">5 000 FCFA</p>
              <p className="text-[11px] text-gray-500 flex items-center justify-end mt-0.5">
                <span className="w-1 h-1 bg-black rounded-full mr-1.5"></span>
                En attente
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0">
                P1
              </div>
              <div>
                <p className="text-[15px] font-medium text-gray-900">Pension tranche 1</p>
                <div className="flex items-center text-[11px] text-gray-500 space-x-2 mt-0.5">
                  <span>30 sept. 2026</span>
                  <span>PAY-2026123456</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-medium text-gray-900">350 000 FCFA</p>
              <p className="text-[11px] text-gray-500 flex items-center justify-end mt-0.5">
                <span className="w-1 h-1 bg-black rounded-full mr-1.5"></span>
                En attente
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
