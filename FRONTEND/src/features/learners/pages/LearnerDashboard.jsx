import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentService } from '../../../services/paymentService';
import { fraisService } from '../../../services/fraisService';

export function LearnerDashboard() {
  const [historique, setHistorique] = useState([]);
  const [frais, setFrais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histData, fraisData] = await Promise.all([
          paymentService.obtenirHistorique(),
          fraisService.listerFrais()
        ]);
        setHistorique(histData || []);
        setFrais(fraisData || []);
      } catch (error) {
        console.error("Erreur chargement dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Déterminer le prochain paiement (le premier frais non payé)
  // Simplification : si on trouve un frais dont le titre n'est pas dans l'historique "acquittee"
  const paiementsAcquittes = historique.filter(p => p.statut === 'acquittee');
  const prochainFrais = frais.find(f => !paiementsAcquittes.some(p => p.objet_paiement.includes(f.titre)));

  if (isLoading) {
    return <div className="p-8 text-center">Chargement de votre espace...</div>;
  }
  return (
    <div className="px-6 py-2 space-y-8 max-w-lg mx-auto">
      {/* Black Card: Immediate Payment */}
      {prochainFrais ? (
        <div className="bg-[#0a0a0a] text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">PAIEMENT IMMEDIAT</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {prochainFrais.montant.toLocaleString('fr-FR')} FCFA
          </h2>
          <div className="inline-block bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            Échéance : {new Date(prochainFrais.date_echeance).toLocaleDateString('fr-FR')}
          </div>
          <p className="text-sm text-gray-300 mb-6">{prochainFrais.titre}</p>
          <Link 
            to="/apprenant/paiements/nouveau"
            className="block w-full bg-white text-black text-center font-medium py-3.5 rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            Payer maintenant
          </Link>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Tout est à jour ! </h2>
          <p className="text-sm text-gray-300 mb-6">Vous n'avez aucun frais en attente de paiement.</p>
          <Link 
            to="/apprenant/paiements/nouveau"
            className="block w-full border border-gray-700 text-white text-center font-medium py-3.5 rounded-xl text-lg hover:bg-gray-900 transition-colors"
          >
            Faire un paiement libre
          </Link>
        </div>
      )}

      {/* Période de paiement */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-medium text-gray-900">Période de paiement</h3>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Voir tout</a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {frais.length > 0 ? frais.map((item, index) => {
            const isPaye = paiementsAcquittes.some(p => p.objet_paiement.includes(item.titre));
            return (
              <div key={item.id || index} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mb-1">{item.code}</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mb-2">{item.titre}</p>
                  <p className="text-[10px] text-gray-500 mb-3">
                    Échéance {new Date(item.date_echeance).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mb-3">
                    {item.montant.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                <span className={`inline-block text-[10px] px-3 py-1 rounded-full self-start font-medium ${isPaye ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {isPaye ? 'Réglé' : 'En attente'}
                </span>
              </div>
            );
          }) : (
            <p className="text-sm text-gray-500 col-span-2">Aucun frais défini par l'établissement.</p>
          )}
        </div>
      </section>

      {/* Derniers paiements */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-medium text-gray-900">Derniers paiements</h3>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Voir tout</a>
        </div>
        <div className="space-y-3">
          {historique.length > 0 ? historique.slice(0, 5).map((paiement) => (
            <div key={paiement.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0">
                  {paiement.objet_paiement ? paiement.objet_paiement.substring(0, 2).toUpperCase() : 'P'}
                </div>
                <div>
                  <p className="text-[15px] font-medium text-gray-900 max-w-[150px] truncate">{paiement.objet_paiement}</p>
                  <div className="flex items-center text-[11px] text-gray-500 space-x-2 mt-0.5">
                    <span>{new Date(paiement.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>{paiement.reference_transaction || '---'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-medium text-gray-900">{paiement.montant.toLocaleString('fr-FR')} FCFA</p>
                <p className="text-[11px] text-gray-500 flex items-center justify-end mt-0.5">
                  <span className={`w-1 h-1 rounded-full mr-1.5 ${paiement.statut === 'acquittee' ? 'bg-green-500' : (paiement.statut.includes('attente') ? 'bg-orange-500' : 'bg-black')}`}></span>
                  {paiement.statut}
                </p>
              </div>
            </div>
          )) : (
             <p className="text-sm text-gray-500">Aucun paiement récent.</p>
          )}
        </div>
      </section>
    </div>
  );
}
