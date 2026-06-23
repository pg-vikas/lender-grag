import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";
import { Download, Info } from "lucide-react";
import * as htmlToImage from 'html-to-image';

export default function InvoiceDetailsPage() {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const invoiceData = {
    invoiceNumber: "INV-000023",
    status: "PAID",
    from: {
      name: "Pink Gorilla",
      address: ["8605 Santa Monica Blvd", "West Hollywood", "CA", "90069", "United States"]
    },
    to: "Vs Test",
    dates: {
      invoice: "02-03-2026",
      due: "02-03-2026"
    },
    totals: {
      payments: "$0.00",
      balance: "$0.00",
      total: "$0.00"
    },
    items: [
      { description: "Core Starter", qty: 1, unit: "Each", rate: "0.00", total: "0.00" }
    ]
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Use html-to-image to reliably capture the glassmorphism UI in Vite React
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        quality: 1,
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          margin: '0',
          boxShadow: 'none' // Remove exterior shadows so it looks clean as an image
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Invoice_${invoiceData.invoiceNumber}.png`;
      link.click();
    } catch (error: any) {
      console.error("Failed to generate invoice image:", error);
      alert("Failed to generate image. " + (error?.message || ""));
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath="/admin/invoices" />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Invoice Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[22px] font-semibold text-white">Invoice #{invoiceData.invoiceNumber}</h1>
              <button 
                onClick={handleDownload}
                className="w-10 h-10 flex items-center justify-center bg-slate-900/80 border border-white/10 rounded-xl shadow-sm text-slate-300 hover:text-white hover:bg-slate-900/40 backdrop-blur-xl/50 transition-colors"
                title="Download Invoice"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div ref={invoiceRef} className="bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/10 p-8 md:p-12 mb-6">
               <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-[16px] font-bold text-white mb-1">Invoice</h2>
                    <p className="text-[14px] text-slate-400 underline underline-offset-2 hover:text-white cursor-pointer">#INV-000023</p>
                  </div>
                  <div className="text-[24px] font-medium text-[#2dd4bf] tracking-wider">
                    PAID
                  </div>
               </div>

               <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
                  <div>
                    <h3 className="text-[16px] font-bold text-white mb-2">Pink Gorilla</h3>
                    <div className="text-[13px] text-slate-300 leading-relaxed">
                      <p>8605 Santa Monica Blvd</p>
                      <p>West Hollywood</p>
                      <p>CA</p>
                      <p>90069</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <h3 className="text-[13px] font-medium text-slate-400 mb-1">Invoice To</h3>
                    <p className="text-[15px] font-bold text-white">Vs Test</p>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/10 pb-8 mb-8">
                 <div className="flex gap-12">
                   <div>
                     <p className="text-[13px] text-slate-400 mb-1">Invoice Date:</p>
                     <p className="text-[13px] text-slate-400">Due Date:</p>
                   </div>
                   <div>
                     <p className="text-[13px] font-medium text-white mb-1">02-03-2026</p>
                     <p className="text-[13px] font-medium text-white">02-03-2026</p>
                   </div>
                 </div>
                 <div className="flex gap-8 md:gap-12 justify-between md:justify-end">
                   <div className="text-right space-y-1">
                     <p className="text-[13px] text-slate-400">Payments:</p>
                     <p className="text-[13px] text-slate-400 font-medium">Balance Due:</p>
                   </div>
                   <div className="text-right space-y-1">
                     <p className="text-[13px] font-medium text-white">$0.00</p>
                     <p className="text-[13px] font-semibold text-emerald-400 bg-green-50 border border-green-200 px-3 rounded-full inline-block">$0.00</p>
                   </div>
                 </div>
               </div>

               <div className="w-full overflow-x-auto">
                 <table className="w-full text-sm text-left whitespace-nowrap mb-6">
                   <thead className="bg-slate-900/40 backdrop-blur-xl/50 border-y border-white/10">
                     <tr>
                       <th className="py-3 px-4 font-semibold text-slate-400 text-[13px] w-full">Description</th>
                       <th className="py-3 px-4 font-semibold text-slate-400 text-[13px] text-right">Qty</th>
                       <th className="py-3 px-4 font-semibold text-slate-400 text-[13px] text-right">Unit</th>
                       <th className="py-3 px-4 font-semibold text-slate-400 text-[13px] text-right">Rate</th>
                       <th className="py-3 px-4 font-semibold text-slate-400 text-[13px] text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f1f5f9]">
                     <tr>
                       <td className="py-4 px-4 text-white text-[13px]">Core Starter</td>
                       <td className="py-4 px-4 text-slate-300 text-[13px] text-right">1</td>
                       <td className="py-4 px-4 text-slate-300 text-[13px] text-right">Each</td>
                       <td className="py-4 px-4 text-slate-300 text-[13px] text-right">0.00</td>
                       <td className="py-4 px-4 text-slate-300 text-[13px] text-right">0.00</td>
                     </tr>
                   </tbody>
                 </table>
                 
                 <div className="bg-slate-900/40 backdrop-blur-xl/50 border-y border-white/10 py-4 px-4 flex justify-between items-center w-full">
                    <span className="font-bold text-white ml-auto mr-12 text-[15px]">Total</span>
                    <span className="font-bold text-white text-[15px]">$0.00</span>
                 </div>
               </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/10 p-6">
              <div className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                Notes <Info className="w-4 h-4 text-slate-500" />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}