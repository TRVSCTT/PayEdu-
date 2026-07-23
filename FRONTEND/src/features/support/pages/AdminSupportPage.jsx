import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, MessageSquare, AlertCircle, Search, User } from 'lucide-react';
import { supportService } from '../../../services/supportService';
import { PageHeader, cardStyles, cx } from '../../../components/ui/designSystem';
import { useAuth } from '../../../store/authStore';
import { toast } from 'sonner';

export function AdminSupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApprenantId, setSelectedApprenantId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer la liste des conversations
  const { data: conversations = [], isLoading: isLoadingConv } = useQuery({
    queryKey: ['support-conversations'],
    queryFn: supportService.getConversations,
  });

  // Filtrer les conversations (recherche)
  const filteredConversations = conversations.filter(c => 
    c.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.matricule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Récupérer les détails d'une conversation spécifique
  const { data: messages = [], isLoading: isLoadingMsgs } = useQuery({
    queryKey: ['support-messages', selectedApprenantId],
    queryFn: () => supportService.getConversationDetails(selectedApprenantId),
    enabled: !!selectedApprenantId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (contenu) => supportService.envoyerMessage(contenu, selectedApprenantId),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['support-messages', selectedApprenantId] });
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] }); // Au cas où
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedApprenantId) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const selectedApprenant = conversations.find(c => c.apprenant_id === selectedApprenantId);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <PageHeader
        eyebrow="Assistance"
        title="Gestion du Support"
        description="Répondez aux questions et problèmes signalés par les apprenants."
      />

      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
        {/* Colonne de gauche : Liste des conversations */}
        <section className={cx(cardStyles('flex flex-col w-1/3 overflow-hidden min-w-[300px]'))}>
          <div className="p-4 border-b border-border bg-surface/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Rechercher un apprenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoadingConv ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">
                Aucune conversation trouvée.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.apprenant_id}
                    onClick={() => setSelectedApprenantId(conv.apprenant_id)}
                    className={cx(
                      'w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3',
                      selectedApprenantId === conv.apprenant_id ? 'bg-primary-light/50 border-l-4 border-primary' : 'border-l-4 border-transparent'
                    )}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {conv.prenom[0]}{conv.nom[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-text truncate">{conv.prenom} {conv.nom}</p>
                      <p className="text-xs text-text-secondary truncate">{conv.matricule}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Colonne de droite : Chat */}
        <section className={cx(cardStyles('flex flex-col flex-1 overflow-hidden'))}>
          {!selectedApprenantId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
              <MessageSquare className="h-16 w-16 mb-4 text-border" />
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm">Cliquez sur un apprenant à gauche pour afficher les messages.</p>
            </div>
          ) : (
            <>
              {/* En-tête du chat */}
              <div className="border-b border-border bg-surface/50 px-6 py-4 flex items-center gap-4 shadow-sm z-10">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {selectedApprenant?.prenom[0]}{selectedApprenant?.nom[0]}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text">{selectedApprenant?.prenom} {selectedApprenant?.nom}</h2>
                  <p className="text-xs text-text-secondary">{selectedApprenant?.matricule}</p>
                </div>
              </div>

              {/* Zone des messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {isLoadingMsgs ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-text-secondary">
                    Aucun message dans cette conversation.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cx(
                        'flex w-full',
                        msg.est_moi ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cx(
                          'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
                          msg.est_moi
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white border border-border text-text rounded-bl-none shadow-sm'
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.contenu}</p>
                        <span
                          className={cx(
                            'mt-1 block text-[10px] uppercase tracking-wider',
                            msg.est_moi ? 'text-primary-light/80' : 'text-text-muted'
                          )}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-border bg-white p-4 z-10">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="relative flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Répondre à ${selectedApprenant?.prenom}...`}
                      className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className={cx(
                      'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
                      newMessage.trim() && !sendMessageMutation.isPending
                        ? 'bg-primary text-white shadow-sm hover:bg-primary/90'
                        : 'bg-surface border border-border text-text-muted cursor-not-allowed'
                    )}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
