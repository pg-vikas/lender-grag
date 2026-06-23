import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Search, Edit2, Trash2, ArrowRight, FileText, Calendar, Grip, List as ListIcon, Play, CheckSquare, X } from "lucide-react";
import { Sidebar, Header } from "./clients";

// Mock data
const mockTemplates = [
  { id: 1, name: 'Standard Website Launch', description: 'Complete checklist for launching a new 5-page business website including QA and SEO setup.', category: 'Web Development', tasks: 24, lastUpdated: 'Oct 12, 2025', color: '#3b82f6' },
  { id: 2, name: 'E-Commerce Store Setup', description: 'Step-by-step process for Shopify/WooCommerce setup including payment gateways and tax config.', category: 'E-Commerce', tasks: 38, lastUpdated: 'Nov 05, 2025', color: '#10b981' },
  { id: 3, name: 'SEO Migration Protocol', description: 'Critical steps for preserving rankings during a site redesign or domain change.', category: 'Marketing', tasks: 15, lastUpdated: 'Sep 28, 2025', color: '#f59e0b' },
  { id: 4, name: 'Monthly Maintenance', description: 'Recurring tasks for plugin updates, backups, security scans, and performance testing.', category: 'Maintenance', tasks: 12, lastUpdated: 'Dec 01, 2025', color: '#8b5cf6' },
  { id: 5, name: 'Client Onboarding', description: 'Initial setup steps including contract signing, intake forms, and kickoff meeting scheduling.', category: 'Operations', tasks: 8, lastUpdated: 'Jan 15, 2026', color: '#ec4899' },
  { id: 6, name: 'Social Media Campaign', description: 'Template for launching a new 30-day cross-platform social media ad campaign.', category: 'Marketing', tasks: 18, lastUpdated: 'Feb 20, 2026', color: '#06b6d4' }
];

export default function LaunchpadTemplatesPage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [templates, setTemplates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Web Development' });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ name: '', description: '', category: 'Web Development' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormData({ name: template.name, description: template.description, category: template.category });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name) return;
    
    const newTemplate = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tasks: 0,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 6)]
    };
    
    setTemplates([newTemplate, ...templates]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.name || !selectedTemplate) return;
    
    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, name: formData.name, description: formData.description, category: formData.category, lastUpdated: 'Today' } 
        : t
    ));
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <Header title="Launchpads" />

        <div className="flex flex-1 overflow-hidden relative z-10">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-7xl mx-auto">
              
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    Launchpad Templates
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Manage reusable task sequences for common project types
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search templates..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-600 bg-slate-950/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all"
                    />
                  </div>
                  
                  <div className="flex bg-slate-900/80 border border-slate-600 bg-slate-950/50 rounded-lg p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-colors \${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Grip className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-colors \${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  >
                    <Plus className="w-4 h-4" /> New Template
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {filteredTemplates.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-600 bg-slate-950/50 rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-600 bg-slate-950">
                    <FileText className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6">
                    {searchQuery ? "We couldn't find any templates matching your search." : "You haven't created any launchpad templates yet. Create your first template to save time on recurring projects."}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={handleOpenAdd}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create Template
                    </button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-6 \${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredTemplates.map(template => (
                    <div 
                      key={template.id} 
                      className={`bg-slate-900/60 backdrop-blur-xl border border-slate-600 bg-slate-950/50 rounded-xl overflow-hidden hover:border-slate-600 bg-slate-950 transition-all group \${viewMode === 'list' ? 'flex items-center' : 'flex flex-col'}`}
                      style={{ borderTopColor: template.color, borderTopWidth: '4px' }}
                    >
                      <div className={`p-6 \${viewMode === 'list' ? 'flex-1 flex items-center justify-between' : 'flex-1 flex flex-col'}`}>
                        <div className={`\${viewMode === 'list' ? 'flex items-center gap-6 flex-1' : ''}`}>
                          <div className="flex items-start justify-between mb-4">
                            <span 
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border"
                              style={{ 
                                color: template.color, 
                                backgroundColor: `\${template.color}15`,
                                borderColor: `\${template.color}30`
                              }}
                            >
                              {template.category}
                            </span>
                            
                            {viewMode === 'grid' && (
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(template); }}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 bg-slate-950 transition-colors"
                                  title="Edit Template"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenDelete(template); }}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/20 transition-colors"
                                  title="Delete Template"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className={`\${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <h3 className="text-[16px] font-bold text-white mb-2">{template.name}</h3>
                            <p className="text-[13px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-[12px] text-slate-500 \${viewMode === 'list' ? 'mr-8' : 'mt-auto pt-4 border-t border-slate-800/80'}`}>
                          <div className="flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5" />
                            {template.tasks} Tasks
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {template.lastUpdated}
                          </div>
                        </div>
                        
                        {viewMode === 'list' && (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {}}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[12px] font-bold rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5" /> Apply
                            </button>
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(template); }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenDelete(template); }}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {viewMode === 'grid' && (
                        <div className="bg-slate-900 p-3 border-t border-slate-800/80">
                          <button 
                            onClick={() => {}}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[13px] font-bold rounded-lg transition-colors border border-slate-600 bg-slate-950/50"
                          >
                            <Play className="w-4 h-4" /> Apply Template
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-indigo-500/30 border-t-indigo-500 border-t-4 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Plus className="w-4 h-4" />
                </div>
                Create New Template
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Template Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., SEO Migration Protocol"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe what this template covers..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-600"
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAdd}
                disabled={!formData.name}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[13px] font-bold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div 
            className="bg-slate-900 border border-slate-600 bg-slate-950/50 border-t-4 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ borderTopColor: selectedTemplate.color }}
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: `\${selectedTemplate.color}15`, color: selectedTemplate.color }}>
                  <Edit2 className="w-4 h-4" />
                </div>
                Edit Template
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Template Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={!formData.name}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[13px] font-bold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 border-t-rose-500 border-t-4 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Template?</h2>
              <p className="text-slate-400 mb-8 text-[14px] leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">"{selectedTemplate.name}"</span>? 
                This action cannot be undone and will not affect launchpads currently using this template.
              </p>
              
              <div className="flex justify-center gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-[14px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-600 bg-slate-950 transition-colors"
                >
                  Keep Template
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[14px] font-bold transition-colors shadow-lg shadow-rose-500/20"
                >
                  Yes, Delete It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
