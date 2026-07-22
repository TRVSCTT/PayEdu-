import { useNavigate } from 'react-router-dom';

export function PaymentPendingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-between p-6 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div className="mb-8">
          {/* Custom clock circle SVG matching the mockup */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#222" strokeWidth="6" fill="white" />
            <path d="M50 24 L50 50 L68 50" stroke="#222" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Clock ticks */}
            <path d="M50 10 L50 16 M90 50 L84 50 M50 90 L50 84 M10 50 L16 50" stroke="#222" strokeWidth="4" strokeLinecap="round" />
            <path d="M78 22 L74 26 M78 78 L74 74 M22 78 L26 74 M22 22 L26 26" stroke="#222" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-black mb-6 text-center tracking-wide">Enregistrement en cours</h1>
        <p className="text-center text-gray-800 text-[15px] leading-relaxed max-w-[280px]">
          Vous êtes mis en attente. Un reçu vous sera envoyé après enregistrement
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto pb-6">
        <div className="flex justify-center items-center space-x-2 mb-10">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white"></div>
        </div>
        <button 
          onClick={() => navigate('/apprenant/paiements/rendez-vous')}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
