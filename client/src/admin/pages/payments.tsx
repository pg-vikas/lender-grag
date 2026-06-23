import { useState } from "react";
import { ChevronUp, ExternalLink, Pin, X } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

export default function PaymentsPage() {
  const [openMenus, setOpenMenus] = useState<string>('sales');
  const [location] = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const [paymentsList, setPaymentsList] = useState([
    { id: "#9", date: "02-03-2026", invoice: "INV-000023", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
    { id: "#8", date: "01-03-2026", invoice: "INV-000022", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
    { id: "#7", date: "28-02-2026", invoice: "INV-000021", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
    { id: "#6", date: "27-02-2026", invoice: "INV-000020", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
    { id: "#5", date: "27-02-2026", invoice: "INV-000019", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
    { id: "#4", date: "27-02-2026", invoice: "INV-000018", amount: "$0.00", client: "Vs Test", method: "Stripe", pinned: false },
  ]);

  const togglePin = (id: string) => {
    setPaymentsList(prev => prev.map(payment => payment.id === id ? { ...payment, pinned: !payment.pinned } : payment));
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Billings" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-[22px] font-semibold text-white mb-6">Billings</h1>

            <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-sm p-6 border border-white/10">
              <h2 className="text-sm font-medium text-slate-400 mb-6">Billing History</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap border-separate" style={{ borderSpacing: '0 12px' }}>
                  <thead>
                    <tr className="bg-slate-900/40 backdrop-blur-xl/50 text-slate-400">
                      <th className="py-4 px-6 font-medium rounded-l-[12px] cursor-pointer hover:text-white w-24">
                        <div className="flex items-center gap-1.5 text-[13px]">ID# <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Date <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Invoice <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Amount <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Client <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium cursor-pointer hover:text-white">
                        <div className="flex items-center gap-1.5 text-[13px]">Method <ChevronUp className="w-3.5 h-3.5 opacity-50" /></div>
                      </th>
                      <th className="py-4 px-6 font-medium rounded-r-[12px] text-[13px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.map((payment, i) => (
                      <tr key={i} className="bg-slate-900/40 backdrop-blur-xl group">
                        <td className="py-4 px-6 font-medium text-white rounded-l-[12px] border-y border-l border-white/10 group-hover:border-[#cbd5e1] transition-colors">
                          <button 
                            className="text-indigo-400 hover:text-[#7c3aed] transition-colors hover:underline"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            {payment.id}
                          </button>
                        </td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{payment.date}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{payment.invoice}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{payment.amount}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{payment.client}</td>
                        <td className="py-4 px-6 font-medium text-white border-y border-white/10 group-hover:border-[#cbd5e1] transition-colors">{payment.method}</td>
                        <td className="py-4 px-6 border-y border-r border-white/10 group-hover:border-[#cbd5e1] transition-colors rounded-r-[12px]">
                           <div className="flex items-center gap-3 text-slate-500">
                              <button 
                                className="hover:text-white transition-colors"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => togglePin(payment.id)}
                                className={`transition-colors ${payment.pinned ? 'text-indigo-400' : 'hover:text-white'}`}
                              >
                                <Pin className={`w-4 h-4 ${payment.pinned ? 'fill-indigo-400' : ''}`} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Payment Details Popup */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
          <div className="glass-panel rounded-2xl border-t border-indigo-500/20 shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 pb-4">
              <h2 className="text-xl font-bold text-white">Payment</h2>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 pt-2 pb-12">
              <div className="border border-white/10 rounded-md overflow-hidden">
                <table className="w-full text-[14px] text-left">
                  <tbody className="divide-y divide-[#e2e8f0]">
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 w-1/3 border-r border-white/10">Payment ID</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.id}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Amount</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.amount}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Invoice ID</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.invoice}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Date</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.date}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Payment Method</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.method}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Client</td>
                      <td className="py-3 px-4 text-white">{selectedPayment.client}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-300 bg-slate-900/40 backdrop-blur-xl/50 border-r border-white/10">Notes</td>
                      <td className="py-3 px-4 text-white"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
