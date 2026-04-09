import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { automations, automationTemplates } from "../data/mockPhase3Data";
import { motion, AnimatePresence } from "framer-motion";
import type { Automation, AutomationStatus, AutomationModule } from "../types";
import {
  Search, Zap, Play, Pause, Pencil, Copy, Trash2, Plus, ChevronRight,
  Clock, RotateCcw, X, ArrowRight, Users, FileText,
  MessageSquare, ClipboardCheck, PenTool, ListChecks, Activity
} from "lucide-react";

const views = ["All Automations", "Active", "Draft", "Paused", "Failed", "Templates"] as const;
const moduleIcons: Record<string, any> = { leads: Users, borrowers: Users, pipeline: Activity, documents: FileText, esign: PenTool, conditions: ClipboardCheck, communications: MessageSquare, tasks: ListChecks };

function statusStyle(s: AutomationStatus) {
  switch (s) {
    case "Active": return "bg-green-400/10 text-green-400";
    case "Draft": return "bg-white/[0.06] text-white/50";
    case "Paused": return "bg-amber-400/10 text-amber-400";
    case "Failed": return "bg-red-400/10 text-red-400";
  }
}

function triggerLabel(t: string) {
  return t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function actionLabel(a: string) {
  return a.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function AutomationsPage() {
  const [activeView, setActiveView] = useState<string>("All Automations");
  const [search, setSearch] = useState("");
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  const isTemplateView = activeView === "Templates";
  const source = isTemplateView ? automationTemplates : automations;

  const filtered = source.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (!isTemplateView) {
      if (activeView === "Active") return a.status === "Active";
      if (activeView === "Draft") return a.status === "Draft";
      if (activeView === "Paused") return a.status === "Paused";
      if (activeView === "Failed") return a.status === "Failed";
    }
    if (moduleFilter !== "all" && a.module !== moduleFilter) return false;
    return true;
  });

  const stats = [
    { label: "Active", value: automations.filter(a => a.status === "Active").length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Total Runs", value: automations.reduce((s, a) => s + a.runCount, 0), color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Drafts", value: automations.filter(a => a.status === "Draft").length, color: "text-white/50", bg: "bg-white/[0.06]" },
    { label: "Paused", value: automations.filter(a => a.status === "Paused").length, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Failed", value: automations.filter(a => a.status === "Failed").length, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Templates", value: automationTemplates.length, color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10" },
  ];

  const modules: AutomationModule[] = ["leads", "borrowers", "pipeline", "documents", "esign", "conditions", "communications", "tasks"];

  return (
    <AppShell title="Automations" subtitle="Workflow automation engine">
      <div className="grid grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {views.map(v => (
          <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-${v.toLowerCase().replace(/\s+/g, "-")}`}>{v}</button>
        ))}
        <div className="flex-1" />
        <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none" data-testid="select-module-filter">
          <option value="all">All Modules</option>
          {modules.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
        </select>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search automations..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-52" data-testid="input-search-automations" />
        </div>
        <button onClick={() => setShowBuilder(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e91e8c] text-white text-xs font-medium hover:bg-[#e91e8c]/80 transition-colors" data-testid="button-new-automation">
          <Plus className="w-3.5 h-3.5" /> New Automation
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map(a => {
          const ModIcon = moduleIcons[a.module] || Zap;
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group" onClick={() => setSelectedAutomation(a)} data-testid={`card-automation-${a.id}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e91e8c]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#e91e8c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{a.name}</p>
                    {a.isTemplate && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6]">Template</span>}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusStyle(a.status)}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-white/40 line-clamp-1">{a.description}</p>
                </div>
                <div className="flex items-center gap-6 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <ModIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{a.module}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{a.stepCount} steps</span>
                  </div>
                  {!a.isTemplate && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{a.runCount} runs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{a.lastRunAt ? new Date(a.lastRunAt).toLocaleDateString() : "Never"}</span>
                      </div>
                    </>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">No automations found</div>
        )}
      </div>

      <AnimatePresence>
        {selectedAutomation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedAutomation(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[480px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">{selectedAutomation.name}</h3>
                <button onClick={() => setSelectedAutomation(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-automation-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusStyle(selectedAutomation.status)}`}>{selectedAutomation.status}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{selectedAutomation.module}</span>
                </div>
                <p className="text-sm text-white/50">{selectedAutomation.description}</p>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold">Trigger</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-400" /></div>
                    <span className="text-sm text-white/70">{triggerLabel(selectedAutomation.triggerType)}</span>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold">Actions ({selectedAutomation.actionTypes.length})</p>
                  <div className="space-y-2">
                    {selectedAutomation.actionTypes.map((act, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#e91e8c]/10 flex items-center justify-center text-xs text-[#e91e8c] font-bold">{i + 1}</div>
                        <span className="text-sm text-white/60">{actionLabel(act)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!selectedAutomation.isTemplate && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                      <p className="text-xs text-white/30">Total Runs</p>
                      <p className="text-lg font-bold text-white mt-1">{selectedAutomation.runCount}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                      <p className="text-xs text-white/30">Last Run</p>
                      <p className="text-lg font-bold text-white mt-1">{selectedAutomation.lastRunAt ? new Date(selectedAutomation.lastRunAt).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {selectedAutomation.status === "Active" && (
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-medium" data-testid="button-pause-automation"><Pause className="w-3.5 h-3.5" /> Pause</button>
                  )}
                  {(selectedAutomation.status === "Draft" || selectedAutomation.status === "Paused") && (
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-400/10 text-green-400 text-xs font-medium" data-testid="button-activate-automation"><Play className="w-3.5 h-3.5" /> Activate</button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] text-white/50 text-xs font-medium" data-testid="button-edit-automation"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] text-white/50 text-xs font-medium" data-testid="button-duplicate-automation"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-medium" data-testid="button-delete-automation"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBuilder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBuilder(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-[640px] max-h-[80vh] bg-[#111] border border-white/[0.06] rounded-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">New Automation</h3>
                <button onClick={() => setShowBuilder(false)} className="text-white/30 hover:text-white/60" data-testid="button-close-builder"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Name</label>
                  <input className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="My Automation" data-testid="input-automation-name" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Module</label>
                  <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-automation-module">
                    {modules.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Trigger</label>
                  <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-automation-trigger">
                    <option value="lead_created">Lead Created</option>
                    <option value="no_contact_timeout">No Contact Timeout</option>
                    <option value="loan_stage_changed">Loan Stage Changed</option>
                    <option value="document_uploaded">Document Uploaded</option>
                    <option value="condition_overdue">Condition Overdue</option>
                    <option value="esign_completed">E-Sign Completed</option>
                    <option value="closing_approaching">Closing Approaching</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Description</label>
                  <textarea className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none resize-none h-20" placeholder="Describe what this automation does..." data-testid="input-automation-description" />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowBuilder(false)} className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/50 text-xs font-medium" data-testid="button-cancel-automation">Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-[#e91e8c] text-white text-xs font-medium" data-testid="button-save-automation">Create Automation</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
