
import React, { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus, Message } from '../types';
import { generateSmartReply } from '../services/geminiService';

interface ConversationViewProps {
  lead: Lead;
  onClose: () => void;
  onSendMessage: (leadId: string, text: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ lead, onClose, onSendMessage, onUpdateStatus }) => {
  const [inputText, setInputText] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lead.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(lead.id, inputText);
    setInputText('');
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const context = "A boutique software solutions agency helping small businesses automate social media.";
    const reply = await generateSmartReply(lead.name, lead.initialMessage, context);
    setAiDraft(reply);
    setIsGenerating(false);
  };

  const useDraft = () => {
    setInputText(aiDraft);
    setAiDraft('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h3 className="font-bold text-slate-900">{lead.name}</h3>
            <span className="text-xs text-slate-500">{lead.platform} • {lead.username}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <select 
            className="text-xs font-medium border border-slate-200 rounded px-2 py-1 bg-white"
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
          >
            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        <div className="flex flex-col items-center mb-6">
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            Inquiry started via {lead.type}
          </span>
          <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 w-full shadow-sm italic text-slate-600 text-sm">
            "{lead.initialMessage}"
          </div>
        </div>

        {lead.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'lead' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
              m.sender === 'lead' 
                ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none' 
                : 'bg-indigo-600 text-white rounded-br-none'
            }`}>
              {m.text}
              <div className={`text-[10px] mt-1 ${m.sender === 'lead' ? 'text-slate-400' : 'text-indigo-200'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistance */}
      {aiDraft && (
        <div className="m-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Suggestion</span>
            <button onClick={() => setAiDraft('')} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xs"></i></button>
          </div>
          <p className="text-sm text-slate-700 italic">"{aiDraft}"</p>
          <div className="flex gap-2">
            <button 
              onClick={useDraft}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-all font-medium"
            >
              Insert Draft
            </button>
            <button 
              onClick={handleGenerateAI}
              className="px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs rounded-lg hover:bg-indigo-50 transition-all font-medium"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 space-y-3">
        <div className="flex gap-2">
          <button 
            disabled={isGenerating}
            onClick={handleGenerateAI}
            className={`flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-xs font-bold hover:bg-indigo-100 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
            {isGenerating ? 'Thinking...' : 'AI Reply'}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-100 transition-all">
            <i className="fas fa-paperclip"></i>
          </button>
        </div>
        <div className="flex gap-2">
          <textarea
            rows={2}
            className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder="Type your follow-up message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
