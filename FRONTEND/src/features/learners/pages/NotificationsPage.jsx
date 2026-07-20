import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard } from 'lucide-react';

export function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        </div>
        <button className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
          Tout lu
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          <button className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full whitespace-nowrap">Tout</button>
          <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full border border-gray-300 whitespace-nowrap hover:bg-gray-50">Système</button>
          <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full border border-gray-300 whitespace-nowrap hover:bg-gray-50">Paiement</button>
          <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full border border-gray-300 whitespace-nowrap hover:bg-gray-50">Confirmation</button>
          <button className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full border border-gray-300 whitespace-nowrap hover:bg-gray-50">Alerte</button>
        </div>
      </div>

      {/* Notifications List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Item 1 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-0.5">Paiement effectué</h3>
            <p className="text-sm text-gray-600 mb-1.5 truncate">Paiement de 350 000 FCFA... (2frais)</p>
            <div className="flex items-center text-xs text-gray-400 space-x-3">
              <span>30 sept. 2026</span>
              <span>20h40</span>
            </div>
          </div>
          <div className="flex-shrink-0 pt-2">
            <span className="w-2.5 h-2.5 bg-black rounded-full block"></span>
          </div>
        </div>
      </main>
    </div>
  );
}
