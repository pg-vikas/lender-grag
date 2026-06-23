import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { ArrowLeft } from "lucide-react";

export default function TicketCreatePage() {
  const [openMenus, setOpenMenus] = useState<string>('support');
  const [location, setLocation] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Add New Ticket" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setLocation('/admin/tickets')}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Tickets
            </button>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Create Support Ticket</h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject*</label>
                  <input 
                    type="text" 
                    placeholder="Enter ticket subject"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Client*</label>
                    <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option value="">Select a client</option>
                      <option value="pink-gorilla">Pink Gorilla Agency</option>
                      <option value="acme-corp">Acme Corp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Assigned To</label>
                    <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option value="">Select assignee</option>
                      <option value="milhan">Milhan Farooque</option>
                      <option value="vikas">Vikas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department*</label>
                    <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority*</label>
                    <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                      <option value="low">Low</option>
                      <option value="normal" selected>Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status*</label>
                  <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="answered">Answered</option>
                    <option value="on-hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message*</label>
                  <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                    <div className="bg-slate-800/50 border-b border-slate-600 bg-slate-950 p-2 flex gap-2">
                      <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">B</button>
                      <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">I</button>
                      <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">U</button>
                      <div className="w-px bg-slate-700 mx-1"></div>
                      <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Link</button>
                    </div>
                    <textarea 
                      rows={6}
                      className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 resize-none"
                      placeholder="Enter ticket description..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <p className="text-xs text-slate-500">* Required</p>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setLocation('/admin/tickets')}
                      className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLocation('/admin/tickets')}
                      className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all font-medium text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
