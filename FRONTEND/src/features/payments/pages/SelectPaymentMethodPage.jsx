import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, CreditCard } from 'lucide-react';

export function SelectPaymentMethodPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('mobile');

  const handleContinue = () => {
    navigate('/apprenant/paiements/options');
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
        
        {/* Progress bar - Step 3 */}
        <div className="flex space-x-1.5 mb-6 px-1">
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-black rounded-full"></div>
          <div className="h-1.5 flex-1 bg-white rounded-full border border-gray-300"></div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-[17px] font-medium text-gray-900">Choisissez un moyen de paiement</h2>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          
          {/* Mobile */}
          <div 
            onClick={() => setSelectedMethod('mobile')}
            className={`bg-white p-5 rounded-2xl border flex items-center cursor-pointer transition-colors shadow-sm ${selectedMethod === 'mobile' ? 'border-gray-400' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="mr-5 flex-shrink-0">
              <Phone className="w-6 h-6 fill-black" strokeWidth={0} />
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-medium text-gray-900">Mobile</h3>
            </div>
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedMethod === 'mobile' ? 'border-black' : 'border-gray-400'}`}>
                {selectedMethod === 'mobile' && <div className="w-3 h-3 bg-black rounded-full"></div>}
              </div>
            </div>
          </div>

          {/* Carte VISA */}
          <div 
            onClick={() => setSelectedMethod('visa')}
            className={`bg-white p-5 rounded-2xl border flex items-center cursor-pointer transition-colors shadow-sm ${selectedMethod === 'visa' ? 'border-gray-400' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="mr-5 flex-shrink-0">
              <CreditCard className="w-6 h-6 text-black fill-black" strokeWidth={0} />
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-medium text-gray-900">Carte VISA</h3>
            </div>
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedMethod === 'visa' ? 'border-black' : 'border-gray-400'}`}>
                {selectedMethod === 'visa' && <div className="w-3 h-3 bg-black rounded-full"></div>}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 mb-5">
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
