import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { borrowers, loanFiles, getLOName, getProcessorName, getBranchName } from "../data/mockData";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function BorrowersPage() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  let filtered = borrowers;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(b => b.fullName.toLowerCase().includes(q) || b.email.toLowerCase().includes(q));
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Borrowers</h1>
          <p className="text-[14px] text-white/35 mt-1">Active borrower records</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[400px] flex items-center gap-2 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <Search className="w-4 h-4 text-white/25" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search borrowers..." className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none" data-testid="input-borrowers-search" />
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
                  {["Name", "Loan Status", "Loan Type", "Loan Amount", "Assigned LO", "Processor", "Branch", "Last Activity", "Tags"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const lf = loanFiles.find(l => l.id === b.loanFileId);
                  return (
                    <motion.tr
                      key={b.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/borrowers/${b.id}`)}
                      data-testid={`borrower-row-${b.id}`}
                    >
                      <td className="px-4 py-3 text-[13px] font-medium text-white/80">{b.fullName}</td>
                      <td className="px-4 py-3">{lf && <StatusBadge status={lf.stage} />}</td>
                      <td className="px-4 py-3 text-[12px] text-white/40">{lf?.loanType || "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-white/50 font-medium">{lf ? `$${(lf.amount / 1000).toFixed(0)}K` : "—"}</td>
                      <td className="px-4 py-3 text-[12px] text-white/50">{getLOName(b.assignedLOId)}</td>
                      <td className="px-4 py-3 text-[12px] text-white/40">{getProcessorName(b.processorId)}</td>
                      <td className="px-4 py-3 text-[12px] text-white/40">{getBranchName(b.branchId)}</td>
                      <td className="px-4 py-3 text-[11px] text-white/30">{new Date(b.lastActivityAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {b.tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[9px]">{t}</span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-white/25 text-sm">No borrowers found</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
