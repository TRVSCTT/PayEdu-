import { useNavigate } from 'react-router-dom';

export function AppointmentScheduledPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-between p-6 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto mt-10">
        <div className="mb-8">
          {/* Custom Map Pin SVG matching the mockup */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 78 C50 78 26 56 26 38 C26 24.745 36.745 14 50 14 C63.255 14 74 24.745 74 38 C74 56 50 78 50 78 Z" stroke="black" strokeWidth="8" strokeLinejoin="round" fill="black" />
            <circle cx="50" cy="38" r="10" fill="white" />
            <path d="M28 85 C 38 92, 62 92, 72 85" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <h1 className="text-[22px] font-medium text-black mb-5 text-center tracking-wide">Rendez vous planifié</h1>
        <p className="text-center text-gray-900 text-[16px] leading-relaxed max-w-[280px]">
          Validation le 29 juin 2026 à 10:30. Validez le 1h avant.
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto pb-4">
        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-2 mb-10">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-500 bg-white"></div>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-500 bg-white"></div>
          <div className="w-3 h-3 rounded-full bg-black"></div>
        </div>
        
        {/* Actions Buttons */}
        <div className="space-y-4 mb-6">
          <button 
            onClick={() => { /* Navigate to RDV later */ }}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Regarder mon rdv
          </button>
          <button 
            onClick={() => { /* Navigate to documents later */ }}
            className="w-full bg-white text-black py-4 rounded-xl text-lg font-medium border border-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Mes documents
          </button>
        </div>
        
        <div className="text-center pt-2">
          <button 
            onClick={() => navigate('/apprenant')}
            className="text-[16px] text-gray-900 hover:underline"
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    </div>
  );
}
