import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { crmRecords } from "../data/mockData";
import { useAdminStore } from "../store";
import { Search, Phone, MessageSquare, Mail, ListChecks, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import type { RecordType } from "../types";

const quickFilters = ["All Records", "Leads", "Borrowers", "Hot Follow Ups", "No Recent Activity"];

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Records");
  const { openDrawer } = useAdminStore();
  const [, navigate] = useLocation();

  let filtered = crmRecords;
  if (activeFilter === "Leads") filtered = filtered.filter(r => r.recordType === "Lead");
  if (activeFilter === "Borrowers") filtered = filtered.filter(r => r.recordType === "Borrower");
  if (activeFilter === "Hot Follow Ups") filtered = filtered.filter(r => r.tags.includes("hot"));
  if (activeFilter === "No Recent Activity") {
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString();
    filtered = filtered.filter(r => r.lastActivity < cutoff);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">CRM</h1>
          <p className="text-[14px] text-white/35 mt-1">Manage all contacts and relationships</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-48 space-y-1 flex-shrink-0">
            {quickFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeFilter === f ? "bg-white/[0.08] text-white" : "text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                }`}
                data-testid={`crm-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Search className="w-4 h-4 text-white/25" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search CRM..."
                  className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none"
                  data-testid="input-crm-search"
                />
              </div>
              <button className="h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/60 flex items-center gap-1.5 text-[12px]">
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>
            </div>

            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Name", "Type", "Status", "Source", "Assigned LO", "Branch", "Last Activity", "Tags", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <motion.tr
                        key={r.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                        onClick={() => {
                          if (r.recordType === "Borrower") navigate(`/admin/borrowers/${r.id}`);
                          else openDrawer("crm-preview", r);
                        }}
                        data-testid={`crm-row-${r.id}`}
                      >
                        <td className="px-4 py-3 text-[13px] font-medium text-white/80">{r.name}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.recordType === "Lead" ? "bg-[#e91e8c]/10 text-[#e91e8c]" : "bg-cyan-400/10 text-cyan-400"}`}>{r.recordType}</span></td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{r.source}</td>
                        <td className="px-4 py-3 text-[12px] text-white/50">{r.assignedLO}</td>
                        <td className="px-4 py-3 text-[12px] text-white/40">{r.branch}</td>
                        <td className="px-4 py-3 text-[11px] text-white/30">{new Date(r.lastActivity).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {r.tags.slice(0, 2).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[9px]">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button className="w-7 h-7 rounded-md hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60"><Phone className="w-3 h-3" /></button>
                            <button className="w-7 h-7 rounded-md hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60"><MessageSquare className="w-3 h-3" /></button>
                            <button className="w-7 h-7 rounded-md hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60"><Mail className="w-3 h-3" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-white/25 text-sm">No records match your filters</p>
                  <button onClick={() => { setActiveFilter("All Records"); setSearch(""); }} className="mt-2 text-[#e91e8c] text-[13px] font-bold">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
