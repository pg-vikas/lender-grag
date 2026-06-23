import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { ChevronLeft, UserPlus, Mail, Phone, FileText, CheckSquare, Calendar, MessageSquare, RefreshCw, Briefcase, CheckCircle, FilePlus, Activity, Image, MessageCircle, Headphones } from "lucide-react";

export default function UserPerformancePage() {
  const [openMenus, setOpenMenus] = useState<string>('reports');
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string, filter?: string }>();
  
  const userId = params.id;
  const filter = params.filter || 'all';
  const activeTab = filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time';

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const handleTabClick = (tab: string) => {
    const newFilter = tab === 'Today' ? 'today' : tab === 'This Week' ? 'week' : tab === 'This Month' ? 'month' : 'all';
    setLocation(`/admin/performance/user/${userId}/${newFilter}`);
  };

  // Varing the data based on filter to show it updates
  const multiplier = filter === 'today' ? 0.1 : filter === 'week' ? 0.3 : filter === 'month' ? 0.7 : 1;

  const performanceMetrics = [
    { title: "Total Actions", value: Math.floor(263 * multiplier), color: "text-indigo-400" },
    { title: "Active Minutes", value: filter === 'today' ? "45 mins" : "5 hrs 26 mins", color: "text-emerald-400" },
    { title: "Idle Minutes", value: filter === 'today' ? "2 hrs 10 mins" : "80 hrs 15 mins", color: "text-slate-400" },
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

  const pieData = [
    { name: 'Lead Added', value: Math.floor(40 * multiplier), color: '#60a5fa' },
    { name: 'Email Sent', value: Math.floor(30 * multiplier), color: '#34d399' },
    { name: 'Call Logged', value: Math.floor(20 * multiplier), color: '#f472b6' },
    { name: 'Note Added', value: Math.floor(10 * multiplier), color: '#fbbf24' },
    { name: 'Task Completed', value: Math.floor(15 * multiplier), color: '#a78bfa' },
    { name: 'Meeting Set', value: Math.floor(5 * multiplier), color: '#38bdf8' }
  ];

  const recentActionsData = [
    { date: "Oct 27, 2023 10:00 AM", action: "Lead Added", description: "Added new lead John Doe", client: "John Doe", clientId: "1" },
    { date: "Oct 27, 2023 10:45 AM", action: "Email Sent", description: "Sent follow-up email", client: "Sarah Smith", clientId: "2" },
    { date: "Oct 26, 2023 02:15 PM", action: "Call Logged", description: "Introductory call (15 mins)", client: "Tech Corp", clientId: "3" },
    { date: "Oct 26, 2023 04:30 PM", action: "Note Added", description: "Client requested new proposal", client: "Acme Inc", clientId: "4" },
    { date: "Oct 25, 2023 09:10 AM", action: "Task Completed", description: "Prepare Q3 report", client: "Internal", clientId: "1" },
    { date: "Oct 25, 2023 11:20 AM", action: "Meeting Set", description: "Scheduled demo for next week", client: "Global UI", clientId: "2" },
    { date: "Oct 24, 2023 01:05 PM", action: "Lead Added", description: "Added new lead Michael Brown", client: "Michael Brown", clientId: "3" },
    { date: "Oct 24, 2023 03:50 PM", action: "Email Sent", description: "Sent requested pricing info", client: "Tech Corp", clientId: "4" },
    { date: "Oct 23, 2023 10:15 AM", action: "Call Logged", description: "Follow up call (5 mins)", client: "Sarah Smith", clientId: "1" },
    { date: "Oct 23, 2023 04:45 PM", action: "Task Completed", description: "Update client CRM data", client: "Internal", clientId: "2" }
  ].slice(0, Math.max(3, Math.floor(10 * multiplier)));

  const allUsers = [
    { id: 1, name: "PR Admin", role: "Super Admin", email: "admin@pinkgorilla.agency" },
    { id: 2, name: "Sale Admin", role: "Sales Lead", email: "sales@pinkgorilla.agency" },
    { id: 3, name: "Vikas Dev", role: "Developer", email: "vikas@pinkgorilla.agency" },
    { id: 4, name: "Chayan", role: "Designer", email: "chayan@pinkgorilla.agency" },
    { id: 5, name: "Neeraj", role: "Marketing", email: "neeraj@pinkgorilla.agency" },
    { id: 6, name: "Jordan", role: "Consultant", email: "jordan@pinkgorilla.agency" }
  ];

  const currentUser = allUsers.find(u => u.id === parseInt(userId || '0')) || allUsers[2];

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title={`Performance Details - ${currentUser.name}`} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col mb-2">
              <div className="flex items-center gap-4 mb-4">
                <Link href={`/admin/performance/${filter}`}>
                  <button className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to directory
                  </button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Performance Details - {currentUser.name}</h1>
                
                <div className="flex items-center gap-2">
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
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm text-slate-400">From</span>
                    <input type="date" className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500" />
                    <span className="text-sm text-slate-400">To</span>
                    <input type="date" className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500" />
                    <button className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{currentUser.name}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">{currentUser.email}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-purple-400 font-medium">{currentUser.role}</span>
                </div>
              </div>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600 bg-slate-950">
                Update
              </button>
            </div>

            {/* Performance Metrics Summary Grid */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Performance Metrics Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="bg-slate-950 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors shadow-sm">
                    <div className={`text-xl xl:text-2xl font-bold mb-2 ${metric.color}`}>{metric.value}</div>
                    <div className="text-xs font-medium text-slate-400">{metric.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Sessions */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-slate-300">Timer Sessions</h2>
                <span className="text-xs text-slate-500">For {filter === 'today' ? 'today' : filter === 'week' ? 'this week' : filter === 'month' ? 'this month' : 'all time'} based on filter selection</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Active Time</span>
                    <span className="text-emerald-400 font-medium">65%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden w-full relative">
                    {/* Simulated timeline blocks for active time */}
                    <div className="absolute top-0 bottom-0 left-[5%] w-[20%] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute top-0 bottom-0 left-[30%] w-[15%] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute top-0 bottom-0 left-[50%] w-[30%] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>09:00</span>
                    <span>12:00</span>
                    <span>15:00</span>
                    <span>18:00</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Idle Time</span>
                    <span className="text-slate-300 font-medium">35%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden w-full relative">
                    {/* Simulated timeline blocks for idle time */}
                    <div className="absolute top-0 bottom-0 left-[25%] w-[5%] bg-slate-500"></div>
                    <div className="absolute top-0 bottom-0 left-[45%] w-[5%] bg-slate-500"></div>
                    <div className="absolute top-0 bottom-0 left-[80%] w-[20%] bg-slate-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Actions Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Daily Actions</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickMargin={10} 
                      axisLine={false} 
                      tickLine={false} 
                      angle={-45}
                      textAnchor="end"
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
                      name="Actions"
                      dataKey="actions" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Consistency Trends */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Consistency Trends</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <defs>
                      <linearGradient id="colorActionsUser" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorActionsUser)" 
                      activeDot={{ r: 5, fill: '#fff', stroke: '#2dd4bf', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Action Breakdown by Type */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h2 className="text-lg font-medium text-slate-300 mb-6">Action Breakdown by Type</h2>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Indicators */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                <h2 className="text-lg font-medium text-slate-300 mb-6">Conversion Indicators</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900/40 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-800">
                    <span className="text-3xl font-semibold text-teal-400 mb-2">{pieData.find(d => d.name === 'Lead Added')?.value || 0}</span>
                    <span className="text-sm font-medium text-slate-400">Leads Converted</span>
                  </div>
                  <div className="bg-slate-900/40 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-800">
                    <span className="text-3xl font-semibold text-purple-400 mb-2">{pieData.find(d => d.name === 'Task Completed')?.value || 0}</span>
                    <span className="text-sm font-medium text-slate-400">Tasks Completed</span>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-slate-400 mb-5">Action Breakdown:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm gap-2">
                      {item.name === 'Lead Added' && <UserPlus className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      {item.name === 'Email Sent' && <Mail className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      {item.name === 'Call Logged' && <Phone className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      {item.name === 'Note Added' && <FileText className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      {item.name === 'Task Completed' && <CheckSquare className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      {item.name === 'Meeting Set' && <Calendar className="w-4 h-4 shrink-0" style={{ color: item.color }} />}
                      <span className="text-slate-300 font-medium">{item.name}:</span>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Actions Tracker */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h2 className="text-lg font-medium text-slate-300 mb-6">Recent Actions Tracker</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left dark-table">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Date</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Action</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Description</th>
                      <th className="py-3 px-4 text-xs font-semibold text-slate-400 tracking-wider">Client</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {recentActionsData.length > 0 ? recentActionsData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 text-sm text-slate-400 whitespace-nowrap">{row.date}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            row.action === 'Lead Added' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            row.action === 'Email Sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            row.action === 'Call Logged' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                            row.action === 'Note Added' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            row.action === 'Task Completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}>
                            {row.action}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">{row.description}</td>
                        <td className="py-4 px-4 text-sm font-medium">
                          <Link href={`/admin/clients/${row.clientId || '1'}`}>
                            <span className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline">{row.client}</span>
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">No recent actions found for this time period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}