
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Lead, LeadPlatform, LeadStatus } from '../types';

interface DashboardProps {
  leads: Lead[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const stats = useMemo(() => {
    const total = leads.length;
    const igCount = leads.filter(l => l.platform === LeadPlatform.INSTAGRAM).length;
    const fbCount = leads.filter(l => l.platform === LeadPlatform.FACEBOOK).length;
    const converted = leads.filter(l => l.status === LeadStatus.CONVERTED).length;
    const today = new Date().toDateString();
    const todayCount = leads.filter(l => new Date(l.capturedAt).toDateString() === today).length;

    return {
      total,
      igLeads: igCount,
      fbLeads: fbCount,
      conversionRate: total > 0 ? (converted / total) * 100 : 0,
      newLeadsToday: todayCount
    };
  }, [leads]);

  const platformData = [
    { name: 'Instagram', value: stats.igLeads, color: '#E1306C' },
    { name: 'Facebook', value: stats.fbLeads, color: '#1877F2' }
  ];

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(LeadStatus).forEach(status => {
      counts[status] = leads.filter(l => l.status === status).length;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon="fa-users" color="bg-blue-500" />
        <StatCard title="New Today" value={stats.newLeadsToday} icon="fa-calendar-day" color="bg-emerald-500" />
        <StatCard title="Conversion Rate" value={`${stats.conversionRate.toFixed(1)}%`} icon="fa-chart-line" color="bg-purple-500" />
        <StatCard title="Active Inquiries" value={leads.filter(l => l.status === LeadStatus.NEW).length} icon="fa-clock" color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Platform Sources</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
                <span className="text-sm text-slate-500 font-medium">Capture Ratio</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {platformData.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                <span className="text-sm text-slate-600 font-medium">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
    <div className={`${color} p-3 rounded-lg text-white`}>
      <i className={`fas ${icon} text-xl`}></i>
    </div>
  </div>
);

export default Dashboard;
