import { useState } from "react";
import { 
  BarChart2, 
  CheckSquare, 
  Unlink, 
  Users, 
  Target, 
  Zap, 
  DollarSign, 
  Lightbulb, 
  Smartphone, 
  Monitor, 
  MapPin,
  Clock,
  MousePointer2,
  TrendingUp
} from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

export default function WebsiteAnalyticsPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Website Analytics" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[22px] font-semibold text-white mb-6">Website Analytics</h1>

            {/* Google Analytics Dashboard Card */}
            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 shadow-sm border border-white/10 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="w-5 h-5 text-slate-500" />
                  <h2 className="text-base font-semibold text-slate-400">Google Analytics Dashboard</h2>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <p className="text-[15px] font-semibold text-white">Property ID: <span className="font-normal">508551389</span></p>
                  <p className="text-[15px] font-semibold text-emerald-400">Credentials: <span className="font-normal">Uploaded</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 border border-white/10 p-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" /> Connected to Google Analytics
                  </span>
                  <span className="text-[13px] text-slate-400 ml-6">Last checked: 2026-03-10 00:47:34</span>
                </div>
                <button className="px-4 py-2 border border-red-200 text-red-400 hover:bg-red-50 rounded-md text-sm font-medium flex items-center gap-2 transition-colors h-[38px] ml-4">
                  <Unlink className="w-4 h-4" /> Disconnect
                </button>
              </div>
            </div>

            {/* Four Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-5 shadow-sm border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-medium text-slate-300">Total Visitors</p>
                   <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Users className="w-[18px] h-[18px]" />
                   </div>
                 </div>
                 <h3 className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]xl font-medium text-white mb-1">51</h3>
                 <span className="text-xs font-medium text-emerald-400">↑ N/A this month</span>
               </div>

               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-5 shadow-sm border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-medium text-slate-300">New Leads Captured</p>
                   <div className="w-8 h-8 rounded bg-emerald-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]merald-600 flex items-center justify-center">
                      <Target className="w-[18px] h-[18px]" />
                   </div>
                 </div>
                 <h3 className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]xl font-medium text-white mb-1">0</h3>
                 <span className="text-xs font-medium text-emerald-400">↑ N/A from last month</span>
               </div>

               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-5 shadow-sm border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-medium text-slate-300">Conversion Rate</p>
                   <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Zap className="w-[18px] h-[18px]" />
                   </div>
                 </div>
                 <h3 className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]xl font-medium text-white mb-1">0.0%</h3>
                 <span className="text-xs font-medium text-emerald-400">↑ N/A</span>
               </div>

               <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-5 shadow-sm border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-medium text-slate-300">Revenue from Web Leads</p>
                   <div className="w-8 h-8 rounded bg-emerald-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]merald-600 flex items-center justify-center">
                      <DollarSign className="w-[18px] h-[18px]" />
                   </div>
                 </div>
                 <h3 className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]xl font-medium text-white mb-1">$0</h3>
                 <span className="text-xs font-medium text-emerald-400">↑ N/A this month</span>
               </div>
            </div>

            {/* Key Insights */}
            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 shadow-sm border border-white/10">
              <h3 className="text-[15px] font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-slate-400" /> Key Insights
              </h3>
              <ul className="space-y-3 text-[14px] text-slate-400 list-disc list-inside ml-2 marker:text-slate-300">
                <li>You had <span className="font-semibold text-white">51</span> visitors in the last 7 days.</li>
                <li><span className="font-semibold text-white">Direct</span> drove <span className="font-semibold text-white">34.3%</span> of sessions.</li>
                <li>Desktop users account for <span className="font-semibold text-white">85%</span> of traffic.</li>
                <li>Average time on site is <span className="font-semibold text-white">15m 50s</span>.</li>
              </ul>
            </div>

            {/* Website Traffic */}
            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 shadow-sm border border-white/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-medium text-white">Website Traffic</h3>
                  <p className="text-[13px] text-slate-500 mt-1">Visitor sessions over time</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-full">
                  <button className="px-4 py-1.5 bg-slate-900/40 backdrop-blur-xl shadow-sm rounded-full text-xs font-semibold text-white">7 Days</button>
                  <button className="px-4 py-1.5 text-slate-400 text-xs font-medium hover:text-white">30 Days</button>
                  <button className="px-4 py-1.5 text-slate-400 text-xs font-medium hover:text-white">90 Days</button>
                </div>
              </div>
              
              {/* Mock Line Chart Using SVG */}
              <div className="h-[200px] w-full mb-6 relative">
                 <svg viewBox="0 0 1000 200" className="w-full h-full preserve-aspect-ratio-none">
                    <polyline fill="none" stroke="#86efac" strokeWidth="2" points="50,150 200,50 350,70 500,140 650,190 800,120 950,200" />
                    <circle cx="50" cy="150" r="3" fill="#86efac" />
                    <circle cx="200" cy="50" r="3" fill="#86efac" />
                    <circle cx="350" cy="70" r="3" fill="#86efac" />
                    <circle cx="500" cy="140" r="3" fill="#86efac" />
                    <circle cx="650" cy="190" r="3" fill="#86efac" />
                    <circle cx="800" cy="120" r="3" fill="#86efac" />
                    <circle cx="950" cy="200" r="3" fill="#86efac" />
                 </svg>
                 <div className="absolute bottom-0 w-full flex justify-between text-xs text-slate-500 border-t border-white/10 pt-2 px-[5%]">
                    <span>Mar 03</span>
                    <span>Mar 04</span>
                    <span>Mar 05</span>
                    <span>Mar 06</span>
                    <span>Mar 07</span>
                    <span>Mar 08</span>
                    <span>Mar 09</span>
                    <span>Mar 10</span>
                 </div>
                 <div className="absolute left-0 bottom-2 w-4 h-full flex items-end">
                    <span className="text-xs text-slate-500 -translate-x-full pr-1">0</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-6">
                <div>
                  <h4 className="text-[14px] font-medium text-slate-300 mb-5">Top Traffic Sources</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Direct
                      </div>
                      <span className="font-medium text-white">34.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Referral
                      </div>
                      <span className="font-medium text-white">29.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Organic Search
                      </div>
                      <span className="font-medium text-white">24.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Unassigned
                      </div>
                      <span className="font-medium text-white">12.1%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-medium text-slate-300 mb-5">Device Breakdown</h4>
                  <div className="space-y-6 text-sm">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-slate-300">
                        <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]merald-400" /> Mobile</span>
                      </div>
                      <div className="text-[13px] text-slate-500 mb-1">15%</div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1 text-slate-300">
                        <span className="flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-400" /> Desktop</span>
                      </div>
                      <div className="text-[13px] text-slate-500 mb-1">85%</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-medium text-slate-300 mb-5">Top Locations</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Unknown, Eastern Visayas
                      </div>
                      <span className="font-medium text-white">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Chandigarh, Ropar Division
                      </div>
                      <span className="font-medium text-white">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Sahibzada Ajit Singh Nagar, Punjab
                      </div>
                      <span className="font-medium text-white">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> , Eastern Visayas
                      </div>
                      <span className="font-medium text-white">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leads & Conversions */}
            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 shadow-sm border border-white/10 min-h-[300px] flex flex-col">
              <h3 className="text-[15px] font-semibold text-white mb-1">Leads & Conversions</h3>
              <p className="text-[13px] text-slate-500">Comparing website visitors to leads captured</p>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-sm text-slate-500">No data available</span>
              </div>
            </div>

            {/* Top Pages & Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 shadow-sm border border-white/10">
                 <h3 className="text-[15px] font-semibold text-white mb-6">Top Pages</h3>
                 <div className="space-y-0 divide-y divide-[#f1f5f9]">
                   <div className="flex justify-between items-center py-4">
                     <div className="flex flex-col">
                       <span className="text-[14px] text-slate-300">Home Renovation - Pink Gorilla Agency</span>
                       <span className="text-xs text-slate-500 mt-1">97 views</span>
                     </div>
                     <span className="text-sm font-medium text-slate-300">97</span>
                   </div>
                   <div className="flex justify-between items-center py-4">
                     <div className="flex flex-col">
                       <span className="text-[14px] text-slate-300">Mortgage Loan - Pink Gorilla Agency</span>
                       <span className="text-xs text-slate-500 mt-1">87 views</span>
                     </div>
                     <span className="text-sm font-medium text-slate-300">87</span>
                   </div>
                   <div className="flex justify-between items-center py-4">
                     <div className="flex flex-col">
                       <span className="text-[14px] text-slate-300">Pink Gorilla Agency</span>
                       <span className="text-xs text-slate-500 mt-1">67 views</span>
                     </div>
                     <span className="text-sm font-medium text-slate-300">67</span>
                   </div>
                   <div className="flex justify-between items-center py-4">
                     <div className="flex flex-col">
                       <span className="text-[14px] text-slate-300">Doctor & Clinic - Pink Gorilla Agency</span>
                       <span className="text-xs text-slate-500 mt-1">51 views</span>
                     </div>
                     <span className="text-sm font-medium text-slate-300">51</span>
                   </div>
                   <div className="flex justify-between items-center py-4">
                     <div className="flex flex-col">
                       <span className="text-[14px] text-slate-300">Pool Cleaning - Pink Gorilla Agency</span>
                       <span className="text-xs text-slate-500 mt-1">38 views</span>
                     </div>
                     <span className="text-sm font-medium text-slate-300">38</span>
                   </div>
                 </div>
              </div>
              
              <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 shadow-sm border border-white/10">
                 <h3 className="text-[15px] font-semibold text-white mb-6">Engagement Metrics</h3>
                 <div className="space-y-4">
                   <div className="border border-white/10 rounded-lg p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                       <Clock className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-xs text-slate-400">Average Time on Site</span>
                       <span className="text-[15px] font-medium text-white">15m 50s</span>
                     </div>
                   </div>
                   <div className="border border-white/10 rounded-lg p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-emerald-400 text-white flex items-center justify-center shrink-0">
                       <Target className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-xs text-slate-400">Pages per Session</span>
                       <span className="text-[15px] font-medium text-white">5.1</span>
                     </div>
                   </div>
                   <div className="border border-white/10 rounded-lg p-4 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-orange-400 text-white flex items-center justify-center shrink-0">
                       <TrendingUp className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-xs text-slate-400">Bounce Rate</span>
                       <span className="text-[15px] font-medium text-white">0.5%</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Business Summary */}
            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6 mb-6 shadow-sm border border-white/10">
               <h3 className="text-[15px] font-semibold text-slate-400 mb-1">Business Summary (This Month)</h3>
               <p className="text-[13px] text-slate-500 mb-6">Performance metrics from your CRM</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-emerald-50 rounded-lg p-5">
                   <p className="text-[13px] font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]merald-500 mb-2">Total Jobs Completed</p>
                   <h4 className="text-[26px] font-medium text-white mb-2">87</h4>
                   <p className="text-sm font-semibold text-white">+12 from last month</p>
                 </div>
                 
                 <div className="bg-blue-50 rounded-lg p-5">
                   <p className="text-[13px] font-medium text-blue-500 mb-2">Total Revenue</p>
                   <h4 className="text-[26px] font-medium text-white mb-2">$124,350</h4>
                   <p className="text-sm font-semibold text-white">+18% from last month</p>
                 </div>
                 
                 <div className="bg-purple-50 rounded-lg p-5">
                   <p className="text-[13px] font-medium text-purple-500 mb-2">Average Job Value</p>
                   <h4 className="text-[26px] font-medium text-white mb-2">$1,429</h4>
                   <p className="text-sm font-semibold text-white">Industry standard: $1,200</p>
                 </div>
                 
                 <div className="bg-orange-50 rounded-lg p-5">
                   <p className="text-[13px] font-medium text-orange-500 mb-2">Repeat Customers</p>
                   <h4 className="text-[26px] font-medium text-white mb-2">68%</h4>
                   <p className="text-sm font-semibold text-white">Excellent retention rate</p>
                 </div>
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
