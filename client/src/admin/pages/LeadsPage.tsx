import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { leads, getLOName, getBranchName } from "../data/mockData";
import { useAdminStore } from "../store";
import { Search, Filter, Users, PhoneCall, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { LeadStatus } from "../types";

const statusFilters: LeadStatus[] = ["New", "Attempted Contact", "Contacted", "Qualified", "Pre Approval Started", "Application Started", "Nurture", "Cold", "Lost", "Converted"];

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { openDrawer } = useAdminStore();

  let filtered = leads;
  if (statusFilter !== "all") filtered = filtered.filter(l => l.status === statusFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
  }

  const newCount = leads.filter(l => l.status === "New").length;
  const contactedToday = leads.filter(l => l.lastContactAt && new Date(l.lastContactAt).toDateString() === new Date().toDateString()).length;
  const qualified = leads.filter(l => l.status === "Qualified").length;
  const stale = leads.filter(l => l.tags.includes("stale")).length;
  const converted = leads.filter(l => l.status === "Converted").length;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Leads</h1>
          <p className="text-[14px] text-white/35 mt-1">Lead management center</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "New Leads", value: newCount, icon: Users, color: "text-cyan-400 bg-cyan-400/10" },
            { label: "Contacted Today", value: contactedToday, icon: PhoneCall, color: "text-blue-400 bg-blue-400/10" },
            { label: "Qualified", value: qualified, icon: CheckCircle2, color: "text-green-400 bg-green-400/10" },
            { label: "Stale Leads", value: stale, icon: AlertTriangle, color: "text-amber-400 bg-amber-400/10" },
            { label: "Converted", value: converted, icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[11px] text-white/30">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <Search className="w-4 h-4 text-white/25" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none" data-testid="input-leads-search" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 text-[12px] focus:outline-none"
            data-testid="select-lead-status"
          >
            <option value="all">All Statuses</option>
            {statusFilters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Name", "Source", "Status", "Assigned LO", "Phone", "Email", "Created", "Last Contact", "Est. Amount", "Tags"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <motion.tr
                    key={l.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => openDrawer("lead-detail", l)}
                    data-testid={`lead-row-${l.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-white/80">{l.firstName} {l.lastName}</span>
                        {l.tags.includes("hot") && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
                        {l.tags.includes("stale") && <span className="px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-bold">STALE</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{l.source}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3 text-[12px] text-white/50">{getLOName(l.assignedLOId)}</td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{l.phone}</td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{l.email}</td>
                    <td className="px-4 py-3 text-[11px] text-white/30">{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[11px] text-white/30">{l.lastContactAt ? new Date(l.lastContactAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-white/50 font-medium">${(l.estimatedLoanAmount / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {l.tags.filter(t => t !== "hot" && t !== "stale").map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[9px]">{t}</span>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-white/25 text-sm">No leads match your filters</p>
              <button onClick={() => { setStatusFilter("all"); setSearch(""); }} className="mt-2 text-[#e91e8c] text-[13px] font-bold">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
