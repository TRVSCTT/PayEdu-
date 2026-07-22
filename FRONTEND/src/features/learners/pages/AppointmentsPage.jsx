import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, X, Download, QrCode } from 'lucide-react';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';
import { appointmentService } from '../../../services/appointmentService';

export function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [movingApt, setMovingApt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} - ${hours}H${minutes}`;
  };

  // Ajoute isFirst et isLast pour la timeline
  const formattedAppointments = appointments.map((apt, index) => ({
    ...apt,
    isFirst: index === 0,
    isLast: index === appointments.length - 1
  }));

  // Mock data si vide pour montrer la maquette
  const MOCK_APPOINTMENTS = [
    {
      id: 'mock-1',
      dateStr: '30 sept 2026 - 10H30',
      location: 'Agence UBA, Douala -Ange Raphaël',
      status: 'Planifié',
      isFirst: true,
      isLast: false,
    },
    {
      id: 'mock-2',
      dateStr: '30 sept 2026 - 10H30',
      location: 'Agence UBA, Douala -Ange Raphaël',
      status: 'Planifié',
      isFirst: false,
      isLast: true,
    }
  ];

  const displayAppointments = formattedAppointments.length > 0 ? formattedAppointments : MOCK_APPOINTMENTS;

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        <div className="mt-8 relative">
          
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-4">Chargement de vos rendez-vous...</p>
          ) : (
            displayAppointments.map((apt) => (
            <div key={apt.id} className="flex relative mb-6 last:mb-0">
              
              {/* Timeline left side */}
              <div className="flex flex-col items-center mr-4 relative pt-6">
                {/* Vertical line connecting nodes */}
                {!apt.isLast && (
                  <div className="absolute top-9 left-1/2 -ml-[1px] w-[2px] h-[calc(100%+24px)] bg-black"></div>
                )}
                
                {/* Circle node */}
                <div className="w-[18px] h-[18px] rounded-full border-[2px] border-black bg-white relative z-10"></div>
              </div>

              {/* Card content */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                
                {/* Header: Date + Badge */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[16px] font-medium text-gray-900 tracking-tight">
                    {apt.dateStr || (apt.date_rdv ? formatDateTime(apt.date_rdv) : 'Date non définie')}
                  </h3>
                  <span className="bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                    {apt.statut || apt.status}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-start text-gray-600 mb-6">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 mt-1 flex-shrink-0" />
                  <p className="text-[13px] leading-tight">
                    {apt.lieu || apt.location}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mb-4">
                  <button 
                    onClick={() => setSelectedApt(apt)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Afficher
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                    Confirmer
                  </button>
                </div>

                {/* Footer link */}
                <div className="text-center">
                  <button 
                    onClick={() => {
                      setMovingApt(apt);
                      setSelectedSlot(null);
                    }}
                    className="text-[14px] font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Déplacer
                  </button>
                </div>

              </div>
            </div>
          )))}

        </div>

      </div>

      {/* MODAL QR CODE */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 shadow-2xl relative">
            
            {/* Handle bar for mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <button 
              onClick={() => setSelectedApt(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-medium text-center text-gray-900 mb-6 mt-2">Rendez vous de validation</h2>
            
            <div className="flex justify-center mb-4">
              <QrCode className="w-[180px] h-[180px] text-black" strokeWidth={1} />
            </div>
            
            <p className="text-center text-[13px] text-gray-800 mb-8 font-medium">
              QR code d'accès - A présenter à l'agence
            </p>

            <div className="space-y-4 mb-8 px-1">
              <DetailRow label="Date" value="26 juin 2026" />
              <DetailRow label="Heure" value="10:00 AM" />
              <DetailRow label="Lieu" value="UBA, Douala - Ange Raphaël" />
              <DetailRow label="Statut" value="Planifié" />
              <DetailRow label="N° de passage" value="26.200" />
            </div>

            <div className="space-y-3 pb-4 sm:pb-0">
              <button className="w-full flex items-center justify-center py-4 rounded-xl bg-black text-white text-[15px] font-medium hover:bg-gray-800 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Télécharger le reçu
              </button>
              <button 
                onClick={() => navigate('/recu')}
                className="w-full py-4 rounded-xl border border-gray-300 text-[15px] font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
              >
                Afficher le reçu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DEPLACER LE RDV */}
      {movingApt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 shadow-2xl relative min-h-[50vh] flex flex-col">
            
            {/* Handle bar for mobile */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <div className="flex-1">
              <h2 className="text-[20px] font-medium text-center text-gray-900 mb-1 mt-2">Déplacer le rdv</h2>
              <p className="text-center text-[14px] text-gray-700 mb-8">Choisissez un nouveau créneau :</p>
              
              <div className="flex space-x-3 mb-8">
                {/* Slot 1 */}
                <button 
                  onClick={() => setSelectedSlot('slot1')}
                  className={`flex-1 flex flex-col items-center justify-center py-4 border rounded-xl transition-all ${selectedSlot === 'slot1' ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-900 hover:border-gray-400'}`}
                >
                  <span className="text-[15px] font-medium mb-0.5">mar.30 juin</span>
                  <span className={`text-[15px] ${selectedSlot === 'slot1' ? 'text-gray-200' : 'text-gray-500'}`}>09:00</span>
                </button>

                {/* Slot 2 */}
                <button 
                  onClick={() => setSelectedSlot('slot2')}
                  className={`flex-1 flex flex-col items-center justify-center py-4 border rounded-xl transition-all ${selectedSlot === 'slot2' ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-900 hover:border-gray-400'}`}
                >
                  <span className="text-[15px] font-medium mb-0.5">jeu.01 juil</span>
                  <span className={`text-[15px] ${selectedSlot === 'slot2' ? 'text-gray-200' : 'text-gray-500'}`}>13:00</span>
                </button>
              </div>
            </div>

            <div className="mt-auto pt-6 space-y-4">
              <button 
                onClick={() => {
                  // Simulate moving
                  setMovingApt(null);
                }}
                disabled={!selectedSlot}
                className="w-full flex items-center justify-center py-4 rounded-xl bg-black text-white text-[15px] font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                Confirmer le déplacement
              </button>
              <button 
                onClick={() => setMovingApt(null)}
                className="w-full text-center text-[15px] font-medium text-gray-800 hover:text-black pb-2"
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Helper pour les lignes en pointillés
const DetailRow = ({ label, value }) => (
  <div className="flex items-baseline w-full text-[14px]">
    <span className="text-gray-900">{label}</span>
    <div className="flex-1 border-b-[2px] border-dotted border-black/30 mx-2 relative top-[-4px]"></div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
