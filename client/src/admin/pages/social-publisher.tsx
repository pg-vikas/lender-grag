import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { useAppStore } from "@/admin/lib/store";
import { 
  Search, 
  Bell, 
  Menu, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  MapPin, 
  Smile, 
  Calendar, 
  ChevronDown,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  BarChart,
  LayoutGrid,
  X,
  Clock
} from "lucide-react";

import CalendarTab from "@/admin/components/social-publisher/CalendarTab";

export default function SocialPublisher() {
  const [, setLocation] = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [openMenus, setOpenMenus] = useState<string>("social-media");
  const [activeTab, setActiveTab] = useState("calendar");
  const [postContent, setPostContent] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(['twitter']);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? "" : menu);
  };

  const toggleAccount = (account: string) => {
    if (selectedAccounts.includes(account)) {
      setSelectedAccounts(selectedAccounts.filter(a => a !== account));
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/social/publisher" />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Social Publisher" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner flex space-x-1">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "dashboard" 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => setActiveTab("accounts")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "accounts" 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex -space-x-2 mr-1">
                    <div className="w-5 h-5 rounded-full bg-[#1DA1F2] border border-slate-900 flex items-center justify-center"><Twitter className="w-2.5 h-2.5 text-white" /></div>
                    <div className="w-5 h-5 rounded-full bg-[#1877F2] border border-slate-900 flex items-center justify-center"><Facebook className="w-2.5 h-2.5 text-white" /></div>
                  </div>
                  <span>Accounts</span>
                </button>
                <button 
                  onClick={() => setActiveTab("composer")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "composer" 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Composer</span>
                </button>
                <button 
                  onClick={() => setActiveTab("calendar")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "calendar" 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
                <button 
                  onClick={() => setActiveTab("reports")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "reports" 
                      ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Reports</span>
                </button>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-slate-800 rounded-xl border border-slate-700 border-t-purple-500 border-t-4 p-6 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Draft</h3>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 border-t-blue-500 border-t-4 p-6 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Scheduled</h3>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 border-t-amber-500 border-t-4 p-6 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Processing</h3>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 border-t-emerald-500 border-t-4 p-6 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Published</h3>
                  <p className="text-3xl font-bold text-white">9</p>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 border-t-rose-500 border-t-4 p-6 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-medium mb-2">Failed</h3>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Connect Accounts */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-slate-700 bg-slate-800/80">
                    <h3 className="text-lg font-bold text-white">Connect Accounts</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-900/50">
                          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Name</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Connected At</th>
                          <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {[
                          { platform: 'FACEBOOK', name: 'Chayan Alavi', status: 'Connected', date: '2026-03-31 22:24:41', action: 'Disconnect' },
                          { platform: 'INSTAGRAM', name: 'the.pinkgorilla', status: 'Connected', date: '2026-03-31 22:31:07', action: 'Disconnect' },
                          { platform: 'THREADS', name: 'THREADS Account', status: 'Connected', date: '2026-04-06 03:36:14', action: 'Disconnect' },
                          { platform: 'TIKTOK', name: 'TIKTOK Account', status: 'Disconnected', date: '2026-03-30 05:53:09', action: 'Connect' },
                          { platform: 'YOUTUBE', name: 'Pink Gorilla', status: 'Connected', date: '2026-04-06 06:00:53', action: 'Disconnect' },
                          { platform: 'X', name: '---', status: 'Disconnected', date: '---', action: 'Connect' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-700/30 transition-colors group">
                            <td className="py-4 px-6 text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors">{row.platform}</td>
                            <td className="py-4 px-6 text-[13px] text-slate-400">{row.name}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                                row.status === 'Connected' 
                                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' 
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-[13px] text-slate-400">{row.date}</td>
                            <td className="py-4 px-6 text-right">
                              <button className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                                row.action === 'Connect'
                                  ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                                  : 'bg-transparent border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50'
                              }`}>
                                {row.action}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Platform Credentials */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Platform Credentials</h3>
                  
                  <div className="flex space-x-6 border-b border-slate-700 mb-6">
                    {['FACEBOOK', 'INSTAGRAM', 'THREADS', 'TIKTOK', 'YOUTUBE', 'X'].map((plat) => (
                      <button 
                        key={plat}
                        className={`pb-3 text-xs tracking-wider font-bold transition-colors relative ${
                          plat === 'FACEBOOK' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {plat}
                        {plat === 'FACEBOOK' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-t-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">FACEBOOK</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Client ID</label>
                        <input 
                          type="text" 
                          defaultValue="1269618474690205"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-cyan-500 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Client Secret</label>
                        <input 
                          type="text" 
                          placeholder="Saved (leave blank to keep)"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-cyan-500 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Status</label>
                        <div className="relative">
                          <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-cyan-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer">
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">
                        Save Credentials
                      </button>
                      <button className="px-6 py-2.5 bg-transparent border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 rounded-xl text-sm font-bold transition-all">
                        Clear Saved
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'composer' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Composer Section */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Select Accounts */}
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-2 text-xs font-bold">1</span>
                      Select Accounts
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => toggleAccount('twitter')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                          selectedAccounts.includes('twitter') 
                            ? 'bg-[#1DA1F2]/10 border-[#1DA1F2] text-[#1DA1F2] shadow-[0_0_10px_rgba(29,161,242,0.2)]' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="font-medium text-sm">Greg Gorilla Hub</span>
                      </button>
                      <button 
                        onClick={() => toggleAccount('facebook')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                          selectedAccounts.includes('facebook') 
                            ? 'bg-[#1877F2]/10 border-[#1877F2] text-[#1877F2] shadow-[0_0_10px_rgba(24,119,242,0.2)]' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="font-medium text-sm">Gorilla Agency</span>
                      </button>
                      <button 
                        onClick={() => toggleAccount('instagram')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                          selectedAccounts.includes('instagram') 
                            ? 'bg-[#E1306C]/10 border-[#E1306C] text-[#E1306C] shadow-[0_0_10px_rgba(225,48,108,0.2)]' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="font-medium text-sm">@gorillahub</span>
                      </button>
                      <button 
                        onClick={() => toggleAccount('linkedin')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                          selectedAccounts.includes('linkedin') 
                            ? 'bg-[#0A66C2]/10 border-[#0A66C2] text-[#0A66C2] shadow-[0_0_10px_rgba(10,102,194,0.2)]' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="font-medium text-sm">Greg Gorilla Hub Inc</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-600 bg-slate-900/50 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-all">
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm">Connect Account</span>
                      </button>
                    </div>
                  </div>

                  {/* Create Post */}
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-2 text-xs font-bold">2</span>
                      Create Post
                    </h3>
                    
                    <div className="bg-slate-950 border border-slate-600 rounded-xl overflow-hidden shadow-inner focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                      <textarea 
                        className="w-full bg-transparent border-none p-4 text-white placeholder:text-slate-500 resize-none focus:ring-0 outline-none"
                        rows={6}
                        placeholder="What do you want to share with your audience?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      ></textarea>
                      
                      <div className="flex items-center justify-between p-3 border-t border-slate-800 bg-slate-900/50">
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Add Media">
                            <ImageIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Add Video">
                            <Video className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Add Location">
                            <MapPin className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors" title="Add Emoji">
                            <Smile className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {postContent.length}/280
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Publish */}
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 relative">
                        <button 
                          onClick={() => setIsScheduling(!isScheduling)}
                          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all border ${
                            scheduleDate && scheduleTime 
                              ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' 
                              : isScheduling 
                                ? 'bg-slate-700 border-slate-500 text-white' 
                                : 'bg-slate-900 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-sky-400" />
                          <span className="text-sm font-semibold">
                            {scheduleDate && scheduleTime ? `${scheduleDate} at ${scheduleTime}` : 'Schedule Post'}
                          </span>
                        </button>
                        
                        {scheduleDate && scheduleTime && (
                           <button 
                             onClick={() => { setScheduleDate(""); setScheduleTime(""); }}
                             className="text-slate-500 hover:text-rose-400 transition-colors"
                             title="Clear Schedule"
                           >
                             <X className="w-4 h-4" />
                           </button>
                        )}
                        
                        {!scheduleDate && <span className="text-sm text-slate-500">or save as draft</span>}

                        {/* Scheduling Popover */}
                        {isScheduling && (
                          <div className="absolute bottom-full left-0 mb-4 w-72 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 z-10 animate-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-bold flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-sky-400" /> 
                                Select Date & Time
                              </h4>
                              <button onClick={() => setIsScheduling(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                                <input 
                                  type="date" 
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 [color-scheme:dark]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Time</label>
                                <input 
                                  type="time" 
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 [color-scheme:dark]"
                                />
                              </div>
                              <button 
                                onClick={() => setIsScheduling(false)}
                                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-bold transition-colors mt-2"
                              >
                                Confirm Schedule
                              </button>
                            </div>
                            
                            {/* Decorative pointer arrow */}
                            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-slate-800 border-b border-r border-slate-600 rotate-45"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-all">
                          Save Draft
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">
                          <Send className="w-4 h-4" />
                          <span>{scheduleDate && scheduleTime ? 'Schedule' : 'Publish Now'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg sticky top-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Post Preview</h3>
                      <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-lg p-1">
                        <button className="px-3 py-1 rounded bg-slate-800 text-white text-xs font-medium shadow-sm">Desktop</button>
                        <button className="px-3 py-1 rounded text-slate-400 hover:text-white text-xs font-medium">Mobile</button>
                      </div>
                    </div>

                    {selectedAccounts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Select an account to see preview</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedAccounts.includes('twitter') && (
                          <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                <span className="text-white font-bold text-sm">GH</span>
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm leading-tight">Greg Gorilla Hub</p>
                                <p className="text-slate-500 text-xs">@gorillahub</p>
                              </div>
                              <Twitter className="w-4 h-4 text-[#1DA1F2] ml-auto" />
                            </div>
                            <p className="text-slate-300 text-sm whitespace-pre-wrap">
                              {postContent || <span className="text-slate-600 italic">Your post content will appear here...</span>}
                            </p>
                          </div>
                        )}
                        
                        {selectedAccounts.includes('linkedin') && (
                          <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                <span className="text-white font-bold text-sm">GH</span>
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm leading-tight">Greg Gorilla Hub Inc</p>
                                <p className="text-slate-500 text-xs">Software Development</p>
                              </div>
                              <Linkedin className="w-4 h-4 text-[#0A66C2] ml-auto" />
                            </div>
                            <p className="text-slate-300 text-sm whitespace-pre-wrap">
                              {postContent || <span className="text-slate-600 italic">Your post content will appear here...</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'calendar' && (
              <CalendarTab onNewPost={() => setActiveTab('composer')} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
