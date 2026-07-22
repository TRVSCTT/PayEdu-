import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';
import { walletService } from '../../../services/walletService';

export function AddPaymentMethodPage() {
  const navigate = useNavigate();
  const [methodType, setMethodType] = useState('mobile'); // 'mobile' or 'card'
  const [operator, setOperator] = useState('Orange');
  const [phone, setPhone] = useState('');
  const [fundsOrigin, setFundsOrigin] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await walletService.addPaymentMethod({
        type_methode: methodType,
        fournisseur: operator,
        numero_masque: phone,
        nom_titulaire: holderName,
        origine_fonds: fundsOrigin || null
      });
      navigate('/apprenant/portefeuille');
    } catch (err) {
      setError("Erreur lors de l'enregistrement du moyen de paiement.");
      setIsSaving(false);
    }
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
            {methodType === 'mobile' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-600 mb-1.5">Opérateur</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    />
                  </div>
                  <div className="col-span-1 relative">
                    <label className="block text-xs text-gray-600 mb-1.5">Numéro</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="MM/AA"
                        className="w-full pl-3 pr-10 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-600 mb-1.5">CVV</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    />
                  </div>
                  <div className="col-span-2">
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
                </div>
              </>
            )}

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

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

        <div className="mt-8">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

      </div>
    </div>
  );
}
