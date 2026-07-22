import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';
import { paymentService } from '../../../services/paymentService';

export function HistoryPage() {
  const [historique, setHistorique] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const histData = await paymentService.obtenirHistorique();
        setHistorique(histData || []);
      } catch (error) {
        console.error("Erreur chargement historique", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}   ${hours}h${minutes}`;
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-4">Chargement de l'historique...</p>
          ) : historique.length > 0 ? (
            historique.map((payment) => (
              <div 
                key={payment.id} 
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center cursor-pointer hover:border-gray-300 transition-colors"
              >
                <div className="mr-4 flex-shrink-0">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-[16px] font-medium text-gray-900 leading-tight">Facture</h3>
                  <p className="text-[13px] text-gray-600 mt-0.5 truncate">
                    Paiement de {payment.montant_total?.toLocaleString('fr-FR')} FCFA... ({payment.objet_paiement})
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {formatDate(payment.created_at || new Date().toISOString())}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            // Mock entry if no history, to show the UI
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center cursor-pointer hover:border-gray-300 transition-colors">
              <div className="mr-4 flex-shrink-0">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-[16px] font-medium text-gray-900 leading-tight">Facture</h3>
                <p className="text-[13px] text-gray-600 mt-0.5 truncate">
                  Paiement de 350 000 FCFA... (2frais)
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  30 sept. 2026   20h40
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
