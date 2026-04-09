import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { pricingScenarios, lockRecords, mortgageProducts } from "../data/mockPhase3Data";
import { borrowers, loanFiles } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import type { PricingScenario } from "../types";
import {
  Search, Lock, Clock, X,
  Calculator, CheckCircle2, XCircle, Plus
} from "lucide-react";

const views = ["Pricing Scenarios", "Lock Tracker", "Scenario Builder"] as const;

function lockStatusStyle(s: string) {
  switch (s) {
    case "Active": return "bg-green-400/10 text-green-400";
    case "Expiring": return "bg-red-400/10 text-red-400";
    case "Expired": return "bg-white/[0.06] text-white/30";
    case "Extended": return "bg-cyan-400/10 text-cyan-400";
    default: return "bg-white/[0.06] text-white/40";
  }
}

function getBorrowerName(id: string) { return borrowers.find(b => b.id === id)?.fullName || id; }

export default function PricingDeskPage() {
  const [activeView, setActiveView] = useState<string>("Pricing Scenarios");
  const [search, setSearch] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<PricingScenario | null>(null);

  const stats = [
    { label: "Active Locks", value: lockRecords.filter(l => l.status === "Active").length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Expiring Soon", value: lockRecords.filter(l => l.status === "Expiring").length, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Scenarios", value: pricingScenarios.length, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Products", value: mortgageProducts.filter(p => p.active).length, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Avg Rate", value: (lockRecords.reduce((s, l) => s + l.rate, 0) / lockRecords.length).toFixed(3) + "%", color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10", isText: true },
    { label: "Total Locked", value: "$" + (lockRecords.reduce((s, l) => { const lf = loanFiles.find(f => f.id === l.loanFileId); return s + (lf?.amount || 0); }, 0) / 1000000).toFixed(1) + "M", color: "text-white/60", bg: "bg-white/[0.04]", isText: true },
  ];

  return (
    <AppShell title="Pricing Desk" subtitle="Rate scenarios and lock management">
      <div className="grid grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{(s as any).isText ? s.value : s.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {views.map(v => (
          <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-pricing-${v.toLowerCase().replace(/\s+/g, "-")}`}>{v}</button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-48" data-testid="input-search-pricing" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e91e8c] text-white text-xs font-medium hover:bg-[#e91e8c]/80" data-testid="button-new-scenario">
          <Plus className="w-3.5 h-3.5" /> New Scenario
        </button>
      </div>

      {activeView === "Pricing Scenarios" && (
        <div className="space-y-3">
          {pricingScenarios.filter(s => !search || getBorrowerName(s.borrowerId).toLowerCase().includes(search.toLowerCase())).map(sc => (
            <motion.div key={sc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer" onClick={() => setSelectedScenario(sc)} data-testid={`card-scenario-${sc.id}`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{getBorrowerName(sc.borrowerId)}</p>
                  <p className="text-xs text-white/40">{sc.inputs.loanType} • {sc.inputs.purpose} • ${(sc.inputs.loanAmount / 1000).toFixed(0)}K • {sc.inputs.ficoBucket} FICO</p>
                </div>
                {sc.lockDate && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Locked {sc.lockDate}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sc.comparedProducts.map(cp => (
                  <div key={cp.productId} className={`rounded-lg p-3 border text-center ${cp.productId === sc.selectedProductId ? "border-[#e91e8c]/40 bg-[#e91e8c]/5" : cp.eligible ? "border-white/[0.06] bg-white/[0.02]" : "border-white/[0.04] bg-white/[0.01] opacity-50"}`}>
                    <p className="text-[10px] text-white/40 mb-1">{cp.productName}</p>
                    <p className={`text-lg font-bold ${cp.productId === sc.selectedProductId ? "text-[#e91e8c]" : "text-white/70"}`}>{cp.rate}%</p>
                    {cp.eligible ? (
                      <p className="text-[10px] text-white/30">${cp.estimatedPayment.toLocaleString()}/mo</p>
                    ) : (
                      <p className="text-[10px] text-red-400">Ineligible</p>
                    )}
                  </div>
                ))}
              </div>
              {sc.notes && <p className="text-xs text-white/30 mt-3 italic">{sc.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {activeView === "Lock Tracker" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Borrower</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Product</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Rate</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Lock Date</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Expiration</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-right">Days Left</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {lockRecords.filter(l => !search || getBorrowerName(l.borrowerId).toLowerCase().includes(search.toLowerCase())).map(l => (
                <tr key={l.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors" data-testid={`row-lock-${l.id}`}>
                  <td className="p-3 text-sm text-white/70 font-medium">{getBorrowerName(l.borrowerId)}</td>
                  <td className="p-3 text-sm text-white/50">{l.productName}</td>
                  <td className="p-3 text-sm text-white/70 text-right font-mono">{l.rate}%</td>
                  <td className="p-3 text-sm text-white/40">{l.lockDate}</td>
                  <td className="p-3 text-sm text-white/40">{l.lockExpiration}</td>
                  <td className="p-3 text-right">
                    <span className={`text-sm font-bold ${l.daysRemaining <= 5 ? "text-red-400" : l.daysRemaining <= 15 ? "text-amber-400" : "text-green-400"}`}>{l.daysRemaining}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${lockStatusStyle(l.status)}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeView === "Scenario Builder" && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Build New Pricing Scenario</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Loan Type</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-loan-type">
                <option value="Conventional">Conventional</option>
                <option value="FHA">FHA</option>
                <option value="VA">VA</option>
                <option value="Jumbo">Jumbo</option>
                <option value="DSCR">DSCR</option>
                <option value="Non-QM">Non-QM</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Purpose</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-purpose">
                <option value="Purchase">Purchase</option>
                <option value="Refinance">Refinance</option>
                <option value="Cash-Out Refi">Cash-Out Refi</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">FICO Bucket</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-fico">
                <option value="780+">780+</option>
                <option value="760-779">760-779</option>
                <option value="740-759">740-759</option>
                <option value="720-739">720-739</option>
                <option value="700-719">700-719</option>
                <option value="680-699">680-699</option>
                <option value="660-679">660-679</option>
                <option value="640-659">640-659</option>
                <option value="620-639">620-639</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Loan Amount</label>
              <input type="number" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="525000" data-testid="input-loan-amount" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">LTV %</label>
              <input type="number" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="80" data-testid="input-ltv" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Lock Term (days)</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/60 outline-none" data-testid="select-lock-term">
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
                <option value="45">45 Days</option>
                <option value="60">60 Days</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e91e8c] text-white text-xs font-medium" data-testid="button-run-scenario">
              <Calculator className="w-3.5 h-3.5" /> Run Scenario
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedScenario && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedScenario(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[520px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">Scenario Details</h3>
                <button onClick={() => setSelectedScenario(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-scenario-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-3">Borrower Info</p>
                  <p className="text-sm font-semibold text-white">{getBorrowerName(selectedScenario.borrowerId)}</p>
                  <p className="text-xs text-white/40 mt-1">Loan {selectedScenario.loanFileId}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-3">Scenario Inputs</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-white/30">Type:</span> <span className="text-white/60">{selectedScenario.inputs.loanType}</span></div>
                    <div><span className="text-white/30">Purpose:</span> <span className="text-white/60">{selectedScenario.inputs.purpose}</span></div>
                    <div><span className="text-white/30">FICO:</span> <span className="text-white/60">{selectedScenario.inputs.ficoBucket}</span></div>
                    <div><span className="text-white/30">LTV:</span> <span className="text-white/60">{selectedScenario.inputs.ltv}%</span></div>
                    <div><span className="text-white/30">Amount:</span> <span className="text-white/60">${selectedScenario.inputs.loanAmount.toLocaleString()}</span></div>
                    <div><span className="text-white/30">Term:</span> <span className="text-white/60">{selectedScenario.inputs.term}yr / {selectedScenario.inputs.lockTerm}d lock</span></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold">Product Comparison</p>
                  {selectedScenario.comparedProducts.map(cp => (
                    <div key={cp.productId} className={`rounded-xl p-3 border ${cp.productId === selectedScenario.selectedProductId ? "border-[#e91e8c]/40 bg-[#e91e8c]/5" : cp.eligible ? "border-white/[0.06] bg-white/[0.02]" : "border-white/[0.04] bg-white/[0.01] opacity-50"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{cp.productName}</span>
                        <span className={`text-lg font-bold ${cp.productId === selectedScenario.selectedProductId ? "text-[#e91e8c]" : "text-white/70"}`}>{cp.rate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{cp.points} pts • ${cp.estimatedPayment.toLocaleString()}/mo</span>
                        {cp.eligible ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <p className="text-[10px] text-white/30 mt-1">{cp.fitNotes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
