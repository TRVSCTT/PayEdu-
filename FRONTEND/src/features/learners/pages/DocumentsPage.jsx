import { useState, useEffect } from 'react';
import { FileText, MoreVertical, Plus } from 'lucide-react';
import { paymentService } from '../../../services/paymentService';
import { fraisService } from '../../../services/fraisService';

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('Tout');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const tabs = ['Tout', 'Facture', 'Reçus', 'Importé', 'Quitus'];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [histData, fraisData] = await Promise.all([
          paymentService.obtenirHistorique(),
          fraisService.listerFrais()
        ]);
        
        const paiementsAcquittes = (histData || []).filter(p => p.statut === 'acquittee');
        
        // Les reçus (paiements acquittés)
        const recus = paiementsAcquittes.map(p => {
          const date = new Date(p.created_at);
          const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + 
                          date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

          return {
            id: `recu-${p.id}`,
            title: 'Paiement effectué',
            description: `Paiement de ${p.montant ? p.montant.toLocaleString('fr-FR') : '0'} FCFA (${p.objet_paiement})`,
            dateStr: dateStr,
            type: 'Reçus'
          };
        });

        // Les factures (frais non payés)
        const unpaidFrais = (fraisData || []).filter(f => !paiementsAcquittes.some(p => p.objet_paiement.includes(f.titre)));
        const factures = unpaidFrais.map(f => {
          return {
            id: `facture-${f.id}`,
            title: `Facture : ${f.titre}`,
            description: `Montant : ${f.montant ? f.montant.toLocaleString('fr-FR') : '0'} FCFA`,
            dateStr: `Échéance : ${new Date(f.date_echeance).toLocaleDateString('fr-FR')}`,
            type: 'Facture'
          };
        });

        // Historique récent non abouti (brouillon, attente caisse)
        const pending = (histData || []).filter(p => p.statut !== 'acquittee').map(p => {
          return {
            id: `pending-${p.id}`,
            title: 'Paiement en cours',
            description: `Tentative de ${p.montant ? p.montant.toLocaleString('fr-FR') : '0'} FCFA (${p.objet_paiement})`,
            dateStr: new Date(p.created_at).toLocaleDateString('fr-FR'),
            type: 'Facture'
          };
        });

        setDocuments([...recus, ...factures, ...pending]);
      } catch (error) {
        console.error("Erreur de récupération des documents", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = activeTab === 'Tout' 
    ? documents 
    : documents.filter(doc => doc.type === activeTab);

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] pb-24 font-sans relative">
      <div className="px-4 py-4 max-w-lg mx-auto">
        
        {/* Top Scrollable Tabs */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                activeTab === tab
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex justify-end mb-4">
          <button className="text-[13px] font-medium text-gray-800 hover:text-black">
            Sélectionner
          </button>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-4">Chargement de vos documents...</p>
          ) : filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 flex items-center border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 mr-4">
                  <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-medium text-gray-900 leading-tight truncate">
                    {doc.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 truncate mt-0.5">
                    {doc.description}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {doc.dateStr}
                  </p>
                </div>
                <button className="p-2 ml-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 text-gray-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">Aucun document trouvé pour cette catégorie.</p>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-white border border-gray-200 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-gray-50 transition-colors z-40">
        <Plus className="w-6 h-6 text-black" strokeWidth={1.5} />
      </button>

    </div>
  );
}
