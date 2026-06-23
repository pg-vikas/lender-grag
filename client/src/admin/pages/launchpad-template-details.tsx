import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { ArrowLeft, Plus, CheckCircle2, Circle, Clock, FileText, Edit2, Trash2, UploadCloud, Image as ImageIcon, File as FileIcon, X } from "lucide-react";

export default function LaunchpadTemplateDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('launchpads');
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  // This would normally be fetched from the backend. For the mockup, we will just determine the type based on ID
  const isDocumentTemplate = id === '3' || id === '4'; 
  const templateName = id === '3' ? 'Standard NDA' : id === '4' ? 'Client Onboarding' : 'Demo 5 task Template';
  const templateType = isDocumentTemplate ? 'Document Template' : 'Task Template';

  // --- TASK STATE ---
  const [isTaskCategoryModalOpen, setIsTaskCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<{id: number | string, category: string, title: string, status?: string, hours?: string, subs?: string, date?: string} | null>(null);
  const [taskFilter, setTaskFilter] = useState<'All' | 'uncompleted' | 'completed'>('All');
  
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
    }
  ]);

  // --- DOCUMENT STATE ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string | null>(null);
  const [uploadDocumentType, setUploadDocumentType] = useState('Not Signed');
  const [pendingUploadFiles, setPendingUploadFiles] = useState<{name: string, size: string, date: string, type: string}[]>([]);
  const [isDocCategoryModalOpen, setIsDocCategoryModalOpen] = useState(false);
  const [docCategoryToEdit, setDocCategoryToEdit] = useState<{id: string, name: string} | null>(null);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<{name: string, type: string, documentType?: string, categoryId?: string} | null>(null);
  const [categoryDocFilters, setCategoryDocFilters] = useState<Record<string, string>>({});
  
  const [documentCategories, setDocumentCategories] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'Agreement' },
    { id: '2', name: 'Non-Disclosure Agreement' },
    { id: '3', name: 'eSign' }
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, date: string, type: string, documentType?: string, categoryId?: string}[]>([
    { name: 'image-1772441207150-4V.png', size: '1563 kb', date: '17-10-2023', type: 'image', documentType: 'Not Signed', categoryId: '2' }
  ]);

  // --- COMMON STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'task' | 'category' | 'document' | 'docCategory', id: string | number, name: string} | null>(null);


  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  // --- TASK HANDLERS ---
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

  // --- DOCUMENT HANDLERS ---
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + ' kb',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: file.type.includes('image') ? 'image' : 'document'
      }));
      setPendingUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSaveUpload = () => {
    if (pendingUploadFiles.length > 0 && uploadCategory) {
      const filesToSave = pendingUploadFiles.map(f => ({
        ...f,
        documentType: uploadDocumentType,
        categoryId: uploadCategory
      }));
      setUploadedFiles(prev => [...prev, ...filesToSave]);
    }
    setPendingUploadFiles([]);
    setIsUploadModalOpen(false);
    setUploadCategory(null);
  };

  // --- COMMON HANDLERS ---
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

  const uncompletedCount = tasks.flatMap(c => c.items).filter(i => i.status === 'uncompleted').length;
  const completedCount = tasks.flatMap(c => c.items).filter(i => i.status === 'completed').length;

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/launchpads" />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={templateName} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar relative">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Link href="/admin/launchpads/templates">
                <button className="flex items-center gap-2 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Templates
                </button>
              </Link>
            </div>

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{templateName}</h1>
                <p className="text-slate-400 mt-1">{templateType}</p>
              </div>
            </div>

            {!isDocumentTemplate ? (
              /* ================== TASKS TEMPLATE ================== */
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white">Tasks</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setCategoryToEdit(null);
                        setIsTaskCategoryModalOpen(true);
                      }}
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
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-600 bg-slate-950">
                        <CheckCircle2 className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-slate-200 font-medium">No tasks found</h3>
                      <p className="text-slate-400 text-sm mt-1">Add a category to start creating tasks.</p>
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
                                <button className="mt-0.5 text-slate-500 hover:text-purple-400 transition-colors cursor-default">
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
            ) : (
              /* ================== DOCUMENTS TEMPLATE ================== */
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white">Documents</h2>
                  <div className="flex gap-2">
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
                  {documentCategories.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-600 bg-slate-950">
                        <FileText className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-slate-200 font-medium">No document categories</h3>
                      <p className="text-slate-400 text-sm mt-1">Add a category to start uploading template documents.</p>
                    </div>
                  ) : (
                    documentCategories.map((category) => {
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

                          <div className="flex flex-wrap items-center gap-4">
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
                                  <div className={`w-4 h-4 rounded-full border transition-all ${currentFilter === docType ? 'border-emerald-500 border-4' : 'border-slate-500'}`}></div>
                                </div>
                                <span className={`text-sm ${currentFilter === docType ? 'text-emerald-400 font-medium' : 'text-slate-400 group-hover:text-slate-300'} transition-colors`}>
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
                                        setDocumentToEdit(file);
                                        setIsEditDocumentModalOpen(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-purple-400 transition-colors bg-slate-800 hover:bg-slate-700 rounded"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setItemToDelete({type: 'document', id: file.name, name: file.name});
                                        setIsDeleteModalOpen(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800 hover:bg-slate-700 rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= MODALS ================= */}

      {/* Add/Edit Task Category Modal */}
      {isTaskCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">{categoryToEdit ? 'Edit Category' : 'Add Category'}</h2>
              <button 
                onClick={() => setIsTaskCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditCategory}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Category Name*</label>
                  <input 
                    type="text" 
                    name="categoryName"
                    defaultValue={categoryToEdit || ''}
                    placeholder="Enter category name"
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsTaskCategoryModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Document Category Modal */}
      {isDocCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">{docCategoryToEdit ? 'Edit Document Category' : 'Add Document Category'}</h2>
              <button 
                onClick={() => setIsDocCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditDocCategory}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Category Name*</label>
                  <input 
                    type="text" 
                    name="docCategoryName"
                    defaultValue={docCategoryToEdit?.name || ''}
                    placeholder="Enter document category name"
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsDocCategoryModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && taskToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">Edit Task</h2>
              <button 
                onClick={() => setIsEditTaskModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditTask}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Task Title*</label>
                  <input 
                    type="text" 
                    name="title"
                    defaultValue={taskToEdit.title}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Hours</label>
                    <input 
                      type="number" 
                      name="hours"
                      defaultValue={taskToEdit.hours}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Subs</label>
                    <input 
                      type="number" 
                      name="subs"
                      defaultValue={taskToEdit.subs}
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Status</label>
                  <select 
                    name="status"
                    defaultValue={taskToEdit.status}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                  >
                    <option value="uncompleted" className="bg-slate-800 text-slate-200">Uncompleted</option>
                    <option value="completed" className="bg-slate-800 text-slate-200">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditTaskModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">Upload Documents</h2>
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setPendingUploadFiles([]);
                }}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-400">Document Type</label>
                <select 
                  value={uploadDocumentType}
                  onChange={(e) => setUploadDocumentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                >
                  <option value="Client Signed" className="bg-slate-800 text-slate-200">Client Signed</option>
                  <option value="Contractor Signed" className="bg-slate-800 text-slate-200">Contractor Signed</option>
                  <option value="Fully Executed" className="bg-slate-800 text-slate-200">Fully Executed</option>
                  <option value="Not Signed" className="bg-slate-800 text-slate-200">Not Signed</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-600 bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-900/30 hover:bg-slate-800/30 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm font-medium text-slate-200 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, PNG, JPG, DOCX (max. 20MB)</p>
              </div>

              {pendingUploadFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Pending Uploads ({pendingUploadFiles.length})</h3>
                  {pendingUploadFiles.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 bg-slate-950/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
                          {file.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FileIcon className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{file.name}</div>
                          <div className="text-[11px] text-slate-500">{file.size}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setPendingUploadFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setPendingUploadFiles([]);
                }}
                className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUpload}
                disabled={pendingUploadFiles.length === 0}
                className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
              >
                Upload {pendingUploadFiles.length > 0 ? `(${pendingUploadFiles.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {isEditDocumentModalOpen && documentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">Edit Document</h2>
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
            >
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Document Name*</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={documentToEdit.name}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Document Type</label>
                  <select 
                    name="documentType"
                    defaultValue={documentToEdit.documentType || 'Not Signed'}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                  >
                    <option value="Client Signed" className="bg-slate-800 text-slate-200">Client Signed</option>
                    <option value="Contractor Signed" className="bg-slate-800 text-slate-200">Contractor Signed</option>
                    <option value="Fully Executed" className="bg-slate-800 text-slate-200">Fully Executed</option>
                    <option value="Not Signed" className="bg-slate-800 text-slate-200">Not Signed</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditDocumentModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-rose-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Confirm Deletion</h2>
              <p className="text-slate-400 text-center text-sm">
                Are you sure you want to delete <span className="text-slate-200 font-medium">"{itemToDelete?.name}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-center gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors w-full"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}