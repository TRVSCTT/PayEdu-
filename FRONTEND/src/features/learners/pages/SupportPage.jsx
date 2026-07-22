import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function SupportPage() {
  const navigate = useNavigate();

  const faqItems = [
    "Comment effectuer un paiement?",
    "Quand est-ce que je reçois mon reçu",
    "Comment déplacer un rendez-vous?",
    "Mon paiement n'est pas confirmé"
  ];

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] pb-24 font-sans text-gray-900">
      <div className="px-5 py-6 max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-black" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">Support & aide</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Décrivez votre problème" 
            className="w-full py-4 pl-5 pr-12 rounded-xl border border-gray-300 bg-white text-[15px] focus:outline-none focus:border-gray-500 shadow-sm placeholder-gray-400"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Aide et support</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
                  index !== faqItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <span className="text-[15px] font-medium text-gray-900">{item}</span>
                <ChevronRight className="w-5 h-5 text-black" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="space-y-3 mb-10">
          <button className="w-full py-4 rounded-xl bg-black text-white text-[17px] font-medium hover:bg-gray-800 transition-colors">
            Contacter l'assistant
          </button>
          <button className="w-full py-4 rounded-xl border border-gray-900 bg-white text-black text-[17px] font-medium hover:bg-gray-50 transition-colors">
            Guide utilisateur
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col items-center space-y-3">
          <button className="text-[13px] text-gray-800 hover:text-black hover:underline transition-all">
            Condition Générales d'Utilisation
          </button>
          <button className="text-[13px] text-gray-800 hover:text-black hover:underline transition-all">
            Politique de Confidentialité
          </button>
        </div>

      </div>
    </div>
  );
}
