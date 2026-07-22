import { useNavigate } from 'react-router-dom';

export function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-between p-6 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div className="mb-8">
          {/* Custom checkmark circle SVG matching the mockup */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#222" strokeWidth="6" fill="white" />
            <path d="M28 50 L44 66 L78 26" stroke="#222" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Adding the small trailing tail of the checkmark from the mockup */}
            <path d="M78 26 Q 85 24 92 34" stroke="#222" strokeWidth="6" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-black mb-6 text-center tracking-wide">Paiement confirmé</h1>
        <p className="text-center text-gray-800 text-[15px] leading-relaxed max-w-[280px]">
          Votre transaction a été accepté. Un reçus ainsi qu'un rendez vous vous seront communiqués
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto pb-6">
        <div className="flex justify-center items-center space-x-2 mb-10">
          <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white"></div>
        </div>
        <button 
          onClick={() => navigate('/apprenant')}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
