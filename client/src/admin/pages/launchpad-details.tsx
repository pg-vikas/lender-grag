import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { ArrowLeft, Plus, MoreHorizontal, MessageSquare, FileText, CheckCircle2, Circle, Clock, Check, MoreVertical, Edit2, Download, Search, Paperclip, Bold, Link2, List as ListIcon, ListOrdered, Image as ImageIcon, Film, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Grid, Code, Maximize, X, UploadCloud, File as FileIcon, Trash2 } from "lucide-react";

export default function LaunchpadDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('launchpads');
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('Chat');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pendingUploadFiles, setPendingUploadFiles] = useState<{name: string, size: string, date: string, type: string}[]>([]);
  const [uploadDocumentType, setUploadDocumentType] = useState('Not Signed');
  const [isTaskTemplateModalOpen, setIsTaskTemplateModalOpen] = useState(false);
  const [isDocTemplateModalOpen, setIsDocTemplateModalOpen] = useState(false);
  const [isDocCategoryModalOpen, setIsDocCategoryModalOpen] = useState(false);
  const [docCategoryToEdit, setDocCategoryToEdit] = useState<{id: string, name: string} | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string | null>(null);
  const [categoryDocFilters, setCategoryDocFilters] = useState<Record<string, string>>({});
  const [documentCategories, setDocumentCategories] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'Agreement' },
    { id: '2', name: 'Non-Disclosure Agreement' },
    { id: '3', name: 'dfsdf' }
  ]);
  const [isTaskCategoryModalOpen, setIsTaskCategoryModalOpen] = useState(false);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [isEditProjectDetailsModalOpen, setIsEditProjectDetailsModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    id: '8',
    name: 'Demo 3',
    client: 'Pink Gorilla Software',
    startDate: '17-10-2023',
    endDate: '',
    priority: 'Low',
    status: 'In Progress',
    manager: '---',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy.'
  });
  const [documentToEdit, setDocumentToEdit] = useState<{name: string, type: string, documentType?: string, categoryId?: string} | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<{id: number | string, category: string, title: string, status?: string, hours?: string, subs?: string, date?: string} | null>(null);
  const [taskFilter, setTaskFilter] = useState<'All' | 'uncompleted' | 'completed'>('All');
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, date: string, type: string, documentType?: string, categoryId?: string}[]>([
    { name: 'image-1772441207150-4V.png', size: '1563 kb', date: '17-10-2023', type: 'image', documentType: 'Not Signed', categoryId: '2' }
  ]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'task' | 'category' | 'document' | 'note' | 'docCategory', id: string | number, name: string} | null>(null);
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteMembers, setInviteMembers] = useState<{name: string, email: string, role: string}[]>([
    { name: 'Chayan', email: 'chayan@yopmail.com', role: 'Client' },
    { name: 'Neeraj', email: 'neeraj@pinkgorillasoftware.com', role: 'Team Member' }
  ]);
  const [currentInviteInput, setCurrentInviteInput] = useState('');
  const [currentInviteRole, setCurrentInviteRole] = useState('Client');

  const [tasks, setTasks] = useState([
    {
      category: "Trailer",
      items: [
        { id: 1, title: "Task 1", hours: "0", subs: "0", status: "uncompleted" },
        { id: 2, title: "Task 2", hours: "0", subs: "0", status: "uncompleted" },
        { id: 3, title: "Task 3", hours: "0", subs: "0", status: "uncompleted" },
      ]
    },
    {
      category: "Test",
      items: [
        { id: 4, title: "Task 11", hours: "0", subs: "0", status: "uncompleted" },
        { id: 5, title: "Task 12", hours: "0", subs: "0", status: "uncompleted" },
      ]
    },
    {
      category: "Demo 2",
      items: [
        { id: 6, title: "Sub", hours: "0", subs: "0", status: "uncompleted" },
        { id: 7, title: "Sub 2", date: "24 Feb 2024", hours: "0", subs: "0", status: "uncompleted" },
      ]
    },
    {
      category: "Task 3",
      items: []
    }
  ]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const handleEditCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('categoryName') as string;
    
    if (!newName.trim()) return;

    if (categoryToEdit) {
      setTasks(prev => prev.map(cat => 
        cat.category === categoryToEdit ? { ...cat, category: newName } : cat
      ));
    } else {
      setTasks(prev => [...prev, { category: newName, items: [] }]);
    }
    
    setIsTaskCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleEditDocCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('docCategoryName') as string;
    
    if (!newName.trim()) return;

    if (docCategoryToEdit) {
      setDocumentCategories(prev => prev.map(cat => 
        cat.id === docCategoryToEdit.id ? { ...cat, name: newName } : cat
      ));
    } else {
      setDocumentCategories(prev => [...prev, { id: Date.now().toString(), name: newName }]);
    }
    
    setIsDocCategoryModalOpen(false);
    setDocCategoryToEdit(null);
  };

  const handleEditTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskToEdit) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const hours = formData.get('hours') as string;
    const subs = formData.get('subs') as string;
    const status = formData.get('status') as string;

    setTasks(prev => prev.map(cat => {
      if (cat.category === taskToEdit.category) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === taskToEdit.id 
              ? { ...item, title, hours: hours || "0", subs: subs || "0", status } 
              : item
          )
        };
      }
      return cat;
    }));

    setIsEditTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleAddInviteMember = () => {
    if (currentInviteInput.trim()) {
      const isEmail = currentInviteInput.includes('@');
      const newMember = {
        name: isEmail ? currentInviteInput.split('@')[0] : currentInviteInput,
        email: isEmail ? currentInviteInput : `${currentInviteInput.toLowerCase().replace(/\s+/g, '')}@example.com`,
        role: currentInviteRole
      };
      setInviteMembers([...inviteMembers, newMember]);
      setCurrentInviteInput('');
    }
  };

  const handleRemoveInviteMember = (index: number) => {
    setInviteMembers(inviteMembers.filter((_, i) => i !== index));
  };

  const handleUpdateMemberRole = (index: number, newRole: string) => {
    const updated = [...inviteMembers];
    updated[index].role = newRole;
    setInviteMembers(updated);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'task') {
      setTasks(prev => prev.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.id !== itemToDelete.id)
      })));
    } else if (itemToDelete.type === 'category') {
      setTasks(prev => prev.filter(cat => cat.category !== itemToDelete.name));
    } else if (itemToDelete.type === 'document') {
      setUploadedFiles(prev => prev.filter(f => f.name !== itemToDelete.id));
    } else if (itemToDelete.type === 'docCategory') {
      setDocumentCategories(prev => prev.filter(cat => cat.id !== itemToDelete.id));
      setUploadedFiles(prev => prev.filter(f => f.categoryId !== itemToDelete.id));
    }
    
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const filteredTasks = tasks.map(category => ({
    ...category,
    items: category.items.filter(item => taskFilter === 'All' || item.status === taskFilter)
  })).filter(category => category.items.length > 0);

  // Calculate counts
  const uncompletedCount = tasks.flatMap(c => c.items).filter(i => i.status === 'uncompleted').length;
  const completedCount = tasks.flatMap(c => c.items).filter(i => i.status === 'completed').length;

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/launchpads" />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title={`Launchpad: Demo ${id || 2}`} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <button 
                onClick={() => setLocation('/admin/launchpads')}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Launchpads
              </button>
            </div>

            {/* Header Card */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold">
                  🦍
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Pink Gorilla Software</div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">Demo 2</h1>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      In Progress
                    </span>
                    <div className="flex -space-x-2 ml-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px]">MJ</div>
                      <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center text-[10px]">+1</div>
                    </div>
                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Invite
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-sm font-medium text-slate-300">Progress</div>
                <div className="flex-1 md:w-48 bg-slate-800 rounded-full h-2 relative">
                  <div className="absolute left-0 top-0 h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-xs text-purple-400 font-medium">0 / 0 Hrs</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Tasks Section */}
                <div className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Tasks</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsTaskTemplateModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-600 bg-slate-950"
                      >
                        Apply Template
                      </button>
                      <button 
                        onClick={() => setIsTaskCategoryModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-600 bg-slate-950"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Category
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <button 
                      onClick={() => setTaskFilter('All')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        taskFilter === 'All' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setTaskFilter('uncompleted')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        taskFilter === 'uncompleted' 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' 
                          : 'bg-slate-800/50 text-slate-400 border-slate-600 bg-slate-950 hover:bg-slate-800'
                      }`}
                    >
                      Uncompleted ({uncompletedCount})
                    </button>
                    <button 
                      onClick={() => setTaskFilter('completed')}
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        taskFilter === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                          : 'bg-slate-800/50 text-slate-400 border-slate-600 bg-slate-950 hover:bg-slate-800'
                      }`}
                    >
                      Completed ({completedCount})
                    </button>
                  </div>

                  <div className="space-y-6">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No tasks found for this filter.
                      </div>
                    ) : (
                      filteredTasks.map((category, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <h3 className="font-semibold text-slate-200">{category.category}</h3>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCategoryToEdit(category.category);
                                  setIsTaskCategoryModalOpen(true);
                                }}
                                className="text-slate-500 hover:text-purple-400 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setItemToDelete({type: 'category', id: category.category, name: category.category});
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {category.items.map(task => (
                              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 group hover:border-slate-600 bg-slate-950 transition-colors">
                                <div className="flex items-start gap-3">
                                  <button className="mt-0.5 text-slate-500 hover:text-purple-400 transition-colors">
                                    {task.status === 'completed' ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <Circle className="w-4 h-4" />
                                    )}
                                  </button>
                                  <div>
                                    <div className="text-sm font-medium text-slate-200">{task.title}</div>
                                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                                      {task.date && <span className="text-slate-400">{task.date} • Due On</span>}
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.hours} Hrs</span>
                                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {task.subs} Sub</span>
                                      {task.status && (
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold ${
                                          task.status === 'completed' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        }`}>
                                          {task.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3 sm:mt-0 ml-7 sm:ml-0">
                                  <button className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Request Approval
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTaskToEdit({...task, category: category.category});
                                      setIsEditTaskModalOpen(true);
                                    }}
                                    className="text-slate-500 hover:text-purple-400 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setItemToDelete({type: 'task', id: task.id, name: task.title});
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="text-slate-500 hover:text-rose-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <button className="w-full py-2.5 border border-dashed border-purple-500/30 text-purple-400 hover:bg-purple-500/5 hover:border-purple-500/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                            <Plus className="w-3.5 h-3.5" /> ADD TASK
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Documents</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsDocTemplateModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-600 bg-slate-950"
                      >
                        Apply Template
                      </button>
                      <button 
                        onClick={() => {
                          setDocCategoryToEdit(null);
                          setIsDocCategoryModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-600 bg-slate-950"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Category
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {documentCategories.map((category) => {
                      const categoryFiles = uploadedFiles.filter(f => f.categoryId === category.id);
                      const currentFilter = categoryDocFilters[category.id] || 'Not Signed';
                      const filteredCategoryFiles = categoryFiles.filter(f => f.documentType === currentFilter);
                      
                      return (
                        <div key={category.id} className="space-y-4 pb-6 border-b border-slate-800 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-medium text-slate-200">{category.name}</h3>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setUploadCategory(category.id);
                                  setUploadDocumentType('Not Signed');
                                  setIsUploadModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800 hover:bg-slate-700 rounded"
                              >
                                <UploadCloud className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setDocCategoryToEdit(category);
                                  setIsDocCategoryModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-purple-400 transition-colors bg-slate-800 hover:bg-slate-700 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setItemToDelete({type: 'docCategory', id: category.id, name: category.name});
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800 hover:bg-slate-700 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {['Client Signed', 'Contractor Signed', 'Fully Executed', 'Not Signed'].map((docType) => (
                              <label key={docType} className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                  <input 
                                    type="radio" 
                                    name={`doctype-${category.id}`} 
                                    value={docType}
                                    checked={currentFilter === docType}
                                    onChange={(e) => setCategoryDocFilters(prev => ({...prev, [category.id]: e.target.value}))}
                                    className="peer sr-only"
                                  />
                                  <div className="w-4 h-4 rounded-full border border-slate-500 peer-checked:border-emerald-500 peer-checked:border-4 transition-all"></div>
                                </div>
                                <span className={`text-sm ${currentFilter === docType ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'} transition-colors`}>
                                  {docType}
                                </span>
                              </label>
                            ))}
                          </div>

                          {filteredCategoryFiles.length > 0 && (
                            <div className="space-y-2 mt-2">
                              {filteredCategoryFiles.map((file, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800 group hover:border-slate-600 bg-slate-950 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                                      {file.type.includes('image') ? (
                                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                                      ) : (
                                        <FileIcon className="w-4 h-4 text-blue-400" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-slate-200">{file.name}</div>
                                      <div className="text-[11px] text-slate-500 flex gap-2">
                                        <span>• {file.size}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setItemToDelete({type: 'document', id: file.name, name: file.name});
                                        setIsDeleteModalOpen(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {documentCategories.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                        No document categories yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="glass-panel rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Project Details</h2>
                    <button 
                      onClick={() => setIsEditProjectDetailsModalOpen(true)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Project ID</span>
                      <span className="col-span-2 text-white font-medium">{projectDetails.id}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Project Client</span>
                      <span className="col-span-2 text-white font-medium">{projectDetails.client || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Start Date</span>
                      <span className="col-span-2 text-white font-medium">{projectDetails.startDate || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">End Date</span>
                      <span className="col-span-2 text-white font-medium">{projectDetails.endDate || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Priority</span>
                      <span className="col-span-2"><span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-600 bg-slate-950">{projectDetails.priority}</span></span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Client Name</span>
                      <span className="col-span-2 text-white font-medium flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px]">PG</div>
                        {projectDetails.client}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Manager</span>
                      <span className="col-span-2 text-white font-medium">{projectDetails.manager}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Developer</span>
                      <span className="col-span-2 flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px]">MJ</div>
                         <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-900 flex items-center justify-center text-[10px]">+1</div>
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Designer</span>
                      <span className="col-span-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[10px]">PG</div>
                        <span className="text-white font-medium text-xs">PG Admin</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Description</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {projectDetails.description}
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column - Chat/Activity */}
              <div className="lg:col-span-2">
                <div className="glass-panel rounded-2xl border border-white/10 h-max flex flex-col overflow-hidden">
                  
                  <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-hide">
                    {['Chat', 'Public Notes', 'Private Notes', 'Uploads', 'Activities'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                          activeTab === tab 
                            ? 'text-purple-400 border-b-2 border-purple-500' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {activeTab === 'Chat' && (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">PG</div>
                          <div className="flex-1">
                            <div className="bg-slate-800/50 rounded-2xl rounded-tl-none p-3 border border-slate-600 bg-slate-950/50">
                              <div className="text-sm text-slate-200">PG Admin</div>
                              <div className="text-[10px] text-slate-500 mt-1">Today at 10:45 AM</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">PG</div>
                          <div className="flex-1">
                            <div className="bg-slate-800/50 rounded-2xl rounded-tl-none p-3 border border-slate-600 bg-slate-950/50">
                              <div className="text-sm text-slate-200">PG Admin</div>
                              <div className="mt-2 text-sm text-slate-300">hi</div>
                              <div className="text-[10px] text-slate-500 mt-1">Today at 10:46 AM</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">PG</div>
                          <div className="flex-1">
                            <div className="bg-slate-800/50 rounded-2xl rounded-tl-none p-3 border border-slate-600 bg-slate-950/50">
                              <div className="text-sm text-slate-200 mb-2">PG Admin</div>
                              <div className="w-full max-w-[200px] h-32 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-600 bg-slate-950 overflow-hidden">
                                {/* Placeholder for uploaded image */}
                                <div className="w-16 h-16 opacity-50">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-2">Today at 10:50 AM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Public Notes' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-slate-200">Public Notes</h3>
                        </div>
                        
                        {/* Note Composer */}
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-600 bg-slate-950/50 shadow-sm">
                          <div className="px-4 py-3 border-b border-slate-600 bg-slate-950/50 font-medium text-slate-200 bg-slate-800/50 flex justify-between items-center">
                            <span>Message</span>
                          </div>
                          <div className="p-2 border-b border-slate-600 bg-slate-950/50 flex flex-wrap gap-1 items-center text-slate-400 bg-slate-950">
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ListIcon className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Film className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignJustify className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Grid className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Code className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Maximize className="w-4 h-4" /></button>
                          </div>
                          <div className="p-4 bg-slate-950 h-32">
                            <textarea className="w-full h-full bg-transparent resize-none outline-none text-sm text-slate-300 placeholder:text-slate-600" placeholder="Write your public note here..."></textarea>
                          </div>
                          <div className="px-4 py-3 border-t border-slate-600 bg-slate-950/50 bg-slate-950 flex justify-end gap-3">
                            <button className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-md border border-slate-600 bg-slate-950 transition-colors">
                              Clear
                            </button>
                            <button className="px-5 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-md shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all">
                              Send
                            </button>
                          </div>
                        </div>

                        {/* Notes Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-semibold text-slate-200">Project Kickoff Summary</h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setIsTaskCategoryModalOpen(true)}
                                  className="p-1 text-slate-400 hover:text-purple-400"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setItemToDelete({type: 'note', id: 'note-1', name: 'Project Kickoff Summary'});
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                              Client approved the initial wireframes. We need to focus on the dashboard metrics first. Next meeting is scheduled for Thursday to review the mockups.
                            </p>
                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-600 bg-slate-950/50">
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Oct 17, 2023</span>
                              <button 
                                onClick={() => setIsTaskCategoryModalOpen(true)}
                                className="text-[10px] font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                              >
                                Meeting Notes
                              </button>
                            </div>
                          </div>

                          <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-semibold text-slate-200">Brand Guidelines</h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setIsTaskCategoryModalOpen(true)}
                                  className="p-1 text-slate-400 hover:text-purple-400"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setItemToDelete({type: 'note', id: 'note-2', name: 'Brand Guidelines'});
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                              Primary color: #7c3aed. Secondary: Emerald green. Fonts to use are Inter for body and Plus Jakarta Sans for headings.
                            </p>
                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-600 bg-slate-950/50">
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Oct 15, 2023</span>
                              <button 
                                onClick={() => setIsTaskCategoryModalOpen(true)}
                                className="text-[10px] font-medium px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors border border-slate-600 bg-slate-950"
                              >
                                + Category
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Private Notes' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-slate-200">Private Notes</h3>
                        </div>
                        
                        {/* Note Composer */}
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-600 bg-slate-950/50 shadow-sm">
                          <div className="px-4 py-3 border-b border-slate-600 bg-slate-950/50 font-medium text-slate-200 bg-slate-800/50 flex justify-between items-center">
                            <span>Private Note</span>
                          </div>
                          <div className="p-2 border-b border-slate-600 bg-slate-950/50 flex flex-wrap gap-1 items-center text-slate-400 bg-slate-950">
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ListIcon className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Film className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><AlignJustify className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Grid className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Code className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"><Maximize className="w-4 h-4" /></button>
                          </div>
                          <div className="p-4 bg-slate-950 h-32">
                            <textarea className="w-full h-full bg-transparent resize-none outline-none text-sm text-slate-300 placeholder:text-slate-600" placeholder="Write your private note here (visible only to admins)..."></textarea>
                          </div>
                          <div className="px-4 py-3 border-t border-slate-600 bg-slate-950/50 bg-slate-950 flex justify-start gap-3">
                            <button className="px-5 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-md shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all">
                              Save
                            </button>
                            <button className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-md border border-slate-600 bg-slate-950 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Notes Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-800/40 border border-slate-600 bg-slate-950/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl opacity-50"></div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                Internal Review 
                                <span className="bg-purple-500/20 text-purple-400 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">PRIVATE</span>
                              </h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setIsTaskCategoryModalOpen(true)}
                                  className="p-1 text-slate-400 hover:text-purple-400"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setItemToDelete({type: 'note', id: 'note-3', name: 'Internal Review'});
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-3 relative z-10">
                              Client requested to speed up the delivery timeline but budget remains fixed. We need to allocate resources from another project to meet this deadline. Do not discuss timeline constraints in public notes.
                            </p>
                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-600 bg-slate-950/50 relative z-10">
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Oct 18, 2023</span>
                              <button 
                                onClick={() => setIsTaskCategoryModalOpen(true)}
                                className="text-[10px] font-medium px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors border border-slate-600 bg-slate-950"
                              >
                                + Category
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Uploads' && (
                      <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-600 bg-slate-950/50 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-medium text-slate-200">Uploads</h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setIsUploadModalOpen(true)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all"
                            >
                              <Download className="w-4 h-4 rotate-180" /> Upload
                            </button>
                          </div>
                        </div>
                        
                        {uploadedFiles.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-800 rounded-xl">
                            <UploadCloud className="w-12 h-12 text-slate-600 mb-4" />
                            <p>No uploads found.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {['Not Signed', 'Client Signed', 'Contractor Signed', 'Fully Executed'].map((docType) => {
                              const typeFiles = uploadedFiles.filter(f => f.documentType === docType);
                              if (typeFiles.length === 0) return null;
                              
                              return (
                                <div key={docType} className="space-y-3">
                                  <h4 className="text-sm font-semibold text-slate-400 border-b border-slate-800 pb-2">{docType}</h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    {typeFiles.map((file, idx) => (
                                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-600 bg-slate-950/50 bg-slate-800/30 group hover:border-emerald-500/50 transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                          {file.type.includes('image') ? (
                                            <ImageIcon className="w-6 h-6 text-emerald-400" />
                                          ) : (
                                            <FileIcon className="w-6 h-6 text-blue-400" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-slate-200 break-all line-clamp-2" title={file.name}>{file.name}</p>
                                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                            <span>{file.size}</span>
                                            <span>•</span>
                                            <span>{file.date}</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors rounded">
                                            <Download className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => {
                                              setDocumentToEdit(file);
                                              setIsEditDocumentModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => {
                                              setItemToDelete({type: 'document', id: file.name, name: file.name});
                                              setIsDeleteModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
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
                    )}

                    {activeTab === 'Activities' && (
                      <div className="space-y-6">
                        <div className="relative pl-6 border-l border-slate-800 space-y-8">
                          <div className="relative">
                            <div className="absolute -left-[29px] top-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-[#0f172a]" />
                            <div className="text-sm text-white">Project Created</div>
                            <div className="text-xs text-slate-500 mt-1">17 Oct 2023 at 10:00 AM</div>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[29px] top-1 w-3 h-3 bg-slate-700 rounded-full border-2 border-[#0f172a]" />
                            <div className="text-sm text-white">Tasks Generated from Template</div>
                            <div className="text-xs text-slate-500 mt-1">17 Oct 2023 at 10:05 AM</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {activeTab === 'Chat' && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Type a message..." 
                          className="w-full bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-purple-400 transition-colors">
                            <Paperclip className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
              
            </div>

          </div>
        </main>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                  <Trash2 className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete Item</h2>
              <p className="text-slate-400 text-center mb-6">
                Are you sure you want to delete <span className="text-slate-200 font-semibold">{itemToDelete?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors border border-slate-600 bg-slate-950"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {isEditDocumentModalOpen && documentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">Edit Document</h2>
              <button 
                onClick={() => {
                  setIsEditDocumentModalOpen(false);
                  setDocumentToEdit(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newName = formData.get('name') as string;
                const newType = formData.get('documentType') as string;
                
                setUploadedFiles(prev => prev.map(f => 
                  f.name === documentToEdit.name 
                    ? { ...f, name: newName, documentType: newType } 
                    : f
                ));
                
                setIsEditDocumentModalOpen(false);
                setDocumentToEdit(null);
              }}
              className="p-6 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">File Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={documentToEdit.name}
                  className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Document Type</label>
                <select 
                  name="documentType"
                  defaultValue={documentToEdit.documentType || 'Not Signed'}
                  className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Not Signed">Not Signed</option>
                  <option value="Client Signed">Client Signed</option>
                  <option value="Contractor Signed">Contractor Signed</option>
                  <option value="Fully Executed">Fully Executed</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditDocumentModalOpen(false);
                    setDocumentToEdit(null);
                  }}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-md border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">Upload Document</h2>
              <button 
                onClick={() => {
                  setPendingUploadFiles([]);
                  setIsUploadModalOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Document Type</label>
                <select 
                  value={uploadDocumentType}
                  onChange={(e) => setUploadDocumentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Not Signed">Not Signed</option>
                  <option value="Client Signed">Client Signed</option>
                  <option value="Contractor Signed">Contractor Signed</option>
                  <option value="Fully Executed">Fully Executed</option>
                </select>
              </div>

              <label className="border-2 border-dashed border-slate-600 bg-slate-950 hover:border-emerald-500/50 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors bg-slate-950 cursor-pointer group w-full">
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const newFiles = Array.from(e.target.files).map(file => ({
                        name: file.name,
                        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        type: file.type.startsWith('image/') ? 'image' : 'document'
                      }));
                      setPendingUploadFiles(prev => [...prev, ...newFiles]);
                    }
                  }}
                />
                <UploadCloud className="w-12 h-12 text-slate-500 mb-4 group-hover:text-emerald-400 transition-colors" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">Drag your file(s) to start uploading or click to browse</h3>
                <p className="text-sm text-slate-500">
                  Allowed: .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .txt (max 15 MB each)
                </p>
              </label>

              {pendingUploadFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Selected Files ({pendingUploadFiles.length})</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {pendingUploadFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 bg-slate-950/50">
                        <div className="flex items-center gap-3">
                          {file.type === 'image' ? <ImageIcon className="w-4 h-4 text-emerald-400" /> : <FileIcon className="w-4 h-4 text-blue-400" />}
                          <span className="text-sm text-slate-200">{file.name}</span>
                          <span className="text-xs text-slate-500">{file.size}</span>
                        </div>
                        <button 
                          onClick={() => setPendingUploadFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-600 bg-slate-950/50 flex justify-end gap-3 bg-slate-900/20">
              <button 
                onClick={() => {
                  setPendingUploadFiles([]);
                  setIsUploadModalOpen(false);
                }}
                className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-md border border-slate-600 bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (pendingUploadFiles.length > 0) {
                    const filesToUpload = pendingUploadFiles.map(f => ({
                      ...f,
                      documentType: uploadDocumentType,
                      categoryId: uploadCategory || undefined
                    }));
                    setUploadedFiles(prev => [...prev, ...filesToUpload]);
                  }
                  setPendingUploadFiles([]);
                  setIsUploadModalOpen(false);
                }}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pendingUploadFiles.length === 0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Template Modal */}
      {isTaskTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">Apply Task Template</h2>
              <button 
                onClick={() => setIsTaskTemplateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 pb-2">
              <div className="flex items-center justify-between py-4 border-b border-slate-600 bg-slate-950/50">
                <div className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium">Demo 5 task Template</span>
                </div>
                <button className="px-6 py-1.5 text-emerald-400/50 border border-emerald-400/20 rounded text-sm font-medium cursor-default">
                  Applied
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-slate-600 bg-slate-950/50">
                <div className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium">Standard Task Template</span>
                </div>
                <button className="px-6 py-1.5 text-emerald-400 border border-emerald-400/50 hover:bg-emerald-400/10 rounded text-sm font-medium transition-colors">
                  Apply
                </button>
              </div>
            </div>
            
            <div className="p-6 flex justify-between items-center mt-2 bg-slate-800/30">
              <span className="text-sm font-medium text-slate-400">Create Your Own Template?</span>
              <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && taskToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">Edit Task</h2>
              <button 
                onClick={() => {
                  setIsEditTaskModalOpen(false);
                  setTaskToEdit(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditTask}>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Task Title*</label>
                  <input 
                    type="text" 
                    name="title"
                    defaultValue={taskToEdit.title}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium text-slate-400">Hours</label>
                    <input 
                      type="number" 
                      name="hours"
                      defaultValue={taskToEdit.hours}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium text-slate-400">Subs</label>
                    <input 
                      type="number" 
                      name="subs"
                      defaultValue={taskToEdit.subs}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Status</label>
                  <select 
                    name="status"
                    defaultValue={taskToEdit.status}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="uncompleted">Uncompleted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditTaskModalOpen(false);
                    setTaskToEdit(null);
                  }}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Category Modal */}
      {isTaskCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-200">{categoryToEdit ? 'Edit Category' : 'Add Task Category'}</h2>
              <button 
                onClick={() => {
                  setIsTaskCategoryModalOpen(false);
                  setCategoryToEdit(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditCategory}>
              <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Category Name*</label>
                <input 
                  type="text" 
                  name="categoryName"
                  defaultValue={categoryToEdit || ''}
                  className="flex-1 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsTaskCategoryModalOpen(false);
                    setCategoryToEdit(null);
                  }}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-600 bg-slate-950 transition-colors"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#7c3aed] hover:bg-purple-600 shadow-[0_0_10px_rgba(124,58,237,0.3)] text-white text-sm font-medium rounded-xl transition-all"
                >
                  {categoryToEdit ? 'Save' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Template Modal */}
      {isDocTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center border-b border-slate-600 bg-slate-950/50">
              <h2 className="text-xl font-bold text-white">Apply Document Template</h2>
              <button 
                onClick={() => setIsDocTemplateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 pb-2 bg-slate-950">
              <div className="flex items-center justify-between py-5 border-b border-slate-600 bg-slate-950/50">
                <div className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Demo Document Template</span>
                </div>
                <button className="px-6 py-1.5 text-[#2DD4BF] border border-[#2DD4BF]/50 hover:bg-[#2DD4BF]/10 rounded text-[13px] font-medium transition-colors">
                  Apply
                </button>
              </div>
              <div className="flex items-center justify-between py-5 border-b border-slate-600 bg-slate-950/50">
                <div className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Standard Document Template</span>
                </div>
                <button className="px-6 py-1.5 text-[#2DD4BF]/60 border border-[#2DD4BF]/30 rounded text-[13px] font-medium cursor-default">
                  Applied
                </button>
              </div>
            </div>
            
            <div className="p-6 flex justify-between items-center mt-2 bg-slate-800/30">
              <span className="text-[15px] font-semibold text-slate-400">Create Your Own Template?</span>
              <button className="px-6 py-2.5 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-slate-900 text-[13px] font-bold rounded shadow-sm transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Category Modal */}
      {isDocCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex justify-between items-center border-b border-slate-600 bg-slate-950/50">
              <h2 className="text-xl font-bold text-white">{docCategoryToEdit ? 'Edit' : 'Add'} Document Category</h2>
              <button 
                onClick={() => setIsDocCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditDocCategory}>
              <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-950">
                <label className="text-[15px] font-medium text-slate-400 whitespace-nowrap">Category Name*</label>
                <input 
                  type="text" 
                  name="docCategoryName"
                  defaultValue={docCategoryToEdit?.name || ''}
                  className="flex-1 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-[15px] text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 shadow-sm transition-all"
                  required
                />
              </div>
              
              <div className="p-6 flex justify-end gap-3 bg-slate-800/30 mt-8 border-t border-slate-600 bg-slate-950/50">
                <button 
                  type="button"
                  onClick={() => setIsDocCategoryModalOpen(false)}
                  className="px-6 py-2.5 bg-transparent hover:bg-slate-800 text-slate-300 text-[15px] font-medium rounded-xl border border-slate-600 bg-slate-950 transition-colors shadow-sm"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-[#7c3aed] hover:bg-purple-600 text-white text-[15px] font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Project Details Modal */}
      {isEditProjectDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Launchpad</h2>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">Created By: PG | 17-12-2025</span>
                <button 
                  onClick={() => setIsEditProjectDetailsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setProjectDetails(prev => ({
                ...prev,
                name: formData.get('name') as string,
                client: formData.get('client') as string,
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string,
                priority: formData.get('priority') as string,
                status: formData.get('status') as string,
                description: formData.get('description') as string,
              }));
              setIsEditProjectDetailsModalOpen(false);
            }}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Launchpad Name*</label>
                    <input 
                      type="text" 
                      name="name"
                      defaultValue={projectDetails.name}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Client*</label>
                    <select 
                      name="client"
                      defaultValue={projectDetails.client}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                      required
                    >
                      <option value="Pink Gorilla Software">Pink Gorilla Software</option>
                      <option value="Acme Corp">Acme Corp</option>
                      <option value="Globex">Globex</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Start Date*</label>
                    <input 
                      type="text" 
                      name="startDate"
                      defaultValue={projectDetails.startDate}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Est. End Date</label>
                    <input 
                      type="text" 
                      name="endDate"
                      defaultValue={projectDetails.endDate}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Priority</label>
                    <select 
                      name="priority"
                      defaultValue={projectDetails.priority}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Status</label>
                    <select 
                      name="status"
                      defaultValue={projectDetails.status}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-slate-300">Description & Details</h3>
                    <div className="w-10 h-5 bg-purple-500 rounded-full flex items-center p-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm transition-transform"></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-600 bg-slate-950/50">
                    <div className="p-2 border-b border-slate-600 bg-slate-950/50 flex flex-wrap gap-1 items-center text-slate-400 bg-slate-800/30">
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><ListIcon className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><Film className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                      <button type="button" className="p-1.5 hover:bg-slate-700 hover:text-slate-200 rounded transition-colors"><AlignJustify className="w-4 h-4" /></button>
                    </div>
                    <div className="p-4 bg-slate-950 h-40">
                      <textarea 
                        name="description"
                        defaultValue={projectDetails.description}
                        className="w-full h-full bg-transparent resize-none outline-none text-sm text-slate-300 placeholder:text-slate-600 leading-relaxed" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditProjectDetailsModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Invite Client Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-[640px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-7 pb-4 flex justify-between items-center border-b border-slate-600 bg-slate-950/50">
              <h2 className="text-[22px] font-bold text-white">Invite Client</h2>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-7 space-y-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-slate-400">Invite*</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={currentInviteInput}
                      onChange={(e) => setCurrentInviteInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInviteMember();
                        }
                      }}
                      placeholder="Email address..."
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 h-11 text-[14px] text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <select
                      value={currentInviteRole}
                      onChange={(e) => setCurrentInviteRole(e.target.value)}
                      className="bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 h-11 text-[14px] text-slate-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none pr-10 cursor-pointer min-w-[130px]"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                    >
                      <option value="Client" className="bg-slate-800">Client</option>
                      <option value="Team Member" className="bg-slate-800">Team Member</option>
                    </select>
                    <button 
                      onClick={() => {
                        if (currentInviteInput.trim()) {
                          handleAddInviteMember();
                        } else {
                          setIsInviteModalOpen(false);
                        }
                      }}
                      className="px-8 h-11 bg-[#7c3aed] hover:bg-purple-600 text-white text-[14px] font-semibold rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-[14px] font-medium text-slate-400">Members</h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                  {inviteMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between group p-3 bg-slate-800/30 border border-slate-600 bg-slate-950/50 rounded-xl hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-[40px] h-[40px] rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-[16px] font-semibold shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[15px] font-bold text-slate-200 truncate mb-0.5">{member.name}</div>
                          <div className="text-[13px] text-slate-400 truncate leading-none">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(index, e.target.value)}
                          className="bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-3.5 h-10 text-[13px] font-medium text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none pr-8 min-w-[130px]"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                        >
                          <option value="Client" className="bg-slate-800">Client</option>
                          <option value="Team Member" className="bg-slate-800">Team Member</option>
                        </select>
                        <button 
                          onClick={() => handleRemoveInviteMember(index)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {inviteMembers.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm bg-slate-800/20 border border-slate-600 bg-slate-950/50 rounded-xl">
                      No members added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
