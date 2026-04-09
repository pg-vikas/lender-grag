import { useAdminStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Briefcase, FileText, StickyNote, ListChecks } from "lucide-react";

const createOptions = [
  { label: "New Lead", icon: UserPlus, color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10", drawer: "create-lead" },
  { label: "New Borrower", icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-400/10", drawer: "create-borrower" },
  { label: "New Loan File", icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10", drawer: "create-loan" },
  { label: "New Note", icon: StickyNote, color: "text-green-400", bg: "bg-green-400/10", drawer: "create-note" },
  { label: "New Task", icon: ListChecks, color: "text-white/25", bg: "bg-white/[0.04]", drawer: "" },
];

export function QuickCreateMenu() {
  const { quickCreateOpen, setQuickCreateOpen, openDrawer } = useAdminStore();

  return (
    <AnimatePresence>
      {quickCreateOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setQuickCreateOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="fixed top-16 right-4 z-50 w-[260px] bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-[13px] font-bold text-white/70">Quick Create</p>
              <button onClick={() => setQuickCreateOpen(false)} className="text-white/30 hover:text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              {createOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setQuickCreateOpen(false);
                    if (opt.drawer) openDrawer(opt.drawer);
                  }}
                  disabled={!opt.drawer}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${opt.drawer ? "hover:bg-white/[0.04]" : "opacity-40 cursor-not-allowed"}`}
                  data-testid={`quick-create-${opt.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-8 h-8 rounded-lg ${opt.bg} flex items-center justify-center`}>
                    <opt.icon className={`w-4 h-4 ${opt.color}`} />
                  </div>
                  <span className="text-[13px] text-white/60 font-medium">{opt.label}</span>
                  {!opt.drawer && <span className="ml-auto text-[9px] font-bold text-white/20 uppercase">P2</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
