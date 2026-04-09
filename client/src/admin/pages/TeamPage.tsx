import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { teamMembers, permissionSets } from "../data/mockPhase3Data";
import { branches } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import type { TeamMember, TeamRole } from "../types";
import {
  Search, UserPlus, X, Mail, Phone,
  Building2, CheckCircle2, XCircle
} from "lucide-react";

const views = ["All Team", "Loan Officers", "Processors", "Managers", "Permissions"] as const;

function roleColor(r: TeamRole) {
  switch (r) {
    case "Executive": return "bg-[#e91e8c]/10 text-[#e91e8c]";
    case "Loan Officer": return "bg-blue-400/10 text-blue-400";
    case "Processor": return "bg-cyan-400/10 text-cyan-400";
    case "Branch Manager": return "bg-amber-400/10 text-amber-400";
    case "Admin": return "bg-purple-400/10 text-purple-400";
  }
}

function statusColor(s: string) {
  switch (s) {
    case "Active": return "text-green-400";
    case "Inactive": return "text-white/30";
    case "Suspended": return "text-red-400";
    default: return "text-white/40";
  }
}

function getBranchName(id: string) { return branches.find(b => b.id === id)?.name || id; }

export default function TeamPage() {
  const [activeView, setActiveView] = useState<string>("All Team");
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const isPermView = activeView === "Permissions";

  const filtered = teamMembers.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeView === "Loan Officers") return m.role === "Loan Officer";
    if (activeView === "Processors") return m.role === "Processor";
    if (activeView === "Managers") return m.role === "Branch Manager" || m.role === "Executive" || m.role === "Admin";
    if (branchFilter !== "all" && m.branchId !== branchFilter) return false;
    return true;
  });

  const stats = [
    { label: "Active", value: teamMembers.filter(m => m.status === "Active").length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Loan Officers", value: teamMembers.filter(m => m.role === "Loan Officer").length, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Processors", value: teamMembers.filter(m => m.role === "Processor").length, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Managers", value: teamMembers.filter(m => m.role === "Branch Manager" || m.role === "Executive").length, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Permission Sets", value: permissionSets.length, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Inactive", value: teamMembers.filter(m => m.status !== "Active").length, color: "text-white/30", bg: "bg-white/[0.04]" },
  ];

  const permKeys = permissionSets.length > 0 ? Object.keys(permissionSets[0].permissions) : [];

  return (
    <AppShell title="Team Management" subtitle="Users, roles, and permissions">
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
          <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-team-${v.toLowerCase().replace(/\s+/g, "-")}`}>{v}</button>
        ))}
        <div className="flex-1" />
        {!isPermView && (
          <>
            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none" data-testid="select-branch-filter">
              <option value="all">All Branches</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-48" data-testid="input-search-team" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e91e8c] text-white text-xs font-medium" data-testid="button-add-member"><UserPlus className="w-3.5 h-3.5" /> Add Member</button>
          </>
        )}
      </div>

      {!isPermView ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Name</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Role</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Branch</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Active Files</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Active Leads</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Funded Volume</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Avg Response</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedMember(m)} data-testid={`row-team-${m.id}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-[#e91e8c]">{m.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-sm text-white/70 font-medium">{m.name}</p>
                        <p className="text-[10px] text-white/30">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleColor(m.role)}`}>{m.role}</span></td>
                  <td className="p-3 text-xs text-white/40">{getBranchName(m.branchId)}</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.activeFileCount}</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.activeLeadCount}</td>
                  <td className="p-3 text-sm text-right font-mono">{m.fundedVolume > 0 ? <span className="text-green-400">${(m.fundedVolume / 1000000).toFixed(2)}M</span> : <span className="text-white/20">—</span>}</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.responseTime > 0 ? `${m.responseTime}m` : "—"}</td>
                  <td className="p-3 text-center"><span className={`text-[10px] font-bold ${statusColor(m.status)}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider sticky left-0 bg-[#0e0e0e]">Permission</th>
                {permissionSets.map(ps => (
                  <th key={ps.id} className="text-[11px] text-white/40 font-medium p-3 uppercase tracking-wider text-center">{ps.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permKeys.map(pk => (
                <tr key={pk} className="border-b border-white/[0.03]">
                  <td className="p-3 text-xs text-white/50 font-medium capitalize sticky left-0 bg-[#0e0e0e]">{pk.replace(/_/g, " ")}</td>
                  {permissionSets.map(ps => (
                    <td key={ps.id} className="p-3 text-center">
                      {ps.permissions[pk] ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-white/10 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedMember(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[480px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">{selectedMember.name}</h3>
                <button onClick={() => setSelectedMember(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-member-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{selectedMember.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{selectedMember.name}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleColor(selectedMember.role)}`}>{selectedMember.role}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/50"><Mail className="w-3.5 h-3.5" /> {selectedMember.email}</div>
                  <div className="flex items-center gap-2 text-xs text-white/50"><Phone className="w-3.5 h-3.5" /> {selectedMember.phone}</div>
                  <div className="flex items-center gap-2 text-xs text-white/50"><Building2 className="w-3.5 h-3.5" /> {getBranchName(selectedMember.branchId)}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Active Files</p>
                    <p className="text-xl font-bold text-white">{selectedMember.activeFileCount}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Active Leads</p>
                    <p className="text-xl font-bold text-white">{selectedMember.activeLeadCount}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Funded Volume</p>
                    <p className="text-xl font-bold text-green-400">{selectedMember.fundedVolume > 0 ? `$${(selectedMember.fundedVolume / 1000000).toFixed(2)}M` : "—"}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Avg Response</p>
                    <p className="text-xl font-bold text-cyan-400">{selectedMember.responseTime > 0 ? `${selectedMember.responseTime}m` : "—"}</p>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2">Permission Set</p>
                  <p className="text-sm text-white/60">{permissionSets.find(p => p.id === selectedMember.permissionsSetId)?.name || "—"}</p>
                  <p className="text-xs text-white/30 mt-1">{permissionSets.find(p => p.id === selectedMember.permissionsSetId)?.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
