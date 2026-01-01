
import React, { useState, useMemo } from 'react';
import { Lead, LeadPlatform, LeadStatus, LeadType } from '../types';

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onSelectLead, onUpdateStatus }) => {
  const [filter, setFilter] = useState({
    platform: 'All',
    status: 'All',
    search: ''
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchPlatform = filter.platform === 'All' || lead.platform === filter.platform;
      const matchStatus = filter.status === 'All' || lead.status === filter.status;
      const matchSearch = lead.name.toLowerCase().includes(filter.search.toLowerCase()) || 
                          lead.username.toLowerCase().includes(filter.search.toLowerCase());
      return matchPlatform && matchStatus && matchSearch;
    });
  }, [leads, filter]);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LeadStatus.CONTACTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LeadStatus.FOLLOWED_UP: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case LeadStatus.CONVERTED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LeadStatus.CLOSED: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-grow">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search name or username..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={filter.platform}
            onChange={(e) => setFilter({...filter, platform: e.target.value})}
          >
            <option value="All">All Platforms</option>
            <option value={LeadPlatform.INSTAGRAM}>Instagram</option>
            <option value={LeadPlatform.FACEBOOK}>Facebook</option>
          </select>
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="All">All Statuses</option>
            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Lead</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Initial Message</th>
              <th className="px-6 py-4">Sentiment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${lead.platform === LeadPlatform.INSTAGRAM ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' : 'bg-[#1877F2]'}`}>
                      {lead.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <i className={`fab ${lead.platform === LeadPlatform.INSTAGRAM ? 'fa-instagram' : 'fa-facebook'} text-base`}></i>
                      {lead.platform}
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-max">{lead.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 truncate max-w-[200px]" title={lead.initialMessage}>
                    {lead.initialMessage}
                  </p>
                  <span className="text-[10px] text-slate-400">{new Date(lead.capturedAt).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    lead.sentiment === 'Positive' ? 'bg-green-50 text-green-700 border-green-100' :
                    lead.sentiment === 'Negative' ? 'bg-red-50 text-red-700 border-red-100' :
                    'bg-slate-50 text-slate-700 border-slate-100'
                  }`}>
                    {lead.sentiment || 'Analyzing...'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onSelectLead(lead)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <i className="fas fa-comment-dots"></i>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                  No leads found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadList;
