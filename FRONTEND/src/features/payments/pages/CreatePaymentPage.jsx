import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { usePaymentContext } from './../context/PaymentContext';
import { fraisService } from '../../../services/fraisService';
import { paymentService } from '../../../services/paymentService';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';

export function CreatePaymentPage() {
  const navigate = useNavigate();
  const { updatePaymentData } = usePaymentContext();
  const [selectedFees, setSelectedFees] = useState([]);
  const [availableFees, setAvailableFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const [fraisData, histData] = await Promise.all([
          fraisService.listerFrais(),
          paymentService.obtenirHistorique()
        ]);
        
        // Filtrer les frais qui sont déjà payés ("acquittee")
        const paiementsAcquittes = (histData || []).filter(p => p.statut === 'acquittee');
        const unpaidFees = (fraisData || []).filter(f => !paiementsAcquittes.some(p => p.objet_paiement.includes(f.titre)));
        
        setAvailableFees(unpaidFees);
      } catch (error) {
        console.error("Erreur chargement des frais", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFees();
  }, []);

  const toggleFee = (id) => {
    setSelectedFees(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const totalAmount = selectedFees.reduce((sum, id) => {
    const fee = availableFees.find(f => f.id === id);
    return sum + (fee ? fee.montant : 0);
  }, 0);

  const handleContinue = () => {
    // Set the chosen fees in context
    const objetPaiement = selectedFees.map(id => availableFees.find(f => f.id === id)?.titre).join(', ');
    updatePaymentData({
      objet_paiement: objetPaiement || 'Frais de scolarité',
      montant_total: totalAmount
    });
    
    navigate('/apprenant/paiements/quitus', { state: { totalAmount, selectedFees } });
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        {/* Top Tabs */}
        <TopNavTabs />
        
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
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-4">Chargement des frais...</p>
          ) : availableFees.length > 0 ? (
            availableFees.map(fee => (
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
                  <h3 className="text-[15px] font-medium text-gray-900 leading-tight">{fee.titre}</h3>
                  <p className="text-[12px] text-gray-500 mt-1">Échéance {new Date(fee.date_echeance).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <p className="text-[15px] font-medium text-gray-900">{fee.montant.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">Vous n'avez aucun frais en attente de paiement.</p>
          )}
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
