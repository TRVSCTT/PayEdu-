import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';

const RECEIPTS = [
  { id: 'is', title: 'Inscription spéciale' },
  { id: 't1', title: 'Tranche 1' },
  { id: 't2', title: 'Tranche 2' },
  { id: 'vm', title: 'Visite médicale' },
  { id: 'ce', title: 'Carte étudiant' },
];

export function UploadReceiptPage() {
  const navigate = useNavigate();
  const [selectedReceipts, setSelectedReceipts] = useState([]);

  const toggleReceipt = (id) => {
    setSelectedReceipts(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate('/apprenant/paiements/methode');
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
        
        {/* Progress bar - Step 2 */}
        <div className="flex space-x-1.5 mb-6 px-1">
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-[17px] font-medium text-gray-900">Joindre les quitus correspondant</h2>
        </div>

        {/* Receipts List */}
        <div className="space-y-3">
          {RECEIPTS.map(receipt => (
            <div 
              key={receipt.id} 
              onClick={() => toggleReceipt(receipt.id)}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="mr-4 flex-shrink-0">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedReceipts.includes(receipt.id) ? 'bg-black border-black' : 'border-gray-400 bg-white'}`}>
                  {selectedReceipts.includes(receipt.id) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-medium text-gray-900 leading-tight">{receipt.title}</h3>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <Download className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 mb-5">
          <button 
            onClick={handleContinue}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
