import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';
import { walletService } from '../../../services/walletService';

export function WalletPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await walletService.getPaymentMethods();
        setMethods(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMethods();
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        {/* Saved Payment Methods Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-4 text-sm text-gray-500">Chargement de votre portefeuille...</div>
          ) : methods.length > 0 ? (
            methods.map((method) => (
            <div 
              key={method.id} 
              className="bg-black text-white p-4 rounded-xl relative shadow-md flex flex-col justify-between aspect-[1.8/1]"
            >
              <div className="absolute top-3 right-3">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-[17px] font-medium tracking-wide mt-1">{method.fournisseur}</h3>
              <div>
                <p className="text-[13px] font-medium opacity-90 mb-1 tracking-wider">{method.numero_masque}</p>
                <p className="text-[11px] text-gray-400">{method.nom_titulaire}</p>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-2 text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-sm">Aucun moyen de paiement enregistré.</p>
            </div>
          )}
        </div>

        {/* Add button */}
        <div className="mt-8 flex justify-end pr-2">
          <button 
            onClick={() => navigate('/apprenant/portefeuille/nouveau')}
            className="text-[15px] font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <span>+ Ajouter</span>
          </button>
        </div>

      </div>
    </div>
  );
}
