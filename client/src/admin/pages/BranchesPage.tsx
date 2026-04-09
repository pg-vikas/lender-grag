import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { branchPerformanceData, teamMembers } from "../data/mockPhase3Data";
import { branches } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Building2, ChevronRight, X, Award, BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const branchData = branchPerformanceData.filter(b => !search || b.branch.toLowerCase().includes(search.toLowerCase()));

  const totalVolume = branchPerformanceData.reduce((s, b) => s + b.volume, 0);
  const avgConversion = Math.round(branchPerformanceData.reduce((s, b) => s + b.conversion, 0) / branchPerformanceData.length);
  const totalLeads = branchPerformanceData.reduce((s, b) => s + b.leads, 0);
  const totalFiles = branchPerformanceData.reduce((s, b) => s + b.files, 0);

  const stats = [
    { label: "Total Volume", value: "$" + (totalVolume / 1000000).toFixed(1) + "M", color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Avg Conversion", value: avgConversion + "%", color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10" },
    { label: "Total Leads", value: totalLeads, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Active Files", value: totalFiles, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Branches", value: branches.length, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Team Members", value: teamMembers.filter(t => t.status === "Active").length, color: "text-white/50", bg: "bg-white/[0.04]" },
  ];

  const selectedBranchData = selectedBranch ? branchPerformanceData.find(b => b.branch === selectedBranch) : null;
  const selectedBranchInfo = selectedBranch ? branches.find(b => b.name === selectedBranch || b.name + " Main" === selectedBranch || selectedBranch.includes(b.name)) : null;
  const branchMembers = selectedBranch ? teamMembers.filter(t => {
    const bi = branches.find(b => selectedBranch.includes(b.name) || selectedBranch.includes(b.location.split(",")[0]));
    return bi && t.branchId === bi.id;
  }) : [];

  const loLeaderboard = teamMembers
    .filter(t => t.role === "Loan Officer" || t.role === "Executive")
    .sort((a, b) => b.fundedVolume - a.fundedVolume);

  return (
    <AppShell title="Branches" subtitle="Branch performance and team distribution">
      <div className="grid grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white/70 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#8b5cf6]" /> Volume by Branch</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={branchPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, "Volume"]} />
            <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setShowLeaderboard(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!showLeaderboard ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40"}`} data-testid="tab-branch-cards">Branch Cards</button>
        <button onClick={() => setShowLeaderboard(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showLeaderboard ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40"}`} data-testid="tab-leaderboard">LO Leaderboard</button>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-48" data-testid="input-search-branches" />
        </div>
      </div>

      {!showLeaderboard ? (
        <div className="grid grid-cols-3 gap-3">
          {branchData.map(b => (
            <motion.div key={b.branch} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group" onClick={() => setSelectedBranch(b.branch)} data-testid={`card-branch-${b.branch.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.branch}</p>
                  <p className="text-[10px] text-white/30">{b.leads} leads • {b.files} files</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/40" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                  <p className="text-lg font-bold text-green-400">${(b.volume / 1000000).toFixed(1)}M</p>
                  <p className="text-[10px] text-white/30">Volume</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                  <p className="text-lg font-bold text-[#e91e8c]">{b.conversion}%</p>
                  <p className="text-[10px] text-white/30">Conversion</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                  <p className="text-lg font-bold text-cyan-400">{b.responseTime}m</p>
                  <p className="text-[10px] text-white/30">Avg Response</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5 text-center">
                  <p className="text-lg font-bold text-amber-400">{b.openFlags}</p>
                  <p className="text-[10px] text-white/30">Open Flags</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider w-8">#</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Name</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Role</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Funded Volume</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Active Files</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Active Leads</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Avg Response</th>
              </tr>
            </thead>
            <tbody>
              {loLeaderboard.map((m, i) => (
                <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="p-3">
                    {i < 3 ? <Award className={`w-4 h-4 ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : "text-orange-600"}`} /> : <span className="text-xs text-white/30">{i + 1}</span>}
                  </td>
                  <td className="p-3 text-sm text-white/70 font-medium">{m.name}</td>
                  <td className="p-3 text-xs text-white/40">{m.role}</td>
                  <td className="p-3 text-sm text-green-400 text-right font-mono">${(m.fundedVolume / 1000000).toFixed(2)}M</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.activeFileCount}</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.activeLeadCount}</td>
                  <td className="p-3 text-sm text-white/50 text-right">{m.responseTime}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedBranch && selectedBranchData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedBranch(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[480px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">{selectedBranch}</h3>
                <button onClick={() => setSelectedBranch(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-branch-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Volume</p>
                    <p className="text-xl font-bold text-green-400">${(selectedBranchData.volume / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Conversion</p>
                    <p className="text-xl font-bold text-[#e91e8c]">{selectedBranchData.conversion}%</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Avg Response Time</p>
                    <p className="text-xl font-bold text-cyan-400">{selectedBranchData.responseTime}m</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Open Flags</p>
                    <p className="text-xl font-bold text-amber-400">{selectedBranchData.openFlags}</p>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-3">Team ({branchMembers.length})</p>
                  <div className="space-y-2">
                    {branchMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3 py-1.5">
                        <div className="w-7 h-7 rounded-full bg-[#e91e8c]/10 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#e91e8c]">{m.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white/70">{m.name}</p>
                          <p className="text-[10px] text-white/30">{m.role}</p>
                        </div>
                        {m.fundedVolume > 0 && <span className="text-xs text-green-400/70">${(m.fundedVolume / 1000000).toFixed(1)}M</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
