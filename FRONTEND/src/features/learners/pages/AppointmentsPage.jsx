import { MapPin } from 'lucide-react';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    dateStr: '30 sept 2026 - 10H30',
    location: 'Agence UBA, Douala -Ange Raphaël',
    status: 'Planifié',
    isFirst: true,
    isLast: false,
  },
  {
    id: 2,
    dateStr: '30 sept 2026 - 10H30',
    location: 'Agence UBA, Douala -Ange Raphaël',
    status: 'Planifié',
    isFirst: false,
    isLast: true,
  }
];

export function AppointmentsPage() {
  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        <div className="mt-8 relative">
          
          {MOCK_APPOINTMENTS.map((apt, index) => (
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
                    {apt.dateStr}
                  </h3>
                  <span className="bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                    {apt.status}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-start text-gray-600 mb-6">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 mt-1 flex-shrink-0" />
                  <p className="text-[13px] leading-tight">
                    {apt.location}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mb-4">
                  <button className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors">
                    Afficher
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                    Confirmer
                  </button>
                </div>

                {/* Footer link */}
                <div className="text-center">
                  <button className="text-[14px] font-medium text-gray-900 hover:text-gray-600 transition-colors">
                    Déplacer
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
