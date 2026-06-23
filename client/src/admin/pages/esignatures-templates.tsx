import { useState } from "react";
import { Sidebar, Header } from "./clients";
import { FileText, Search, Plus, MoreHorizontal, Copy, Edit2, Trash2, LayoutTemplate, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function ESignaturesTemplatesPage() {
  const [openMenus, setOpenMenus] = useState<string>('esignatures');
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const templates = [
    {
      id: "tpl_1",
      title: "Standard NDA",
      description: "Mutual non-disclosure agreement for standard business interactions.",
      tags: ["Legal", "Standard"],
      lastUpdated: "Jan 15, 2026",
      usageCount: 45,
      isStarred: true
    },
    {
      id: "tpl_2",
      title: "Website Design Agreement",
      description: "Comprehensive agreement covering design phases, revisions, and handoff.",
      tags: ["Services", "Web"],
      lastUpdated: "Feb 20, 2026",
      usageCount: 112,
      isStarred: true
    },
    {
      id: "tpl_3",
      title: "SEO Retainer Contract",
      description: "Monthly recurring SEO services contract with defined deliverables.",
      tags: ["Services", "Marketing"],
      lastUpdated: "Mar 05, 2026",
      usageCount: 89,
      isStarred: false
    },
    {
      id: "tpl_4",
      title: "Employee Onboarding Packet",
      description: "W4, I9, Employee Handbook acknowledgment, and Direct Deposit forms.",
      tags: ["HR", "Internal"],
      lastUpdated: "Dec 10, 2025",
      usageCount: 12,
      isStarred: false
    },
    {
      id: "tpl_5",
      title: "Independent Contractor Agreement",
      description: "Agreement for hiring freelance talent for specific project work.",
      tags: ["Legal", "HR"],
      lastUpdated: "Mar 10, 2026",
      usageCount: 34,
      isStarred: false
    },
    {
      id: "tpl_6",
      title: "Change Order Form",
      description: "Request for scope changes on existing active projects.",
      tags: ["Project Management"],
      lastUpdated: "Feb 28, 2026",
      usageCount: 67,
      isStarred: true
    }
  ];

  const filteredTemplates = templates.filter(tpl => {
    if (searchQuery && !tpl.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-[#0f172a] font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar openMenus={openMenus} toggleMenu={(m) => setOpenMenus(m === openMenus ? '' : m)} currentPath={location} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header title="E-Signature Templates" />

        <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <LayoutTemplate className="w-7 h-7 text-indigo-400" /> Document Templates
                </h1>
                <p className="text-sm text-slate-400 mt-1">Save time by creating reusable templates for frequently used documents.</p>
              </div>
              <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Create Template
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-600 bg-slate-950/80 rounded-xl text-[14px] text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-600 bg-slate-950/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group flex flex-col hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <button className="text-slate-500 hover:text-amber-400 transition-colors" title={template.isStarred ? "Unstar" : "Star"}>
                        <Star className={`w-5 h-5 ${template.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors cursor-pointer">{template.title}</h3>
                    <p className="text-[13px] text-slate-400 line-clamp-2 mb-4 flex-1">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-600 bg-slate-950 text-[10px] font-bold tracking-wide uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Used {template.usageCount} times • {template.lastUpdated}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded border border-transparent hover:border-indigo-500/20 transition-all" title="Use Template" onClick={() => setLocation('/admin/esignatures/send')}>
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded border border-transparent transition-all" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded border border-transparent transition-all" title="More">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <LayoutTemplate className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                <p className="text-slate-400 text-sm max-w-md mb-6">We couldn't find any templates matching "{searchQuery}". Try adjusting your search or create a new template.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[13px] font-bold transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}