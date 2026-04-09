import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { complianceFlags, auditEvents, riskTrendData } from "../data/mockPhase3Data";
import { borrowers, loanFiles } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import type { ComplianceFlag, ComplianceSeverity, ComplianceFlagStatus } from "../types";
import {
  Search, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Eye,
  Clock, X, ChevronRight, TrendingUp
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const views = ["All Flags", "Open", "In Review", "Resolved", "Dismissed", "Audit Trail"] as const;

function severityStyle(s: ComplianceSeverity) {
  switch (s) {
    case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "high": return "bg-orange-400/10 text-orange-400 border-orange-400/20";
    case "medium": return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    case "low": return "bg-blue-400/10 text-blue-400 border-blue-400/20";
  }
}

function statusIcon(s: ComplianceFlagStatus) {
  switch (s) {
    case "Open": return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    case "In Review": return <Eye className="w-3.5 h-3.5 text-amber-400" />;
    case "Resolved": return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
    case "Dismissed": return <XCircle className="w-3.5 h-3.5 text-white/30" />;
  }
}

function getBorrowerName(id: string) { return borrowers.find(b => b.id === id)?.fullName || id; }
function getLoanLabel(id: string) { const l = loanFiles.find(f => f.id === id); return l ? `${l.id} — ${l.loanType}` : id; }

export default function CompliancePage() {
  const [activeView, setActiveView] = useState<string>("All Flags");
  const [search, setSearch] = useState("");
  const [selectedFlag, setSelectedFlag] = useState<ComplianceFlag | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const isAuditView = activeView === "Audit Trail";

  const filteredFlags = complianceFlags.filter(f => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !getBorrowerName(f.borrowerId).toLowerCase().includes(search.toLowerCase())) return false;
    if (activeView === "Open") return f.status === "Open";
    if (activeView === "In Review") return f.status === "In Review";
    if (activeView === "Resolved") return f.status === "Resolved";
    if (activeView === "Dismissed") return f.status === "Dismissed";
    if (severityFilter !== "all" && f.severity !== severityFilter) return false;
    return true;
  });

  const filteredAudit = auditEvents.filter(e => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: "Critical", value: complianceFlags.filter(f => f.severity === "critical" && f.status !== "Resolved" && f.status !== "Dismissed").length, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "High", value: complianceFlags.filter(f => f.severity === "high" && f.status !== "Resolved" && f.status !== "Dismissed").length, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Medium", value: complianceFlags.filter(f => f.severity === "medium" && f.status !== "Resolved" && f.status !== "Dismissed").length, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Open Flags", value: complianceFlags.filter(f => f.status === "Open" || f.status === "In Review").length, color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10" },
    { label: "Resolved", value: complianceFlags.filter(f => f.status === "Resolved").length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Audit Events", value: auditEvents.length, color: "text-white/50", bg: "bg-white/[0.04]" },
  ];

  return (
    <AppShell title="Compliance" subtitle="Risk monitoring and audit trail">
      <div className="grid grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white/70 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#e91e8c]" /> Risk Trend (5 Weeks)</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={riskTrendData}>
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.08} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {views.map(v => (
          <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-compliance-${v.toLowerCase().replace(/\s+/g, "-")}`}>{v}</button>
        ))}
        <div className="flex-1" />
        {!isAuditView && (
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none" data-testid="select-severity-filter">
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        )}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-48" data-testid="input-search-compliance" />
        </div>
      </div>

      {!isAuditView ? (
        <div className="space-y-2">
          {filteredFlags.map(f => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group" onClick={() => setSelectedFlag(f)} data-testid={`card-flag-${f.id}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.severity === "critical" ? "bg-red-400/10" : f.severity === "high" ? "bg-orange-400/10" : f.severity === "medium" ? "bg-amber-400/10" : "bg-blue-400/10"}`}>
                  <ShieldAlert className={`w-5 h-5 ${f.severity === "critical" ? "text-red-400" : f.severity === "high" ? "text-orange-400" : f.severity === "medium" ? "text-amber-400" : "text-blue-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{f.title}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${severityStyle(f.severity)}`}>{f.severity}</span>
                    <span className="flex items-center gap-1 text-[10px] text-white/40">{statusIcon(f.status)} {f.status}</span>
                  </div>
                  <p className="text-xs text-white/40 line-clamp-1">{f.description}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{getBorrowerName(f.borrowerId)}</span>
                  <span>{getLoanLabel(f.loanFileId)}</span>
                  {f.dueDate && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.dueDate}</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
              </div>
            </motion.div>
          ))}
          {filteredFlags.length === 0 && <div className="text-center py-16 text-white/30 text-sm">No compliance flags found</div>}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredAudit.map(e => (
            <div key={e.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3" data-testid={`audit-${e.id}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-xs text-white/30 w-24 flex-shrink-0">{new Date(e.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <span className="text-[10px] uppercase font-bold text-white/20 w-20 flex-shrink-0">{e.module}</span>
              <span className="text-xs text-white/60 flex-1">{e.description}</span>
              {e.loanFileId && <span className="text-[10px] text-white/20">{e.loanFileId}</span>}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedFlag && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedFlag(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[480px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">{selectedFlag.title}</h3>
                <button onClick={() => setSelectedFlag(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-flag-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${severityStyle(selectedFlag.severity)}`}>{selectedFlag.severity}</span>
                  <span className="flex items-center gap-1 text-[10px] text-white/40">{statusIcon(selectedFlag.status)} {selectedFlag.status}</span>
                </div>
                <p className="text-sm text-white/50">{selectedFlag.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Borrower</p>
                    <p className="text-sm font-medium text-white mt-1">{getBorrowerName(selectedFlag.borrowerId)}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Loan File</p>
                    <p className="text-sm font-medium text-white mt-1">{selectedFlag.loanFileId}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Due Date</p>
                    <p className="text-sm font-medium text-white mt-1">{selectedFlag.dueDate || "—"}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Created</p>
                    <p className="text-sm font-medium text-white mt-1">{new Date(selectedFlag.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  {selectedFlag.status === "Open" && (
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-medium" data-testid="button-review-flag"><Eye className="w-3.5 h-3.5" /> Mark In Review</button>
                  )}
                  {(selectedFlag.status === "Open" || selectedFlag.status === "In Review") && (
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-400/10 text-green-400 text-xs font-medium" data-testid="button-resolve-flag"><CheckCircle2 className="w-3.5 h-3.5" /> Resolve</button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] text-white/40 text-xs font-medium" data-testid="button-dismiss-flag"><XCircle className="w-3.5 h-3.5" /> Dismiss</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
