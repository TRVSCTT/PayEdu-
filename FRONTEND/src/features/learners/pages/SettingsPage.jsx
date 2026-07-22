import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function SettingsPage() {
  // State for toggles
  const [darkMode, setDarkMode] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [location, setLocation] = useState(true);
  const [alerts, setAlerts] = useState(true);
  
  // State for Language Modal
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Français');

  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] pb-24 font-sans text-gray-900">
      <div className="px-5 py-4 max-w-lg mx-auto space-y-6">
        
        {/* Apparence Section */}
        <section>
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Apparence</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            <SettingRow 
              label="Langue" 
              onClick={() => setShowLanguageModal(true)}
              rightElement={
                <div className="flex items-center text-[11px] text-gray-400">
                  <span className="mr-1">{selectedLanguage}</span>
                  <ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />
                </div>
              } 
            />
            
            <SettingRow 
              label="Mode sombre/clair" 
              rightElement={<Toggle isChecked={darkMode} onChange={() => setDarkMode(!darkMode)} />} 
            />
            
            <SettingRow 
              label="Taille de la police" 
              rightElement={<ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />} 
              isLast 
            />
            
          </div>
        </section>

        {/* Permission & Sécurité Section */}
        <section>
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Permission & Sécurité</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            <SettingRow 
              label="Biométrie & Face ID" 
              rightElement={<Toggle isChecked={biometrics} onChange={() => setBiometrics(!biometrics)} />} 
            />
            
            <SettingRow 
              label="Localisation" 
              rightElement={<Toggle isChecked={location} onChange={() => setLocation(!location)} />} 
            />
            
            <SettingRow 
              label="Alerte" 
              rightElement={<Toggle isChecked={alerts} onChange={() => setAlerts(!alerts)} />} 
            />
            
            <SettingRow 
              label="Mots de passe et code de sécurité" 
              rightElement={<ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />} 
              isLast 
            />
            
          </div>
        </section>

        {/* Aide et support Section */}
        <section>
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Aide et support</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            <SettingRow 
              label="Support & aide" 
              onClick={() => navigate('/apprenant/parametres/support')}
              rightElement={<ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />} 
            />
            
            <SettingRow 
              label="Assistant technique" 
              rightElement={<ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />} 
            />
            
            <SettingRow 
              label="Demande de contrôle" 
              rightElement={<ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />} 
            />
            
            <SettingRow 
              label="A propos de l'application" 
              isLast 
            />
            
          </div>
        </section>

      </div>

      {/* LANGUAGE SELECTION MODAL */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="w-full max-w-sm px-6 flex flex-col items-center flex-1 justify-center relative pb-20">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Langues</h2>
            <p className="text-gray-900 mb-10 text-center">Choisissez la langue de l'application</p>

            <div className="w-full space-y-4">
              
              {/* Français */}
              <button 
                onClick={() => setSelectedLanguage('Français')}
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-900 bg-white"
              >
                <span className="text-[17px] font-medium text-gray-900">Français</span>
                <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center ${selectedLanguage === 'Français' ? 'border-black' : 'border-gray-400'}`}>
                  {selectedLanguage === 'Français' && <div className="w-3 h-3 bg-black rounded-full" />}
                </div>
              </button>

              {/* Anglais */}
              <button 
                onClick={() => setSelectedLanguage('Anglais')}
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-900 bg-white"
              >
                <span className="text-[17px] font-medium text-gray-900">Anglais</span>
                <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center ${selectedLanguage === 'Anglais' ? 'border-black' : 'border-gray-400'}`}>
                  {selectedLanguage === 'Anglais' && <div className="w-3 h-3 bg-black rounded-full" />}
                </div>
              </button>
              
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-10 left-6 right-6">
              <button 
                onClick={() => setShowLanguageModal(false)}
                className="w-full py-4 rounded-xl bg-black text-white text-[17px] font-medium hover:bg-gray-800 transition-colors"
              >
                Continuer
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * Reusable Setting Row Component
 */
function SettingRow({ label, rightElement, isLast, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3.5 bg-white ${!isLast ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}
    >
      <span className="text-[15px] font-normal text-gray-900">{label}</span>
      {rightElement}
    </div>
  );
}

/**
 * Custom iOS-style Toggle Switch
 */
function Toggle({ isChecked, onChange }) {
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-[42px] h-[24px] rounded-full flex items-center p-[2px] cursor-pointer transition-colors duration-200 ease-in-out ${
        isChecked ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <div 
        className={`bg-white w-[20px] h-[20px] rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
          isChecked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </div>
  );
}
