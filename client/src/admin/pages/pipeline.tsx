import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import { Search, Filter, Plus, MoreHorizontal, Clock, AlertCircle, CheckCircle2, DollarSign, Percent, TrendingUp, Calendar } from "lucide-react";

const mockLoans = [
  { id: "10482", borrower: "John & Jane Doe", amount: "$450,000", type: "Conventional 30YR", rate: "6.500%", stage: "Processing", lockExpires: "12 Days", lockDate: "10/24/26", ltv: "80%", fico: "740" },
  { id: "10485", borrower: "Michael Smith", amount: "$320,000", type: "FHA 30YR", rate: "6.125%", stage: "Underwriting", lockExpires: "5 Days", lockDate: "10/17/26", ltv: "96.5%", fico: "680" },
  { id: "10489", borrower: "Sarah Williams", amount: "$850,000", type: "Jumbo 30YR", rate: "6.875%", stage: "Clear to Close", lockExpires: "22 Days", lockDate: "11/04/26", ltv: "75%", fico: "780" },
  { id: "10492", borrower: "Robert Johnson", amount: "$500,000", type: "VA 30YR", rate: "5.990%", stage: "Application", lockExpires: "Not Locked", lockDate: "-", ltv: "100%", fico: "710" },
  { id: "10495", borrower: "Emily Davis", amount: "$275,000", type: "Conventional 15YR", rate: "5.875%", stage: "Processing", lockExpires: "18 Days", lockDate: "10/30/26", ltv: "60%", fico: "810" },
];

const stages = ["Application", "Processing", "Underwriting", "Clear to Close", "Funded"];

export default function PipelinePage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('pipeline');
  const [activeStage, setActiveStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  const filteredLoans = mockLoans.filter(loan => 
    (activeStage === 'All' || loan.stage === activeStage) &&
    (loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) || loan.id.includes(searchQuery))
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <Header title="Loan Pipeline" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Active Pipeline
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Manage your active loans and track progress.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search borrower or loan #" 
                    className="w-64 pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[13px] font-bold transition-all border border-slate-700">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Plus className="w-4 h-4" /> New Loan
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">+12%</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Active Pipeline Volume</h3>
                <p className="text-2xl font-bold text-white">$2,445,000</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">2 closing</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Clear to Close</h3>
                <p className="text-2xl font-bold text-white">4 Loans</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[11px] font-bold">1 expiring</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Locks Expiring (&lt; 7 Days)</h3>
                <p className="text-2xl font-bold text-white">2 Loans</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">YTD</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Funded Volume</h3>
                <p className="text-2xl font-bold text-white">$12.5M</p>
              </div>
            </div>

            {/* Stages Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setActiveStage('All')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeStage === 'All' ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
              >
                All Active ({mockLoans.length})
              </button>
              {stages.map(stage => (
                <button 
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeStage === stage ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
                >
                  {stage} ({mockLoans.filter(l => l.stage === stage).length})
                </button>
              ))}
            </div>

            {/* Pipeline Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-800">
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Borrower / Loan #</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Stage</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Amount / Product</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Rate / Lock</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoans.map(loan => (
                      <tr key={loan.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group cursor-pointer">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                              {loan.borrower.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{loan.borrower}</div>
                              <div className="text-[12px] text-slate-500 font-mono mt-0.5">#{loan.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold ${
                            loan.stage === 'Clear to Close' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            loan.stage === 'Underwriting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            loan.stage === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {loan.stage === 'Clear to Close' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {loan.stage === 'Underwriting' && <Clock className="w-3.5 h-3.5" />}
                            {loan.stage}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{loan.amount}</div>
                          <div className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-2">
                            {loan.type} <span className="text-slate-600">•</span> LTV: {loan.ltv}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white flex items-center gap-1">
                            {loan.rate} 
                            {loan.lockExpires !== 'Not Locked' && <Percent className="w-3 h-3 text-slate-500" />}
                          </div>
                          <div className={`text-[12px] mt-0.5 flex items-center gap-1 ${
                            loan.lockExpires.includes('5 Days') ? 'text-rose-400 font-medium' : 'text-slate-400'
                          }`}>
                            {loan.lockExpires !== 'Not Locked' && <Calendar className="w-3 h-3" />}
                            {loan.lockExpires === 'Not Locked' ? 'Floating' : `Exp: ${loan.lockExpires}`}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLoans.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No loans found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
