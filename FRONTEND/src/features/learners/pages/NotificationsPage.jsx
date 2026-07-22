import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Bell, Info, AlertTriangle } from 'lucide-react';
import { notificationService } from '../../../services/notificationService';

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.listerNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleToutLu = async () => {
    try {
      await notificationService.marquerToutLu();
      setNotifications(notifications.map(n => ({ ...n, est_lu: true })));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications", error);
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'PAIEMENT': return <CreditCard className="w-5 h-5" />;
      case 'ALERTE': return <AlertTriangle className="w-5 h-5" />;
      case 'CONFIRMATION': return <Bell className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

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
        <button 
          onClick={handleToutLu}
          className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
        >
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
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Chargement...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={`bg-white p-4 rounded-2xl border ${notif.est_lu ? 'border-gray-100' : 'border-gray-300'} shadow-sm flex items-start space-x-4 transition-colors`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.est_lu ? 'bg-gray-100 text-gray-500' : 'bg-black text-white'}`}>
                {getIconForType(notif.type_notification)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-semibold mb-0.5 ${notif.est_lu ? 'text-gray-600' : 'text-gray-900'}`}>{notif.titre}</h3>
                <p className="text-sm text-gray-600 mb-1.5">{notif.message}</p>
                <div className="flex items-center text-xs text-gray-400 space-x-3">
                  <span>{new Date(notif.created_at).toLocaleDateString('fr-FR')}</span>
                  <span>{new Date(notif.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
              {!notif.est_lu && (
                <div className="flex-shrink-0 pt-2">
                  <span className="w-2.5 h-2.5 bg-black rounded-full block"></span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune notification pour le moment.</p>
          </div>
        )}

        {/* Bouton de test caché (pour débogage) */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={async () => {
              try {
                await notificationService.creerNotificationTest();
                const data = await notificationService.listerNotifications();
                setNotifications(data || []);
              } catch(e) { console.error(e); }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200"
          >
            + Ajouter une notification test
          </button>
        </div>
      </main>
    </div>
  );
}
