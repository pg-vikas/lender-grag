import { useState, useEffect, useRef } from "react";
import { useAdminStore } from "../store";
import { Search, X, Users, Briefcase, FileText, ArrowRight } from "lucide-react";
import { leads, borrowers, loanFiles, getLOName } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export function GlobalSearch() {
  const { globalSearchOpen, setGlobalSearchOpen } = useAdminStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
      if (e.key === "Escape") setGlobalSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setGlobalSearchOpen]);

  useEffect(() => {
    if (globalSearchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [globalSearchOpen]);

  const q = query.toLowerCase().trim();

  const matchedLeads = q ? leads.filter(l => `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)).slice(0, 4) : [];
  const matchedBorrowers = q ? borrowers.filter(b => b.fullName.toLowerCase().includes(q) || b.email.toLowerCase().includes(q)).slice(0, 4) : [];
  const matchedLoans = q ? loanFiles.filter(lf => lf.propertyAddress.toLowerCase().includes(q) || lf.id.toLowerCase().includes(q)).slice(0, 4) : [];

  const hasResults = matchedLeads.length > 0 || matchedBorrowers.length > 0 || matchedLoans.length > 0;

  return (
    <AnimatePresence>
      {globalSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setGlobalSearchOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50"
          >
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.06]">
                <Search className="w-5 h-5 text-white/30" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search leads, borrowers, loans..."
                  className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/25 focus:outline-none"
                  data-testid="input-global-search"
                />
                <button onClick={() => setGlobalSearchOpen(false)} className="text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {q && (
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {!hasResults && (
                    <p className="text-center text-white/25 text-sm py-8">No results for "{query}"</p>
                  )}

                  {matchedLeads.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 px-3 py-1.5">Leads</p>
                      {matchedLeads.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => { setGlobalSearchOpen(false); navigate("/admin/leads"); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                          data-testid={`search-result-${l.id}`}
                        >
                          <Users className="w-4 h-4 text-[#e91e8c]/60" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-white/80 font-medium truncate">{l.firstName} {l.lastName}</p>
                            <p className="text-[11px] text-white/30">{l.status} · {l.source}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-white/20" />
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedBorrowers.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 px-3 py-1.5">Borrowers</p>
                      {matchedBorrowers.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => { setGlobalSearchOpen(false); navigate(`/admin/borrowers/${b.id}`); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                          data-testid={`search-result-${b.id}`}
                        >
                          <Briefcase className="w-4 h-4 text-cyan-400/60" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-white/80 font-medium truncate">{b.fullName}</p>
                            <p className="text-[11px] text-white/30">{getLOName(b.assignedLOId)}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-white/20" />
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedLoans.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 px-3 py-1.5">Loan Files</p>
                      {matchedLoans.map((lf) => (
                        <button
                          key={lf.id}
                          onClick={() => { setGlobalSearchOpen(false); navigate(`/admin/pipeline/${lf.id}`); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
                          data-testid={`search-result-${lf.id}`}
                        >
                          <FileText className="w-4 h-4 text-amber-400/60" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-white/80 font-medium truncate">{lf.propertyAddress}</p>
                            <p className="text-[11px] text-white/30">{lf.stage} · ${(lf.amount / 1000).toFixed(0)}K</p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-white/20" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!q && (
                <div className="p-6 text-center text-white/20 text-sm">
                  Start typing to search across all records
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
