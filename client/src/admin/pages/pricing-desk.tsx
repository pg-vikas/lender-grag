import { useState } from "react";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import { Search, Filter, Calculator, TrendingDown, Percent, Zap, Building2, CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingDeskPage() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>('pricing-desk');

  const toggleMenu = (menu: string) => {
    setOpenMenus(openMenus === menu ? '' : menu);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>
        <Header title="Pricing & Lock Desk" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Quick Pricer
                </h1>
                <p className="text-slate-400 mt-1 text-[14px]">Run scenarios and lock rates instantly.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Scenario Input */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-indigo-400" />
                      Loan Scenario
                    </h2>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Loan Purpose</label>
                      <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
                        <option>Purchase</option>
                        <option>Rate/Term Refinance</option>
                        <option>Cash-Out Refinance</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Property Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                          <input type="text" defaultValue="500,000" className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Loan Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                          <input type="text" defaultValue="400,000" className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FICO Score</label>
                        <input type="text" defaultValue="740" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">State</label>
                        <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
                          <option>CA</option>
                          <option>TX</option>
                          <option>FL</option>
                          <option>NY</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Property Type</label>
                      <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
                        <option>Single Family Detached</option>
                        <option>Condominium</option>
                        <option>2-4 Units</option>
                        <option>Townhouse</option>
                      </select>
                    </div>
                    
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> Get Pricing
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Results */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-400 font-medium">Pricing engine returned 24 eligible products in 1.2 seconds.</p>
                </div>

                {/* Product 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg group hover:border-indigo-500/30 transition-colors">
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 bg-slate-800/30">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">Conventional 30-Year Fixed</h2>
                      </div>
                      <p className="text-xs text-slate-400">Fannie Mae • DU Approved • Eligible</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                          6.250 <Percent className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <TrendingDown className="w-3 h-3" /> Lowest Rate
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-950/50">
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">Rate</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">15 Day</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">30 Day</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase">45 Day</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase text-right">Lock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        <tr className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3 font-bold text-white">6.125%</td>
                          <td className="px-5 py-3 text-rose-400 font-medium">-0.250</td>
                          <td className="px-5 py-3 text-rose-400 font-medium">-0.375</td>
                          <td className="px-5 py-3 text-rose-400 font-medium">-0.500</td>
                          <td className="px-5 py-3 text-right">
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold transition-colors">Select</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors bg-indigo-500/5 relative">
                          <td className="px-5 py-3 font-bold text-indigo-400">6.250%</td>
                          <td className="px-5 py-3 text-emerald-400 font-bold">+0.125</td>
                          <td className="px-5 py-3 text-emerald-400 font-bold">+0.000</td>
                          <td className="px-5 py-3 text-rose-400 font-medium">-0.125</td>
                          <td className="px-5 py-3 text-right">
                            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors">Select</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3 font-bold text-white">6.375%</td>
                          <td className="px-5 py-3 text-emerald-400 font-medium">+0.500</td>
                          <td className="px-5 py-3 text-emerald-400 font-medium">+0.375</td>
                          <td className="px-5 py-3 text-emerald-400 font-medium">+0.250</td>
                          <td className="px-5 py-3 text-right">
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold transition-colors">Select</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg group hover:border-indigo-500/30 transition-colors">
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 bg-slate-800/30">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <h2 className="text-lg font-bold text-white">FHA 30-Year Fixed</h2>
                      </div>
                      <p className="text-xs text-slate-400">FHA • Eligible with exceptions</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                          5.875 <Percent className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Standard Pricing</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
                    <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1 w-full">
                      View Rate Sheet <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
