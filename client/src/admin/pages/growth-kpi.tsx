import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sidebar, Header } from './clients';
import { Phone, MessageSquare, Mail, UserPlus, FileText, CalendarCheck, CheckSquare, LineChart, Search, Filter } from 'lucide-react';
import { useAppStore } from '@/admin/lib/store';

export default function GrowthKPIPage() {
  const { sidebarOpen } = useAppStore();
  const [openMenus, setOpenMenus] = useState<string>('crm');
  const [location] = useLocation();
  const [activeTimeFilter, setActiveTimeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setActiveTimeFilter(null);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  // Base dummy data (All Time / Reset state)
  const baseKpis = [
    { title: 'Outreach Calls', value: 245, icon: Phone },
    { title: 'Outreach Texts', value: 180, icon: MessageSquare },
    { title: 'Outreach Emails', value: 350, icon: Mail },
    { title: 'New Contacts', value: 42, icon: UserPlus },
    { title: 'Notes Entered', value: 86, icon: FileText },
    { title: 'Follow-up Scheduled', value: 124, icon: CalendarCheck },
    { title: 'Tasks Completed', value: 210, icon: CheckSquare },
    { title: 'Conversion Percentage', value: '12.5%', icon: LineChart }
  ];

  const baseRows = [
    { name: 'Sale Advisor', email: 'sale@yopmail.com', calls: 45, texts: 30, emails: 50, contacts: 10, clients: 5, notes: 20, followups: 25, tasks: 40 },
    { name: 'Marketing Pro', email: 'marketing@yopmail.com', calls: 35, texts: 25, emails: 120, contacts: 8, clients: 3, notes: 15, followups: 15, tasks: 35 },
    { name: 'Support Rep', email: 'support@yopmail.com', calls: 60, texts: 40, emails: 80, contacts: 5, clients: 1, notes: 30, followups: 20, tasks: 55 },
    { name: 'New Hire', email: 'new@yopmail.com', calls: 80, texts: 60, emails: 70, contacts: 12, clients: 4, notes: 18, followups: 35, tasks: 60 },
    { name: 'Lead Generator', email: 'lead@yopmail.com', calls: 25, texts: 25, emails: 30, contacts: 7, clients: 2, notes: 3, followups: 29, tasks: 20 }
  ];

  // Derived dummy data based on filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let kpis: any[] = [...baseKpis];
  let tableRows = [...baseRows];

  if (activeTimeFilter === '24h') {
    kpis = baseKpis.map(k => ({ ...k, value: typeof k.value === 'number' ? Math.floor(k.value * 0.15) : '2.1%' }));
    tableRows = baseRows.slice(0, 2);
  } else if (activeTimeFilter === '48h') {
    kpis = baseKpis.map(k => ({ ...k, value: typeof k.value === 'number' ? Math.floor(k.value * 0.3) : '4.5%' }));
    tableRows = baseRows.slice(0, 3);
  } else if (activeTimeFilter === '7d') {
    kpis = baseKpis.map(k => ({ ...k, value: typeof k.value === 'number' ? Math.floor(k.value * 0.6) : '8.2%' }));
    tableRows = baseRows.slice(0, 4);
  }

  tableRows = tableRows.filter(row => {
    return !appliedSearchQuery || 
      row.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(appliedSearchQuery.toLowerCase());
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header title="Growth KPI Overview" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white tracking-tight">Growth KPI Overview</h1>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-8 text-[#e2e8f0]">
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search name or email" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-[200px] px-3 py-2 bg-slate-900/80 border border-slate-600 bg-slate-950 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-slate-500" 
                  />
                </div>
                <select className="px-3 py-2 bg-slate-900/80 border border-slate-600 bg-slate-950 rounded-md text-sm text-white focus:outline-none">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <select className="px-3 py-2 bg-slate-900/80 border border-slate-600 bg-slate-950 rounded-md text-sm text-white focus:outline-none min-w-[120px]">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                >
                  Filter <Filter className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-600 bg-slate-950 bg-slate-800/50 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors text-white"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setActiveTimeFilter('24h')}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    activeTimeFilter === '24h' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                      : 'border-slate-600 bg-slate-950 bg-slate-800/50 hover:bg-slate-700 text-white'
                  }`}
                >
                  Last 24 hours
                </button>
                <button 
                  onClick={() => setActiveTimeFilter('48h')}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    activeTimeFilter === '48h' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                      : 'border-slate-600 bg-slate-950 bg-slate-800/50 hover:bg-slate-700 text-white'
                  }`}
                >
                  Last 48 hours
                </button>
                <button 
                  onClick={() => setActiveTimeFilter('7d')}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    activeTimeFilter === '7d' 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                      : 'border-slate-600 bg-slate-950 bg-slate-800/50 hover:bg-slate-700 text-white'
                  }`}
                >
                  Last 7 days
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {kpis.map((kpi, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 flex flex-col items-center justify-center text-center text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] relative overflow-hidden group border border-purple-500/30">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <kpi.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xs font-semibold mb-1 w-full truncate px-1 text-purple-100">{kpi.title}</div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-600 bg-slate-950">
                <table className="w-full text-left dark-table">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-600 bg-slate-950">
                      <th className="py-4 px-6 text-sm font-bold text-center" colSpan={1}></th>
                      <th className="py-3 px-4 text-sm font-bold text-center bg-orange-500/10 text-orange-400 border-x border-slate-600 bg-slate-950" colSpan={3}>Outreach Attempts</th>
                      <th className="py-3 px-4 text-sm font-bold text-center bg-purple-500/10 text-purple-400 border-r border-slate-600 bg-slate-950" colSpan={2}>Clients</th>
                      <th className="py-3 px-4 text-sm font-bold text-center bg-indigo-500/10 text-indigo-400 border-r border-slate-600 bg-slate-950" colSpan={1}>Notes</th>
                      <th className="py-3 px-4 text-sm font-bold text-center bg-cyan-500/10 text-cyan-400" colSpan={2}>Tasks</th>
                    </tr>
                    <tr className="border-b border-slate-600 bg-slate-950 text-xs text-slate-400 uppercase tracking-wider bg-slate-950">
                      <th className="py-3 px-6 font-semibold flex items-center gap-1">Name <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Calls <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Text <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Email <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">New Contacts <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Active Clients <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Notes Entered <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Follow-up Scheduled <span className="text-[10px]">↕</span></th>
                      <th className="py-3 px-4 text-center font-semibold border-l border-slate-600 bg-slate-950">Tasks Completed <span className="text-[10px]">↕</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No records found matching "{appliedSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                    tableRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-orange-500/5 border-l border-slate-800/50 font-medium">{row.calls}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-orange-500/5 border-l border-slate-800/50 font-medium">{row.texts}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-orange-500/5 border-l border-slate-800/50 font-medium">{row.emails}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-purple-500/5 border-l border-slate-800/50 font-medium">{row.contacts}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-purple-500/5 border-l border-slate-800/50 font-medium">{row.clients}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-indigo-500/5 border-l border-slate-800/50 font-medium">{row.notes}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-cyan-500/5 border-l border-slate-800/50 font-medium">{row.followups}</td>
                        <td className="py-4 px-4 text-center text-slate-300 bg-cyan-500/5 border-l border-slate-800/50 font-medium">{row.tasks}</td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
