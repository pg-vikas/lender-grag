import { useState } from "react";
import { Sidebar, Header } from "./clients";
import { useLocation } from "wouter";

export default function ComingSoonPage({ title, description }: { title: string, description: string }) {
  const [openMenus, setOpenMenus] = useState<string>('');
  const [location] = useLocation();
  
  const toggleMenu = (menu: string) => setOpenMenus(prev => prev === menu ? '' : menu);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title={title} />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <div className="w-24 h-24 mb-8 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">{title}</h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
            {description}
          </p>
          
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Module in Development
          </div>
        </div>
      </div>
    </div>
  );
}
