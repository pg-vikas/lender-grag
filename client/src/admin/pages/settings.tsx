import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Building2, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Shield, 
  Bell, 
  Globe, 
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Save
} from "lucide-react";
import { Header, Sidebar } from "./clients";

export default function SettingsPage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('settings');
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-slate-500/5 blur-[120px] pointer-events-none"></div>
        
        <Header title="Settings & Billing" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Settings & Configurations
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Manage your company profile, API usage, and billing preferences.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {showSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar Navigation */}
              <div className="w-full lg:w-64 shrink-0">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden sticky top-6">
                  <div className="p-3 space-y-1">
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'general' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Company Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('api-usage')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'api-usage' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4" />
                        API & Usage
                      </div>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'notifications' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveTab('team')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'team' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Team Members
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'security' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </button>
                    <div className="my-2 border-t border-slate-800"></div>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all ${
                        activeTab === 'billing' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing & Plans
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 min-w-0 pb-20">
                
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white">Company Profile</h2>
                        <p className="text-sm text-slate-400 mt-1">Update your company details and basic information.</p>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="flex items-start gap-6">
                          <div className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-slate-700 border-dashed flex flex-col items-center justify-center shrink-0 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
                            <Building2 className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Logo</span>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Company Name</label>
                                <input type="text" defaultValue="Stone Bridge Mortgage" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">NMLS ID</label>
                                <input type="text" defaultValue="1938081" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-300">Company Website</label>
                              <input type="text" defaultValue="https://www.LenderGreg.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Primary Contact Email</label>
                            <input type="email" defaultValue="Greg@StonebridgeMortgage.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Primary Phone</label>
                            <input type="text" defaultValue="619-550-9885" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-300">Office Address</label>
                            <input type="text" defaultValue="514 Via De La Valle #202, Solana Beach, CA 92075" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Usage & Tracking */}
                {activeTab === 'api-usage' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-bold text-white">API Usage & Tracking</h2>
                          <p className="text-sm text-slate-400 mt-1">Monitor your monthly limits for integrated services like SMS and Email.</p>
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Approaching limits
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-8">
                        
                        {/* SMS Usage */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white">SMS Messages (Twilio)</h3>
                                <p className="text-xs text-slate-400">Resets on May 1, 2026</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">4,285 <span className="text-sm text-slate-500 font-medium">/ 5,000</span></div>
                              <p className="text-xs text-amber-400 font-medium">85% of monthly limit</p>
                            </div>
                          </div>
                          
                          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 w-[85%] rounded-full relative">
                              <div className="absolute inset-0 bg-white/20 shimmer"></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Estimated overage cost: $0.0075 per extra message</span>
                            <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Upgrade Limit</button>
                          </div>
                        </div>

                        <div className="h-px bg-slate-800 w-full"></div>

                        {/* Email Usage */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Mail className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white">Marketing Emails (SendGrid)</h3>
                                <p className="text-xs text-slate-400">Resets on May 1, 2026</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">12,450 <span className="text-sm text-slate-500 font-medium">/ 50,000</span></div>
                              <p className="text-xs text-emerald-400 font-medium">24% of monthly limit</p>
                            </div>
                          </div>
                          
                          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[24%] rounded-full"></div>
                          </div>
                        </div>

                        <div className="h-px bg-slate-800 w-full"></div>

                        {/* Document Signatures */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Key className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white">E-Signatures (DocuSign API)</h3>
                                <p className="text-xs text-slate-400">Resets on May 1, 2026</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">42 <span className="text-sm text-slate-500 font-medium">/ 100</span></div>
                              <p className="text-xs text-emerald-400 font-medium">42% of monthly limit</p>
                            </div>
                          </div>
                          
                          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[42%] rounded-full"></div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
                        <p className="text-sm text-slate-400 mt-1">Control how and when you receive alerts from the platform.</p>
                      </div>
                      
                      <div className="p-0">
                        {/* New Lead Alert */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white">New Lead Assigned</h3>
                            <p className="text-xs text-slate-400 mt-1">When a new borrower lead is assigned to you.</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">SMS</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Document Uploaded */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white">Document Uploaded</h3>
                            <p className="text-xs text-slate-400 mt-1">When a borrower uploads a requested condition document.</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">SMS</span>
                            </label>
                          </div>
                        </div>

                        {/* Pre-Approval Requested */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white">Pre-Approval Letter Requested</h3>
                            <p className="text-xs text-slate-400 mt-1">When a borrower or agent requests a new pre-approval letter.</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">SMS</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Weekly Summary */}
                        <div className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white">Weekly Pipeline Summary</h3>
                            <p className="text-xs text-slate-400 mt-1">Receive a weekly email summarizing your active pipeline.</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 relative"></div>
                              <span className="text-xs text-slate-300 font-medium">Email</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Billing Placeholder */}
                {activeTab === 'billing' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-bold text-white">Billing & Subscription</h2>
                          <p className="text-sm text-slate-400 mt-1">Manage your plan and payment methods.</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold">
                          Pro Plan
                        </span>
                      </div>
                      
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <CreditCard className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Next invoice: May 1, 2026</h3>
                        <p className="text-slate-400 text-sm max-w-md">Your subscription is active. Invoices will be sent to Greg@StonebridgeMortgage.com.</p>
                        
                        <div className="mt-8 flex gap-4">
                          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                            Update Payment Method
                          </button>
                          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                            View Invoices
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Placeholder */}
                {activeTab === 'team' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-10 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Team Management</h3>
                      <p className="text-slate-400 text-sm max-w-md mb-6">Manage your loan officer assistants, processors, and other team members here.</p>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
                        Invite Team Member
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Placeholder */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-white">Security Settings</h2>
                        <p className="text-sm text-slate-400 mt-1">Manage your password and secure your account.</p>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
                              <p className="text-xs text-slate-400 mt-1">Protect your account with an extra layer of security.</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-bold">Enabled</span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-white mb-4">Change Password</h3>
                          <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-300">Current Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-300">New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                            </div>
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
