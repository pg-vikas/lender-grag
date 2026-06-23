import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { Edit2, Settings, Trash2, X } from "lucide-react";

export default function TicketDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('support');
  const [location, setLocation] = useLocation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/tickets" />
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Ticket Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="flex justify-between items-center mb-6">
              
              <h1 className="text-[22px] font-bold text-white">Testing the Support features</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-9 h-9 flex items-center justify-center bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-colors shadow-sm">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column - Ticket Details */}
              <div className="w-full lg:w-[320px] shrink-0">
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl  border border-white/10">
                  <div className="p-5 border-b border-white/10">
                    <h2 className="text-[15px] font-bold text-white">Ticket Details</h2>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-1">Department</h3>
                      <p className="text-[13px] text-slate-400">Support</p>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-1">Created</h3>
                      <p className="text-[13px] text-slate-400">31-10-2025 At 01:03</p>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-1">Client</h3>
                      <p 
                        className="text-[13px] text-indigo-400 font-medium cursor-pointer hover:underline"
                        onClick={() => setLocation('/admin/clients/1')}
                      >
                        Pink Gorilla Agency
                      </p>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-1">Activity</h3>
                      <p className="text-[13px] text-slate-400">4 months ago</p>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-1">Tags</h3>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-2">Priority</h3>
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-semibold border border-sky-200 bg-sky-50/50 text-[#ffffff]">
                        Normal
                      </span>
                    </div>
                    
                    <div className="h-[1px] w-full bg-slate-800"></div>
                    
                    <div>
                      <h3 className="text-[13px] font-semibold text-white mb-2">Status</h3>
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-semibold text-green-600 border border-green-300 bg-transparent">
                        Answered
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
                      >
                        Edit Support Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Conversation */}
              <div className="flex-1 min-w-0 space-y-4">
                
                {/* Message 1 */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl  border border-white/10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Milhan" alt="Milhan" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-col mb-4">
                        <span className="text-[14px] font-semibold text-white">Milhan Farooque</span>
                        <span className="text-[12px] text-slate-500">4 months ago</span>
                      </div>
                      <p className="text-[14px] text-slate-300">Nice!</p>
                    </div>
                  </div>
                </div>

                {/* Note 1 */}
                <div className="bg-[#fff9e6] rounded-xl  border border-[#fef0c7] p-6 relative">
                  <div className="absolute top-6 right-6">
                    <span className="px-2 py-1 bg-[#fef0c7] text-[#d97706] text-[10px] font-bold rounded">ticket note</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Milhan" alt="Milhan" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-col mb-4">
                        <span className="text-[14px] font-semibold text-[#000000]">Milhan Farooque</span>
                        <span className="text-[12px] text-slate-500">31-10-2025 - (4 months ago)</span>
                      </div>
                      <p className="text-[14px] text-[#8094a8]">adding a note</p>
                    </div>
                  </div>
                </div>

                {/* Note 2 */}
                <div className="bg-[#fff9e6] rounded-xl  border border-[#fef0c7] p-6 relative">
                  <div className="absolute top-6 right-6">
                    <span className="px-2 py-1 bg-[#fef0c7] text-[#d97706] text-[10px] font-bold rounded">ticket note</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Milhan" alt="Milhan" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-col mb-4">
                        <span className="text-[14px] font-semibold text-[#000000]">Milhan Farooque</span>
                        <span className="text-[12px] text-slate-500">31-10-2025 - (4 months ago)</span>
                      </div>
                      <p className="text-[14px] text-[#8094a8]">the second note.... it's cool</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3 pt-4">
                  <button 
                    onClick={() => setIsAddNoteModalOpen(true)}
                    className="px-5 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 hover:backdrop-blur-xl/50 text-slate-300 rounded-lg text-[14px] font-semibold transition-colors shadow-sm"
                  >
                    Add A Note
                  </button>
                  <button 
                    onClick={() => setIsReplyModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-[14px] font-semibold transition-colors shadow-sm"
                  >
                    Reply Support Ticket
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl w-full max-w-sm border border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Are you sure?</h2>
              <p className="text-slate-400 text-sm">
                Do you really want to delete this ticket? This process cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[#1e293b] hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 bg-slate-950 w-28"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setLocation('/admin/tickets');
                }}
                className="px-4 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Support Ticket Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] rounded-xl w-full max-w-2xl border border-slate-800 shadow-2xl flex flex-col my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Edit Support Ticket</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Delete Ticket"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject*</label>
                <input 
                  type="text" 
                  defaultValue="Test"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message*</label>
                <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                  <div className="bg-slate-800/50 border-b border-slate-600 bg-slate-950 p-2 flex gap-1 flex-wrap">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-bold">B</button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded italic">I</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Link</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Img</button>
                  </div>
                  <textarea 
                    rows={8}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 resize-none"
                    defaultValue="This is test purpose"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Sales</option>
                  <option selected>Support</option>
                  <option>Billing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Open</option>
                  <option>In Progress</option>
                  <option selected>Answered</option>
                  <option>On Hold</option>
                  <option>Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority*</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                  <option>Low</option>
                  <option selected>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">* Required</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 border border-slate-600 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] rounded-xl w-full max-w-2xl border border-slate-800 shadow-2xl flex flex-col my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Add Note</h2>
              <button 
                onClick={() => setIsAddNoteModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Note*</label>
                <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                  <div className="bg-slate-800/50 border-b border-slate-600 bg-slate-950 p-2 flex gap-1 flex-wrap">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-bold">B</button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded italic">I</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Link</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Img</button>
                  </div>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 resize-none"
                    placeholder="Type your note here..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">* Required</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-6 py-2 border border-slate-600 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-6 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reply Support Ticket Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] rounded-xl w-full max-w-2xl border border-slate-800 shadow-2xl flex flex-col my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Reply Support Ticket</h2>
              <button 
                onClick={() => setIsReplyModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message*</label>
                <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                  <div className="bg-slate-800/50 border-b border-slate-600 bg-slate-950 p-2 flex gap-1 flex-wrap">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-bold">B</button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded italic">I</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Link</button>
                    <div className="w-px bg-slate-700 mx-1"></div>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">Img</button>
                  </div>
                  <textarea 
                    rows={8}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 resize-none"
                    placeholder="Type your reply here..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">* Required</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-6 py-2 border border-slate-600 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-6 py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white rounded-lg transition-all font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}