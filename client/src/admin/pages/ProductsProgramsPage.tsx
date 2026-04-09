import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { mortgageProducts } from "../data/mockPhase3Data";
import { motion, AnimatePresence } from "framer-motion";
import type { MortgageProduct } from "../types";
import {
  Search, Package, CheckCircle2, XCircle, X,
  AlertTriangle, Info
} from "lucide-react";

const categories = ["All", "Conventional", "FHA", "VA", "Jumbo", "HELOC", "DSCR", "Non-QM"] as const;

function categoryColor(c: string) {
  switch (c) {
    case "Conventional": return "bg-blue-400/10 text-blue-400";
    case "FHA": return "bg-green-400/10 text-green-400";
    case "VA": return "bg-purple-400/10 text-purple-400";
    case "Jumbo": return "bg-amber-400/10 text-amber-400";
    case "HELOC": return "bg-cyan-400/10 text-cyan-400";
    case "DSCR": return "bg-orange-400/10 text-orange-400";
    case "Non-QM": return "bg-rose-400/10 text-rose-400";
    default: return "bg-white/[0.06] text-white/40";
  }
}

export default function ProductsProgramsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MortgageProduct | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  const filtered = mortgageProducts.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    return true;
  });

  const stats = [
    { label: "Active Products", value: mortgageProducts.filter(p => p.active).length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Categories", value: new Set(mortgageProducts.map(p => p.category)).size, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Avg Min FICO", value: Math.round(mortgageProducts.reduce((s, p) => s + p.minFico, 0) / mortgageProducts.length), color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Avg Max LTV", value: Math.round(mortgageProducts.reduce((s, p) => s + p.maxLtv, 0) / mortgageProducts.length) + "%", color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10" },
  ];

  return (
    <AppShell title="Products & Programs" subtitle="Mortgage product catalog and eligibility">
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-product-${c.toLowerCase()}`}>{c}</button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setShowMatrix(!showMatrix)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showMatrix ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-white/[0.04] text-white/40"}`} data-testid="button-toggle-matrix">
          {showMatrix ? "Card View" : "Matrix View"}
        </button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-48" data-testid="input-search-products" />
        </div>
      </div>

      {!showMatrix ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group" onClick={() => setSelectedProduct(p)} data-testid={`card-product-${p.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColor(p.category)}`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${categoryColor(p.category)}`}>{p.category}</span>
                  </div>
                </div>
                {p.active ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-white/20" />}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-white/[0.03] rounded-lg px-2.5 py-2">
                  <p className="text-white/30">Min FICO</p>
                  <p className="text-white/70 font-bold text-sm">{p.minFico}</p>
                </div>
                <div className="bg-white/[0.03] rounded-lg px-2.5 py-2">
                  <p className="text-white/30">Max LTV</p>
                  <p className="text-white/70 font-bold text-sm">{p.maxLtv}%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.occupancyAllowed.map(o => (
                  <span key={o} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{o}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Product</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Category</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-center">Min FICO</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-center">Max LTV</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Occupancy</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider">Property Types</th>
                <th className="text-[11px] text-white/30 font-medium p-3 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <td className="p-3 text-sm text-white/70 font-medium">{p.name}</td>
                  <td className="p-3"><span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${categoryColor(p.category)}`}>{p.category}</span></td>
                  <td className="p-3 text-sm text-white/50 text-center">{p.minFico}</td>
                  <td className="p-3 text-sm text-white/50 text-center">{p.maxLtv}%</td>
                  <td className="p-3 text-xs text-white/40">{p.occupancyAllowed.join(", ")}</td>
                  <td className="p-3 text-xs text-white/40">{p.propertyTypesAllowed.join(", ")}</td>
                  <td className="p-3 text-center">{p.active ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-white/20 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedProduct(null)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-[520px] h-full bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">{selectedProduct.name}</h3>
                <button onClick={() => setSelectedProduct(null)} className="text-white/30 hover:text-white/60" data-testid="button-close-product-drawer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${categoryColor(selectedProduct.category)}`}>{selectedProduct.category}</span>
                  {selectedProduct.active ? <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">Active</span> : <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30">Inactive</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Min FICO</p>
                    <p className="text-xl font-bold text-white">{selectedProduct.minFico}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-xs text-white/30">Max LTV</p>
                    <p className="text-xl font-bold text-white">{selectedProduct.maxLtv}%</p>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2">Occupancy Allowed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.occupancyAllowed.map(o => <span key={o} className="text-xs px-2 py-1 rounded-lg bg-white/[0.04] text-white/50">{o}</span>)}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2">Property Types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.propertyTypesAllowed.map(pt => <span key={pt} className="text-xs px-2 py-1 rounded-lg bg-white/[0.04] text-white/50">{pt}</span>)}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Overlays</p>
                  <ul className="space-y-1.5">
                    {selectedProduct.overlays.map((o, i) => <li key={i} className="text-xs text-white/50 flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />{o}</li>)}
                  </ul>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-cyan-400" /> Talking Points</p>
                  <ul className="space-y-1.5">
                    {selectedProduct.talkingPoints.map((tp, i) => <li key={i} className="text-xs text-white/50 flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />{tp}</li>)}
                  </ul>
                </div>
                <p className="text-[10px] text-white/20">Updated {selectedProduct.updatedAt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
