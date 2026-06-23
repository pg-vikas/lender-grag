import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Sidebar, Header } from "./clients";
import { ExternalLink, Download } from "lucide-react";
import * as XLSX from 'xlsx';

export default function SubscriptionDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const paymentHistory = [
    { invoice: "INV-000023", date: "02-03-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000022", date: "01-03-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000021", date: "28-02-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000020", date: "27-02-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000019", date: "27-02-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000018", date: "27-02-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000017", date: "27-02-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
    { invoice: "INV-000006", date: "27-01-2026", method: "Stripe Payment", amount: "$0.00", status: "Paid" },
  ];

  const handleDownloadPayment = (payment: any) => {
    const worksheet = XLSX.utils.json_to_sheet([payment]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment");
    XLSX.writeFile(workbook, `Payment_${payment.invoice}.xlsx`);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/subscriptions" />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Subscription Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Subscription Info */}
              <div className="w-full lg:w-[380px] shrink-0">
                <div className="mb-6">
                  <h1 className="text-[22px] font-bold text-white">Core Starter</h1>
                  <p className="text-[14px] text-slate-300 font-medium">$0.00/Month</p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/10 overflow-hidden">
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-1">Client</p>
                      <p className="text-[15px] font-semibold text-white">Vs Test</p>
                    </div>

                    <div className="h-[1px] bg-slate-800 -mx-6"></div>

                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-1">Stripe ID</p>
                      <p className="text-[14px] text-white break-all">sub_1SuBLxJr5KxVZRQGbLCunfJW</p>
                    </div>

                    <div className="h-[1px] bg-slate-800 -mx-6"></div>

                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-1">Start Date</p>
                      <p className="text-[15px] font-semibold text-white">27-01-2026</p>
                    </div>

                    <div className="h-[1px] bg-slate-800 -mx-6"></div>

                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-1">Last Payment</p>
                      <p className="text-[15px] font-semibold text-white">27-02-2026</p>
                    </div>

                    <div className="h-[1px] bg-slate-800 -mx-6"></div>

                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-1">Next Payment</p>
                      <p className="text-[15px] font-semibold text-white">28-02-2026</p>
                    </div>

                    <div className="h-[1px] bg-slate-800 -mx-6"></div>

                    <div>
                      <p className="text-[13px] font-medium text-slate-400 mb-2">Status</p>
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold text-green-600 border border-green-300">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment History */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-semibold text-white mb-6">Payment History</h2>
                
                <div className="space-y-4">
                  {paymentHistory.map((payment, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-xl rounded-xl  p-4 flex items-center justify-between group border border-transparent hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 w-1/4">
                        <div className="w-5 h-4 bg-slate-200 rounded-[2px] flex items-center justify-center shrink-0">
                          <div className="w-3 h-0.5 bg-slate-900/40 backdrop-blur-xl rounded-full"></div>
                        </div>
                        <Link href={`/admin/invoices/${payment.invoice}`} className="text-[14px] font-semibold text-white hover:text-indigo-400 transition-colors">
                          {payment.invoice}
                        </Link>
                      </div>
                      
                      <div className="text-[14px] text-slate-300 w-1/5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]enter">
                        {payment.date}
                      </div>
                      
                      <div className="text-[14px] text-slate-300 w-1/4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]enter">
                        {payment.method}
                      </div>
                      
                      <div className="text-[14px] font-medium text-white w-1/6 text-right">
                        {payment.amount}
                      </div>
                      
                      <div className="w-1/6 flex items-center justify-end gap-6">
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-semibold text-sky-500 border border-sky-200 bg-sky-50/50">
                          {payment.status}
                        </span>
                        <div className="flex items-center gap-3 text-slate-500">
                          <Link href={`/admin/invoices/${payment.invoice}`} className="hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button 
                            className="hover:text-white transition-colors"
                            onClick={() => handleDownloadPayment(payment)}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}