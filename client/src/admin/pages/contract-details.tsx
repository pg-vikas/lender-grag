import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { ArrowLeft, Edit3, Trash2, Mail, Printer, Copy, Save, X, AlertCircle } from "lucide-react";
import { useAppStore } from "@/admin/lib/store";

export default function ContractDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('contracts');
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const { contracts, updateContract, deleteContract, addContract } = useAppStore();
  const contract = contracts.find(c => c.id === id);

  // If the path ends with /edit, initialize in edit mode
  const [isEditing, setIsEditing] = useState(location.endsWith('/edit'));
  
  // Also update edit mode if location changes
  useEffect(() => {
    if (location.endsWith('/edit')) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [location]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  
  const [editedContract, setEditedContract] = useState({
    description: "",
    value: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (contract) {
      setEditedContract({
        description: contract.description || "",
        value: contract.value || "",
        startDate: contract.startDate || contract.date,
        endDate: contract.endDate || ""
      });
    }
  }, [contract]);

  if (!contract) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0f172a] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contract not found</h2>
          <button 
            onClick={() => setLocation('/admin/contracts')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl"
          >
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const handleSave = () => {
    updateContract(contract.id, editedContract);
    setIsEditing(false);
    // If we were on the /edit route, redirect back to the view route
    if (location.endsWith('/edit')) {
      setLocation(`/admin/contracts/${contract.id}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // If we were on the /edit route, redirect back to the view route
    if (location.endsWith('/edit')) {
      setLocation(`/admin/contracts/${contract.id}`);
    }
  };

  const handleDelete = () => {
    deleteContract(contract.id);
    setIsDeleteModalOpen(false);
    setLocation('/admin/contracts');
  };

  const handleClone = () => {
    const newId = `CO-000${Math.floor(Math.random() * 100) + 50}`;
    const clonedContract = {
      ...contract,
      id: newId,
      title: `${contract.title} (Copy)`,
      status: "Draft",
      clientStatus: "Pending",
      providerStatus: "Pending"
    };
    addContract(clonedContract);
    setLocation(`/admin/contracts/${newId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending mail
    setIsMailModalOpen(false);
    setMailTo("");
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/contracts" />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Contract Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between mb-6">
              <Link href="/admin/contracts" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Contracts
              </Link>
              
              {/* Action Icons */}
              <div className="flex items-center gap-2 print:hidden">
                <button 
                  onClick={handleClone}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Clone Contract"
                >
                  <Copy className="w-5 h-5" />
                </button>
                {isEditing && (
                  <button 
                    onClick={() => setIsMailModalOpen(true)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Send Mail"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                )}
                
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancelEdit}
                      className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
                      title="Cancel Edit"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSave}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                      title="Save Changes"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                    title="Edit Contract"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
                
                <button 
                  onClick={handlePrint}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Print Contract"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  title="Delete Contract"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div id="contract-document" className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden border border-white/10 bg-slate-950 print:bg-white print:text-black">
              
              {/* Header Banner */}
              <div className="relative h-48 bg-gradient-to-r from-purple-800 to-indigo-900 flex flex-col items-center justify-center text-white overflow-hidden print:bg-none print:text-black">
                <div className="absolute inset-0 bg-black/20 print:hidden"></div>
                <div className="absolute top-6 right-6">
                   <div className="text-xl font-bold tracking-tight flex flex-col items-end leading-none print:text-black">
                     <span>Pink</span>
                     <span className="text-sm font-normal">GORILLA</span>
                   </div>
                </div>
                <div className="absolute top-6 left-0">
                  <span className="bg-slate-900/40 backdrop-blur-sm px-4 py-1.5 rounded-r-md text-sm font-medium print:border print:border-black print:text-black print:bg-white">{contract.status}</span>
                </div>
                <div className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] text-center print:text-black print:drop-shadow-none">
                  <h1 className="text-4xl font-bold mb-2 tracking-tight">CONTRACT</h1>
                  <p className="text-lg opacity-90 print:opacity-100">{contract.title}</p>
                  <p className="text-sm opacity-75 mt-1 print:opacity-100">{contract.id}</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-10 md:p-14">
                
                {/* Entities */}
                <div className="flex flex-col md:flex-row justify-between mb-16 gap-10">
                  <div className="flex-1">
                    <h2 className="text-[16px] font-semibold text-white print:text-black mb-4">Service Provider / Company</h2>
                    <h3 className="text-[15px] font-bold text-white print:text-black mb-2">Pink Gorilla</h3>
                    <div className="text-[13px] text-slate-300 print:text-gray-700 leading-relaxed">
                      <p>8605 Santa Monica Blvd</p>
                      <p>West Hollywood CA</p>
                      <p>90069</p>
                      <p>United States</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 md:text-right">
                    <h2 className="text-[16px] font-semibold text-white print:text-black mb-4">Client</h2>
                    <h3 className="text-[15px] font-bold text-white print:text-black mb-2">{contract.client}</h3>
                    <div className="text-[13px] text-slate-300 print:text-gray-700 leading-relaxed">
                      <p>+1 555 123 4567</p>
                      <p>19 Street, North West Calgary,</p>
                      <p>AB, T2L 2B5, Canada</p>
                    </div>
                  </div>
                </div>

                <div className="mb-16">
                  {isEditing ? (
                    <div className="space-y-6 print:hidden">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-400 mb-2">Contract Description</label>
                        <textarea 
                          rows={8}
                          value={editedContract.description}
                          onChange={(e) => setEditedContract({...editedContract, description: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[13px] font-medium text-slate-400 mb-2">Contract Value</label>
                          <input 
                            type="text"
                            value={editedContract.value}
                            onChange={(e) => setEditedContract({...editedContract, value: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-400 mb-2">Start Date</label>
                          <input 
                            type="date"
                            value={editedContract.startDate}
                            onChange={(e) => setEditedContract({...editedContract, startDate: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-slate-400 mb-2">End Date</label>
                          <input 
                            type="date"
                            value={editedContract.endDate}
                            onChange={(e) => setEditedContract({...editedContract, endDate: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-300 print:text-black whitespace-pre-wrap leading-relaxed">
                      {contract.description || "This contract outlines the terms and conditions between Pink Gorilla and the Client for the provided services. The parties agree to the following terms..."}
                      <div className="mt-8 space-y-2">
                        <div><strong className="text-white print:text-black">Contract Value:</strong> <span className="text-slate-300 print:text-gray-800">{contract.value || "TBD"}</span></div>
                        <div><strong className="text-white print:text-black">Start Date:</strong> <span className="text-slate-300 print:text-gray-800">{contract.startDate || contract.date}</span></div>
                        {contract.endDate && <div><strong className="text-white print:text-black">End Date:</strong> <span className="text-slate-300 print:text-gray-800">{contract.endDate}</span></div>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-[1px] w-full bg-[#e2e8f0] mb-12 opacity-10 print:opacity-100 print:bg-black"></div>

                {/* Signatures */}
                <div className="flex flex-col md:flex-row justify-between gap-10">
                  <div className="flex-1">
                    <h3 className="text-[14px] font-semibold text-white print:text-black mb-6">Service Provider</h3>
                    <p className="text-[13px] text-slate-300 print:text-gray-700 mb-4">Chayan Alavi</p>
                    
                    {/* Provider Signature */}
                    {contract.providerStatus === 'Signed' ? (
                      <>
                        <div className="mb-4 inline-block print:filter print:invert print:brightness-0">
                          <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 17C14 17 9 24 10 32C11 40 18 45 27 45C38 45 44 38 46 30C48 22 42 16 35 15" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M40 38C40 38 52 24 57 20C62 16 66 18 64 24C62 30 54 39 48 42C42 45 42 41 45 37" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M60 41C60 41 72 26 80 18C88 10 94 15 90 22C86 29 78 39 74 42C70 45 74 44 80 40" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M78 41C85 41 98 32 105 28" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M102 28C100 35 96 42 100 42C104 42 110 35 115 28C120 21 125 24 122 30C119 36 112 43 108 43" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M110 42C115 42 125 35 130 32" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M125 38C125 38 130 38 135 34C140 30 140 38 135 40C130 42 145 42 155 35" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M35 32C45 28 65 24 85 24C105 24 120 28 130 32" stroke="currentColor" className="text-white print:text-black" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-[12px] text-slate-400 print:text-gray-500">Date : {contract.date}</p>
                      </>
                    ) : (
                      <p className="text-[14px] text-orange-400 border border-orange-400/30 bg-orange-400/10 print:border-black print:text-black print:bg-white inline-block px-3 py-1 rounded-md">Pending Signature</p>
                    )}
                  </div>
                  
                  <div className="flex-1 md:text-right">
                    <h3 className="text-[14px] font-semibold text-white print:text-black mb-6">Client</h3>
                    {contract.clientStatus === 'Signed' ? (
                      <>
                        <div className="mb-4 inline-block md:float-right clear-both print:filter print:invert print:brightness-0">
                          <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 40C15 35 30 20 40 25C50 30 40 45 35 40C30 35 45 25 55 30" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M50 40C60 30 80 20 90 25C100 30 85 45 75 40C65 35 80 25 95 30" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M90 40C100 35 115 25 125 30C135 35 120 45 115 40C110 35 125 25 140 30" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M130 40C140 35 160 25 170 30C180 35 165 45 160 40" stroke="currentColor" className="text-white print:text-black" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="clear-both"></div>
                        <p className="text-[12px] text-slate-400 print:text-gray-500">Date : {contract.date}</p>
                      </>
                    ) : (
                      <p className="text-[14px] text-orange-400 border border-orange-400/30 bg-orange-400/10 print:border-black print:text-black print:bg-white inline-block px-3 py-1 rounded-md md:float-right">Pending Signature</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Send Mail Modal */}
      {isMailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-600 bg-slate-950/50 flex justify-between items-center bg-slate-900/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" /> Send Contract via Mail
              </h2>
              <button 
                onClick={() => setIsMailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendMail}>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Select Client Email</label>
                  <select 
                    value={mailTo}
                    onChange={(e) => setMailTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none"
                    required
                  >
                    <option value="">Select an email...</option>
                    <option value="client@pinkgorilla.com">client@pinkgorilla.com</option>
                    <option value="billing@pinkgorilla.com">billing@pinkgorilla.com</option>
                    <option value="custom">Add new email...</option>
                  </select>
                </div>

                {mailTo === "custom" && (
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-slate-400">Custom Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g., new@client.com"
                      className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-400">Message (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Add a custom message..."
                    className="w-full bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsMailModalOpen(false)}
                  className="px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Send Mail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel border border-slate-600 bg-slate-950/50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Contract</h2>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete <span className="text-slate-200 font-semibold">{contract.title}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="p-6 border-t border-slate-600 bg-slate-950/50 bg-slate-800/30 flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 bg-transparent hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-lg border border-slate-600 bg-slate-950 transition-colors flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}