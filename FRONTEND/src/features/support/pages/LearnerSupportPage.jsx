import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { supportService } from '../../../services/supportService';
import { PageHeader, cardStyles, buttonStyles, cx } from '../../../components/ui/designSystem';
import { useAuth } from '../../../store/authStore';
import { toast } from 'sonner';

export function LearnerSupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ['support-messages'],
    queryFn: supportService.recupererMessages,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (contenu) => supportService.envoyerMessage(contenu),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assistance"
        title="Support Client"
        description="Besoin d'aide ? Envoyez-nous un message et nous vous répondrons dans les plus brefs délais."
      />

      <section className={cardStyles('flex flex-col h-[600px] overflow-hidden')}>
        {/* En-tête du chat */}
        <div className="border-b border-border bg-surface/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">Équipe de support</h2>
              <p className="text-xs text-success">En ligne</p>
            </div>
          </div>
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex h-full flex-col items-center justify-center text-text-secondary">
              <AlertCircle className="h-8 w-8 mb-2 text-danger" />
              <p>Impossible de charger les messages.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-text-secondary">
              <MessageSquare className="h-12 w-12 mb-4 text-border" />
              <p>Aucun message pour le moment.</p>
              <p className="text-sm">Envoyez votre première question ci-dessous.</p>
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
        <div className="border-t border-border bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
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
      </section>
    </div>
  );
}
