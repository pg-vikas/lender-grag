import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { useAdminStore } from "../store";
import {
  Users, UserPlus, FileText, Clock, CheckCircle2, DollarSign, AlertTriangle,
  TrendingUp, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, Trophy,
  Zap, Target, Eye
} from "lucide-react";
import { leads, loanFiles, loanOfficers, activities, alerts as alertData, borrowers } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import type { LoanStage } from "../types";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

function AnimatedCount({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

function KPICard({ icon: Icon, label, value, prefix = "", suffix = "", change, changeType, color }: {
  icon: any; label: string; value: number; prefix?: string; suffix?: string;
  change?: string; changeType?: "up" | "down"; color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#111] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold ${changeType === "up" ? "text-green-400" : "text-red-400"}`}>
            {changeType === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white tracking-tight">
        <AnimatedCount value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-[12px] text-white/35 mt-0.5">{label}</p>
    </motion.div>
  );
}

const pipelineStages: { stage: LoanStage; color: string }[] = [
  { stage: "Lead", color: "bg-cyan-400" },
  { stage: "Pre Qualified", color: "bg-indigo-400" },
  { stage: "Pre Approved", color: "bg-purple-400" },
  { stage: "Application Submitted", color: "bg-sky-400" },
  { stage: "Processing", color: "bg-amber-400" },
  { stage: "Submitted to Underwriting", color: "bg-orange-400" },
  { stage: "Conditional Approval", color: "bg-yellow-400" },
  { stage: "Clear to Close", color: "bg-lime-400" },
  { stage: "Funded", color: "bg-emerald-400" },
];

export default function Dashboard() {
  const { dashboardMode } = useAdminStore();
  const [, navigate] = useLocation();

  const newLeads = leads.filter(l => l.status === "New").length;
  const activeLeads = leads.filter(l => !["Lost", "Converted", "Cold"].includes(l.status)).length;
  const inUW = loanFiles.filter(lf => lf.stage === "Submitted to Underwriting").length;
  const ctc = loanFiles.filter(lf => lf.stage === "Clear to Close").length;
  const fundedMTD = loanFiles.filter(lf => lf.stage === "Funded").length;
  const fundedVolume = loanFiles.filter(lf => lf.stage === "Funded").reduce((s, lf) => s + lf.amount, 0);
  const appsInProgress = loanFiles.filter(lf => ["Application Submitted", "Processing"].includes(lf.stage)).length;
  const projectedVolume = loanFiles.filter(lf => !["Lost / Withdrawn", "Funded", "Closed"].includes(lf.stage)).reduce((s, lf) => s + lf.amount, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Command Center</h1>
            <p className="text-[14px] text-white/35 mt-1">Real-time overview of your lending operation</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/[0.04] rounded-lg border border-white/[0.06] p-0.5">
              {(["Executive", "Sales", "Operations"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => useAdminStore.getState().setDashboardMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                    dashboardMode === mode ? "bg-[#e91e8c]/15 text-[#e91e8c]" : "text-white/35 hover:text-white/60"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
          <KPICard icon={Users} label="Active Leads" value={activeLeads} color="bg-cyan-400/10 text-cyan-400" change="+12%" changeType="up" />
          <KPICard icon={UserPlus} label="New Leads Today" value={newLeads} color="bg-[#e91e8c]/10 text-[#e91e8c]" change="+3" changeType="up" />
          <KPICard icon={FileText} label="Apps In Progress" value={appsInProgress} color="bg-amber-400/10 text-amber-400" />
          <KPICard icon={Eye} label="In Underwriting" value={inUW} color="bg-orange-400/10 text-orange-400" />
          <KPICard icon={CheckCircle2} label="Clear to Close" value={ctc} color="bg-lime-400/10 text-lime-400" />
          <KPICard icon={DollarSign} label="Funded MTD" value={fundedMTD} color="bg-emerald-400/10 text-emerald-400" suffix={` ($${(fundedVolume / 1000000).toFixed(1)}M)`} />
          <KPICard icon={TrendingUp} label="Projected Volume" value={Math.round(projectedVolume / 1000)} prefix="$" suffix="K" color="bg-purple-400/10 text-purple-400" />
          {dashboardMode !== "Sales" && <KPICard icon={AlertTriangle} label="Alerts" value={alertData.length} color="bg-red-400/10 text-red-400" />}
          {dashboardMode === "Sales" && <KPICard icon={Target} label="Qualified Leads" value={leads.filter(l => l.status === "Qualified").length} color="bg-green-400/10 text-green-400" />}
          {dashboardMode === "Operations" && <KPICard icon={Clock} label="Avg Days in Stage" value={6} suffix=" days" color="bg-blue-400/10 text-blue-400" />}
          {dashboardMode !== "Operations" && <KPICard icon={Zap} label="Conversion Rate" value={38} suffix="%" color="bg-indigo-400/10 text-indigo-400" change="+5%" changeType="up" />}
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-white">Pipeline Snapshot</h3>
            <button onClick={() => navigate("/admin/pipeline")} className="text-[12px] text-[#e91e8c] hover:text-[#e91e8c]/80 font-bold" data-testid="link-view-pipeline">View Pipeline →</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {pipelineStages.map(({ stage, color }) => {
              const count = loanFiles.filter(lf => lf.stage === stage).length;
              const volume = loanFiles.filter(lf => lf.stage === stage).reduce((s, lf) => s + lf.amount, 0);
              return (
                <motion.button
                  key={stage}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate("/admin/pipeline")}
                  className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-left hover:border-white/[0.1] transition-all"
                  data-testid={`pipeline-stage-${stage.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-2 h-2 rounded-full ${color} mb-2`} />
                  <p className="text-xl font-black text-white">{count}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{stage}</p>
                  {volume > 0 && <p className="text-[10px] text-white/20 mt-0.5">${(volume / 1000).toFixed(0)}K</p>}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-[15px] font-bold text-white mb-4">Lead Funnel</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Leads", value: leads.length, pct: 100, color: "bg-cyan-400" },
                  { label: "Contacted", value: leads.filter(l => l.lastContactAt).length, pct: Math.round((leads.filter(l => l.lastContactAt).length / leads.length) * 100), color: "bg-blue-400" },
                  { label: "Qualified", value: leads.filter(l => ["Qualified", "Pre Approval Started", "Application Started", "Converted"].includes(l.status)).length, pct: Math.round((leads.filter(l => ["Qualified", "Pre Approval Started", "Application Started", "Converted"].includes(l.status)).length / leads.length) * 100), color: "bg-purple-400" },
                  { label: "Application", value: leads.filter(l => ["Application Started", "Converted"].includes(l.status)).length, pct: Math.round((leads.filter(l => ["Application Started", "Converted"].includes(l.status)).length / leads.length) * 100), color: "bg-amber-400" },
                  { label: "Funded", value: leads.filter(l => l.status === "Converted").length, pct: Math.round((leads.filter(l => l.status === "Converted").length / leads.length) * 100), color: "bg-emerald-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-white/50">{item.label}</span>
                      <span className="text-[12px] font-bold text-white/70">{item.value} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-[15px] font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-0">
                {activities.slice(0, 8).map((act, i) => (
                  <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-white/[0.03] last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      act.type === "lead_created" ? "bg-cyan-400" :
                      act.type === "stage_changed" ? "bg-amber-400" :
                      act.type === "note_added" ? "bg-green-400" :
                      act.type === "borrower_created" ? "bg-purple-400" :
                      act.type === "lead_converted" ? "bg-emerald-400" :
                      "bg-white/20"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white/60 truncate">{act.description}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{new Date(act.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-[15px] font-bold text-white mb-4">Alerts</h3>
              <div className="space-y-2">
                {alertData.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.severity === "critical" ? "border-red-500/20 bg-red-500/[0.04]" :
                    alert.severity === "warning" ? "border-amber-500/20 bg-amber-500/[0.04]" :
                    "border-white/[0.06] bg-white/[0.02]"
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        alert.severity === "critical" ? "text-red-400" : alert.severity === "warning" ? "text-amber-400" : "text-white/30"
                      }`} />
                      <div>
                        <p className="text-[12px] font-bold text-white/70">{alert.title}</p>
                        <p className="text-[11px] text-white/35 mt-0.5">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-[15px] font-bold text-white">Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {loanOfficers.sort((a, b) => b.volume - a.volume).map((lo, i) => (
                  <div key={lo.id} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                      i === 0 ? "bg-amber-400/20 text-amber-400" : i === 1 ? "bg-white/10 text-white/50" : "bg-white/[0.04] text-white/30"
                    }`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-white/70 truncate">{lo.fullName}</p>
                      <p className="text-[10px] text-white/25">{lo.closedLoans} closed · {lo.avgResponseTime}min avg</p>
                    </div>
                    <p className="text-[12px] font-bold text-white/50">${(lo.volume / 1000000).toFixed(1)}M</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h3 className="text-[15px] font-bold text-white">Upcoming Closings</h3>
              </div>
              <div className="space-y-2">
                {loanFiles
                  .filter(lf => lf.estimatedClose && !["Funded", "Closed", "Lost / Withdrawn"].includes(lf.stage))
                  .sort((a, b) => new Date(a.estimatedClose).getTime() - new Date(b.estimatedClose).getTime())
                  .slice(0, 4)
                  .map((lf) => {
                    const bw = borrowers.find(b => b.loanFileId === lf.id);
                    return (
                      <div key={lf.id} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-white/60 truncate">{bw?.fullName || "TBD"}</p>
                          <p className="text-[10px] text-white/25">${(lf.amount / 1000).toFixed(0)}K · {lf.loanType}</p>
                        </div>
                        <p className="text-[11px] font-bold text-white/40">{new Date(lf.estimatedClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
