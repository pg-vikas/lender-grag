import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { conditions, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { loanFiles } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import type { Condition, ConditionStatus } from "../types";
import {
  Search, Plus, Filter, X, CheckCircle2, Clock, AlertTriangle, RotateCcw,
  FileText, ClipboardCheck, ChevronRight, Bell, Eye, ListChecks, Columns3
} from "lucide-react";

const kanbanColumns: { status: ConditionStatus; color: string; bg: string }[] = [
  { status: "Requested", color: "text-amber-400", bg: "border-t-amber-400" },
  { status: "Borrower Uploaded", color: "text-purple-400", bg: "border-t-purple-400" },
  { status: "Under Review", color: "text-cyan-400", bg: "border-t-cyan-400" },
  { status: "Accepted", color: "text-blue-400", bg: "border-t-blue-400" },
  { status: "Needs Revision", color: "text-red-400", bg: "border-t-red-400" },
  { status: "Cleared", color: "text-green-400", bg: "border-t-green-400" },
  { status: "Overdue", color: "text-red-500", bg: "border-t-red-500" },
];

function condStatusColor(s: ConditionStatus) {
  switch (s) {
    case "Requested": return "bg-amber-400/10 text-amber-400";
    case "Borrower Uploaded": return "bg-purple-400/10 text-purple-400";
    case "Under Review": return "bg-cyan-400/10 text-cyan-400";
    case "Accepted": return "bg-blue-400/10 text-blue-400";
    case "Needs Revision": return "bg-red-400/10 text-red-400";
    case "Cleared": return "bg-green-400/10 text-green-400";
    case "Overdue": return "bg-red-500/10 text-red-500";
  }
}

function priorityColor(p: string) {
  switch (p) {
    case "Urgent": return "bg-red-500/10 text-red-500";
    case "High": return "bg-amber-400/10 text-amber-400";
    case "Medium": return "bg-cyan-400/10 text-cyan-400";
    default: return "bg-white/[0.04] text-white/30";
  }
}

export default function ConditionsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [selectedCond, setSelectedCond] = useState<Condition | null>(null);

  const filtered = conditions.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !getBorrowerName(c.borrowerId).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = kanbanColumns.map(col => ({
    label: col.status,
    value: conditions.filter(c => c.status === col.status).length,
    color: col.color,
  }));

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white" data-testid="text-conditions-title">Conditions</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conditions..." className="h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#e91e8c]/40 w-60" data-testid="input-cond-search" />
            </div>
            <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
              <button onClick={() => setView("kanban")} className={`h-9 px-3 text-[12px] font-medium flex items-center gap-1 ${view === "kanban" ? "bg-white/[0.08] text-white" : "text-white/30 hover:bg-white/[0.04]"}`}><Columns3 className="w-3.5 h-3.5" /> Board</button>
              <button onClick={() => setView("list")} className={`h-9 px-3 text-[12px] font-medium flex items-center gap-1 ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/30 hover:bg-white/[0.04]"}`}><ListChecks className="w-3.5 h-3.5" /> List</button>
            </div>
            <button className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#d11a7a] transition-colors" data-testid="button-create-condition">
              <Plus className="w-3.5 h-3.5" /> Create Condition
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/25 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {view === "kanban" ? (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {kanbanColumns.map(col => {
              const colItems = filtered.filter(c => c.status === col.status);
              return (
                <div key={col.status} className={`flex-shrink-0 w-[260px] bg-[#0e0e0e] border border-white/[0.06] rounded-xl border-t-2 ${col.bg}`}>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-bold ${col.color}`}>{col.status}</span>
                      <span className="w-5 h-5 rounded-full bg-white/[0.06] text-white/30 text-[10px] font-bold flex items-center justify-center">{colItems.length}</span>
                    </div>
                  </div>
                  <div className="px-2 pb-2 space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto">
                    {colItems.map(cond => (
                      <motion.div key={cond.id} whileHover={{ scale: 1.01 }} className="bg-[#111] border border-white/[0.06] rounded-lg p-3 cursor-pointer hover:border-white/[0.12] transition-colors" onClick={() => setSelectedCond(cond)} data-testid={`card-cond-${cond.id}`}>
                        <p className="text-[12px] font-semibold text-white mb-1.5 leading-tight">{cond.title}</p>
                        <p className="text-[11px] text-white/30 mb-2">{getBorrowerName(cond.borrowerId)}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${priorityColor(cond.priority)}`}>{cond.priority}</span>
                          <span className="text-[9px] text-white/20">Due {new Date(cond.dueDate).toLocaleDateString()}</span>
                          {cond.linkedDocumentIds.length > 0 && <span className="text-[9px] text-white/15 flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" />{cond.linkedDocumentIds.length}</span>}
                          {cond.notes.length > 0 && <span className="text-[9px] text-white/15">{cond.notes.length} notes</span>}
                        </div>
                      </motion.div>
                    ))}
                    {colItems.length === 0 && <p className="text-center text-white/10 text-[11px] py-6">No items</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Condition", "Borrower", "Loan", "Type", "Priority", "Status", "Due Date", "Reviewer"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(cond => (
                  <tr key={cond.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedCond(cond)}>
                    <td className="px-4 py-3 text-[13px] font-medium text-white max-w-[250px] truncate">{cond.title}</td>
                    <td className="px-4 py-3 text-[12px] text-white/50">{getBorrowerName(cond.borrowerId)}</td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{cond.loanFileId}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[10px]">{cond.type.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColor(cond.priority)}`}>{cond.priority}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${condStatusColor(cond.status)}`}>{cond.status}</span></td>
                    <td className="px-4 py-3 text-[11px] text-white/30">{new Date(cond.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{getUserName(cond.assignedReviewerId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCond && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedCond(null)}>
            <div className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[420px] bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-white">Condition Detail</h2>
                <button onClick={() => setSelectedCond(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[11px] text-white/30 mb-1">Title</p>
                  <p className="text-white font-semibold text-[14px]">{selectedCond.title}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 mb-1">Description</p>
                  <p className="text-white/50 text-[13px] leading-relaxed">{selectedCond.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] text-white/30 mb-1">Borrower</p><p className="text-white/60 text-[13px]">{getBorrowerName(selectedCond.borrowerId)}</p></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Loan File</p><p className="text-white/60 text-[13px]">{selectedCond.loanFileId}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><p className="text-[11px] text-white/30 mb-1">Status</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${condStatusColor(selectedCond.status)}`}>{selectedCond.status}</span></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Priority</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColor(selectedCond.priority)}`}>{selectedCond.priority}</span></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Due</p><p className="text-white/50 text-[12px]">{new Date(selectedCond.dueDate).toLocaleDateString()}</p></div>
                </div>
                <div><p className="text-[11px] text-white/30 mb-1">Reviewer</p><p className="text-white/60 text-[13px]">{getUserName(selectedCond.assignedReviewerId)}</p></div>
                {selectedCond.linkedDocumentIds.length > 0 && (
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Linked Documents</p>
                    <div className="space-y-1">
                      {selectedCond.linkedDocumentIds.map(id => (
                        <div key={id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04] text-white/40 text-[11px]">
                          <FileText className="w-3 h-3" /> {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCond.notes.length > 0 && (
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Notes</p>
                    {selectedCond.notes.map((n, i) => (
                      <p key={i} className="text-white/40 text-[12px] bg-white/[0.02] border border-white/[0.04] rounded-lg p-2 mb-1">{n}</p>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="h-9 rounded-lg bg-green-400/10 text-green-400 text-[12px] font-bold hover:bg-green-400/20 transition-colors flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Accept</button>
                  <button className="h-9 rounded-lg bg-amber-400/10 text-amber-400 text-[12px] font-bold hover:bg-amber-400/20 transition-colors flex items-center justify-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Revision</button>
                  <button className="h-9 rounded-lg bg-cyan-400/10 text-cyan-400 text-[12px] font-bold hover:bg-cyan-400/20 transition-colors flex items-center justify-center gap-1"><ClipboardCheck className="w-3.5 h-3.5" /> Clear</button>
                  <button className="h-9 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-[12px] font-bold hover:bg-[#e91e8c]/20 transition-colors flex items-center justify-center gap-1"><Bell className="w-3.5 h-3.5" /> Notify</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
