import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Shield, Heart } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] pb-24 font-sans text-gray-900">
      <div className="px-5 py-6 max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-black" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">À propos</h1>
        </div>

        {/* Logo and Version */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-3xl font-bold tracking-tighter">PE</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">PayEdu</h2>
          <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-[17px] font-medium text-gray-900 mb-3">Notre Mission</h3>
          <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
            PayEdu a pour vocation de simplifier la vie des étudiants et des établissements scolaires en digitalisant le processus de paiement des frais de scolarité, d'inscription et autres services.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-gray-900">Paiement Sécurisé</h4>
                <p className="text-[12px] text-gray-500 mt-0.5">Vos transactions sont chiffrées de bout en bout.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Info className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-gray-900">Suivi en temps réel</h4>
                <p className="text-[12px] text-gray-500 mt-0.5">Gardez un œil sur l'état de tous vos reçus et factures.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Heart className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="text-[14px] font-medium text-gray-900">Pensé pour vous</h4>
                <p className="text-[12px] text-gray-500 mt-0.5">Une interface fluide, dynamique et premium.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[12px] text-gray-400">
          <p>© 2026 PayEdu. Tous droits réservés.</p>
          <p className="mt-1">Fait avec passion au Cameroun.</p>
        </div>

      </div>
    </div>
  );
}
