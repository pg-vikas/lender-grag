import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import { Shield, ShieldAlert, CheckCircle2, FileText, Download, Filter, Search, AlertCircle, Clock } from "lucide-react";

export default function CompliancePage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('compliance');

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <Header title="Compliance Center" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Compliance & Audits
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Monitor HMDA data, disclosures, and state licensing.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[13px] font-bold transition-all border border-slate-700 shadow-sm">
                <Download className="w-4 h-4" /> Export HMDA LAR
              </button>
            </div>

            {/* Health Status */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/30 shrink-0 relative">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-bold text-white">System Compliance Health: Excellent</h2>
                <p className="text-sm text-slate-400 mt-1">All initial disclosures sent within 3 days. No ECOA or TRID violations detected in active pipeline.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center flex-1 md:w-32">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Disclosures</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center flex-1 md:w-32">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Violations</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Disclosures */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Recent Disclosures
                  </h3>
                  <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
                </div>
                <div className="p-0 overflow-y-auto max-h-[400px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Borrower</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Package</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {[
                        { b: "John Doe", p: "Initial LE", s: "Signed", d: "Today" },
                        { b: "Sarah Williams", p: "Closing Disclosure", s: "Sent", d: "Yesterday" },
                        { b: "Michael Smith", p: "Change of Circumstance", s: "Signed", d: "Oct 12" },
                        { b: "Emily Davis", p: "Initial LE", s: "Sent", d: "Oct 10" }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-white">{item.b}</div>
                            <div className="text-xs text-slate-500">{item.d}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300">{item.p}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.s === 'Signed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.s === 'Signed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {item.s}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* State Licenses */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    State Licenses (NMLS)
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { state: "California (CA)", num: "CA-DFPI276890", exp: "12/31/2026", status: "Active" },
                    { state: "Texas (TX)", num: "TX-276890", exp: "12/31/2026", status: "Active" },
                    { state: "Florida (FL)", num: "LO98321", exp: "12/31/2026", status: "Active" }
                  ].map((lic, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div>
                        <div className="font-bold text-white text-sm">{lic.state}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">#{lic.num}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-1">{lic.status}</div>
                        <div className="text-[11px] text-slate-400 block">Exp: {lic.exp}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-400">CE Requirements Due Soon</h4>
                      <p className="text-xs text-amber-400/80 mt-1">You have 8 hours of Continuing Education required before December 15th to maintain active status.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
