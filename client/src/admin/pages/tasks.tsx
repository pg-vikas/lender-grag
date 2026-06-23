import { useState } from "react";
import { Search, Pencil, Trash2, X } from "lucide-react";
import { useLocation, useSearch, Link } from "wouter";
import { Sidebar, Header } from "./clients";

const MOCK_TASKS = {
  today: [
    { id: 1, name: 'Call new lead', client: 'Alpha Corp', clientId: 1, dueDateStr: 'Today, 2:00 PM', daysText: 'Due today', isOverdue: false, isCompleted: false },
    { id: 2, name: 'Send proposal', client: 'Omega Inc', clientId: 2, dueDateStr: 'Today, 5:00 PM', daysText: 'Due today', isOverdue: false, isCompleted: false },
  ],
  overdue: [
    { id: 3, name: 'test 3', client: 'PG Development', clientId: 3, dueDateStr: 'Dec 01, 2025', daysText: '105 days overdue', isOverdue: true, isCompleted: false },
    { id: 4, name: 'Follow Up', client: 'Juicy Whip', clientId: 4, dueDateStr: 'Dec 04, 2025', daysText: '102 days overdue', isOverdue: true, isCompleted: false },
    { id: 5, name: 'Follow Up', client: 'PG Development', clientId: 3, dueDateStr: 'Dec 05, 2025', daysText: '101 days overdue', isOverdue: true, isCompleted: false },
    { id: 6, name: 'Test Task', client: 'Juicy Whip', clientId: 4, dueDateStr: 'Dec 05, 2025', daysText: '101 days overdue', isOverdue: true, isCompleted: false },
    { id: 7, name: 'Follow Up', client: 'Juicy Whip', clientId: 4, dueDateStr: 'Dec 06, 2025', daysText: '100 days overdue', isOverdue: true, isCompleted: false },
  ],
  future: [
    { id: 8, name: 'Quarterly Review', client: 'Beta LLC', clientId: 5, dueDateStr: 'Next Week', daysText: '7 days from now', isOverdue: false, isCompleted: false },
    { id: 11, name: 'Check-in Meeting', client: 'Delta Co', clientId: 6, dueDateStr: 'In 2 Weeks', daysText: '14 days from now', isOverdue: false, isCompleted: false },
  ],
  completed: [
    { id: 9, name: 'Initial setup', client: 'Gamma Group', clientId: 7, dueDateStr: 'Last Week', daysText: 'Completed on time', isOverdue: false, isCompleted: true },
  ],
  missing: [
    { id: 10, name: 'Upload Logo', client: 'Delta Co', clientId: 6, dueDateStr: 'No date set', daysText: 'Action required', isOverdue: true, isCompleted: false },
    { id: 12, name: 'Sign Agreement', client: 'Zeta Corp', clientId: 8, dueDateStr: 'No date set', daysText: 'Action required', isOverdue: true, isCompleted: false },
  ]
};

export default function TasksPage() {
  const [openMenus, setOpenMenus] = useState<string>('crm');
  const [location, setLocation] = useLocation();
  const searchString = useSearch();

  const searchParams = new URLSearchParams(searchString || window.location.search);
  const currentTab = searchParams.get('tab') || 'today';

  const [tasksData, setTasksData] = useState(MOCK_TASKS);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTask, setSelectedTask] = useState<any>(null);

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
  };

  const handleTabClick = (tab: string) => {
    setLocation(`/admin/tasks?tab=${tab}`);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openDeleteModal = (task: any) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasksData(prev => ({
        ...prev,
        [currentTab]: prev[currentTab as keyof typeof prev].filter(t => t.id !== selectedTask.id)
      }));
    }
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const tasks = tasksData[currentTab as keyof typeof tasksData] || [];
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !appliedSearchQuery || 
      task.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      task.client.toLowerCase().includes(appliedSearchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Tasks" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[22px] font-semibold text-white mb-6">Client Tasks Overview</h1>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 border border-white/10">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full max-w-[320px]">
                  <label className="block text-[13px] text-slate-400 mb-2 font-medium">Client / Task Name</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-[40px] px-3 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-md focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm text-white" 
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleSearch}
                    className="h-[40px] px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    <Search className="w-4 h-4" /> Filter
                  </button>
                  {appliedSearchQuery && (
                    <button 
                      onClick={handleReset}
                      className="h-[40px] px-6 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 border border-slate-600 bg-slate-950 rounded-md"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl min-h-[400px] rounded-lg border border-white/10 overflow-hidden">
              <div className="p-6 overflow-x-auto border-b border-white/10">
                <div className="flex gap-3 min-w-max">
                  <button 
                    onClick={() => handleTabClick('today')}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${currentTab === 'today' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 hover:bg-slate-800'}`}
                  >
                    Today's Tasks ({MOCK_TASKS.today.length})
                  </button>
                  <button 
                    onClick={() => handleTabClick('overdue')}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${currentTab === 'overdue' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 hover:bg-slate-800'}`}
                  >
                    Overdue Tasks ({MOCK_TASKS.overdue.length})
                  </button>
                  <button 
                    onClick={() => handleTabClick('future')}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${currentTab === 'future' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 hover:bg-slate-800'}`}
                  >
                    Future Tasks ({MOCK_TASKS.future.length})
                  </button>
                  <button 
                    onClick={() => handleTabClick('completed')}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${currentTab === 'completed' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 hover:bg-slate-800'}`}
                  >
                    Completed Tasks ({MOCK_TASKS.completed.length})
                  </button>
                  <button 
                    onClick={() => handleTabClick('missing')}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${currentTab === 'missing' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 hover:bg-slate-800'}`}
                  >
                    Clients Missing Task ({MOCK_TASKS.missing.length})
                  </button>
                </div>
              </div>
              
              {filteredTasks.length > 0 ? (
                <div className="w-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-800/30 border-b border-white/10">
                          <th className="py-4 px-6 w-12 font-medium text-sm text-slate-300"></th>
                          <th className="py-4 px-6 font-medium text-sm text-slate-300">Task</th>
                          <th className="py-4 px-6 font-medium text-sm text-slate-300">Client</th>
                          <th className="py-4 px-6 font-medium text-sm text-slate-300">Due Date</th>
                          <th className="py-4 px-6 font-medium text-sm text-slate-300 w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                              No tasks found matching "{appliedSearchQuery}".
                            </td>
                          </tr>
                        ) : (
                        filteredTasks.map(task => (
                          <tr key={task.id} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-slate-600 bg-slate-950 bg-slate-800/50 checked:bg-indigo-500 checked:border-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-slate-900 transition-all cursor-pointer" 
                                defaultChecked={task.isCompleted} 
                              />
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-semibold text-white">{task.name}</span>
                            </td>
                            <td className="py-4 px-6">
                              <Link href={`/admin/clients/${task.clientId}`}>
                                <span className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors block">{task.client}</span>
                              </Link>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col gap-0.5">
                                <span className={`text-sm font-medium ${task.isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>{task.dueDateStr}</span>
                                <span className={`text-xs ${task.isOverdue ? 'text-rose-400/70' : 'text-slate-500'}`}>({task.daysText})</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => openEditModal(task)}
                                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(task)}
                                  className="text-slate-400 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 flex justify-center border-t border-white/10">
                    <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium transition-colors border border-slate-600 bg-slate-950">
                      show more
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-24 flex items-center justify-center">
                  <p className="text-slate-500 text-[14px]">No tasks found</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-800 bg-slate-950">
              <h2 className="text-xl font-bold text-white">Edit Task</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Task title*</label>
                <input 
                  type="text" 
                  defaultValue={selectedTask?.name} 
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                <input 
                  type="text" 
                  defaultValue="01-12-2025" 
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assignee</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none">
                  <option>Jordan (jordan@yopmail.com)</option>
                  <option>Alex (alex@yopmail.com)</option>
                  <option>Sam (sam@yopmail.com)</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Task</h2>
            <p className="text-[15px] text-slate-300 mb-8">
              Are you sure?
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
