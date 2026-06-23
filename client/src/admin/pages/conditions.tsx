import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import { Search, Filter, Plus, FileText, CheckCircle2, Clock, AlertCircle, UploadCloud, Eye, MoreHorizontal, User } from "lucide-react";

const mockConditions = [
  { id: "C-10482", loanId: "10482", borrower: "John & Jane Doe", name: "Updated 2025 W-2s", status: "Pending Review", requested: "10/20/26", priority: "High" },
  { id: "C-10485", loanId: "10485", borrower: "Michael Smith", name: "Letter of Explanation - Late Payment", status: "Outstanding", requested: "10/22/26", priority: "Medium" },
  { id: "C-10486", loanId: "10485", borrower: "Michael Smith", name: "Bank Statements (Last 2 Months)", status: "Cleared", requested: "10/18/26", priority: "High" },
  { id: "C-10489", loanId: "10489", borrower: "Sarah Williams", name: "Gift Letter Fully Executed", status: "Pending Review", requested: "10/25/26", priority: "High" },
  { id: "C-10490", loanId: "10489", borrower: "Sarah Williams", name: "Evidence of Earnest Money Deposit", status: "Outstanding", requested: "10/25/26", priority: "High" },
  { id: "C-10492", loanId: "10492", borrower: "Robert Johnson", name: "DD214 & Certificate of Eligibility", status: "Outstanding", requested: "10/26/26", priority: "High" },
];

export default function ConditionsPage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('conditions');
  const [activeTab, setActiveTab] = useState<string>('Pending Review');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  const filteredConditions = mockConditions.filter(c => 
    (activeTab === 'All' || c.status === activeTab) &&
    (c.borrower.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <Header title="Conditions Tracker" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Conditions Tracker
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Manage loan conditions and missing documents.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search borrower or condition" 
                    className="w-64 pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Plus className="w-4 h-4" /> Request Document
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[11px] font-bold">Needs Action</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Pending Review (Uploaded)</h3>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-rose-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[11px] font-bold">Missing</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Outstanding Conditions</h3>
                <p className="text-2xl font-bold text-white">34</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">This Week</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Cleared Conditions</h3>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-1">
              {['Pending Review', 'Outstanding', 'Cleared', 'All'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Conditions List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-800">
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Condition Name</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Borrower</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Requested</th>
                      <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConditions.map(condition => (
                      <tr key={condition.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                {condition.name}
                                {condition.priority === 'High' && (
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High Priority"></span>
                                )}
                              </div>
                              <div className="text-[12px] text-slate-500 mt-0.5 font-mono">{condition.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-sm font-medium text-slate-300">{condition.borrower}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 pl-5.5">Loan #{condition.loanId}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            condition.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            condition.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {condition.status === 'Pending Review' && <Clock className="w-3 h-3" />}
                            {condition.status === 'Cleared' && <CheckCircle2 className="w-3 h-3" />}
                            {condition.status === 'Outstanding' && <AlertCircle className="w-3 h-3" />}
                            {condition.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-slate-300">{condition.requested}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {condition.status === 'Pending Review' && (
                              <>
                                <button className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded border border-indigo-500/30 transition-colors" title="View Document">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded border border-emerald-500/30 transition-colors" title="Mark as Cleared">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {condition.status === 'Outstanding' && (
                              <button className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-colors flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Remind
                              </button>
                            )}
                            <button className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
