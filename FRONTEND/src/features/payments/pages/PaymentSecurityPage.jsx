import { ShieldCheck, ScanFace, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function PaymentSecurityPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="px-6 py-6 pb-24 flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 w-full max-w-sm relative">
        
        {/* Shield Icon */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-16 h-16 bg-white rounded-full border border-gray-200 flex items-center justify-center">
            <div className="bg-black rounded-full p-2.5">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">Sécurité</h2>

        <form className="space-y-6">
          {/* Mot de passe */}
          <div>
            <label className="block text-sm text-gray-900 mb-2">Mot de passe</label>
            <input 
              type="password" 
              className="w-full px-3 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
            />
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs text-gray-700 hover:text-black">Mot de passe oublié</a>
            </div>
          </div>

          {/* Code de sécurité */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-900">Code de sécurité</label>
              <span className="text-xs text-gray-500">10s</span>
            </div>
            <div className="flex justify-between space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <a href="#" className="text-sm text-gray-900 underline hover:text-black font-medium">Envoyer le code</a>
            </div>
          </div>

          {/* Autre moyen d'accès */}
          <div className="pt-4">
            <p className="text-center text-sm text-gray-900 mb-4">Autre moyen d'accès</p>
            <div className="flex justify-center space-x-4 mb-8">
              <button type="button" className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ScanFace className="w-7 h-7 text-gray-800" strokeWidth={1.5} />
              </button>
              <button type="button" className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Fingerprint className="w-7 h-7 text-gray-800" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Bouton Accéder */}
          <button 
            type="button" 
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Accéder
          </button>
        </form>
      </div>
    </div>
  );
}
