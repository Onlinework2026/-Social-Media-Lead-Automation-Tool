
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import ConversationView from './components/ConversationView';
import SimulationPanel from './components/SimulationPanel';
import { Lead, LeadStatus, LeadPlatform, LeadType, Message } from './types';
import { INITIAL_LEADS } from './constants';
import { analyzeLeadSentiment } from './services/geminiService';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads'>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  useEffect(() => {
    const savedLeads = localStorage.getItem('socialLeads');
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        // Convert dates back to objects
        const hydrated = parsed.map((l: any) => ({
          ...l,
          capturedAt: new Date(l.capturedAt),
          messages: l.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setLeads(hydrated);
      } catch (e) {
        console.error("Failed to load leads", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('socialLeads', JSON.stringify(leads));
  }, [leads]);

  const handleCaptureLead = async (payload: any) => {
    // Prevent duplicates by username
    if (leads.find(l => l.username === payload.username)) {
      showNotification("Warning: Lead from this user already exists.");
      return;
    }

    const sentiment = await analyzeLeadSentiment(payload.initialMessage);

    const newLead: Lead = {
      ...payload,
      id: Math.random().toString(36).substring(2, 9),
      status: LeadStatus.NEW,
      messages: [],
      sentiment: sentiment as any
    };

    setLeads(prev => [newLead, ...prev]);
    showNotification(`New ${payload.platform} lead captured!`);
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleSendMessage = (leadId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'system',
      timestamp: new Date()
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updatedStatus = l.status === LeadStatus.NEW ? LeadStatus.CONTACTED : l.status;
        return {
          ...l,
          status: updatedStatus,
          messages: [...l.messages, newMessage]
        };
      }
      return l;
    }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <i className="fas fa-robot text-lg"></i>
          </div>
          <h1 className="hidden lg:block font-extrabold text-xl text-slate-900 tracking-tight">SocialLead <span className="text-indigo-600">AI</span></h1>
        </div>

        <nav className="flex-grow px-4 mt-4 space-y-2">
          <SidebarItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon="fa-chart-pie" 
            label="Overview" 
          />
          <SidebarItem 
            active={activeTab === 'leads'} 
            onClick={() => setActiveTab('leads')}
            icon="fa-address-book" 
            label="Lead Inbox" 
            badge={leads.filter(l => l.status === LeadStatus.NEW).length}
          />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 hidden lg:block">
           <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Platform Status</p>
              <div className="space-y-2">
                <PlatformStatus icon="fab fa-instagram" name="Instagram" status="active" />
                <PlatformStatus icon="fab fa-facebook" name="Facebook" status="active" />
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow pl-20 lg:pl-64 transition-all">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'Business Insights' : 'Lead Management'}
            </h2>
            <p className="text-sm text-slate-500">Welcome back, Social Manager</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 cursor-pointer">
              <i className="fas fa-bell"></i>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Pro Account</p>
              </div>
              <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border border-slate-200" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <Dashboard leads={leads} />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Recent Captures</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-indigo-600 text-sm font-bold hover:underline">View All Leads</button>
                  </div>
                  <LeadList 
                    leads={leads.slice(0, 5)} 
                    onSelectLead={(l) => { setSelectedLeadId(l.id); setActiveTab('leads'); }}
                    onUpdateStatus={handleUpdateStatus} 
                  />
                </div>
              </div>
              <div className="space-y-8">
                <SimulationPanel onCaptureLead={handleCaptureLead} />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Automation Logs</h3>
                  <div className="space-y-4">
                    <LogItem time="Just now" text="AI analyzed sentiment for new lead 'Sarah'" type="ai" />
                    <LogItem time="2h ago" text="Auto-reply sent to Instagram lead @sarah_j" type="system" />
                    <LogItem time="5h ago" text="Lead 'Michael' status updated to Contacted" type="status" />
                    <LogItem time="Yesterday" text="Lead 'Alex' reached 'Converted' status" type="status" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Active Pipeline</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <i className="fas fa-download"></i> Export CSV
                  </button>
                </div>
              </div>
              <LeadList 
                leads={leads} 
                onSelectLead={(l) => setSelectedLeadId(l.id)}
                onUpdateStatus={handleUpdateStatus} 
              />
            </div>
          )}
        </div>

        {/* Notification Toaster */}
        {notification && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-3">
            <i className="fas fa-check-circle text-green-400"></i>
            {notification}
          </div>
        )}

        {/* Conversation Drawer */}
        {selectedLead && (
          <ConversationView 
            lead={selectedLead} 
            onClose={() => setSelectedLeadId(null)} 
            onSendMessage={handleSendMessage}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: string, label: string, badge?: number }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    <i className={`fas ${icon} text-lg`}></i>
    <span className="hidden lg:block flex-grow text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const PlatformStatus = ({ icon, name, status }: { icon: string, name: string, status: 'active' | 'error' }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-slate-600">
      <i className={`${icon} text-sm`}></i>
      <span className="text-xs font-medium">{name}</span>
    </div>
    <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
  </div>
);

const LogItem = ({ time, text, type }: { time: string, text: string, type: 'ai' | 'system' | 'status' }) => (
  <div className="flex gap-3">
    <div className={`w-1 h-8 rounded-full ${type === 'ai' ? 'bg-purple-400' : type === 'system' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400 font-bold uppercase">{time}</span>
      <span className="text-xs text-slate-600">{text}</span>
    </div>
  </div>
);

export default App;
