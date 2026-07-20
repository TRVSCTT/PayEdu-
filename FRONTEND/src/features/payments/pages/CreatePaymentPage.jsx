import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const FEES = [
  { id: 'is', title: 'Inscription spéciale', date: '30 sept 2026', amount: 5000 },
  { id: 'p1', title: 'Pension - Tranche 1', date: '30 sept 2026', amount: 350000 },
  { id: 'p2', title: 'Pension - Tranche 2', date: '10 fev 2027', amount: 200000 },
  { id: 'vm', title: 'Visite médicale', date: '30 sept 2026', amount: 5000 },
  { id: 'ce', title: 'Carte étudiant', date: '30 sept 2026', amount: 5000 },
];

export function CreatePaymentPage() {
  const navigate = useNavigate();
  const [selectedFees, setSelectedFees] = useState([]);

  const toggleFee = (id) => {
    setSelectedFees(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const totalAmount = selectedFees.reduce((sum, id) => {
    const fee = FEES.find(f => f.id === id);
    return sum + (fee ? fee.amount : 0);
  }, 0);

  const handleContinue = () => {
    navigate('/apprenant/paiements/quitus', { state: { totalAmount, selectedFees } });
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        {/* Top Tabs (Payer, Portefeuille, Histoire, RDV) */}
        <div className="flex bg-white rounded-2xl border border-gray-200 p-1.5 mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-medium">Payer</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Portefeuille</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Histoire</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">RDV</button>
        </div>
        
        {/* Progress bar */}
        <div className="flex space-x-1.5 mb-6 px-1">
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-[17px] font-medium text-gray-900">Choix des frais à payer</h2>
        </div>

        {/* Fees List */}
        <div className="space-y-3">
          {FEES.map(fee => (
            <div 
              key={fee.id} 
              onClick={() => toggleFee(fee.id)}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="mr-4 flex-shrink-0">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedFees.includes(fee.id) ? 'bg-black border-black' : 'border-gray-400 bg-white'}`}>
                  {selectedFees.includes(fee.id) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-medium text-gray-900 leading-tight">{fee.title}</h3>
                <p className="text-[12px] text-gray-500 mt-1">Échéance {fee.date}</p>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <p className="text-[15px] font-medium text-gray-900">{fee.amount.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 mb-5 flex justify-between items-center px-1">
          <span className="text-[17px] font-medium text-gray-900">Total sélectionné</span>
          <span className="text-[17px] font-medium text-gray-900">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
        </div>

        <button 
          onClick={handleContinue}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
