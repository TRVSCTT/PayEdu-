import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function PaymentOptionsPage() {
  const navigate = useNavigate();
  const [optionType, setOptionType] = useState('mobile'); // 'mobile' or 'carte'
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  const handleContinue = () => {
    navigate('/apprenant/paiements/recapitulatif');
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
            
            <div className="flex space-x-4">
              <div className="w-1/3">
                <label className="block text-xs text-gray-900 mb-1.5">Opérateur</label>
                <select className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white">
                  <option>Orange</option>
                  <option>MTN</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-900 mb-1.5">Numéro</label>
                <input 
                  type="text" 
                  placeholder="6XX XX XX XX" 
                  className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-900 mb-1.5">Origine des fonds</label>
              <select className="w-full px-3 py-2.5 border border-gray-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white">
                <option></option>
                <option>Personnel</option>
                <option>Parent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-900 mb-1.5">Nom du titulaire</label>
              <input 
                type="text" 
                placeholder="Nom complet" 
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
