import { useNavigate, useLocation } from 'react-router-dom';

export function TopNavTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // On détermine quel onglet est actif en fonction du path
  // Payer (par défaut /apprenant/paiements/...)
  // Portefeuille (/apprenant/portefeuille)
  // Histoire (/apprenant/histoire)
  // RDV (/apprenant/rdv)
  
  const currentPath = location.pathname;
  
  const isPayerActive = currentPath.includes('/paiements/');
  const isPortefeuilleActive = currentPath.includes('/portefeuille');
  const isHistoireActive = currentPath.includes('/histoire');
  const isRdvActive = currentPath.includes('/rdv');

  return (
    <div className="flex bg-white rounded-2xl border border-gray-200 p-1.5 mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <button 
        onClick={() => navigate('/apprenant/paiements/nouveau')}
        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${isPayerActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        Payer
      </button>
      <button 
        onClick={() => navigate('/apprenant/portefeuille')}
        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${isPortefeuilleActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        Portefeuille
      </button>
      <button 
        onClick={() => navigate('/apprenant/histoire')}
        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${isHistoireActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        Histoire
      </button>
      <button 
        onClick={() => navigate('/apprenant/rdv')}
        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${isRdvActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        RDV
      </button>
    </div>
  );
}
