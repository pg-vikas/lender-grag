import { useState } from "react";
import { BarChart2, PieChart, TrendingUp, Calendar, Download } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

export default function ReportsPage() {
  const [openMenus, setOpenMenus] = useState<string>('reports');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month'>('all');
  const [location] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const stats = timeFilter === 'all' 
    ? {
        revenue: "$124,500", revGrowth: "+14.5% from last month",
        projects: "42", projGrowth: "+5 new this month",
        retention: "94.2%", retGrowth: "-1.2% from last month",
        chartData: [40, 65, 45, 80, 55, 90, 100],
        chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        statusData: { completed: '45%', inProgress: '35%', planning: '20%' },
        statusNum: { completed: 45, inProgress: 35, planning: 20 }
      }
    : {
        revenue: "$24,500", revGrowth: "+2.1% this week",
        projects: "5", projGrowth: "+2 this week",
        retention: "96.0%", retGrowth: "+0.5% from last week",
        chartData: [20, 35, 50, 80],
        chartLabels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
        statusData: { completed: '15%', inProgress: '60%', planning: '25%' },
        statusNum: { completed: 15, inProgress: 60, planning: 25 }
      };

  const handleExport = () => {
    const csvContent = [
      ["Metric", "Value", "Growth"],
      ["Total Revenue", `"${stats.revenue}"`, `"${stats.revGrowth}"`],
      ["Active Projects", stats.projects, `"${stats.projGrowth}"`],
      ["Client Retention", stats.retention, `"${stats.retGrowth}"`],
      [],
      ["Chart Data", "Value"],
      ...stats.chartLabels.map((label, i) => [label, stats.chartData[i] + "%"]),
      [],
      ["Project Status", "Percentage"],
      ["Completed", stats.statusData.completed],
      ["In Progress", stats.statusData.inProgress],
      ["Planning", stats.statusData.planning]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reports_${timeFilter}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Reports" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[22px] font-bold text-white">Reports Overview</h1>
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setTimeFilter(prev => prev === 'all' ? 'month' : 'all')}
                   className={`flex items-center gap-2 px-4 py-2.5 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow ${timeFilter === 'month' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'}`}
                 >
                    <Calendar className="w-4 h-4" /> {timeFilter === 'month' ? 'All Time' : 'This Month'}
                 </button>
                 <button 
                   onClick={handleExport}
                   className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                 >
                    <Download className="w-4 h-4" /> Export
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 border border-white/10 flex items-center justify-between transition-all duration-300">
                 <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
                   <h3 className="text-3xl font-bold text-white">{stats.revenue}</h3>
                   <p className={`text-sm mt-2 flex items-center gap-1 font-medium ${stats.revGrowth.includes('-') ? 'text-amber-500' : 'text-green-500'}`}>
                     <TrendingUp className={`w-4 h-4 ${stats.revGrowth.includes('-') ? 'rotate-180' : ''}`} /> {stats.revGrowth}
                   </p>
                 </div>
                 <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                    <BarChart2 className="w-8 h-8 text-purple-500" />
                 </div>
              </div>
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 border border-white/10 flex items-center justify-between transition-all duration-300">
                 <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">Active Projects</p>
                   <h3 className="text-3xl font-bold text-white">{stats.projects}</h3>
                   <p className={`text-sm mt-2 flex items-center gap-1 font-medium ${stats.projGrowth.includes('-') ? 'text-amber-500' : 'text-green-500'}`}>
                     <TrendingUp className={`w-4 h-4 ${stats.projGrowth.includes('-') ? 'rotate-180' : ''}`} /> {stats.projGrowth}
                   </p>
                 </div>
                 <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-blue-500" />
                 </div>
              </div>
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 border border-white/10 flex items-center justify-between transition-all duration-300">
                 <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">Client Retention</p>
                   <h3 className="text-3xl font-bold text-white">{stats.retention}</h3>
                   <p className={`text-sm mt-2 flex items-center gap-1 font-medium ${stats.retGrowth.includes('-') ? 'text-amber-500' : 'text-green-500'}`}>
                     <TrendingUp className={`w-4 h-4 ${stats.retGrowth.includes('-') ? 'rotate-180' : ''}`} /> {stats.retGrowth}
                   </p>
                 </div>
                 <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]merald-500" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 border border-white/10 p-6">
                 <h2 className="text-lg font-bold text-white mb-6">Revenue Growth</h2>
                 <div className="h-[300px] flex items-end justify-between gap-2">
                    {/* Mock Bar Chart */}
                    {stats.chartData.map((height, i) => (
                      <div key={i} className="w-full bg-slate-900/40 backdrop-blur-xl/50 rounded-t-lg relative group transition-all duration-500">
                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400" style={{ height: `${height}%` }}></div>
                        <div className="absolute -bottom-6 w-full text-center text-xs text-slate-400">{stats.chartLabels[i]}</div>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 border border-white/10 p-6">
                 <h2 className="text-lg font-bold text-white mb-6">Project Status</h2>
                 <div className="flex flex-col gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-white">Completed</span>
                        <span className="text-slate-400">{stats.statusData.completed}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.statusNum.completed}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-white">In Progress</span>
                        <span className="text-slate-400">{stats.statusData.inProgress}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-amber-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.statusNum.inProgress}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-white">Planning</span>
                        <span className="text-slate-400">{stats.statusData.planning}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.statusNum.planning}%` }}></div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
