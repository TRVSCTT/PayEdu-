import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Plus, Mic, ChevronRight } from 'lucide-react';
import { supportService } from '../../../services/supportService';

export function ChatAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    
    // Polling pour vérifier les nouveaux messages toutes les 5 secondes
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await supportService.recupererMessages();
      setMessages(data || []);
    } catch (error) {
      console.error("Erreur chargement messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Optimistic update
    const optimisticMsg = {
      id: Date.now(),
      contenu: newMessage,
      est_moi: true,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');
    
    try {
      await supportService.envoyerMessage(optimisticMsg.contenu);
      fetchMessages(); // Récupérer la vraie version
    } catch (error) {
      console.error("Erreur envoi message", error);
      // Gérer l'erreur d'envoi ici (ex: toast ou suppression du message optimiste)
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] font-sans text-gray-900 flex flex-col absolute inset-0 z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mr-3"
          >
            <ChevronLeft className="w-6 h-6 text-black" strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="text-[17px] font-medium leading-tight">Assistant technique</h1>
            <p className="text-[12px] text-gray-500">En ligne</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-10">Connexion à l'assistant...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-10">Envoyez un message pour démarrer la discussion.</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.est_moi ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] ${
                  msg.est_moi 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.contenu}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center space-x-3 pb-safe">
        
        {/* Plus Button */}
        <button className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors flex-shrink-0">
          <Plus className="w-5 h-5 text-black" strokeWidth={1.5} />
        </button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ecrivez votre message..." 
            className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-400 bg-white text-[14px] focus:outline-none focus:border-gray-900"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-black">
            <Mic className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors flex-shrink-0 disabled:opacity-50 disabled:border-gray-300"
        >
          <ChevronRight className={`w-5 h-5 ${newMessage.trim() ? 'text-black' : 'text-gray-400'}`} strokeWidth={1.5} />
        </button>

      </div>
    </div>
  );
}
