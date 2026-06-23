import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { Edit2, FileText, User, Calendar, Flag, Users, RefreshCcw, Plus, Search, Zap, CheckSquare, List } from "lucide-react";

export default function ProjectDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/projects" />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Project Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              
              <h1 className="text-3xl font-bold text-white tracking-tight">Project Details</h1>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 font-bold transition-all">
                <Edit2 className="w-4 h-4" /> Edit Project
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Main Info Card */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-indigo-500 border-t-4 shadow-lg overflow-hidden">
                  <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Overview
                    </h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-[13px] font-medium">Project Title</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white pl-6">Twilio ticket + domain verify</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <User className="w-4 h-4" />
                        <span className="text-[13px] font-medium">Client</span>
                      </div>
                      <div className="flex items-center gap-2 pl-6 mt-1">
                         <div className="w-5 h-5 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold">PG</div>
                         <span className="text-[14px] font-semibold text-white">Pink Gorilla...</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[13px] font-medium">Start Date</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white pl-6">10-03-2026</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[13px] font-medium">End Date</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white pl-6">---</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Flag className="w-4 h-4" />
                        <span className="text-[13px] font-medium">Priority</span>
                      </div>
                      <div className="pl-6 mt-1">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[12px] font-bold text-slate-400 bg-slate-700/50 border border-slate-600">
                          Low
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-[13px] font-medium">Assignee</span>
                      </div>
                      <div className="flex flex-wrap gap-3 pl-6 mt-1">
                        <div className="flex items-center gap-1.5">
                           <div className="w-6 h-6 rounded-full bg-pink-500 flex-shrink-0 border-2 border-white shadow-sm"></div>
                           <span className="text-[13px] font-semibold text-white">Vikas Shar...</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <div className="w-6 h-6 rounded-full bg-slate-500 flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="avatar" />
                           </div>
                           <span className="text-[13px] font-semibold text-white">Chayan Alavi</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <RefreshCcw className="w-4 h-4 text-orange-400" />
                        <span className="text-[13px] font-bold uppercase tracking-wider">Status</span>
                      </div>
                      <div className="pl-6 mt-1">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[12px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20">
                          Pending Approval
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-teal-500 border-t-4 shadow-lg overflow-hidden">
                   <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
                     <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                       <Zap className="w-4 h-4 text-teal-400" /> Information
                     </h3>
                   </div>
                   <div className="p-5 space-y-3 text-[13px]">
                     <div className="flex gap-1"><span className="font-semibold text-white">Created By:</span> <span className="text-slate-400">Vikas Sharma</span></div>
                     <div className="flex gap-1"><span className="font-semibold text-white">Created At:</span> <span className="text-slate-400">09-03-2026</span></div>
                     <div className="flex gap-1"><span className="font-semibold text-white">Last Assigned Members:</span> <span className="text-slate-400">Chayan</span></div>
                     <div className="flex gap-1"><span className="font-semibold text-white">Last Assigned by:</span> <span className="text-slate-400">Vikas</span></div>
                     <div className="flex gap-1"><span className="font-semibold text-white">Last Assigned at:</span> <span className="text-slate-400">09-03-2026</span></div>
                   </div>
                </div>

                {/* Description */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-sky-500 border-t-4 shadow-lg overflow-hidden">
                   <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                     <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                       <FileText className="w-4 h-4 text-sky-400" /> Description
                     </h3>
                   </div>
                   <div className="p-5 text-sm text-slate-300">
                     <p>No description provided for this project.</p>
                   </div>
                </div>

                {/* Attachments */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-pink-500 border-t-4 shadow-lg overflow-hidden">
                   <div className="p-4 bg-slate-800/50 flex justify-between items-center">
                     <h3 className="text-[14px] font-bold text-white">Attachments</h3>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-pink-500 transition-colors">
                       <Plus className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Tasks */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-purple-500 border-t-4 shadow-lg flex flex-col overflow-hidden min-h-[300px]">
                   <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
              
                     <h2 className="text-[16px] font-bold text-white flex items-center gap-2">
                       <CheckSquare className="w-5 h-5 text-purple-400" /> Tasks
                     </h2>
                     <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
                          <CheckSquare className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
                          <List className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg hover:bg-indigo-400 transition-colors">
                          <Zap className="w-4 h-4" fill="currentColor" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/20 transition-colors ml-2">
                          <Plus className="w-4 h-4" /> Add Tasks
                        </button>
                     </div>
                   </div>

                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-16 bg-slate-900/20">
                      <div className="relative mb-6">
                         <div className="absolute -top-2 -left-2 w-2 h-2 rounded-full bg-green-200 opacity-50"></div>
                         <div className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-blue-200 opacity-50"></div>
                         <div className="absolute bottom-4 -left-4 w-1 h-1 rounded-full bg-amber-200 opacity-50"></div>
                         <div className="w-20 h-20 rounded-full border border-slate-600 flex items-center justify-center bg-slate-800 shadow-xl relative z-10">
                           <Search className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
                         </div>
                         {/* decorative sparkles around search */}
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-purple-500 rounded-full"></div>
                         <div className="absolute top-2 -right-3 w-2 h-[2px] bg-purple-500 rounded-full rotate-45"></div>
                         <div className="absolute top-2 -left-3 w-2 h-[2px] bg-purple-500 rounded-full -rotate-45"></div>
                      </div>
                      <h3 className="text-[17px] font-bold text-white mb-1.5">No tasks found</h3>
                      <p className="text-[14px] text-slate-500">Create a task to get started</p>
                   </div>
                </div>

                {/* Notes */}
                <div className="bg-slate-800 rounded-xl border border-slate-600 border-t-amber-500 border-t-4 shadow-lg overflow-hidden">
                   <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
              
                     <h2 className="text-[16px] font-bold text-white flex items-center gap-2">
                       <FileText className="w-5 h-5 text-amber-400" /> Notes
                     </h2>
                     <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-amber-500/20 transition-colors">
                       <Plus className="w-4 h-4" /> Add Note
                     </button>
                   </div>

                   <div className="p-6 bg-slate-900/20">
                     <div className="bg-[#fff9e6] rounded-lg p-5 border border-[#fef0c7] shadow-sm relative">
                        {/* Note fold effect */}
                        <div className="absolute top-0 right-0 border-t-[16px] border-r-[16px] border-t-transparent border-r-[#fcdaa3] border-b-[16px] border-l-[16px] border-b-[#fce3b8] border-l-transparent rounded-bl shadow-sm"></div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-md border-2 border-white/50 z-10"></div>

                        <h4 className="text-[15px] font-bold text-slate-800 mb-2 mt-2 font-['Architects_Daughter'] tracking-wide">Update - Twilio "Ticket + Domain Verified"</h4>
                        <p className="text-[14px] text-slate-700 leading-relaxed mb-6 font-['Architects_Daughter'] tracking-wide">
                          I've verified both added domains in Twilio. Domains: pinkgorilla.agency & pinkgorillasoftware.com! I've sent a reply to the Twilio support team regarding ticket #25425379.
                        </p>
                        
                        <div className="flex items-center text-[12px] text-slate-500 font-bold border-t border-amber-200/50 pt-3">
                          <div className="w-6 h-6 rounded-full bg-pink-500 mr-2 flex-shrink-0 border-2 border-white shadow-sm"></div>
                          <span className="text-slate-700 mr-2">Vikas</span>
                          <span className="mr-2">• 09 Mar, 2026</span>
                          <span>• 11:21 pm</span>
                        </div>
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