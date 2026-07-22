import { useNavigate } from 'react-router-dom';
import { TopNavTabs } from '../../../components/ui/TopNavTabs';

const SAVED_METHODS = [
  { id: '1', provider: 'Orange', number: '******739', name: 'Jack Essomba' },
  { id: '2', provider: 'MTN', number: '******756', name: 'Jack Essomba' },
  { id: '3', provider: 'MTN VISA', number: '******756', name: 'Jack Essomba' },
  { id: '4', provider: 'Orange VISA', number: '******739', name: 'Jack Essomba' },
];

export function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-140px)] pb-8 font-sans">
      <div className="px-6 py-4 max-w-lg mx-auto">
        
        <TopNavTabs />

        {/* Saved Payment Methods Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SAVED_METHODS.map((method) => (
            <div 
              key={method.id} 
              className="bg-black text-white p-4 rounded-xl relative shadow-md flex flex-col justify-between aspect-[1.8/1]"
            >
              <div className="absolute top-3 right-3">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-[17px] font-medium tracking-wide mt-1">{method.provider}</h3>
              <div>
                <p className="text-[13px] font-medium opacity-90 mb-1 tracking-wider">{method.number}</p>
                <p className="text-[11px] text-gray-400">{method.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="mt-8 flex justify-end pr-2">
          <button className="text-[15px] font-medium text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1">
            <span>+ Ajouter</span>
          </button>
        </div>

      </div>
    </div>
  );
}
