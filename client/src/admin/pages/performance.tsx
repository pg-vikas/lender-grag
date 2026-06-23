import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Sidebar, Header } from "./clients";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AlertTriangle } from "lucide-react";

export default function PerformancePage() {
  const [openMenus, setOpenMenus] = useState<string>('reports');
  const [location, setLocation] = useLocation();
  const params = useParams<{ filter?: string }>();
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [appliedDateRange, setAppliedDateRange] = useState<{from: string, to: string} | null>(null);
  
  const filter = params.filter || 'all';
  const activeTab = appliedDateRange ? 'Custom' : filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time';

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'Custom') return;
    setAppliedDateRange(null);
    setFromDate("");
    setToDate("");
    setDateError("");
    const newFilter = tab === 'Today' ? 'today' : tab === 'This Week' ? 'week' : tab === 'This Month' ? 'month' : 'all';
    setLocation(`/admin/performance/${newFilter}`);
  };

  const handleApplyDateRange = () => {
    if (!fromDate || !toDate) {
      setDateError("Please select both dates");
      return;
    }
    
    if (new Date(fromDate) > new Date(toDate)) {
      setDateError("From Date cannot be after To Date");
      return;
    }
    
    setDateError("");
    setAppliedDateRange({ from: fromDate, to: toDate });
  };

  // Varing the data based on filter to show it updates
  const multiplier = appliedDateRange ? 0.4 : filter === 'today' ? 0.1 : filter === 'week' ? 0.3 : filter === 'month' ? 0.7 : 1;

  const performanceMetrics = [
    { title: "Total Actions", value: Math.floor(263 * multiplier), color: "text-indigo-400" },
    { title: "Active Minutes", value: appliedDateRange ? "18 hrs 10 mins" : filter === 'today' ? "45 mins" : "5 hrs 26 mins", color: "text-emerald-400" },
    { title: "Idle Minutes", value: appliedDateRange ? "20 hrs 30 mins" : filter === 'today' ? "2 hrs 10 mins" : "80 hrs 15 mins", color: "text-slate-400" },
    { title: "Leads Contacted", value: Math.floor(4 * multiplier), color: "text-purple-400" },
    { title: "Follow-ups Completed", value: Math.floor(14 * multiplier), color: "text-orange-400" },
    { title: "Response Rate", value: "0.0%", color: "text-rose-400" },
    { title: "Projects", value: Math.floor(28 * multiplier), color: "text-teal-400" },
    { title: "Conversions", value: Math.floor(8 * multiplier), color: "text-indigo-400" }
  ];

  const trendData = [
    { date: '2023-09-15', actions: 2 },
    { date: '2023-09-20', actions: 5 },
    { date: '2023-09-25', actions: 3 },
    { date: '2023-09-30', actions: 2 },
    { date: '2023-10-05', actions: 1 },
    { date: '2023-10-10', actions: 4 },
    { date: '2023-10-15', actions: 12 },
    { date: '2023-10-20', actions: 8 },
    { date: '2023-10-25', actions: 5 },
    { date: '2023-10-30', actions: 42 },
    { date: '2023-11-04', actions: 15 },
    { date: '2023-11-09', actions: 56 },
    { date: '2023-11-14', actions: 25 },
    { date: '2023-11-19', actions: 18 },
    { date: '2023-11-24', actions: 10 },
    { date: '2023-11-29', actions: 22 },
    { date: '2023-12-04', actions: 5 },
    { date: '2023-12-09', actions: 13 },
    { date: '2023-12-14', actions: 8 },
    { date: '2023-12-19', actions: 3 },
    { date: '2023-12-24', actions: 24 }
  ].map(d => ({ ...d, actions: Math.floor(d.actions * multiplier) }));

  const leaderboardData = [
    { id: 1, rank: "#1", name: "PR Admin", actions: Math.floor(173 * multiplier), active: "3 hrs 49 mins", idle: "75 hrs 45 mins", sessions: "1 hr 25 mins", color: "bg-orange-500" },
    { id: 2, rank: "#2", name: "Sale Admin", actions: Math.floor(32 * multiplier), active: "21 minutes", idle: "25 minutes", sessions: "22 minutes", color: "bg-slate-400" },
    { id: 3, rank: "#3", name: "Vikas Dev", actions: Math.floor(21 * multiplier), active: "1 hr 16 mins", idle: "2 hrs 12 mins", sessions: "0 second", color: "bg-cyan-500" },
    { id: 4, rank: "#4", name: "Chayan", actions: Math.floor(15 * multiplier), active: "0 second", idle: "0 second", sessions: "0 second", color: "" },
    { id: 5, rank: "#5", name: "Neeraj", actions: Math.floor(5 * multiplier), active: "0 second", idle: "1 hr 53 mins", sessions: "0 second", color: "" },
    { id: 6, rank: "#6", name: "Jordan", actions: Math.floor(2 * multiplier), active: "0 second", idle: "0 second", sessions: "0 second", color: "" }
  ];

  const lowActivityData = [
    { name: "Neeraj", actions: Math.floor(5 * multiplier), threshold: 10, status: "Below Threshold" },
    { name: "Jordan", actions: Math.floor(2 * multiplier), threshold: 10, status: "Below Threshold" }
  ];

  const barChartData = leaderboardData.map(user => ({
    name: user.name,
    actions: user.actions
  }));

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Performance Dashboard" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col mb-4">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-4">Performance Dashboard</h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex border border-purple-500/30 rounded-lg overflow-hidden glass-panel">
                  {['Today', 'This Week', 'This Month', 'All Time'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab 
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' 
                          : 'text-purple-300 hover:bg-purple-500/10 border-r border-purple-500/30 last:border-r-0'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  {appliedDateRange && (
                    <button 
                      className="px-4 py-2 text-sm font-medium bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                    >
                      Custom
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">From</span>
                  <input 
                    type="date" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500" 
                  />
                  <span className="text-sm text-slate-400">To</span>
                  <input 
                    type="date" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500" 
                  />
                  <button 
                    onClick={handleApplyDateRange}
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
              
              {dateError && (
                <div className="text-sm text-rose-400 mt-2 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {dateError}
                </div>
              )}
              {appliedDateRange && !dateError && (
                <div className="text-sm text-indigo-400 mt-2 font-medium">
                  Showing data from {new Date(appliedDateRange.from).toLocaleDateString()} to {new Date(appliedDateRange.to).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Team Performance Metrics Grid */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Team Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-slate-950 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors shadow-sm">
                    <div className={`text-xl xl:text-2xl font-bold mb-2 ${metric.color}`}>{metric.value}</div>
                    <div className="text-xs font-medium text-slate-400">{metric.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Trends */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Consistency Trends</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <defs>
                      <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={true} horizontal={true} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickMargin={10}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis stroke="#64748b" fontSize={12} tickMargin={10} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Area 
                      name="Daily Actions"
                      type="monotone" 
                      dataKey="actions" 
                      stroke="#2dd4bf" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorActions)" 
                      activeDot={{ r: 5, fill: '#fff', stroke: '#2dd4bf', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Leaderboard */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Team Leaderboard</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left dark-table">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Rank</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Name</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Total Actions</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Active Minutes</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Idle Minutes</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Timer Sessions</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {leaderboardData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {row.color && (
                              <div className={`w-4 h-3 rounded-sm ${row.color}`}></div>
                            )}
                            <span className="text-slate-300">{row.rank}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-indigo-400">{row.name}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.actions}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.active}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.idle}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.sessions}</td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => setLocation(`/admin/performance/user/${row.id}/${filter}`)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(79,70,229,0.3)]">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Activity Alerts */}
            <div className="glass-panel p-6 rounded-2xl border border-rose-500/20">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-medium text-rose-400">Low Activity Alerts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left dark-table">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider w-1/4">Advisor</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider w-1/4">Total Actions</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider w-1/4">Threshold</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider w-1/4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {lowActivityData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 text-sm font-medium text-slate-300">{row.name}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.actions}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.threshold}</td>
                        <td className="py-4 px-4">
                          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded text-xs font-medium inline-block">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Member Overview */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Team Member Overview</h2>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickMargin={10} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickMargin={10} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      cursor={{ fill: '#1e293b' }}
                    />
                    <Bar 
                      name="Total Actions"
                      dataKey="actions" 
                      fill="#60a5fa" 
                      radius={[4, 4, 0, 0]} 
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
