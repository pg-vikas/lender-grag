import { useState } from "react";
import { Sidebar, Header } from "./clients";
import { Button } from "@/admin/components/ui/button";
import { Search, Filter, Download, Plus, Edit, Trash2, Clock, CheckCircle2, PauseCircle, PlayCircle, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function LaunchpadsPage() {
  const [location] = useLocation();
  const [activeFilter, setActiveFilter] = useState('All');
  const [openMenus, setOpenMenus] = useState<string>('launchpads');
  const [isAddLaunchpadOpen, setIsAddLaunchpadOpen] = useState(false);
  const [isEditLaunchpadOpen, setIsEditLaunchpadOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  
  // Launchpads State
  const [launchpads, setLaunchpads] = useState([
    { id: 1, name: "Landscaper", client: "Pink Gorilla Software", creator: "Jitender", creatorImg: "J", status: "In Progress" },
    { id: 2, name: "Demo 5", client: "Pink Gorilla Software", creator: "PG", creatorImg: "PG", status: "Not Started" },
    { id: 3, name: "Test2", client: "Pink Gorilla Software", creator: "Jitender", creatorImg: "J", status: "Not Started" },
    { id: 4, name: "Demo 4", client: "Vin Gardner", creator: "PG", creatorImg: "PG", status: "Not Started" },
    { id: 5, name: "Demo 3", client: "Pink Gorilla Software", creator: "PG", creatorImg: "PG", status: "In Progress" },
  ]);

  const [selectedLaunchpad, setSelectedLaunchpad] = useState<any>(null);

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
    setActiveFilter('All');
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const openEditModal = (launchpad: any) => {
    setSelectedLaunchpad(launchpad);
    setIsEditLaunchpadOpen(true);
  };

  const openDeleteModal = (launchpad: any) => {
    setSelectedLaunchpad(launchpad);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedLaunchpad) {
      setLaunchpads(prev => prev.filter(l => l.id !== selectedLaunchpad.id));
      setIsDeleteModalOpen(false);
      setSelectedLaunchpad(null);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLaunchpad) {
      // In a real app we would get values from form, here we'll just mock it
      // since the form doesn't have an onSubmit handler yet or state for its fields
      setIsEditLaunchpadOpen(false);
      setSelectedLaunchpad(null);
    }
  };
  
  const stats = [
    { label: 'Not Started', count: 3, colorClass: 'border-slate-500', icon: Clock, iconColor: 'text-slate-400', filterValue: 'Not Started' },
    { label: 'In Progress', count: 2, colorClass: 'border-blue-500', icon: PlayCircle, iconColor: 'text-blue-400', filterValue: 'In Progress' },
    { label: 'On Hold', count: 0, colorClass: 'border-yellow-500', icon: PauseCircle, iconColor: 'text-yellow-400', filterValue: 'On Hold' },
    { label: 'Pending Approval', count: 0, colorClass: 'border-orange-500', icon: Clock, iconColor: 'text-orange-400', filterValue: 'Pending Approval' },
    { label: 'Completed', count: 0, colorClass: 'border-emerald-500', icon: CheckCircle2, iconColor: 'text-emerald-400', filterValue: 'Completed' },
  ];

  const filteredLaunchpads = launchpads.filter(l => {
    const matchesFilter = activeFilter === 'All' || l.status === activeFilter;
    const matchesSearch = !appliedSearchQuery || 
      l.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      l.client.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      l.creator.toLowerCase().includes(appliedSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Launchpads" />
        
        <div className="flex flex-1 overflow-hidden relative z-10">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveFilter(stat.filterValue)}
                    className={`glass-panel p-4 rounded-xl border-t cursor-pointer transition-all hover:-translate-y-1 ${stat.colorClass} ${activeFilter === stat.filterValue ? 'bg-slate-800/50 shadow-[inset_0_-4px_10px_-4px_rgba(255,255,255,0.1)]' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-1.5 rounded-lg bg-slate-800/80 border border-slate-600 bg-slate-950`}>
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white ml-1">{stat.count}</div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-panel p-4 rounded-xl">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-600 bg-slate-950 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-500" 
                    />
                  </div>
                  
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    Filter <Filter className="w-4 h-4" />
                  </button>

                  {(appliedSearchQuery || activeFilter !== 'All') && (
                    <button 
                      onClick={handleReset}
                      className="px-4 py-2 bg-slate-800/50 border border-slate-600 bg-slate-950 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href="/admin/launchpads/templates">
                    <button className="px-4 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium">
                      Templates
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsExportPanelOpen(true)}
                    className="px-4 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <Button 
                    onClick={() => setIsAddLaunchpadOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all flex items-center gap-2 border-none"
                  >
                    <Plus className="w-4 h-4" /> Add New Launchpad
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="glass-panel rounded-xl overflow-hidden border-t border-purple-500/20">
                <table className="w-full text-left dark-table">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-400">Launchpad Name</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-400">Client</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Created By</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Status</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-400 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLaunchpads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No launchpads found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                    filteredLaunchpads.map((item, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <Link href={`/admin/launchpads/${i + 1}`}>
                            <span className="text-sm font-bold text-white hover:text-purple-400 transition-colors cursor-pointer block">
                              {item.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-300">{item.client}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                {item.creatorImg}
                              </div>
                              <span className="text-sm text-slate-300">{item.creator}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            item.status === 'Not Started' ? 'text-slate-400 bg-slate-800 border-slate-600 bg-slate-950' :
                            item.status === 'In Progress' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' :
                            'text-slate-400 bg-slate-800 border-slate-600 bg-slate-950'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                              className="text-slate-400 hover:text-purple-400 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); openDeleteModal(item); }}
                              className="text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Launchpad Modal */}
      {isAddLaunchpadOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddLaunchpadOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Add New Launchpad</h2>
              <button 
                onClick={() => setIsAddLaunchpadOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Launchpad Name*</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Client*</label>
                  <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none">
                    <option value="">Select a client...</option>
                    <option value="1">Pink Gorilla Software</option>
                    <option value="2">Vin Gardner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Date*</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Est. End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Description & Details</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddLaunchpadOpen(false)}
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => setIsAddLaunchpadOpen(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Launchpad Modal */}
      {isEditLaunchpadOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditLaunchpadOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Edit Launchpad</h2>
              <button 
                onClick={() => setIsEditLaunchpadOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Launchpad Name*</label>
                    <input 
                      type="text" 
                      defaultValue={selectedLaunchpad?.name}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Client*</label>
                    <select 
                      defaultValue={selectedLaunchpad?.client}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                    >
                      <option value="">Select a client...</option>
                      <option value="Pink Gorilla Software">Pink Gorilla Software</option>
                      <option value="Vin Gardner">Vin Gardner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date*</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Est. End Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select 
                      defaultValue={selectedLaunchpad?.status}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Description & Details</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditLaunchpadOpen(false)}
                  className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Launchpad Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Launchpad</h2>
            <p className="text-[15px] text-slate-300 mb-8 text-center">
              Are you sure you want to delete <span className="font-semibold text-white">"{selectedLaunchpad?.name}"</span>?
            </p>
            
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedLaunchpad(null);
                }}
                className="px-6 py-2.5 bg-slate-800 border border-slate-600 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Slide-in Panel */}
      {isExportPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsExportPanelOpen(false)}
          ></div>
          
          {/* Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 text-white">
                <Download className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Export Launchpads</h2>
              </div>
              <button 
                onClick={() => setIsExportPanelOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
              {/* Date Created */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Date Created</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-md">Today</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">This Week</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">This Month</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">All Time</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="From"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50" 
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="To"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50" 
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              {/* Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Launchpad Name", "Client", 
                    "Created By", "Start Date",
                    "End Date", "Priority",
                    "Status"
                  ].map((field) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="w-5 h-5 rounded border border-slate-600 bg-slate-950 bg-slate-900 peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(147,51,234,0)] peer-checked:shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                          <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-center">
              <button 
                onClick={() => {
                  setIsExportPanelOpen(false);
                }}
                className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Export
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
