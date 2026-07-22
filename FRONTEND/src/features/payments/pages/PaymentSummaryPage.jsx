import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentSummaryPage() {
  const navigate = useNavigate();

  const handlePay = () => {
    toast.success('Paiement initié avec succès !');
    // Redirection vers le tableau de bord ou vers une page de succès
    navigate('/apprenant');
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        {/* Top Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-200 p-1.5 mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-medium">Payer</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Portefeuille</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Histoire</button>
          <button className="flex-1 text-gray-600 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">RDV</button>
        </div>
        
        {/* Progress bar - Step 4/4 */}
        <div className="flex space-x-1.5 mb-6 px-1">
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-[17px] font-medium text-gray-900">Récapitulatif</h2>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-700">Bénéficiaire</span>
              <span className="text-[16px] font-medium text-gray-900">IUT de douala</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-700">Payeur</span>
              <span className="text-[16px] font-medium text-gray-900">Jack Essomba</span>
            </div>

            {/* Inset Black Card */}
            <div className="bg-black text-white rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium">Inscription - Tranche 1</p>
                  <p className="text-xl font-semibold mt-0.5">350 000 FCFA</p>
                  <p className="text-xs text-gray-300 mt-2 hover:text-white cursor-pointer transition-colors">
                    Afficher les détails
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[16px] text-gray-700">Moyen</span>
              <span className="text-[16px] font-medium text-gray-900">OM</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-700">Date</span>
              <span className="text-[16px] font-medium text-gray-900">30 sept 2026</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-700">Lieu</span>
              <span className="text-[16px] font-medium text-gray-900">Douala</span>
            </div>
          </div>
          
          {/* Total Section */}
          <div className="border-t border-gray-200 p-5 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <span className="text-[18px] text-gray-900">Total</span>
              <span className="text-[18px] font-medium text-gray-900">350 000 FCFA</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <button 
          onClick={handlePay}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Payer 350 000 FCFA
        </button>

      </div>
    </div>
  );
}
