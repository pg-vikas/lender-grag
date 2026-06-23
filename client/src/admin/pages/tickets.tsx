import { useState } from "react";
import { Search, Filter, Plus, Edit2, ExternalLink, Pin, ChevronUp, Box, TrendingUp, Trash2, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";

export default function TicketsPage() {
  const [openMenus, setOpenMenus] = useState<string>('support');
  const [location, setLocation] = useLocation();
  const [showStats, setShowStats] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  
  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const [ticketsList, setTicketsList] = useState([
    { id: "2", subject: "Testing the Support features", user: "Milhan Farooque", client: "Pink Gorilla Ag...", date: "31-10-2025", priority: "Normal", activity: "4 months ago", status: "Answered" }
  ]);

  const handleDelete = () => {
    if (ticketToDelete !== null) {
      const updatedList = [...ticketsList];
      updatedList.splice(ticketToDelete, 1);
      setTicketsList(updatedList);
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
    }
  };

  const handleStatsFilter = (status: string) => {
    if (activeFilter === status) {
      setActiveFilter(null);
    } else {
      setActiveFilter(status);
    }
  };

  const filteredTickets = (activeFilter 
    ? ticketsList.filter(t => t.status === activeFilter)
    : ticketsList
  ).filter(t => {
    if (appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      return t.subject.toLowerCase().includes(query) ||
             t.user.toLowerCase().includes(query) ||
             t.client.toLowerCase().includes(query) ||
             t.id.toLowerCase().includes(query);
    }
    return true;
  });

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setActiveFilter(null);
  };

  // Stats data
  const stats = [
    { label: "Open", count: ticketsList.filter(t => t.status === "Open").length, color: "bg-indigo-500", filterValue: "Open" },
    { label: "On Hold", count: ticketsList.filter(t => t.status === "On Hold").length, color: "bg-[#fdba74]", filterValue: "On Hold" },
    { label: "Answered", count: ticketsList.filter(t => t.status === "Answered").length, color: "bg-indigo-500", filterValue: "Answered" },
    { label: "Closed", count: ticketsList.filter(t => t.status === "Closed").length, color: "bg-[#e2e8f0]", filterValue: "Closed" },
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Tickets" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[22px] font-semibold text-white mb-6">Tickets</h1>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-4 mb-6 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setAppliedSearchQuery(searchQuery)}
                      placeholder="Search tickets..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <button 
                    onClick={() => setAppliedSearchQuery(searchQuery)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Filter <Filter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Reset <X className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-slate-900/40 backdrop-blur-xl/50 border border-white/10 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" title="Box View">
                    <Box className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowStats(!showStats)}
                    className={`p-2.5 backdrop-blur-xl/50 border rounded-lg transition-colors ${
                      showStats 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                        : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                    title="Toggle Stats"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => setLocation('/admin/tickets/create')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" /> Add New Ticket
                </button>
              </div>
            </div>

            {/* Stats Row */}
            {showStats && (
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-8 border border-white/10 animate-in slide-in-from-top-4 duration-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col group cursor-pointer p-4 rounded-xl transition-all ${
                        activeFilter === stat.filterValue ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'
                      }`}
                      onClick={() => handleStatsFilter(stat.filterValue)}
                    >
                      <span className="text-[28px] font-medium text-white mb-1">{stat.count}</span>
                      <span className={`text-[13px] mb-4 ${activeFilter === stat.filterValue ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {stat.label}
                      </span>
                      <div className={`h-[3px] w-full rounded-full ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto pb-4">
              <table className="w-full text-sm text-left whitespace-nowrap border-separate" style={{ borderSpacing: '0 12px' }}>
                <thead>
                  <tr className="bg-slate-900/40 backdrop-blur-xl/50 text-slate-400">
                    <th className="py-4 px-6 font-medium rounded-l-[12px] w-12">
                      <div className="w-4 h-4 rounded border border-[#cbd5e1] bg-slate-900/40 backdrop-blur-xl"></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">ID <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Subject <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">User <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Client <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Date <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Priority <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Activity <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1.5 text-[13px]">Status <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                    </th>
                    <th className="py-4 px-6 font-medium rounded-r-[12px] text-[13px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, i) => (
                    <tr key={i} className="bg-slate-900/40 backdrop-blur-xl group ">
                      <td className="py-4 px-6 rounded-l-[12px] border-y border-l border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <div className="w-4 h-4 rounded border border-[#cbd5e1] bg-slate-900/40 backdrop-blur-xl"></div>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        <Link href={`/admin/tickets/${ticket.id}`} className="hover:text-indigo-400 transition-colors">{ticket.id}</Link>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        <Link href={`/admin/tickets/${ticket.id}`} className="hover:text-indigo-400 transition-colors">{ticket.subject}</Link>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                        <button 
                          onClick={() => setSelectedUser({
                            name: ticket.user,
                            email: ticket.user.toLowerCase().replace(' ', '.') + '@example.com',
                            phone: '+1 555 123 4567',
                            role: 'Administrator',
                            dateAdded: '15-08-2025',
                            lastLogin: 'Just now'
                          })}
                          className="hover:text-indigo-400 transition-colors"
                        >
                          {ticket.user}
                        </button>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{ticket.client}</td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{ticket.date}</td>
                      <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium text-sky-500 border border-sky-200 bg-sky-50/50">
                           {ticket.priority}
                         </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{ticket.activity}</td>
                      <td className="py-4 px-6 border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                         <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold text-green-600 border border-green-200 bg-green-50/50">
                           {ticket.status}
                         </span>
                      </td>
                      <td className="py-4 px-6 border-y border-r border-white/10 group-hover:border-[#cbd5e1] transition-colors rounded-r-[12px]">
                         <div className="flex items-center gap-3 text-slate-500">
                           <button 
                             onClick={() => {
                               setTicketToEdit(i);
                               setIsEditModalOpen(true);
                             }}
                             className="hover:text-indigo-400 transition-colors"
                           >
                             <Edit2 className="w-[15px] h-[15px]" />
                           </button>
                           <Link href={`/admin/tickets/${ticket.id}`} className="hover:text-white transition-colors">
                             <ExternalLink className="w-[15px] h-[15px]" />
                           </Link>
                           <button className="hover:text-indigo-400 transition-colors">
                             <Pin className="w-[15px] h-[15px]" />
                           </button>
                           <button 
                             onClick={() => {
                               setTicketToDelete(i);
                               setIsDeleteModalOpen(true);
                             }}
                             className="hover:text-rose-400 transition-colors"
                           >
                             <Trash2 className="w-[15px] h-[15px]" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-white/10">
                        No tickets found matching the selected filter.
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
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Are you sure?</h2>
              <p className="text-slate-400 text-sm">
                Do you really want to delete this ticket? This process cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[#1e293b] hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 bg-slate-950 w-28"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Support Ticket Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] rounded-xl w-full max-w-2xl border border-slate-800 shadow-2xl flex flex-col my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Edit Support Ticket</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Delete Ticket"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject*</label>
                <input 
                  type="text" 
                  defaultValue="Test"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message*</label>
                <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                  <div className="bg-slate-800/50 border-b border-slate-600 bg-slate-950 p-2 flex gap-1 flex-wrap">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-bold">B</button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded italic">I</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Link</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Img</button>
                  </div>
                  <textarea 
                    rows={8}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 resize-none"
                    defaultValue="This is test purpose"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Billing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Answered</option>
                  <option>On Hold</option>
                  <option>Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Low</option>
                  <option>Normal</option>
                  <option selected>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">* Required</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 border border-slate-600 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-[#93c5fd] text-white flex items-center justify-center mb-4 overflow-hidden shadow-sm">
                  <svg className="w-16 h-16 text-white mt-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-[#e2e8f0]">{selectedUser.name}</h2>
                <p className="text-slate-400 text-[15px]">{selectedUser.email}</p>
              </div>
              
              <div className="h-[1px] w-full bg-[#e2e8f0] mb-8"></div>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <h3 className="text-[#e2e8f0] font-medium mb-1">Phone</h3>
                  <p className="text-slate-300">{selectedUser.phone || '---'}</p>
                </div>
                <div>
                  <h3 className="text-[#e2e8f0] font-medium mb-1">Designation</h3>
                  <p className="text-slate-300">{selectedUser.role}</p>
                </div>
                <div>
                  <h3 className="text-[#e2e8f0] font-medium mb-1">Date Added</h3>
                  <p className="text-slate-300">{selectedUser.dateAdded || '---'}</p>
                </div>
                <div>
                  <h3 className="text-[#e2e8f0] font-medium mb-1">Last Seen</h3>
                  <p className="text-slate-300">{selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
