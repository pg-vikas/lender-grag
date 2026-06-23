import { useState } from "react";
import { Search, Filter, BookOpen, ChevronRight, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { Sidebar, Header } from "./clients";

export default function KnowledgebasePage() {
  const [openMenus, setOpenMenus] = useState<string>('support');
  const [location] = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const categories = [
    { title: "Getting Started", count: 12, description: "Basic tutorials to get you up and running with Greg Gorilla Hub." },
    { title: "Billing & Subscriptions", count: 8, description: "Information about invoicing, payments, and upgrading plans." },
    { title: "Project Management", count: 24, description: "How to create, track, and complete projects efficiently." },
    { title: "Account Settings", count: 6, description: "Managing your profile, notifications, and security preferences." },
  ];

  const popularArticles = [
    "How to invite a new team member",
    "Understanding your dashboard metrics",
    "Setting up automated invoice reminders",
    "Connecting your Stripe account",
    "How to export client data"
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Knowledgebase" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            
            {/* Search Header Hero */}
            <div className="bg-[#0f172a] rounded-[1rem] p-10 mb-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]enter relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-10 -ml-10 -mb-10 pointer-events-none"></div>
               
               <h1 className="text-3xl font-bold text-white mb-4 relative z-10">How can we help you today?</h1>
               <p className="text-white/70 mb-8 max-w-lg mx-auto relative z-10">Search our knowledgebase for answers to common questions, tutorials, and step-by-step guides.</p>
               
               <div className="max-w-2xl mx-auto relative z-10">
                 <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input 
                     type="text"
                     placeholder="Search articles, guides, and tutorials..." 
                     className="w-full pl-12 pr-4 py-4 bg-slate-900/40 backdrop-blur-xl rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all shadow-lg"
                   />
                   <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                     Search
                   </button>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Categories */}
               <div className="lg:col-span-2">
                 <h2 className="text-xl font-bold text-white mb-6">Browse by Category</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat, i) => (
                      <div key={i} className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10 hover:border-[#8b5cf6]/30 transition-colors cursor-pointer group">
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                               <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                               <h3 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{cat.title}</h3>
                               <p className="text-sm text-slate-400 mb-3">{cat.description}</p>
                               <span className="text-xs font-semibold text-indigo-400 bg-purple-50 px-2.5 py-1 rounded-full">{cat.count} articles</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>

               {/* Sidebar */}
               <div>
                 <div className="glass-panel rounded-2xl border-t border-indigo-500/20 p-6  border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-4">Popular Articles</h2>
                    <ul className="space-y-3">
                       {popularArticles.map((article, i) => (
                         <li key={i}>
                           <a href="#" className="flex items-start gap-3 text-sm text-slate-300 hover:text-indigo-400 transition-colors group">
                              <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-500 group-hover:text-indigo-400" />
                              <span>{article}</span>
                           </a>
                         </li>
                       ))}
                    </ul>
                 </div>
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
