
import React, { useState } from 'react';
import { LeadPlatform, LeadType } from '../types';

interface SimulationPanelProps {
  onCaptureLead: (payload: any) => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ onCaptureLead }) => {
  const [platform, setPlatform] = useState(LeadPlatform.INSTAGRAM);
  const [type, setType] = useState(LeadType.COMMENT);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSimulate = () => {
    if (!name || !message) return;
    onCaptureLead({
      name,
      username: `@${name.toLowerCase().replace(' ', '_')}`,
      platform,
      type,
      initialMessage: message,
      capturedAt: new Date()
    });
    setName('');
    setMessage('');
  };

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-flask text-indigo-300 text-xl"></i>
        <h3 className="text-lg font-bold">Automation Simulator</h3>
      </div>
      <p className="text-sm text-indigo-200 mb-6 leading-relaxed">
        Simulate an incoming hook from Meta's Webhooks. Use this to test the lead capture logic and AI sentiment analysis.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase text-indigo-400 block mb-1">Platform</label>
            <select 
              className="w-full bg-indigo-800 border border-indigo-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as LeadPlatform)}
            >
              <option value={LeadPlatform.INSTAGRAM}>Instagram</option>
              <option value={LeadPlatform.FACEBOOK}>Facebook</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-indigo-400 block mb-1">Event Type</label>
            <select 
              className="w-full bg-indigo-800 border border-indigo-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={type}
              onChange={(e) => setType(e.target.value as LeadType)}
            >
              <option value={LeadType.COMMENT}>Comment Trigger</option>
              <option value={LeadType.DM}>Direct Message</option>
              <option value={LeadType.FORM}>Lead Form Ad</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-indigo-400 block mb-1">Lead Name</label>
          <input 
            type="text" 
            className="w-full bg-indigo-800 border border-indigo-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-500"
            placeholder="e.g. David Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-indigo-400 block mb-1">Trigger Text</label>
          <textarea 
            className="w-full bg-indigo-800 border border-indigo-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-500 min-h-[80px]"
            placeholder="What did the user comment or DM?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSimulate}
          disabled={!name || !message}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-800 disabled:text-indigo-600 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          Simulate Hook Call
        </button>
      </div>
    </div>
  );
};

export default SimulationPanel;
