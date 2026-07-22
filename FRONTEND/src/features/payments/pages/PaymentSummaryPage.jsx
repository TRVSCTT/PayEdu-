import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Delete } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentContext } from './../context/PaymentContext';
import { paymentService } from '../../../services/paymentService';

export function PaymentSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentData } = usePaymentContext();
  
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default to orange (4 digits) if no operator passed
  const operator = location.state?.operator?.toLowerCase() || paymentData.moyen_paiement || 'orange';
  const pinLength = operator.includes('mtn') ? 5 : 4;

  useEffect(() => {
    const fetchSummary = async () => {
      if (!paymentData.paiement_id) return;
      try {
        const data = await paymentService.obtenirRecapitulatif(paymentData.paiement_id);
        setSummaryData(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération du récapitulatif");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [paymentData.paiement_id]);

  const handlePayClick = () => {
    setShowSecurityModal(true);
  };

  const handleKeypadPress = async (val) => {
    if (val === 'delete') {
      setPinCode(prev => prev.slice(0, -1));
    } else {
      if (pinCode.length < pinLength) {
        const newPin = pinCode + val;
        setPinCode(newPin);
        
        // Auto submit if required digits reached
        if (newPin.length === pinLength) {
          try {
            // Convert to string of appropriate length
            const response = await paymentService.autoriserPaiement(paymentData.paiement_id, {
              code_totp: newPin.padStart(pinLength, '0') // backend allows 4 to 6 chars
            });
            
            setShowSecurityModal(false);
            if (response.payment_url) {
               window.location.href = response.payment_url;
            } else {
               navigate('/apprenant/paiements/succes');
            }
          } catch (error) {
             setPinCode('');
             toast.error(error.response?.data?.detail || "Code de sécurité invalide");
          }
        }
      }
    }
  };

  if (isLoading && paymentData.paiement_id) {
    return <div className="flex items-center justify-center min-h-screen text-black">Chargement du récapitulatif...</div>;
  }

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
                  <p className="text-sm font-medium">{summaryData ? summaryData.objet_paiement : paymentData.objet_paiement}</p>
                  <p className="text-xl font-semibold mt-0.5">{summaryData ? summaryData.montant : paymentData.montant_total} FCFA</p>
                  <p className="text-xs text-gray-300 mt-2 hover:text-white cursor-pointer transition-colors">
                    Afficher les détails
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[16px] text-gray-700">Moyen</span>
              <span className="text-[16px] font-medium text-gray-900">{summaryData ? summaryData.moyen_paiement : paymentData.moyen_paiement}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-gray-700">Date</span>
              <span className="text-[16px] font-medium text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span>
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
              <span className="text-[18px] font-medium text-gray-900">{summaryData ? summaryData.montant : paymentData.montant_total} FCFA</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <button 
          onClick={handlePayClick}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Payer {summaryData ? summaryData.montant : paymentData.montant_total} FCFA
        </button>

      </div>

      {/* Security Modal Overlay */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-2xl font-medium text-center text-gray-900 mb-8">Sécurité</h3>
            
            {/* PIN Inputs */}
            <div className="flex justify-center space-x-2 mb-10">
              {Array.from({ length: pinLength }).map((_, index) => (
                <div 
                  key={index} 
                  className={`w-10 h-10 sm:w-12 sm:h-12 border ${pinCode.length > index ? 'border-black bg-black' : 'border-gray-400 bg-white'} rounded-xl flex items-center justify-center transition-all`}
                >
                  {/* Optionnel: masquer le point avec un delay ou juste afficher rempli */}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 max-w-[240px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeypadPress(num.toString())}
                  className="w-14 h-14 rounded-full border border-gray-900 flex items-center justify-center text-2xl font-medium text-gray-900 mx-auto hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  {num}
                </button>
              ))}
              <div className="col-start-2">
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="w-14 h-14 rounded-full border border-gray-900 flex items-center justify-center text-2xl font-medium text-gray-900 mx-auto hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  0
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleKeypadPress('delete')}
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <Delete className="w-8 h-8 fill-black text-white" strokeWidth={1} />
                </button>
              </div>
            </div>
            
            {/* Close button (optional, for UX to cancel) */}
            <div className="mt-8 text-center">
              <button 
                onClick={() => setShowSecurityModal(false)}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
