import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Plus, Mic, ChevronRight } from 'lucide-react';
import { buttonStyles, cx } from '../../../components/ui/designSystem';

export function MessageriePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('conversations');
  const [activeContact, setActiveContact] = useState(0);

  const contacts = [
    { id: 0, initials: 'AY', name: 'Administration Système', time: '10:20', unread: true },
    { id: 1, initials: 'SC', name: 'Scolarité IUT de Douala', time: '10:20', unread: true },
    { id: 2, initials: 'SC', name: 'Scolarité ESSEC de Douala', time: '10:20', unread: true },
  ];

  const currentContact = contacts[activeContact];

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
          <span className="text-sm font-bold text-text">Contacts: 20</span>
          <button className={cx(buttonStyles({ variant: 'primary' }), 'bg-black text-white hover:bg-black/90 px-6')}>
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
              Conversations 03
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={cx("flex-1 py-4 text-center transition-colors", activeTab === 'notifications' ? 'bg-black text-white font-medium' : 'bg-white text-text hover:bg-gray-50')}
            >
              Notifications 05
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {contacts.map((contact, index) => (
              <button 
                key={contact.id}
                onClick={() => setActiveContact(index)}
                className={cx("w-full p-4 flex items-center justify-between transition-colors text-left", activeContact === index ? 'bg-gray-50' : 'bg-white hover:bg-gray-50')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0 bg-white">
                    {contact.initials}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text">{contact.name}</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">{contact.time}</div>
                  </div>
                </div>
                {contact.unread && <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mr-1"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="flex-1 border border-border rounded-2xl bg-white flex flex-col overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0 bg-white">
                {currentContact?.initials}
              </div>
              <div>
                <div className="font-medium text-sm text-text">{currentContact?.name}</div>
                <div className="text-[10px] text-text-secondary">en ligne</div>
              </div>
            </div>
            <button className="p-2 text-text hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {/* Empty state or messages go here */}
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
                className="w-full h-11 pl-4 pr-10 border border-border rounded-full text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/90 shrink-0 transition-colors ml-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
