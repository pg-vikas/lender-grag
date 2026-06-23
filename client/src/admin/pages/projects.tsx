import { useState } from "react";
import { Search, Filter, Plus, ChevronUp, ChevronDown, Folder, MoreHorizontal, LayoutGrid, List, TrendingUp, Download, Edit2, X, Trash2 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";

export default function ProjectsPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'on_hold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [location] = useLocation();
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  
  const assigneesList = ["Vikas Dev", "PG Admin", "Neeraj", "Jordan", "Chayan", "Sale Advisor"];

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees(prev => 
      prev.includes(assignee) 
        ? prev.filter(a => a !== assignee)
        : [...prev, assignee]
    );
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const [projectsList, setProjectsList] = useState([
    { name: "Twilio ticket + domain verify", client: "Pink Gorilla Ag...", dueDate: "---", priority: "Low", createdBy: "Vikas", assignee: "user1", status: "Pending Approval" },
    { name: "Design Car Washing Service landing page", client: "---", dueDate: "---", priority: "Normal", createdBy: "Neeraj", assignee: "user2", status: "In Progress" },
    { name: "El hefe-you're not the same without the...", client: "Juicy Whip", dueDate: "---", priority: "Normal", createdBy: "Manraj", assignee: "user3", status: "In Progress" },
    { name: "Website Redesign & SEO Optimization", client: "Tech Flow", dueDate: "15-11-2025", priority: "High", createdBy: "Sarah", assignee: "user4", status: "Completed" },
    { name: "Mobile App Development MVP", client: "StartUp Inc", dueDate: "20-10-2025", priority: "Urgent", createdBy: "John", assignee: "user1", status: "Completed" },
  ]);

  const filteredProjects = projectsList.filter(project => {
    let match = true;
    if (statusFilter === 'completed') {
      match = project.status === 'Completed';
    } else if (statusFilter === 'in_progress') {
      match = project.status === 'In Progress';
    } else if (statusFilter === 'on_hold') {
      match = project.status === 'On Hold';
    }
    
    if (match && appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      match = project.name.toLowerCase().includes(query) || 
              project.client.toLowerCase().includes(query) ||
              project.assignee.toLowerCase().includes(query) ||
              project.createdBy.toLowerCase().includes(query);
    }
    
    return match;
  });

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setStatusFilter('all');
  };

  const stats = {
    all: projectsList.length,
    in_progress: projectsList.filter(p => p.status === 'In Progress').length,
    on_hold: projectsList.filter(p => p.status === 'On Hold').length,
    completed: projectsList.filter(p => p.status === 'Completed').length,
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Pending Approval') return 'text-orange-500 border border-orange-200 bg-orange-50/50';
    if (status === 'Completed') return 'text-green-500 border border-green-200 bg-green-50/50';
    return 'text-sky-500 border border-sky-200 bg-sky-50/50';
  };

  const getPriorityStyle = (priority: string) => {
    if (priority === 'Low') return 'text-slate-400 border border-slate-200 bg-slate-50';
    if (priority === 'High') return 'text-orange-500 border border-orange-200 bg-orange-50';
    if (priority === 'Urgent') return 'text-red-500 border border-red-200 bg-red-50';
    return 'text-sky-500 border border-sky-200 bg-sky-50';
  };

  const getRowSurfaceClass = (index: number) =>
    index % 2 === 0
      ? 'bg-slate-900/85 border-slate-700/80'
      : 'bg-slate-800/65 border-slate-700/70';

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Projects" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300">View:</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm ${
                      viewMode === 'table' 
                        ? 'bg-slate-900/80 border border-white/10 text-indigo-400' 
                        : 'bg-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" /> Table View
                  </button>
                  <button 
                    onClick={() => setViewMode('board')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm ${
                      viewMode === 'board' 
                        ? 'bg-slate-900/80 border border-white/10 text-indigo-400' 
                        : 'bg-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Board
                  </button>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button 
                    onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
                      statusFilter === 'completed'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : 'bg-slate-900/40 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
                      statusFilter === 'in_progress'
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-400'
                        : 'bg-slate-900/40 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    In progress
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-4 mb-6 shadow-sm border border-white/10 relative z-50">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                  <div className="relative flex-1 max-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setAppliedSearchQuery(searchQuery)}
                      placeholder="Search projects..." 
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
                  <button 
                    onClick={() => setShowStats(!showStats)}
                    className="p-2 bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl/50 transition-colors"
                    title="Toggle Quick Stats"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative z-[100]">
                    <div 
                      onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                      className="flex items-center flex-wrap gap-1.5 px-3 py-1.5 bg-transparent border border-slate-600 bg-slate-950/80 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/30 transition-all cursor-pointer min-w-[140px] max-w-[280px] min-h-[40px]"
                    >
                      {selectedAssignees.length === 0 ? (
                        <span className="px-1 text-slate-300">Assigned</span>
                      ) : (
                        selectedAssignees.map(assignee => (
                          <span 
                            key={assignee} 
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-transparent border border-slate-600 bg-slate-950/80 rounded text-[13px] text-slate-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAssignee(assignee);
                            }}
                          >
                            <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer transition-colors" /> {assignee}
                          </span>
                        ))
                      )}
                      <ChevronDown className={`w-3.5 h-3.5 ml-auto text-slate-400 shrink-0 transition-transform ${isAssigneeDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isAssigneeDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsAssigneeDropdownOpen(false)}
                        />
                        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[200px] bg-white border border-slate-200 rounded-md shadow-2xl z-[150] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {assigneesList.map(assignee => {
                            const isSelected = selectedAssignees.includes(assignee);
                            return (
                              <div
                                key={assignee}
                                onClick={() => toggleAssignee(assignee)}
                                className={`px-4 py-2 text-[14px] cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-[#007bff] text-white' 
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {assignee}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsExportPanelOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-slate-600 bg-slate-950/80 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/30 transition-all min-h-[40px]"
                  >
                    <Download className="w-4 h-4" /> Export <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-medium transition-colors shadow-sm min-h-[40px]"
                  >
                    <Plus className="w-4 h-4" /> Add New Project
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            {showStats && (
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-8 shadow-sm border border-white/10 animate-in slide-in-from-top-4 duration-200 relative z-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div 
                    className={`flex flex-col group cursor-pointer p-2 -m-2 rounded-xl transition-all ${statusFilter === 'all' ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.all}</span>
                    <span className={`text-[13px] mb-4 ${statusFilter === 'all' ? 'text-indigo-400' : 'text-slate-500'}`}>All</span>
                    <div className={`h-[3px] w-full rounded-full transition-all ${statusFilter === 'all' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-500/30 group-hover:bg-indigo-500/60'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-2 -m-2 rounded-xl transition-all ${statusFilter === 'in_progress' ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setStatusFilter('in_progress')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.in_progress}</span>
                    <span className={`text-[13px] mb-4 ${statusFilter === 'in_progress' ? 'text-indigo-400' : 'text-slate-500'}`}>In Progress</span>
                    <div className={`h-[3px] w-full rounded-full transition-all ${statusFilter === 'in_progress' ? 'bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-[#a855f7]/30 group-hover:bg-[#a855f7]/60'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-2 -m-2 rounded-xl transition-all ${statusFilter === 'on_hold' ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setStatusFilter('on_hold')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.on_hold}</span>
                    <span className={`text-[13px] mb-4 ${statusFilter === 'on_hold' ? 'text-indigo-400' : 'text-slate-500'}`}>On Hold</span>
                    <div className={`h-[3px] w-full rounded-full transition-all ${statusFilter === 'on_hold' ? 'bg-[#fdba74] shadow-[0_0_10px_rgba(253,186,116,0.5)]' : 'bg-[#fdba74]/30 group-hover:bg-[#fdba74]/60'}`} />
                  </div>
                  <div 
                    className={`flex flex-col group cursor-pointer p-2 -m-2 rounded-xl transition-all ${statusFilter === 'completed' ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setStatusFilter('completed')}
                  >
                    <span className="text-[28px] font-medium text-white mb-1">{stats.completed}</span>
                    <span className={`text-[13px] mb-4 ${statusFilter === 'completed' ? 'text-indigo-400' : 'text-slate-500'}`}>Completed</span>
                    <div className={`h-[3px] w-full rounded-full transition-all ${statusFilter === 'completed' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-500/30 group-hover:bg-indigo-500/60'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* Projects Content based on View Mode */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-sm text-left whitespace-nowrap border-separate" style={{ borderSpacing: '0 12px' }}>
                  <thead>
                    <tr className="bg-slate-900/40 backdrop-blur-xl/50 text-slate-400">
                      <th className="py-4 px-6 font-medium rounded-l-[12px] cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Project Name <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Client <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Due Date <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Priority <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Created By <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Assignee <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Status <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium rounded-r-[12px] text-[13px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, i) => (
                      <tr key={i} className="group transition-all duration-200">
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 font-medium rounded-l-[12px] border-y border-l group-hover:border-slate-500 transition-colors`}>
                          <Link href="/admin/projects/1" className="text-white hover:text-indigo-400 transition-colors">{project.name}</Link>
                        </td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 font-medium text-white border-y group-hover:border-slate-500 transition-colors`}>{project.client}</td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 font-medium text-white border-y group-hover:border-slate-500 transition-colors`}>{project.dueDate}</td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 border-y group-hover:border-slate-500 transition-colors`}>
                           <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium ${getPriorityStyle(project.priority)}`}>
                             {project.priority}
                           </span>
                        </td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 border-y group-hover:border-slate-500 transition-colors`}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-white/10">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.createdBy}`} alt={project.createdBy} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-white">{project.createdBy}</span>
                          </div>
                        </td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 border-y group-hover:border-slate-500 transition-colors`}>
                          <div className="flex items-center -space-x-2">
                             <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-slate-900 relative z-10 bg-pink-500 ring-1 ring-white/10">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.assignee}1`} className="w-full h-full object-cover" />
                             </div>
                             <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-slate-900 relative z-0 bg-blue-500 ring-1 ring-white/10">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.assignee}2`} className="w-full h-full object-cover" />
                             </div>
                          </div>
                        </td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 border-y group-hover:border-slate-500 transition-colors`}>
                           <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-semibold ${getStatusStyle(project.status)}`}>
                             {project.status}
                           </span>
                        </td>
                        <td className={`${getRowSurfaceClass(i)} py-4 px-6 border-y border-r group-hover:border-slate-500 transition-colors rounded-r-[12px]`}>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setIsEditProjectModalOpen(true)}
                              className="p-1.5 text-slate-500 hover:text-white transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-[15px] h-[15px]" />
                            </button>
                            <button 
                              onClick={() => {
                                setProjectToDelete(i);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-[15px] h-[15px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-white/10">
                          No projects found matching the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
                {filteredProjects.length === 0 && (
                  <div className="col-span-1 md:col-span-3 py-12 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-white/10">
                    No projects found matching the selected criteria.
                  </div>
                )}
                {/* Board Columns */}
                {['Pending Approval', 'In Progress', 'Completed'].map((status) => {
                  const columnProjects = filteredProjects.filter(p => p.status === status);
                  
                  return (
                    <div key={status} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            status === 'Completed' ? 'bg-green-500' :
                            status === 'In Progress' ? 'bg-sky-500' :
                            'bg-orange-500'
                          }`}></div>
                          {status}
                          <span className="ml-2 text-xs py-0.5 px-2 bg-slate-800 rounded-full text-slate-400">{columnProjects.length}</span>
                        </h3>
                      </div>
                      
                      <div className="flex flex-col gap-4 min-h-[200px] bg-slate-900/20 rounded-xl p-2 border border-slate-800/50">
                        {columnProjects.map((project, i) => (
                          <div key={i} className="glass-panel p-5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors cursor-pointer group shadow-sm flex flex-col gap-4 relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsEditProjectModalOpen(true); }}
                                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setProjectToDelete(i);
                                  setIsDeleteModalOpen(true); 
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${getPriorityStyle(project.priority)}`}>
                                  {project.priority}
                                </span>
                              </div>
                              <h4 className="font-medium text-white text-[15px] leading-snug group-hover:text-indigo-400 transition-colors pr-12">{project.name}</h4>
                              <p className="text-sm text-slate-400 mt-1">{project.client}</p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                <Folder className="w-3.5 h-3.5" />
                                {project.dueDate !== "---" ? project.dueDate : "No due date"}
                              </div>
                              <div className="flex items-center -space-x-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-600 bg-slate-950 relative z-10 bg-pink-500">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.assignee}1`} className="w-full h-full object-cover" />
                                </div>
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-600 bg-slate-950 relative z-0 bg-blue-500">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.assignee}2`} className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[800px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <h2 className="text-xl font-bold text-white">Create A New Project</h2>
              <button 
                onClick={() => setIsAddProjectModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Project Name*</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Client</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option></option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Date From*</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Date To</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Priority</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Assignee</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Status</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Not Started</option>
                  </select>
                </div>
              </div>
              
              <div className="w-full h-[1px] bg-slate-800 my-6"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-white">Description & Details</span>
                <button className="w-10 h-5 bg-[#e2e8f0] rounded-full relative transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-slate-900/40 backdrop-blur-xl rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsAddProjectModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Project Modal */}
      {isEditProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[800px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex flex-col p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Project</h2>
                <button 
                  onClick={() => setIsEditProjectModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-[13px] text-slate-400 text-right mt-1">
                Created By: Vikas | 09-03-2026
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Project Name*</label>
                  <input type="text" defaultValue="Twilio ticket + domain verify" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Client</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Pink Gorilla Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Date From*</label>
                  <input type="text" defaultValue="10-03-2026" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Date To</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Priority</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Assignee</label>
                  <div className="w-full min-h-[80px] p-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-md flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-white/10 rounded text-[12px] text-slate-300 w-fit">
                      <span className="cursor-pointer hover:text-red-500">×</span>
                      Vikas Sharma (vikas@pinkgorillasoftware.com)
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-white/10 rounded text-[12px] text-slate-300 w-fit">
                      <span className="cursor-pointer hover:text-red-500">×</span>
                      Chayan Alavi (chayan@pinkgorilla.agency)
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-300 mb-1.5">Status</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Pending Approval</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="w-full h-[1px] bg-slate-800 my-6"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-white">Description & Details</span>
                <button className="w-10 h-5 bg-[#e2e8f0] rounded-full relative transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-slate-900/40 backdrop-blur-xl rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsEditProjectModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Project</h2>
            <p className="text-[15px] text-slate-300 mb-8">
              Are you sure?
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProjectToDelete(null);
                }}
                className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setProjectsList(prev => prev.filter((_, idx) => idx !== projectToDelete));
                  setIsDeleteModalOpen(false);
                  setProjectToDelete(null);
                }}
                className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
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
                <h2 className="text-lg font-semibold">Export Projects</h2>
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
              {/* Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 border-b border-slate-800 pb-2">Fields</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-2">
                  {[
                    "Date Created", "Project Name", 
                    "Status", "Client",
                    "Start Date", "Due Date",
                    "Assignee"
                  ].map((field) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="w-5 h-5 rounded border border-slate-600 bg-slate-950 bg-slate-900 peer-checked:bg-[#8b5cf6] peer-checked:border-[#8b5cf6] transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0)] peer-checked:shadow-[0_0_10px_rgba(139,92,246,0.3)]">
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
            <div className="p-6 flex justify-center mt-auto pb-12">
              <button 
                onClick={() => {
                  import('xlsx').then(XLSX => {
                    const ws = XLSX.utils.json_to_sheet(projectsList);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Projects");
                    XLSX.writeFile(wb, "projects_export.xlsx");
                    setIsExportPanelOpen(false);
                  });
                }}
                className="w-1/2 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all"
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
