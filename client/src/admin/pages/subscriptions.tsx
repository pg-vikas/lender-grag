import { useState } from "react";
import { Search, Filter, ExternalLink, Pin, ChevronUp, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";

export default function SubscriptionsPage() {
  const [openMenus, setOpenMenus] = useState<string>('sales');
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const [subscriptionsList, setSubscriptionsList] = useState([
    { id: "SUB-000002", client: "Vs Test", plan: "Core Starter", amount: "$99.00", renewed: "27-02-2026", payments: "$0.00", status: "Active", pinned: false },
    { id: "SUB-000001", client: "Pink Gorilla...", plan: "Core Starter", amount: "$1.00", renewed: "21-01-2026", payments: "$2.00", status: "Cancelled", pinned: false },
  ]);

  const togglePin = (id: string) => {
    setSubscriptionsList(prev => prev.map(sub => sub.id === id ? { ...sub, pinned: !sub.pinned } : sub));
  };

  const filteredSubscriptions = subscriptionsList.filter(sub => {
    if (appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      return sub.id.toLowerCase().includes(query) ||
             sub.client.toLowerCase().includes(query) ||
             sub.plan.toLowerCase().includes(query);
    }
    return true;
  });

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Subscriptions" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[22px] font-semibold text-white mb-6">Subscriptions</h1>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-sm p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setAppliedSearchQuery(searchQuery)}
                    placeholder="Search subscriptions..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>
                <button 
                  onClick={() => setAppliedSearchQuery(searchQuery)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl transition-all shadow-sm hover:shadow transition-colors"
                >
                  Filter <Filter className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl transition-all shadow-sm hover:shadow transition-colors"
                >
                  Reset <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap border-separate" style={{ borderSpacing: '0 12px' }}>
                  <thead>
                    <tr className="bg-slate-900/40 backdrop-blur-xl/50 text-slate-400">
                      <th className="py-4 px-6 font-medium rounded-l-[12px] cursor-pointer hover:text-white w-32">
                        <div className="flex items-center gap-1.5 text-[13px]">ID # <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Client Name <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Plan <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Amount <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Renewed <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Payments <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Status <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium rounded-r-[12px] text-[13px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((sub, i) => (
                      <tr key={i} className="bg-slate-900/40 backdrop-blur-xl group">
                        <td className="py-4 px-6 font-medium rounded-l-[12px] border-y border-l border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                          <Link href={`/admin/subscriptions/${sub.id}`} className="text-indigo-400 hover:text-[#7c3aed] transition-colors">
                            {sub.id}
                          </Link>
                        </td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{sub.client}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{sub.plan}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{sub.amount}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{sub.renewed}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{sub.payments}</td>
                        <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                           <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold
                              ${sub.status === 'Active' ? 'text-green-600 border border-green-300 bg-transparent' : 
                                'text-red-500 border border-red-200 bg-red-50/50'}`}>
                             {sub.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 border-y border-r border-white/10 group-hover:border-[#cbd5e1] transition-colors rounded-r-[12px]">
                           <div className="flex items-center gap-3 text-slate-500">
                              <Link href={`/admin/subscriptions/${sub.id}`} className="hover:text-white transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button 
                                onClick={() => togglePin(sub.id)}
                                className={`transition-colors ${sub.pinned ? 'text-indigo-400' : 'hover:text-white'}`}
                              >
                                <Pin className={`w-4 h-4 ${sub.pinned ? 'fill-indigo-400' : ''}`} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSubscriptions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-white/10">
                          No subscriptions found matching the selected filter.
                        </td>
                      </tr>
                    )}
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
