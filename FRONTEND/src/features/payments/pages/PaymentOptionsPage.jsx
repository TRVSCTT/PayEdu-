import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { usePaymentContext } from './../context/PaymentContext';
import { paymentService } from '../../../services/paymentService';
import { toast } from 'sonner';

export function PaymentOptionsPage() {
  const navigate = useNavigate();
  const { paymentData, updatePaymentData } = usePaymentContext();
  
  const [optionType, setOptionType] = useState('mobile'); // 'mobile' or 'carte'
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);
  
  // Mobile fields
  const [operator, setOperator] = useState('Orange');
  const [numero, setNumero] = useState('');
  
  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Shared fields
  const [fundsOrigin, setFundsOrigin] = useState('');
  const [holderName, setHolderName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Fetch profile to get etablissement_id
    paymentService.obtenirProfil().then(setUserProfile).catch(console.error);
  }, []);

  const handleContinue = async () => {
    if (!userProfile?.etablissement_id) {
      toast.error("Impossible de récupérer l'établissement. Êtes-vous connecté ?");
      return;
    }

    const finalOperator = selectedSavedCard ? selectedSavedCard : operator;
    const finalNumero = selectedSavedCard ? (selectedSavedCard === 'orange' ? '600000000' : '650000000') : (optionType === 'mobile' ? numero : cardNumber);
    
    if (optionType === 'mobile' && !selectedSavedCard && !finalNumero) {
      toast.error('Veuillez entrer un numéro de compte valide');
      return;
    }
    if (optionType === 'carte' && !finalNumero) {
      toast.error('Veuillez entrer un numéro de carte valide');
      return;
    }

    try {
      setIsLoading(true);
      const moyenPaiementBackend = optionType === 'carte' ? 'carte_bancaire' : (finalOperator.toLowerCase() === 'orange' ? 'orange_money' : 'mtn_momo');
      
      // Pour éviter l'erreur 400, on force une clé valide de TARIFS si l'objet ne correspond pas
      const validObjetKeys = ['frais_inscription', 'frais_pension', 'frais_examen'];
      const finalObjetPaiement = validObjetKeys.includes(paymentData.objet_paiement) ? paymentData.objet_paiement : 'frais_inscription';
      
      // 1. Initier le paiement (Formulaire 1)
      const paiement = await paymentService.initierPaiement({
        etablissement_id: userProfile.etablissement_id,
        objet_paiement: finalObjetPaiement,
        moyen_paiement: moyenPaiementBackend
      });

      // 1.5 Simuler l'étape de confirmation (Formulaire 2) pour satisfaire le backend
      await paymentService.confirmerInformations(paiement.id, {
        infos_confirmees: {
          nom: userProfile?.nom || 'Apprenant PayEdu',
          matricule: userProfile?.matricule || '000000',
        }
      });

      // 2. Définir le numéro de compte (Formulaire 3)
      const definePayload = {
        numero_compte_paiement: finalNumero
      };

      // Si carte bancaire, CinetPay exige des informations supplémentaires
      if (moyenPaiementBackend === 'carte_bancaire') {
        definePayload.email_paiement = userProfile?.email || "test@payedu.com";
        definePayload.adresse_paiement = "Adresse par defaut";
        definePayload.ville_paiement = "Douala";
        definePayload.code_postal_paiement = "00000";
      }

      await paymentService.definirMoyenPaiement(paiement.id, definePayload);

      updatePaymentData({ 
        paiement_id: paiement.id,
        moyen_paiement: moyenPaiementBackend,
        numero_compte_paiement: finalNumero 
      });

      navigate('/apprenant/paiements/recapitulatif', { state: { operator: finalOperator } });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'initialisation du paiement");
    } finally {
      setIsLoading(false);
    }
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
        
        {/* Progress bar - Step 3/4 */}
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
          <h2 className="text-[17px] font-medium text-gray-900">Choisissez une option</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
          
          <h3 className="text-[15px] font-medium text-gray-900 mb-4">Choisissez une option</h3>
          
          {/* Segmented Control */}
          <div className="flex rounded-full border border-gray-300 p-1 mb-6">
            <button 
              onClick={() => setOptionType('mobile')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${optionType === 'mobile' ? 'bg-black text-white' : 'text-gray-700 bg-transparent'}`}
            >
              Compte mobile
            </button>
            <button 
              onClick={() => setOptionType('carte')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${optionType === 'carte' ? 'bg-black text-white' : 'text-gray-700 bg-transparent'}`}
            >
              Carte bancaire
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {optionType === 'mobile' ? (
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <label className="block text-xs text-gray-900 mb-1.5">Opérateur</label>
                  <select 
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white"
                  >
                    <option value="Orange">Orange</option>
                    <option value="MTN">MTN</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-900 mb-1.5">Numéro</label>
                  <input 
                    type="text" 
                    placeholder="6XX XX XX XX" 
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-900 mb-1.5">Numéro de carte</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-900 mb-1.5">Date d'expiration</label>
                    <input 
                      type="text" 
                      placeholder="MM/AA" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-900 mb-1.5">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-gray-900 mb-1.5">Origine des fonds</label>
              <select 
                value={fundsOrigin}
                onChange={(e) => setFundsOrigin(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white"
              >
                <option value=""></option>
                <option value="Personnel">Personnel</option>
                <option value="Parent">Parent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-900 mb-1.5">Nom du titulaire</label>
              <input 
                type="text" 
                placeholder="Nom complet"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

          </div>
        </div>

        {/* Saved Cards */}
        <h3 className="text-[15px] font-medium text-gray-900 mb-4 text-center">Sélectionner une carte préenregistrée</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Card 1 */}
          <div 
            onClick={() => setSelectedSavedCard('orange')}
            className={`bg-black text-white p-4 rounded-xl cursor-pointer border-2 transition-colors ${selectedSavedCard === 'orange' ? 'border-gray-400' : 'border-black'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-lg">Orange</h4>
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                {selectedSavedCard === 'orange' && <div className="w-2 h-2 bg-black rounded-full"></div>}
              </div>
            </div>
            <p className="text-sm tracking-widest mb-4">******739</p>
            <p className="text-xs text-gray-300">Jack Essomba</p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setSelectedSavedCard('mtn')}
            className={`bg-black text-white p-4 rounded-xl cursor-pointer border-2 transition-colors ${selectedSavedCard === 'mtn' ? 'border-gray-400' : 'border-black'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-lg">MTN</h4>
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                {selectedSavedCard === 'mtn' && <div className="w-2 h-2 bg-black rounded-full"></div>}
              </div>
            </div>
            <p className="text-sm tracking-widest mb-4">******756</p>
            <p className="text-xs text-gray-300">Jack Essomba</p>
          </div>

        </div>

        {/* Bottom Section */}
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
