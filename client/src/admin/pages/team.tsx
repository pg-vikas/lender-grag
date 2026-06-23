import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import { Users, Plus, Mail, Phone, MoreHorizontal, Briefcase, Activity, Settings, UserPlus } from "lucide-react";

const mockTeam = [
  { id: 1, name: "Greg Wynn", role: "Loan Officer", email: "greg@stonebridgemortgage.com", phone: "619-550-9885", activeFiles: 14, status: "Active" },
  { id: 2, name: "Sarah Connor", role: "Loan Processor", email: "sarah@stonebridgemortgage.com", phone: "619-550-9886", activeFiles: 22, status: "Active" },
  { id: 3, name: "Marcus Reed", role: "LO Assistant", email: "marcus@stonebridgemortgage.com", phone: "619-550-9887", activeFiles: 14, status: "Active" },
  { id: 4, name: "Elena Rostova", role: "Underwriter", email: "elena@stonebridgemortgage.com", phone: "619-550-9888", activeFiles: 8, status: "Away" },
];

export default function TeamPage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('team');

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <Header title="Team Management" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  My Team
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Manage loan officers, processors, and assistants.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <UserPlus className="w-4 h-4" /> Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockTeam.map(member => (
                <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all shadow-sm">
                  <div className="p-5 flex flex-col items-center text-center relative border-b border-slate-800">
                    <button className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-white rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    <div className="relative mb-3">
                      <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xl font-bold text-white uppercase group-hover:border-indigo-500/50 transition-colors">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg">{member.name}</h3>
                    <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mt-0.5">{member.role}</p>
                  </div>
                  
                  <div className="p-4 space-y-3 bg-slate-900/50">
                    <div className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                      <span><strong className="text-white">{member.activeFiles}</strong> Active Files</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between gap-2">
                    <button className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors">Message</button>
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Permissions">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Placeholder */}
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-900 hover:border-indigo-500/50 transition-all min-h-[280px]">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                  <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">Add Team Member</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[150px]">Invite someone to collaborate on your files.</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
