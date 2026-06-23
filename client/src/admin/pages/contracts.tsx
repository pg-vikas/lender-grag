import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit2, Trash2, Pin, Eye, X, ChevronUp, ChevronDown, TrendingUp } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { useAppStore } from "@/admin/lib/store";

export default function ContractsPage() {
  const [openMenus, setOpenMenus] = useState<string>('contracts');
  const [location, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const contractsList = useAppStore((state) => state.contracts);
  const deleteContract = useAppStore((state) => state.deleteContract);
  const updateContract = useAppStore((state) => state.updateContract);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const togglePin = (id: string) => {
    const contract = contractsList.find(c => c.id === id);
    if (contract) {
      updateContract(id, { pinned: !contract.pinned });
    }
  };

  const filteredContracts = contractsList.filter(c => {
    let match = true;
    if (activeFilter !== 'All') {
      match = c.status === activeFilter;
    }
    
    if (match && appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      match = c.title.toLowerCase().includes(query) ||
              c.client.toLowerCase().includes(query) ||
              c.id.toLowerCase().includes(query);
    }
    
    return match;
  });

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setActiveFilter('All');
  };

  // Calculate stats
  const stats = {
    Active: contractsList.filter(c => c.status === 'Active').length,
    'Awaiting Signatures': contractsList.filter(c => c.status === 'Awaiting Signatures').length,
    Expired: contractsList.filter(c => c.status === 'Expired').length,
    Draft: contractsList.filter(c => c.status === 'Draft').length,
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Contracts" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h1 className="text-[22px] text-white font-semibold">Contracts</h1>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <div className="relative flex-1 md:w-64 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setAppliedSearchQuery(searchQuery)}
                    placeholder="Search contracts..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>
                
                <button 
                  onClick={() => setAppliedSearchQuery(searchQuery)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl transition-all shadow-sm hover:shadow shrink-0"
                >
                  Filter <Filter className="w-4 h-4" />
                </button>
                
                <Link href="/admin/contracts/templates">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-medium hover:bg-indigo-500/30 transition-all shadow-sm shrink-0">
                    Templates
                  </button>
                </Link>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl transition-all shadow-sm hover:shadow shrink-0"
                >
                  Reset <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowStats(!showStats)}
                  className={`flex items-center justify-center p-2.5 backdrop-blur-xl border rounded-xl transition-all shadow-sm hover:shadow shrink-0 ${showStats ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-slate-900/40 text-slate-300 border-white/10 hover:bg-slate-900/40'}`}
                  title="Toggle Quick Stats"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
            </div>

            {/* Stats Row */}
            {showStats && (
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-8 shadow-sm border border-white/10 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div 
                    className={`flex flex-col group cursor-pointer p-4 rounded-xl transition-all ${activeFilter === 'Active' ? 'bg-slate-800/50 shadow-inner' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setActiveFilter(activeFilter === 'Active' ? 'All' : 'Active')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.Active}</span>
                    <span className="text-[13px] text-slate-400 mb-4">Active</span>
                    <div className={`h-[3px] w-full rounded-full ${activeFilter === 'Active' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-500/50'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-4 rounded-xl transition-all ${activeFilter === 'Awaiting Signatures' ? 'bg-slate-800/50 shadow-inner' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setActiveFilter(activeFilter === 'Awaiting Signatures' ? 'All' : 'Awaiting Signatures')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats['Awaiting Signatures']}</span>
                    <span className="text-[13px] text-slate-400 mb-4">Awaiting Signatures</span>
                    <div className={`h-[3px] w-full rounded-full ${activeFilter === 'Awaiting Signatures' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-orange-500/50'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-4 rounded-xl transition-all ${activeFilter === 'Expired' ? 'bg-slate-800/50 shadow-inner' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setActiveFilter(activeFilter === 'Expired' ? 'All' : 'Expired')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.Expired}</span>
                    <span className="text-[13px] text-slate-400 mb-4">Expired</span>
                    <div className={`h-[3px] w-full rounded-full ${activeFilter === 'Expired' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-rose-500/50'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-4 rounded-xl transition-all ${activeFilter === 'Draft' ? 'bg-slate-800/50 shadow-inner' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setActiveFilter(activeFilter === 'Draft' ? 'All' : 'Draft')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.Draft}</span>
                    <span className="text-[13px] text-slate-400 mb-4">Draft</span>
                    <div className={`h-[3px] w-full rounded-full ${activeFilter === 'Draft' ? 'bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.5)]' : 'bg-slate-600/50'}`} />
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-visible pb-24">
              <table className="w-full text-sm text-left whitespace-nowrap border-separate" style={{ borderSpacing: '0 12px' }}>
                <thead>
                  <tr className="bg-slate-900/40 backdrop-blur-xl/50 text-slate-400">
                    <th className="py-4 px-6 font-medium rounded-l-[12px] cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">ID <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Title <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Client <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Date <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Client <Edit2 className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Provider <Edit2 className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Status <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium rounded-r-[12px] text-[13px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract, i) => (
                    <tr key={i} className={`group hover:bg-slate-800/60 transition-colors ${contract.pinned ? 'bg-amber-500/5 border-l-2 border-l-amber-400' : 'bg-slate-800/40 border-l-2 border-l-transparent'}`}>
                      <td className="py-4 px-6 font-medium text-slate-300 rounded-l-[12px] border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/contracts/${contract.id}`} className="hover:text-white transition-colors">
                            {contract.id}
                          </Link>
                          {contract.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        {contract.title}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-300 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        {contract.client}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-300 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        {contract.date}
                      </td>
                      <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium border
                            ${contract.clientStatus === 'Signed' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 
                            'text-slate-400 border-slate-600 bg-slate-950/50 bg-slate-800/50'}`}>
                           {contract.clientStatus}
                         </span>
                      </td>
                      <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium border
                            ${contract.providerStatus === 'Signed' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 
                            'text-slate-400 border-slate-600 bg-slate-950/50 bg-slate-800/50'}`}>
                           {contract.providerStatus}
                         </span>
                      </td>
                      <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium border
                            ${contract.status === 'Active' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 
                              contract.status === 'Awaiting Signatures' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' : 
                              'text-slate-400 border-slate-600 bg-slate-950/50 bg-slate-800/50'}`}>
                           {contract.status}
                         </span>
                      </td>
                      <td className="py-4 px-6 border-y border-r border-white/10 group-hover:border-[#cbd5e1] transition-colors rounded-r-[12px]">
                         <div className="relative flex justify-end">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setActiveDropdown(activeDropdown === i ? null : i);
                             }}
                             className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                           >
                             Action <ChevronDown className="w-4 h-4" />
                           </button>

                           {activeDropdown === i && (
                             <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-600 bg-slate-950 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                               <div className="py-1">
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setContractToDelete(contract.id); 
                                     setIsDeleteModalOpen(true); 
                                     setActiveDropdown(null); 
                                   }}
                                   className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                 >
                                   <Trash2 className="w-4 h-4 text-rose-400" /> Delete
                                 </button>
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setLocation(`/admin/contracts/${contract.id}/edit`);
                                     setActiveDropdown(null);
                                   }}
                                   className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                 >
                                   <Edit2 className="w-4 h-4 text-emerald-400" /> Edit
                                 </button>
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setLocation(`/admin/contracts/${contract.id}`);
                                     setActiveDropdown(null);
                                   }}
                                   className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                 >
                                   <Eye className="w-4 h-4 text-cyan-400" /> View Details
                                 </button>
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     togglePin(contract.id);
                                     setActiveDropdown(null);
                                   }}
                                   className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                 >
                                   <Pin className={`w-4 h-4 ${contract.pinned ? 'text-indigo-400' : 'text-slate-400'}`} /> {contract.pinned ? 'Unpin' : 'Pin'}
                                 </button>
                               </div>
                             </div>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContracts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-white/10">
                        No contracts found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Contract</h2>
            <p className="text-[15px] text-slate-300 mb-8">
              Are you sure?
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setContractToDelete(null);
                }}
                className="px-6 py-2.5 bg-slate-800 border border-slate-600 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (contractToDelete) {
                    deleteContract(contractToDelete);
                  }
                  setIsDeleteModalOpen(false);
                  setContractToDelete(null);
                }}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[600px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">Create A New Contract</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-[14px] text-slate-300">Client*</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 rounded-md text-[13px] text-white focus:outline-none">
                    <option></option>
                    <option>Pink Gorilla Software</option>
                    <option>Recloud</option>
                    <option>PG Development</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-[14px] text-slate-300">Template</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 rounded-md text-[13px] text-white focus:outline-none">
                    <option>None (blank)</option>
                    <option>Standard MSA</option>
                    <option>NDA Template</option>
                  </select>
                </div>
                
                <div className="w-full h-[1px] bg-white/10 my-4"></div>
                
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-[14px] text-slate-300">Contract Title</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-[14px] text-slate-300">Start Date</label>
                  <input type="date" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" style={{ colorScheme: 'dark' }} />
                </div>
                
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-[14px] text-slate-300">End Date</label>
                  <input type="date" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" style={{ colorScheme: 'dark' }} />
                </div>
                
                <div className="w-full h-[1px] bg-white/10 my-4"></div>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="w-5 h-5 rounded border border-slate-600 bg-slate-950 bg-slate-900 peer-checked:bg-[#8b5cf6] peer-checked:border-[#8b5cf6] transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0)] peer-checked:shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                      <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[14px] text-slate-300 group-hover:text-white transition-colors">Show contract after its been created</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
