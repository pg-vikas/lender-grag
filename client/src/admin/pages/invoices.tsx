import { useState } from "react";
import { Search, Filter, Plus, FileText, Download, CheckCircle2, Clock, Trash2, ExternalLink, MoreHorizontal, Pin, X, RefreshCw, TrendingUp } from "lucide-react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import * as XLSX from 'xlsx';

export default function InvoicesPage() {
  const [openMenus, setOpenMenus] = useState<string>('sales');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const [invoicesList, setInvoicesList] = useState([
    { id: "INV-2026-001", client: "Pink Gorilla Software", amount: "$1,250.00", date: "Oct 01, 2026", dueDate: "Oct 15, 2026", status: "Paid", pinned: false },
    { id: "INV-2026-002", client: "Estate Landscape", amount: "$850.00", date: "Oct 05, 2026", dueDate: "Oct 20, 2026", status: "Pending", pinned: false },
    { id: "INV-2026-003", client: "Summit Cabinets", amount: "$2,400.00", date: "Sep 28, 2026", dueDate: "Oct 12, 2026", status: "Overdue", pinned: false },
    { id: "INV-2026-004", client: "Urban Edge", amount: "$450.00", date: "Oct 10, 2026", dueDate: "Oct 25, 2026", status: "Pending", pinned: false },
  ]);

  const togglePin = (id: string) => {
    setInvoicesList(prev => prev.map(inv => inv.id === id ? { ...inv, pinned: !inv.pinned } : inv));
  };

  const filteredInvoices = invoicesList.filter(inv => {
    const matchesSearch = !appliedSearchQuery || 
      inv.id.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
      inv.client.toLowerCase().includes(appliedSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDownloadAll = () => {
    const worksheet = XLSX.utils.json_to_sheet(invoicesList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "Invoices.xlsx");
  };

  const handleDownloadInvoice = (invoice: any) => {
    const worksheet = XLSX.utils.json_to_sheet([invoice]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
    XLSX.writeFile(workbook, `${invoice.id}.xlsx`);
    setActiveDropdown(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Invoices" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[22px] text-white font-semibold">Invoices</h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowStats(!showStats)}
                  className={`flex items-center justify-center p-2.5 backdrop-blur-xl border rounded-xl transition-all shadow-sm hover:shadow shrink-0 ${showStats ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-slate-900/40 text-slate-300 border-white/10 hover:bg-slate-900/40'}`}
                  title="Toggle Quick Stats"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsCreateInvoiceModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4" /> Create Invoice
                </button>
              </div>
            </div>

            {/* Stats Row */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-slate-400 mb-1">Total Paid</p>
                     <h3 className="text-3xl font-bold text-white">$14,500.00</h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                   </div>
                </div>
                <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-slate-400 mb-1">Total Pending</p>
                     <h3 className="text-3xl font-bold text-white">$3,200.00</h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-400" />
                   </div>
                </div>
                <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-slate-400 mb-1">Total Overdue</p>
                     <h3 className="text-3xl font-bold text-white">$2,400.00</h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-rose-400" />
                   </div>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20  overflow-hidden border border-white/10">
              <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 backdrop-blur-xl/50">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search invoices" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-all shadow-sm hover:shadow"
                  >
                    Filter <Filter className="w-3.5 h-3.5" />
                  </button>
                  {appliedSearchQuery && (
                    <button 
                      onClick={handleReset}
                      className="px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900/40 backdrop-blur-xl transition-all shadow-sm hover:shadow transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download All
                </button>
              </div>

              <div className="overflow-x-auto pb-32">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-900/40 backdrop-blur-xl border-b border-white/10">
                    <tr>
                      <th className="py-4 px-6 font-semibold text-slate-300">Invoice ID</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Client</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Amount</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Date</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Due Date</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Status</th>
                      <th className="py-4 px-6 font-semibold text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No invoices found matching "{appliedSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                    filteredInvoices.map((invoice, i) => (
                      <tr key={i} className={`hover:bg-slate-900/40 backdrop-blur-xl/50/50 transition-colors bg-slate-900/40 backdrop-blur-xl ${activeDropdown === i ? 'relative z-50' : 'relative z-10'}`}>
                        <td className="py-4 px-6 font-semibold">
                          <Link href={`/admin/invoices/${invoice.id}`} className="text-indigo-400 hover:text-[#7c3aed] transition-colors">{invoice.id}</Link>
                        </td>
                        <td className="py-4 px-6 font-medium text-white">{invoice.client}</td>
                        <td className="py-4 px-6 font-medium text-white">{invoice.amount}</td>
                        <td className="py-4 px-6 text-slate-400">{invoice.date}</td>
                        <td className="py-4 px-6 text-slate-400">{invoice.dueDate}</td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold
                              ${invoice.status === 'Paid' ? 'bg-green-50 text-green-600 border border-green-200' : 
                                invoice.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                             {invoice.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 relative">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                setInvoiceToDelete(invoice.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link href={`/admin/invoices/${invoice.id}`} className="text-slate-300 hover:text-white transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <div className="relative">
                              <button 
                                onClick={() => toggleDropdown(i)}
                                className="text-slate-300 hover:text-white transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              
                              {activeDropdown === i && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setActiveDropdown(null)}
                                  ></div>
                                  <div className="absolute right-0 top-[24px] z-50 w-[200px] bg-[#1e293b] rounded-lg shadow-xl border border-slate-600 bg-slate-950 py-2 flex flex-col">
                                    <button 
                                      className="w-full text-left px-5 py-2.5 text-[14px] font-medium text-white hover:bg-slate-700 transition-colors"
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsEditInvoiceModalOpen(true);
                                      }}
                                    >
                                      Quick Edit
                                    </button>
                                    <button 
                                      className="w-full text-left px-5 py-2.5 text-[14px] font-medium text-white hover:bg-slate-700 transition-colors"
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsAddPaymentModalOpen(true);
                                      }}
                                    >
                                      Add A New Payment
                                    </button>
                                    <button 
                                      className="w-full text-left px-5 py-2.5 text-[14px] font-medium text-white hover:bg-slate-700 transition-colors"
                                      onClick={() => handleDownloadInvoice(invoice)}
                                    >
                                      Download
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                            <button 
                              onClick={() => togglePin(invoice.id)}
                              className={`transition-colors ${invoice.pinned ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                            >
                              <Pin className={`w-4 h-4 ${invoice.pinned ? 'fill-indigo-400' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
      {/* Edit Invoice Modal */}
      {isEditInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[700px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex flex-col p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Invoice</h2>
                <button 
                  onClick={() => setIsEditInvoiceModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-[13px] text-slate-400 text-right mt-1">
                Created By: | 28-02-2026
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-y-5">
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Invoice Date*</label>
                  <input type="text" defaultValue="28-02-2026" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Due Date*</label>
                  <input type="text" defaultValue="28-02-2026" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Category*</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none">
                    <option>Default</option>
                  </select>
                </div>
              </div>
              
              <div className="w-full h-[1px] bg-slate-800 my-6"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-slate-300">Additional Information</span>
                <button className="w-10 h-5 bg-[#e2e8f0] rounded-full relative transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-slate-900/40 backdrop-blur-xl rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                </button>
              </div>

              <div className="text-[13px] font-semibold text-slate-300 mb-3">* Required</div>

              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/40 backdrop-blur-xl/50 border border-cyan-100 rounded-md text-[13px] text-slate-300">
                <RefreshCw className="w-4 h-4 text-orange-400" />
                <span>Recurring invoice options are available after an invoice has been created</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsEditInvoiceModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[700px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex flex-col p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add A New Payment</h2>
                <button 
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-[13px] font-medium text-slate-400 text-right mt-1">
                Balance Due: <span className="text-white">$0.00</span>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-y-5">
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Amount*</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-slate-900/40 backdrop-blur-xl/50 border border-r-0 border-white/10 rounded-l-md text-[13px] text-slate-500">
                      $
                    </span>
                    <input type="text" defaultValue="0.00" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-r-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                  </div>
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Date*</label>
                  <input type="text" defaultValue="10-03-2026" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Payment Method*</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-slate-300 focus:outline-none">
                    <option>Paypal</option>
                  </select>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Transaction ID</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>
              
              <div className="w-full h-[1px] bg-slate-800 my-6"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-slate-300">Additional Information</span>
                <button className="w-10 h-5 bg-[#e2e8f0] rounded-full relative transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-slate-900/40 backdrop-blur-xl rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                </button>
              </div>

              <label className="flex items-center gap-2 mb-6 cursor-pointer group">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500 border border-[#8b5cf6]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors">Send the client a payment received email</span>
              </label>

              <div className="text-[13px] font-semibold text-slate-300">* Required</div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isCreateInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-[700px] my-8 flex flex-col relative max-h-[90vh]">
            <div className="flex flex-col p-6 border-b border-white/10 shrink-0 sticky top-0 bg-slate-900/40 backdrop-blur-xl z-10 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create Invoice</h2>
                <button 
                  onClick={() => setIsCreateInvoiceModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-y-5">
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Client Name*</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 rounded-md text-[13px] text-slate-300 focus:outline-none">
                    <option></option>
                    <option>Pink Gorilla Software</option>
                    <option>Estate Landscape</option>
                    <option>Summit Cabinets</option>
                    <option>Urban Edge</option>
                  </select>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Invoice Number*</label>
                  <input type="text" placeholder="INV-2026-005" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Date*</label>
                  <input type="date" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" style={{ colorScheme: 'dark' }} />
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Amount*</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-slate-900/40 backdrop-blur-xl/50 border border-r-0 border-white/10 rounded-l-md text-[13px] text-slate-500">
                      $
                    </span>
                    <input type="text" placeholder="0.00" className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-r-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                  </div>
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-center">
                  <label className="text-[13px] font-medium text-slate-300">Status*</label>
                  <select className="w-full border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 px-3 py-2.5 bg-slate-900/80 rounded-md text-[13px] text-slate-300 focus:outline-none">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-[160px_1fr] items-start">
                  <label className="text-[13px] font-medium text-slate-300 mt-2.5">Notes</label>
                  <textarea rows={3} placeholder="Add any notes here..." className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-md text-[13px] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-b-lg shrink-0 sticky bottom-0">
              <button 
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="px-5 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-slate-900/40 backdrop-blur-xl/50 text-slate-300 rounded-md text-[14px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white rounded-xl text-[14px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Invoice</h2>
            <p className="text-[15px] text-slate-300 mb-8">
              Are you sure?
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setInvoiceToDelete(null);
                }}
                className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setInvoicesList(prev => prev.filter(inv => inv.id !== invoiceToDelete));
                  setIsDeleteModalOpen(false);
                  setInvoiceToDelete(null);
                }}
                className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
