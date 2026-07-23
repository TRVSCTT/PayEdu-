import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MoreVertical, Plus, Mic, ChevronRight, X, Bell, Moon, Loader2 } from 'lucide-react';
import { buttonStyles, cx } from '../../../components/ui/designSystem';
import { supportService } from '../../../services/supportService';
import { toast } from 'sonner';

export function MessageriePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('conversations');
  const [activeContactId, setActiveContactId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showPrefModal, setShowPrefModal] = useState(false);
  const [prefSettings, setPrefSettings] = useState({ sound: true, email: false });

  // Fetch conversations
  const { data: conversations = [], isLoading: isLoadingConv } = useQuery({
    queryKey: ['caisse-conversations'],
    queryFn: supportService.getConversations,
  });

  // Fetch messages for active contact
  const { data: messages = [], isLoading: isLoadingMsg } = useQuery({
    queryKey: ['caisse-messages', activeContactId],
    queryFn: () => supportService.getConversationDetails(activeContactId),
    enabled: !!activeContactId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: () => supportService.envoyerMessage(messageText, activeContactId),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries(['caisse-messages', activeContactId]);
      toast.success("Message envoyé");
    },
    onError: () => toast.error("Erreur lors de l'envoi")
  });

  useEffect(() => {
    if (conversations.length > 0 && !activeContactId) {
      setActiveContactId(conversations[0]?.apprenant_id || conversations[0]?.id);
    }
  }, [conversations, activeContactId]);

  const currentContact = conversations.find(c => (c.apprenant_id || c.id) === activeContactId);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSend = () => {
    if (!messageText.trim() || !activeContactId) return;
    sendMessageMutation.mutate();
  };

  const savePreferences = () => {
    toast.success("Préférences enregistrées avec succès");
    setShowPrefModal(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Retour">
            <ArrowLeft className="w-6 h-6 text-text" />
          </button>
          <h1 className="text-3xl font-bold text-text">Messagerie</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-text">Contacts: {conversations.length}</span>
          <button 
            onClick={() => setShowPrefModal(true)}
            className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90 px-6')}
          >
            Préférence
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 gap-4 min-h-0">
        
        {/* Left Column: Contact List */}
        <div className="w-[340px] border border-border rounded-2xl bg-white flex flex-col shrink-0 overflow-hidden">
          <div className="flex border-b border-border text-sm">
            <button 
              onClick={() => setActiveTab('conversations')}
              className={cx("flex-1 py-4 text-center transition-colors", activeTab === 'conversations' ? 'bg-black text-white font-medium' : 'bg-white text-text hover:bg-gray-50')}
            >
              Conversations {conversations.length < 10 ? `0${conversations.length}` : conversations.length}
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={cx("flex-1 py-4 text-center transition-colors", activeTab === 'notifications' ? 'bg-black text-white font-medium' : 'bg-white text-text hover:bg-gray-50')}
            >
              Notifications 00
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoadingConv ? (
               <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : conversations.length === 0 ? (
               <div className="p-6 text-center text-sm text-text-muted">Aucune conversation</div>
            ) : (
              conversations.map((contact) => {
                const cId = contact.apprenant_id || contact.id;
                const cName = contact.nom_complet || contact.nom || 'Utilisateur inconnu';
                return (
                  <button 
                    key={cId}
                    onClick={() => setActiveContactId(cId)}
                    className={cx("w-full p-4 flex items-center justify-between transition-colors text-left", activeContactId === cId ? 'bg-gray-50' : 'bg-white hover:bg-gray-50')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0 bg-white">
                        {getInitials(cName)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-text line-clamp-1">{cName}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5">
                          {new Date(contact.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {/* Placeholder dot for unread status if property exists */}
                    {contact.non_lu && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mr-1"></div>}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="flex-1 border border-border rounded-2xl bg-white flex flex-col overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-white z-10">
            {currentContact ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0 bg-white">
                    {getInitials(currentContact.nom_complet || currentContact.nom)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text">{currentContact.nom_complet || currentContact.nom || 'Utilisateur'}</div>
                    <div className="text-[10px] text-text-secondary">en ligne</div>
                  </div>
                </div>
                <button className="p-2 text-text hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-sm text-text-muted">Sélectionnez une conversation</div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
            {isLoadingMsg ? (
              <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : messages.length === 0 ? (
               <div className="text-center text-sm text-text-muted mt-10">
                 {currentContact ? "Aucun message dans cette conversation" : "Bienvenue dans la messagerie"}
               </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={cx("flex", msg.est_envoyeur ? "justify-end" : "justify-start")}>
                  <div className={cx("max-w-[70%] p-3 rounded-2xl text-sm", msg.est_envoyeur ? "bg-black text-white rounded-br-none" : "bg-gray-100 text-text rounded-bl-none")}>
                    {msg.contenu}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-white flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-gray-50 shrink-0">
              <Plus className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Ecrivez votre message..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={!activeContactId || sendMessageMutation.isPending}
                className="w-full h-11 pl-4 pr-10 border border-border rounded-full text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleSend}
              disabled={!activeContactId || !messageText.trim() || sendMessageMutation.isPending}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/90 shrink-0 transition-colors ml-1 disabled:opacity-50"
            >
              {sendMessageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Modal Préférences */}
      {showPrefModal && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-border w-full max-w-sm relative flex flex-col overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-text">Préférences de messagerie</h3>
              <button onClick={() => setShowPrefModal(false)} className="text-text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text">Notifications sonores</div>
                    <div className="text-[10px] text-text-secondary">Jouer un son à la réception</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={prefSettings.sound}
                  onChange={(e) => setPrefSettings({...prefSettings, sound: e.target.checked})}
                  className="toggle-checkbox"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text">Ne pas déranger</div>
                    <div className="text-[10px] text-text-secondary">Mettre en sourdine les alertes</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={prefSettings.dnd}
                  onChange={(e) => setPrefSettings({...prefSettings, dnd: e.target.checked})}
                  className="toggle-checkbox"
                />
              </label>
            </div>

            <div className="p-5 border-t border-border bg-gray-50/50 flex gap-3">
              <button 
                onClick={() => setShowPrefModal(false)}
                className={cx(buttonStyles({ variant: 'secondary' }), 'flex-1 bg-white border-border')}
              >
                Annuler
              </button>
              <button 
                onClick={savePreferences}
                className={cx(buttonStyles({ variant: 'primary' }), 'flex-1 bg-black text-white hover:bg-black/90')}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
