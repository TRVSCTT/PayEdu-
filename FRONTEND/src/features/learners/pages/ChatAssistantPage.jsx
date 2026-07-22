import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Mic, MoreVertical, Plus, SendHorizontal } from 'lucide-react'
import { supportService } from '../../../services/supportService'
import { buttonStyles, cardStyles, PageHeader } from '../../../components/ui/designSystem'

export function ChatAssistantPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const data = await supportService.recupererMessages()
      setMessages(data || [])
    } catch (error) {
      console.error('Erreur chargement messages', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const optimisticMsg = {
      id: Date.now(),
      contenu: newMessage,
      est_moi: true,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMsg])
    setNewMessage('')

    try {
      await supportService.envoyerMessage(optimisticMsg.contenu)
      fetchMessages()
    } catch (error) {
      console.error('Erreur envoi message', error)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:bg-primary-light hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <PageHeader
        eyebrow="Assistance"
        title="Assistant technique"
        description="Discutez avec le support sans quitter l’application, dans une interface claire et lisible."
      />

      <section className={cardStyles('flex min-h-[60vh] flex-col overflow-hidden')}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-text">En ligne</p>
            <p className="text-xs text-text-muted">Réponse rapide et conversation continue</p>
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition hover:bg-primary-light">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-background p-4">
          {isLoading && messages.length === 0 ? (
            <div className="pt-10 text-center text-sm text-text-secondary">Connexion à l’assistant…</div>
          ) : messages.length === 0 ? (
            <div className="pt-10 text-center text-sm text-text-secondary">Envoyez un message pour démarrer la discussion.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex ${msg.est_moi ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.est_moi ? 'rounded-br-none bg-primary text-white' : 'rounded-bl-none bg-white text-text shadow-soft'
                  }`}
                >
                  {msg.contenu}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border bg-white p-4 pb-safe">
          <div className="flex items-center gap-3">
            <button className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition hover:bg-primary-light">
              <Plus className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder="Écrivez votre message…"
                className="app-input h-11 rounded-full pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text">
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={buttonStyles({ variant: 'primary', size: 'sm' })}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
