import { useState } from "react";
import { Sidebar, Header } from "./clients";
import { FileText, Search, Filter, MoreHorizontal, Eye, Download, CheckCircle2, Clock, Edit2, Trash2, Mail, Link as LinkIcon, Users, User, Share2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ESignaturesDocumentsPage() {
  const [openMenus, setOpenMenus] = useState<string>('esignatures');
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    {
      id: "doc_1",
      title: "Website Redesign Agreement - TechCorp",
      status: "completed",
      lastUpdated: "Mar 15, 2026",
      recipients: [{ name: "John Doe", status: "signed" }],
      owner: "Neeraj Kumar",
      type: "Agreement"
    },
    {
      id: "doc_2",
      title: "SEO Monthly Retainer - GrowthInc",
      status: "pending",
      lastUpdated: "Mar 20, 2026",
      recipients: [{ name: "Sarah Smith", status: "waiting" }, { name: "Neeraj Kumar", status: "signed" }],
      owner: "Neeraj Kumar",
      type: "Retainer"
    },
    {
      id: "doc_3",
      title: "Non-Disclosure Agreement - StartupX",
      status: "draft",
      lastUpdated: "Mar 22, 2026",
      recipients: [],
      owner: "Neeraj Kumar",
      type: "NDA"
    },
    {
      id: "doc_4",
      title: "Marketing Proposal Q2 - GlobalBrands",
      status: "completed",
      lastUpdated: "Feb 28, 2026",
      recipients: [{ name: "Michael Johnson", status: "signed" }],
      owner: "Neeraj Kumar",
      type: "Proposal"
    },
    {
      id: "doc_5",
      title: "Social Media Management - LocalStore",
      status: "pending",
      lastUpdated: "Mar 25, 2026",
      recipients: [{ name: "Emily Brown", status: "waiting" }],
      owner: "Neeraj Kumar",
      type: "Agreement"
    }
  ];

  const filteredDocs = documents.filter(doc => {
    if (activeTab !== 'all' && doc.status !== activeTab) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5" /> Waiting for Others
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700 text-slate-300 border border-slate-600 bg-slate-950 rounded text-[11px] font-bold">
            <Edit2 className="w-3.5 h-3.5" /> Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar openMenus={openMenus} toggleMenu={(m) => setOpenMenus(m === openMenus ? '' : m)} currentPath={location} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header title="Manage Documents" />

        <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Documents</h1>
                <p className="text-sm text-slate-400 mt-1">Manage, track, and review all your e-signature documents.</p>
              </div>
              <button 
                onClick={() => setLocation('/admin/esignatures/send')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Send New Document
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">124</h3>
                  <p className="text-[12px] font-medium text-slate-400">Total Documents</p>
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">89</h3>
                  <p className="text-[12px] font-medium text-slate-400">Completed</p>
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">15</h3>
                  <p className="text-[12px] font-medium text-slate-400">Waiting for Others</p>
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <Users className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">4</h3>
                  <p className="text-[12px] font-medium text-slate-400">Action Required</p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-600 bg-slate-950/50 rounded-2xl shadow-xl overflow-hidden flex flex-col">
              
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/30">
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-600 bg-slate-950 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'all', label: 'All Documents' },
                    { id: 'pending', label: 'Waiting for Others' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'draft', label: 'Drafts' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 rounded-md text-[13px] font-bold transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-slate-700 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text"
                      placeholder="Search documents..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg text-[13px] text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                    />
                  </div>
                  <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-600 bg-slate-950 rounded-lg transition-colors shadow-sm" title="Filter Options">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950">
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Document Title</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recipients</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                                doc.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                doc.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' :
                                'bg-slate-700/50 border-slate-600 bg-slate-950'
                              }`}>
                                <FileText className={`w-5 h-5 ${
                                  doc.status === 'completed' ? 'text-emerald-400' :
                                  doc.status === 'pending' ? 'text-amber-400' :
                                  'text-slate-400'
                                }`} />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer">{doc.title}</h4>
                                <div className="text-[12px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{doc.type}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {doc.owner}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-4">
                            {doc.recipients.length > 0 ? (
                              <div className="flex -space-x-2">
                                {doc.recipients.map((rec, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white ${
                                      rec.status === 'signed' ? 'bg-emerald-600' : 'bg-amber-500'
                                    }`}
                                    title={`${rec.name} (${rec.status})`}
                                  >
                                    {rec.name.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {doc.recipients.length > 2 && (
                                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                                    +{doc.recipients.length - 2}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[12px] text-slate-500 italic">No recipients added</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-slate-300 font-medium">
                            {doc.lastUpdated}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {doc.status === 'pending' && (
                                <button className="px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 bg-slate-950" title="Send Reminder">
                                  Remind
                                </button>
                              )}
                              {doc.status === 'draft' && (
                                <button 
                                  onClick={() => setLocation('/admin/esignatures/send')}
                                  className="px-3 py-1.5 text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/30"
                                >
                                  Continue
                                </button>
                              )}
                              
                              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 bg-slate-950/50 bg-slate-950" title="View Document">
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {doc.status === 'completed' && (
                                <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors border border-slate-600 bg-slate-950/50 bg-slate-950" title="Download PDF">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 bg-slate-950/50 bg-slate-950" title="More Options">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="w-12 h-12 text-slate-600 mb-3" />
                            <p className="text-[14px] font-medium text-white mb-1">No documents found</p>
                            <p className="text-[13px]">We couldn't find any documents matching your criteria.</p>
                            <button 
                              onClick={() => {
                                setActiveTab('all');
                                setSearchQuery('');
                              }}
                              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[12px] font-medium transition-colors"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredDocs.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
                  <span className="text-[12px] text-slate-400">
                    Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">{filteredDocs.length}</span> of <span className="font-bold text-white">{filteredDocs.length}</span> documents
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-500 rounded border border-slate-600 bg-slate-950 text-[12px] font-medium cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-600 bg-slate-950 text-[12px] font-medium transition-colors">Next</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}