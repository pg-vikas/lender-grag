import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { useAdminStore } from "../store";
import { loanFiles, borrowers, getLOName, getProcessorName } from "../data/mockData";
import { Search, LayoutGrid, List, Filter, AlertTriangle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import type { LoanStage, LoanFile } from "../types";

const pipelineStages: LoanStage[] = [
  "Lead", "Consultation", "Pre Qualified", "Pre Approved", "Shopping",
  "Application Submitted", "Processing", "Submitted to Underwriting",
  "Conditional Approval", "Clear to Close", "Closing Scheduled", "Funded", "Closed", "Lost / Withdrawn",
];

const stageColors: Record<string, string> = {
  "Lead": "border-t-cyan-400", "Consultation": "border-t-blue-400", "Pre Qualified": "border-t-indigo-400",
  "Pre Approved": "border-t-purple-400", "Shopping": "border-t-violet-400", "Application Submitted": "border-t-sky-400",
  "Processing": "border-t-amber-400", "Submitted to Underwriting": "border-t-orange-400",
  "Conditional Approval": "border-t-yellow-400", "Clear to Close": "border-t-lime-400",
  "Closing Scheduled": "border-t-green-400", "Funded": "border-t-emerald-400", "Closed": "border-t-emerald-500",
  "Lost / Withdrawn": "border-t-red-400",
};

function KanbanCard({ loan }: { loan: LoanFile }) {
  const [, navigate] = useLocation();
  const bw = borrowers.find(b => b.loanFileId === loan.id);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/admin/pipeline/${loan.id}`)}
      className="bg-[#0e0e0e] border border-white/[0.06] rounded-lg p-3 cursor-pointer hover:border-white/[0.12] transition-all"
      data-testid={`kanban-card-${loan.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-[13px] font-bold text-white/80 truncate flex-1">{bw?.fullName || "Unassigned"}</p>
        {loan.flags.length > 0 && <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />}
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[9px] font-bold text-white/30">{loan.loanType}</span>
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${loan.purpose === "Purchase" ? "bg-cyan-400/10 text-cyan-400" : "bg-purple-400/10 text-purple-400"}`}>{loan.purpose}</span>
      </div>
      <p className="text-[12px] text-white/50 font-medium">${(loan.amount / 1000).toFixed(0)}K</p>
      <p className="text-[10px] text-white/25 mt-1 truncate">{loan.propertyAddress}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
        <span className="text-[10px] text-white/25">{getLOName(loan.assignedLOId)}</span>
        {loan.estimatedClose && (
          <span className="flex items-center gap-1 text-[10px] text-white/20">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(loan.estimatedClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function PipelinePage() {
  const { pipelineView, setPipelineView } = useAdminStore();
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  let filtered = loanFiles;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(lf => {
      const bw = borrowers.find(b => b.loanFileId === lf.id);
      return lf.propertyAddress.toLowerCase().includes(q) || (bw?.fullName || "").toLowerCase().includes(q);
    });
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Loan Pipeline</h1>
            <p className="text-[14px] text-white/35 mt-1">{loanFiles.length} active loan files</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/[0.04] rounded-lg border border-white/[0.06] p-0.5">
              <button
                onClick={() => setPipelineView("kanban")}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold flex items-center gap-1.5 transition-all ${pipelineView === "kanban" ? "bg-white/[0.08] text-white" : "text-white/35"}`}
                data-testid="button-view-kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Board
              </button>
              <button
                onClick={() => setPipelineView("list")}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold flex items-center gap-1.5 transition-all ${pipelineView === "list" ? "bg-white/[0.08] text-white" : "text-white/35"}`}
                data-testid="button-view-list"
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[400px] flex items-center gap-2 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <Search className="w-4 h-4 text-white/25" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pipeline..." className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none" data-testid="input-pipeline-search" />
          </div>
          <button className="h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/60 flex items-center gap-1.5 text-[12px]">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {pipelineView === "kanban" ? (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3" style={{ minWidth: pipelineStages.length * 220 }}>
              {pipelineStages.map((stage) => {
                const stageLoans = filtered.filter(lf => lf.stage === stage);
                const volume = stageLoans.reduce((s, lf) => s + lf.amount, 0);
                return (
                  <div key={stage} className="w-[220px] flex-shrink-0">
                    <div className={`rounded-t-lg border-t-2 ${stageColors[stage] || "border-t-white/20"} bg-white/[0.02] px-3 py-2.5 mb-2 rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold text-white/60 truncate">{stage}</p>
                        <span className="text-[11px] font-black text-white/30">{stageLoans.length}</span>
                      </div>
                      {volume > 0 && <p className="text-[10px] text-white/20">${(volume / 1000).toFixed(0)}K</p>}
                    </div>
                    <div className="space-y-2">
                      {stageLoans.map((loan) => (
                        <KanbanCard key={loan.id} loan={loan} />
                      ))}
                      {stageLoans.length === 0 && (
                        <div className="border border-dashed border-white/[0.06] rounded-lg p-4 text-center">
                          <p className="text-[11px] text-white/15">No files</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Borrower", "Stage", "Loan Type", "Purpose", "Amount", "Rate", "LO", "Processor", "Branch", "Est. Close", "Flags"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/25">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lf) => {
                    const bw = borrowers.find(b => b.loanFileId === lf.id);
                    return (
                      <motion.tr
                        key={lf.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                        onClick={() => navigate(`/admin/pipeline/${lf.id}`)}
                        data-testid={`pipeline-row-${lf.id}`}
                      >
                        <td className="px-4 py-3 text-[13px] font-medium text-white/80">{bw?.fullName || "Unassigned"}</td>
                        <td className="px-4 py-3"><StatusBadge status={lf.stage} /></td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{lf.loanType}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lf.purpose === "Purchase" ? "bg-cyan-400/10 text-cyan-400" : "bg-purple-400/10 text-purple-400"}`}>{lf.purpose}</span></td>
                        <td className="px-4 py-3 text-[12px] text-white/50 font-medium">${(lf.amount / 1000).toFixed(0)}K</td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{lf.rate ? `${lf.rate}%` : "—"}</td>
                        <td className="px-4 py-3 text-[12px] text-white/50">{getLOName(lf.assignedLOId)}</td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{lf.processorId ? getProcessorName(lf.processorId) : "—"}</td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{lf.branchId}</td>
                        <td className="px-4 py-3 text-[11px] text-white/30">{lf.estimatedClose ? new Date(lf.estimatedClose).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3">
                          {lf.flags.map((f) => (
                            <span key={f} className="px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-bold">{f.replace("_", " ")}</span>
                          ))}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
