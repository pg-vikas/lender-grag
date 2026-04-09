import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { executiveAlerts, volumeTrendData, branchPerformanceData, complianceFlags, lockRecords } from "../data/mockPhase3Data";
import { loanFiles, leads } from "../data/mockData";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, Lock, Users,
  Building2, DollarSign, Target, Bell, BellOff, Eye
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

function alertSeverityStyle(s: string) {
  switch (s) {
    case "critical": return "border-red-500/30 bg-red-500/5";
    case "warning": return "border-amber-400/30 bg-amber-400/5";
    case "info": return "border-blue-400/30 bg-blue-400/5";
    default: return "border-white/[0.06] bg-white/[0.02]";
  }
}

function alertIcon(s: string) {
  switch (s) {
    case "critical": return <AlertTriangle className="w-5 h-5 text-red-400" />;
    case "warning": return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    case "info": return <Eye className="w-5 h-5 text-blue-400" />;
    default: return <Bell className="w-5 h-5 text-white/40" />;
  }
}

export default function ExecutivePage() {
  const [showDismissed, setShowDismissed] = useState(false);

  const activeAlerts = executiveAlerts.filter(a => showDismissed ? true : !a.dismissed);
  const openComplianceFlags = complianceFlags.filter(f => f.status === "Open" || f.status === "In Review").length;
  const expiringLocks = lockRecords.filter(l => l.status === "Expiring").length;
  const totalPipeline = loanFiles.reduce((s, l) => s + l.amount, 0);
  const activeLeads = leads.filter(l => l.status !== "Cold" && l.status !== "Converted").length;
  const conversionRate = Math.round((leads.filter(l => l.status === "Converted").length / leads.length) * 100);

  const lastMonth = volumeTrendData[volumeTrendData.length - 2];
  const thisMonth = volumeTrendData[volumeTrendData.length - 1];
  const volumeChange = lastMonth ? Math.round(((thisMonth.funded - lastMonth.funded) / lastMonth.funded) * 100) : 0;

  const kpis = [
    { label: "Total Pipeline", value: "$" + (totalPipeline / 1000000).toFixed(1) + "M", color: "text-green-400", bg: "bg-green-400/10", icon: DollarSign },
    { label: "MTD Funded", value: "$" + (thisMonth.funded / 1000000).toFixed(1) + "M", color: volumeChange >= 0 ? "text-green-400" : "text-red-400", bg: volumeChange >= 0 ? "bg-green-400/10" : "bg-red-400/10", icon: volumeChange >= 0 ? TrendingUp : TrendingDown, sub: `${volumeChange >= 0 ? "+" : ""}${volumeChange}% vs last month` },
    { label: "Active Leads", value: activeLeads, color: "text-cyan-400", bg: "bg-cyan-400/10", icon: Users },
    { label: "Conversion", value: conversionRate + "%", color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10", icon: Target },
    { label: "Open Compliance", value: openComplianceFlags, color: openComplianceFlags > 4 ? "text-red-400" : "text-amber-400", bg: openComplianceFlags > 4 ? "bg-red-400/10" : "bg-amber-400/10", icon: ShieldAlert },
    { label: "Expiring Locks", value: expiringLocks, color: expiringLocks > 0 ? "text-red-400" : "text-green-400", bg: expiringLocks > 0 ? "bg-red-400/10" : "bg-green-400/10", icon: Lock },
  ];

  return (
    <AppShell title="Executive Controls" subtitle="Business intelligence and risk monitoring">
      <div className="grid grid-cols-6 gap-3 mb-6">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`${k.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${k.color}`} />
                {k.sub && <span className={`text-[9px] ${k.color}`}>{k.sub}</span>}
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-white/40 mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <p className="text-sm font-semibold text-white/70 flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-[#e91e8c]" /> Volume Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={volumeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, ""]} />
              <Area type="monotone" dataKey="funded" stroke="#e91e8c" fill="#e91e8c" fillOpacity={0.1} />
              <Area type="monotone" dataKey="pipeline" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.05} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <p className="text-sm font-semibold text-white/70 flex items-center gap-2 mb-3"><Building2 className="w-4 h-4 text-[#8b5cf6]" /> Branch Comparison</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={branchPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="conversion" name="Conv %" fill="#e91e8c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="responseTime" name="Resp (min)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {branchPerformanceData.map(b => (
          <div key={b.branch} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-sm font-semibold text-white/70">{b.branch}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-green-400">${(b.volume / 1000000).toFixed(1)}M</p>
                <p className="text-[9px] text-white/30">Volume</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#e91e8c]">{b.conversion}%</p>
                <p className="text-[9px] text-white/30">Conv</p>
              </div>
              <div>
                <p className={`text-sm font-bold ${b.openFlags > 2 ? "text-red-400" : "text-amber-400"}`}>{b.openFlags}</p>
                <p className="text-[9px] text-white/30">Flags</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2"><Bell className="w-4 h-4 text-[#e91e8c]" /> Executive Alerts</h3>
        <button onClick={() => setShowDismissed(!showDismissed)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showDismissed ? "bg-white/[0.08] text-white/60" : "bg-white/[0.04] text-white/30"}`} data-testid="button-toggle-dismissed">
          {showDismissed ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          {showDismissed ? "Hide Dismissed" : "Show Dismissed"}
        </button>
      </div>

      <div className="space-y-2">
        {activeAlerts.map(a => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`border rounded-xl p-4 ${a.dismissed ? "opacity-40" : ""} ${alertSeverityStyle(a.severity)}`} data-testid={`alert-${a.id}`}>
            <div className="flex items-start gap-3">
              {alertIcon(a.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${a.severity === "critical" ? "bg-red-500/10 text-red-400" : a.severity === "warning" ? "bg-amber-400/10 text-amber-400" : "bg-blue-400/10 text-blue-400"}`}>{a.severity}</span>
                  <span className="text-[10px] text-white/20 uppercase">{a.module}</span>
                </div>
                <p className="text-xs text-white/50">{a.description}</p>
                {a.impactedCount > 0 && <p className="text-[10px] text-white/30 mt-1">{a.impactedCount} item(s) impacted</p>}
              </div>
              <span className="text-[10px] text-white/20 whitespace-nowrap">{new Date(a.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
