import { useState, useEffect } from "react";
import { 
  Users, BarChart2, HelpCircle, ArrowUpRight, User, Building2, Search, 
  Activity, Zap, TrendingUp, ShieldAlert, Server, Briefcase, ArrowRight, 
  FileText, CheckSquare, Star, Calculator, Plus, MessageSquare, Quote,
  DollarSign, Percent, Edit2, Send
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { WorkSession } from "../components/WorkSession";

export default function Home() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [greeting, setGreeting] = useState('');
  
  // Calculator State
  const [calcClients, setCalcClients] = useState(15);
  const [calcRetainer, setCalcRetainer] = useState(2500);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const chartData = {
    '7D': [50, 65, 55, 70, 85, 75, 90],
    '30D': [40, 55, 45, 60, 75, 65, 80, 70, 85, 90, 80, 95, 85, 100],
    '90D': [30, 45, 35, 50, 65, 55, 70, 60, 75, 80, 70, 85, 75, 90, 80, 95, 85, 100, 95, 100, 90]
  };

  const chartLabels = {
    '7D': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '30D': ['W1', 'W2', 'W3', 'W4'],
    '90D': ['M1', 'M2', 'M3']
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <Header title="Pipeline Dashboard" />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* HERO SECTION */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-600 bg-slate-950/50 backdrop-blur-xl shadow-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Origination System Operational
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                      {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Greg Wynn</span>.
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                      Here's your pipeline overview today. Total funded volume is up <span className="text-emerald-400 font-bold">12%</span> this month, and you have 8 applications ready for review.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center gap-2 group">
                        <Plus className="w-5 h-5" />
                        New Application
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-600 bg-slate-950 hover:border-slate-500 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Run Pre-Approval
                      </button>
                    </div>
                  </div>
                  
                    {/* Work Session Component removed and replaced with Pre-Approvals */}
                    <div className="w-full max-w-sm bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 shadow-xl backdrop-blur-sm z-20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <FileText className="w-4 h-4 text-fuchsia-400" />
                          Pre-Approvals
                        </h3>
                        <Link href="/admin/pre-approvals" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                          View All
                        </Link>
                      </div>
                      
                      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          { name: 'Sarah Jenkins', amount: '$500k', status: 'Ready to Send', statusColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' },
                          { name: 'Michael Chen', amount: '$750k', status: 'In Review', statusColor: 'text-amber-400 bg-amber-400/10 border border-amber-400/20' },
                          { name: 'Emma Davis', amount: '$425k', status: 'Sent', statusColor: 'text-blue-400 bg-blue-400/10 border border-blue-400/20' },
                          { name: 'John Smith', amount: '$600k', status: 'Draft', statusColor: 'text-slate-400 bg-slate-400/10 border border-slate-400/20' },
                          { name: 'Lisa Wong', amount: '$850k', status: 'Ready to Send', statusColor: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' },
                        ].map((client, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-colors group">
                            <div>
                              <div className="text-sm font-bold text-white mb-0.5">{client.name}</div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{client.amount}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${client.statusColor}`}>
                                  {client.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/admin/pre-approvals?id=${client.name}`} className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 hover:text-white transition-all shadow-sm" title="Edit">
                                <Edit2 className="w-3.5 h-3.5" />
                              </Link>
                              <Link href={`/admin/pre-approvals?id=${client.name}&action=send`} className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Send">
                                <Send className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Link href="/admin/pre-approvals" className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Generate New Letter
                      </Link>
                    </div>
                </div>
              </div>

              {/* TOP METRICS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Active Pipeline', value: '$4.2M', trend: '+12%', up: true, icon: Briefcase, color: 'purple' },
                  { title: 'Loans in Process', value: '14', trend: '+2', up: true, icon: FileText, color: 'cyan' },
                  { title: 'Funded YTD', value: '$18.5M', trend: '+18%', up: true, icon: DollarSign, color: 'emerald' },
                  { title: 'Avg Close Time', value: '22 Days', trend: '-3 Days', up: true, icon: Activity, color: 'orange' }
                ].map((metric, i) => (
                  <div 
                    key={i} 
                    className={`bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-600 bg-slate-950/50 hover:border-slate-500 transition-all hover:-translate-y-1 shadow-lg group animate-in fade-in slide-in-from-bottom-4`}
                    style={{ animationDelay: `\${(i + 1) * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/20 text-${metric.color}-400 group-hover:bg-${metric.color}-500 group-hover:text-white transition-colors`}>
                        <metric.icon className="w-5 h-5" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${metric.trend.includes('-') && !metric.trend.includes('Days') ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {metric.trend !== 'Stable' && <TrendingUp className="w-3 h-3" />} {metric.trend}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{metric.title}</div>
                      <div className="text-3xl font-extrabold text-white tracking-tight">{metric.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MIDDLE ROW: CHART & CALCULATOR */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-slate-600 bg-slate-950/50 shadow-lg relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 delay-500 border-t-indigo-500 border-t-4">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Funded Volume Overview</h2>
                      <p className="text-sm text-slate-400">Total loan amount funded across all programs</p>
                    </div>
                    <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-600 bg-slate-950/50">
                      {['7D', '30D', '90D'].map((range) => (
                        <button 
                          key={range}
                          onClick={() => setTimeRange(range as any)}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                            timeRange === range 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* CSS Chart Visualization */}
                  <div className="h-72 flex items-end gap-2 relative z-10 pt-4 mt-4">
                    {/* Y Axis */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 font-mono py-2 w-12 border-r border-slate-800">
                      <span>$2M</span><span>$1.5M</span><span>$1M</span><span>$0</span>
                    </div>
                    
                    {/* Grid Lines */}
                    <div className="absolute left-14 right-0 top-0 bottom-8 flex flex-col justify-between z-0">
                      <div className="w-full border-t border-slate-800/80"></div>
                      <div className="w-full border-t border-slate-800/80"></div>
                      <div className="w-full border-t border-slate-800/80"></div>
                      <div className="w-full border-t border-slate-600 bg-slate-950"></div>
                    </div>
                    
                    {/* Bars */}
                    <div className="ml-14 flex-1 flex items-end justify-between gap-1 sm:gap-3 h-[calc(100%-2rem)] z-10 relative group-hover:[&>div>div]:opacity-100">
                      {chartData[timeRange].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group/bar cursor-pointer relative h-full">
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 bg-slate-950 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap shadow-xl flex items-center gap-1.5 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            ${(height * 0.02).toFixed(2)}M
                          </div>
                          
                          {/* Bar */}
                          <div 
                            style={{ height: `${height}%` }} 
                            className="w-full bg-gradient-to-t from-indigo-900/40 to-indigo-500/70 rounded-t-md relative transition-all duration-500 group-hover/bar:to-indigo-400 group-hover/bar:from-indigo-600/50"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-300 rounded-t-md opacity-70 group-hover/bar:bg-white"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* X Axis */}
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono ml-14 mt-3 px-2 uppercase tracking-widest">
                    {chartLabels[timeRange].map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>
                </div>

                {/* Rates Widget */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-600 bg-slate-950/50 shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 delay-700 border-t-emerald-500 border-t-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
                  
                  <div className="p-6 border-b border-slate-800/80">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Percent className="w-5 h-5 text-emerald-400" /> Today's Rates
                    </h2>
                    <p className="text-xs text-slate-400">National average mortgage rates</p>
                  </div>
                  
                  <div className="p-0 flex-1 flex flex-col">
                    <div className="divide-y divide-slate-800/80">
                      {[
                        { program: '30-Year Fixed', rate: '6.85%', apr: '7.02%', trend: 'down' },
                        { program: '15-Year Fixed', rate: '6.12%', apr: '6.31%', trend: 'down' },
                        { program: '5/1 ARM', rate: '6.25%', apr: '7.54%', trend: 'up' },
                        { program: 'Jumbo 30-Year', rate: '7.05%', apr: '7.15%', trend: 'stable' },
                        { program: 'FHA 30-Year', rate: '6.45%', apr: '7.38%', trend: 'down' }
                      ].map((item, i) => (
                         <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                            <div>
                               <div className="text-sm font-bold text-white">{item.program}</div>
                               <div className="text-[11px] text-slate-400">APR {item.apr}</div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="text-lg font-extrabold text-emerald-400">{item.rate}</div>
                               <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                                 item.trend === 'down' ? 'bg-emerald-500/20 text-emerald-400' : 
                                 item.trend === 'up' ? 'bg-rose-500/20 text-rose-400' : 
                                 'bg-slate-700 text-slate-400'
                               }`}>
                                 {item.trend === 'down' ? <TrendingUp className="w-3 h-3 rotate-180" /> : 
                                  item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                                  <span className="w-2 h-0.5 bg-slate-400 rounded-full"></span>}
                               </div>
                            </div>
                         </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto p-4 border-t border-slate-800/80 bg-slate-900/30 text-center">
                       <span className="text-[11px] text-slate-500 font-medium">Last updated: Today at 8:30 AM EST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: PIPELINE, TASKS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Task List Widget */}
                <div className="glass-panel rounded-2xl border border-slate-600 bg-slate-950/50 shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 delay-1000 border-t-amber-500 border-t-4">
                  <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/30">
                    <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-amber-400" /> Action Items
                    </h2>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">6 Due Today</span>
                  </div>
                  
                  <div className="p-0">
                    <div className="divide-y divide-slate-800/50">
                      {[
                        { task: 'Review appraisal for Smith property', client: 'John & Jane Smith', type: 'Underwriting', time: '10:00 AM' },
                        { task: 'Send initial disclosures', client: 'Michael Johnson', type: 'Origination', time: '1:30 PM' },
                        { task: 'Follow up on missing W2s', client: 'Sarah Williams', type: 'Processing', time: '3:00 PM' },
                        { task: 'Lock rate before expiration', client: 'David Brown', type: 'Lock Desk', time: '4:15 PM' },
                        { task: 'Call listing agent for status', client: 'Emily Davis', type: 'Communication', time: '5:00 PM' }
                      ].map((task, i) => (
                        <div key={i} className="p-4 flex items-start gap-3 hover:bg-slate-800/40 transition-colors group cursor-pointer">
                           <div className="mt-0.5 w-4 h-4 rounded border border-slate-500 bg-slate-800 flex items-center justify-center group-hover:border-amber-500 transition-colors">
                              <CheckSquare className="w-3 h-3 text-transparent group-hover:text-amber-500/50" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-bold text-white mb-0.5 truncate">{task.task}</div>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-slate-400 truncate">{task.client}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className="text-amber-400/80">{task.type}</span>
                              </div>
                           </div>
                           <div className="text-[11px] font-medium text-slate-500 whitespace-nowrap">{task.time}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
                        <button className="w-full py-2.5 rounded-lg border border-slate-600 bg-slate-950 text-[13px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        View All Tasks
                        </button>
                    </div>
                  </div>
                </div>

                {/* Pipeline Status */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-600 bg-slate-950/50 shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 delay-1000 border-t-rose-500 border-t-4">
                  <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/30">
                    <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-rose-400" /> Active Pipeline Needs Attention
                    </h2>
                    <Link href="/admin/clients" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
                      View Full Pipeline <ArrowRight className="w-3 h-3 inline" />
                    </Link>
                  </div>
                  
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Borrower</th>
                          <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Loan Amount</th>
                          <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Program</th>
                          <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Est. Close</th>
                          <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {[
                          { name: 'Smith, John & Jane', amount: '$450,000', program: '30-Yr Conv', closeDate: 'Oct 15', status: 'Clear to Close', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                          { name: 'Johnson, Michael', amount: '$325,000', program: 'FHA 30-Yr', closeDate: 'Oct 22', status: 'Cond. Approval', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                          { name: 'Williams, Sarah', amount: '$850,000', program: 'Jumbo 30-Yr', closeDate: 'Oct 28', status: 'Appraisal Ordered', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                          { name: 'Brown, David', amount: '$275,000', program: 'VA 30-Yr', closeDate: 'Nov 05', status: 'Processing', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                          { name: 'Davis, Emily', amount: '$520,000', program: '30-Yr Conv', closeDate: 'Nov 12', status: 'Application', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                        ].map((loan, i) => (
                          <tr key={i} className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                            <td className="py-3.5 px-5 text-[13px] font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {loan.name}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-[13px] text-slate-300">
                              {loan.amount}
                            </td>
                            <td className="py-3.5 px-5 text-[13px] text-slate-400">
                              {loan.program}
                            </td>
                            <td className="py-3.5 px-5 text-[13px] text-slate-400">
                              {loan.closeDate}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${loan.color}`}>
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Extra spacing at bottom */}
              <div className="h-12"></div>
              
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
