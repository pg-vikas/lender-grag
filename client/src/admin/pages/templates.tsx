import { useState } from "react";
import { Plus, Edit2, Trash2, X, FileText, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

interface Template {
  id: string;
  title: string;
  dateCreated: string;
  createdBy: string;
  type: string;
  content: string;
}

export default function TemplatesPage() {
  const [openMenus, setOpenMenus] = useState<string>('contracts');
  const [location] = useLocation();
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Mock data state
  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', title: "Standard Non-Disclosure Agreement", dateCreated: "10-24-2023", createdBy: "System", type: "system", content: "This is a standard Non-Disclosure Agreement..." },
    { id: '2', title: "Freelance Service Contract", dateCreated: "11-05-2023", createdBy: "Admin User", type: "custom", content: "Freelance terms and conditions..." },
    { id: '3', title: "Software License Agreement", dateCreated: "12-12-2023", createdBy: "Jane Doe", type: "custom", content: "SLA details here..." },
    { id: '4', title: "Employment Contract", dateCreated: "01-15-2024", createdBy: "System", type: "system", content: "Standard employment contract terms..." },
  ]);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTemplate: Template = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      content: formData.content,
      dateCreated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      createdBy: "Current User",
      type: "custom"
    };
    setTemplates([newTemplate, ...templates]);
    setIsAddModalOpen(false);
    setFormData({ title: '', content: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTemplate) {
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? { ...t, title: formData.title, content: formData.content } : t
      ));
      setIsEditModalOpen(false);
      setCurrentTemplate(null);
      setFormData({ title: '', content: '' });
    }
  };

  const handleDeleteConfirm = () => {
    if (currentTemplate) {
      setTemplates(templates.filter(t => t.id !== currentTemplate.id));
      setIsDeleteModalOpen(false);
      setCurrentTemplate(null);
    }
  };

  const openAddModal = () => {
    setFormData({ title: '', content: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (template: Template) => {
    setCurrentTemplate(template);
    setFormData({ title: template.title, content: template.content || '' });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (template: Template) => {
    setCurrentTemplate(template);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Contract Templates" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-white tracking-tight">Contract Templates</h1>
              <button 
                onClick={openAddModal}
                className="px-4 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add New Template
              </button>
            </div>

            {/* Main Content Card */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col p-6">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="py-2 px-6 text-sm font-semibold text-slate-300">Title</th>
                      <th className="py-2 px-6 text-sm font-semibold text-slate-300">Date Created</th>
                      <th className="py-2 px-6 text-sm font-semibold text-slate-300">Created By</th>
                      <th className="py-2 px-6 text-sm font-semibold text-slate-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <tr key={template.id} className="bg-slate-900/40 border border-white/10 shadow-sm transition-colors group">
                          <td className="py-4 px-6 border-y border-l border-white/10 rounded-l-xl">
                            <button 
                              onClick={() => openEditModal(template)}
                              className="text-sm font-medium text-slate-200 hover:text-[#7c3aed] transition-colors text-left"
                            >
                              {template.title}
                            </button>
                          </td>
                          <td className="py-4 px-6 border-y border-white/10 text-sm text-slate-400">
                            {template.dateCreated}
                          </td>
                          <td className="py-4 px-6 border-y border-white/10">
                            <div className="flex items-center gap-2">
                              {template.type === 'system' ? (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">🤖</div>
                                  </div>
                                  <span className="text-sm text-slate-300">System</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                    {template.createdBy.substring(0,2).toUpperCase()}
                                  </div>
                                  <span className="text-sm text-slate-300">{template.createdBy}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 border-y border-r border-white/10 rounded-r-xl">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(template);
                                }}
                                className="text-slate-400 hover:text-purple-400 transition-colors"
                                title="Edit Template"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(template);
                                }}
                                className="text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete Template"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center border border-white/10 rounded-xl">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <FileText className="w-12 h-12 mb-3 text-slate-600" />
                            <p className="text-base font-medium">No templates found</p>
                            <p className="text-sm mt-1">Click "Add New Template" to create one.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Add New Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">Add New Contract Template</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Template Title*</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., NDA Template"
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Template Content*</label>
                  <textarea 
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter template content or placeholders here..."
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white">Edit Contract Template</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Template Title*</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., NDA Template"
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Template Content*</label>
                  <textarea 
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter template content or placeholders here..."
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-[#7c3aed] hover:bg-purple-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Template</h2>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete <span className="text-slate-200 font-semibold">{currentTemplate.title}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex-1"
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
