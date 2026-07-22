import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';

export function AddPaymentMethodPage() {
  const navigate = useNavigate();
  const [methodType, setMethodType] = useState('mobile'); // 'mobile' or 'card'
  const [operator, setOperator] = useState('Orange');
  const [phone, setPhone] = useState('');
  const [fundsOrigin, setFundsOrigin] = useState('');
  const [holderName, setHolderName] = useState('');

  const handleSave = () => {
    // Dans une vraie application, on appellerait l'API ici
    navigate('/apprenant/portefeuille');
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-[17px] font-medium text-gray-900">Enregistrement moyen</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-[15px] font-medium text-gray-900 mb-4">Choisissez une option</h3>
          
          {/* Toggle Type */}
          <div className="flex rounded-full border border-gray-300 p-1 mb-6">
            <button 
              onClick={() => setMethodType('mobile')}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${methodType === 'mobile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Compte mobile
            </button>
            <button 
              onClick={() => setMethodType('card')}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${methodType === 'card' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Carte bancaire
            </button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Opérateur</label>
                <select 
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none bg-white text-sm"
                >
                  <option value="Orange">Orange</option>
                  <option value="MTN">MTN</option>
                  <option value="Camtel">Camtel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Numéro</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="6XX XX XX XX"
                  className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Origine des fonds</label>
              <select 
                value={fundsOrigin}
                onChange={(e) => setFundsOrigin(e.target.value)}
                className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none bg-white text-sm"
              >
                <option value=""></option>
                <option value="Personnel">Personnel</option>
                <option value="Parent">Parent</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Nom du titulaire</label>
              <input 
                type="text" 
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Nom complet"
                className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
              />
            </div>
          </form>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleSave}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            Enregistrer
          </button>
        </div>

      </div>
    </div>
  );
}
