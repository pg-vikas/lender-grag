import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { reportPresets, volumeTrendData, leadSourceData, branchPerformanceData } from "../data/mockPhase3Data";
import { motion } from "framer-motion";
import {
  Search, BarChart3, Star, StarOff, Download, Users, Building2, DollarSign, Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const categories = ["All", "Marketing", "Sales", "Operations", "Executive"] as const;

function categoryIcon(c: string) {
  switch (c) {
    case "Marketing": return <Users className="w-4 h-4 text-[#8b5cf6]" />;
    case "Sales": return <DollarSign className="w-4 h-4 text-green-400" />;
    case "Operations": return <Clock className="w-4 h-4 text-cyan-400" />;
    case "Executive": return <Building2 className="w-4 h-4 text-[#e91e8c]" />;
    default: return <BarChart3 className="w-4 h-4 text-white/40" />;
  }
}

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeChart, setActiveChart] = useState<string>("volume");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(reportPresets.filter(r => r.isFavorite).map(r => r.id)));

  const filteredPresets = reportPresets.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== "All" && r.category !== activeCategory) return false;
    return true;
  });

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFavorites(next);
  };

  const chartViews = [
    { key: "volume", label: "Volume Trend" },
    { key: "sources", label: "Lead Sources" },
    { key: "branches", label: "Branch Performance" },
  ];

  return (
    <AppShell title="Reports & Analytics" subtitle="Business intelligence and insights">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          {chartViews.map(cv => (
            <button key={cv.key} onClick={() => setActiveChart(cv.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeChart === cv.key ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:text-white/60"}`} data-testid={`chart-tab-${cv.key}`}>{cv.label}</button>
          ))}
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs font-medium hover:text-white/60" data-testid="button-export-chart"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>

        {activeChart === "volume" && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, ""]} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="funded" name="Funded" fill="#e91e8c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pipeline" name="Pipeline" fill="#8b5cf6" radius={[4, 4, 0, 0]} fillOpacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === "sources" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider">Source</th>
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider text-right">Leads</th>
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider text-right">Converted</th>
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider text-right">Conv %</th>
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider text-right">Avg Speed (min)</th>
                  <th className="text-[11px] text-white/30 font-medium pb-2 uppercase tracking-wider">Conversion Bar</th>
                </tr>
              </thead>
              <tbody>
                {leadSourceData.map(s => (
                  <tr key={s.source} className="border-b border-white/[0.03]">
                    <td className="py-2.5 text-sm text-white/70 font-medium">{s.source}</td>
                    <td className="py-2.5 text-sm text-white/50 text-right">{s.leads}</td>
                    <td className="py-2.5 text-sm text-white/50 text-right">{s.converted}</td>
                    <td className="py-2.5 text-sm text-right font-medium" style={{ color: s.convRate > 30 ? "#4ade80" : s.convRate > 20 ? "#fbbf24" : "#f87171" }}>{s.convRate}%</td>
                    <td className="py-2.5 text-sm text-white/50 text-right">{s.avgSpeed}</td>
                    <td className="py-2.5 w-32">
                      <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#e91e8c]" style={{ width: `${s.convRate}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeChart === "branches" && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branchPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} width={120} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, "Volume"]} />
              <Bar dataKey="volume" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"}`} data-testid={`tab-report-${c.toLowerCase()}`}>{c}</button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none w-52" data-testid="input-search-reports" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredPresets.map(r => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group" data-testid={`card-report-${r.id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {categoryIcon(r.category)}
                <span className="text-[10px] uppercase font-bold text-white/30">{r.category}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }} className="text-white/20 hover:text-amber-400 transition-colors" data-testid={`button-favorite-${r.id}`}>
                {favorites.has(r.id) ? <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm font-semibold text-white mb-1">{r.name}</p>
            <p className="text-xs text-white/40 line-clamp-2 mb-3">{r.description}</p>
            {r.lastViewed && <p className="text-[10px] text-white/20">Last viewed {r.lastViewed}</p>}
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
