import { useAdminStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageSquare, FileText, Tag, Clock } from "lucide-react";
import type { Lead, Borrower, CRMRecord } from "../types";
import { getLOName, getBranchName, notes as allNotes, activities } from "../data/mockData";

function LeadDetailDrawer({ data }: { data: Lead }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-white">{data.firstName} {data.lastName}</h3>
        <p className="text-[13px] text-white/40">{data.source} · {data.status}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[13px] text-white/50"><Phone className="w-3.5 h-3.5" /> {data.phone}</div>
        <div className="flex items-center gap-2 text-[13px] text-white/50"><Mail className="w-3.5 h-3.5" /> {data.email}</div>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Details</p>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div><span className="text-white/30">LO:</span> <span className="text-white/60">{getLOName(data.assignedLOId)}</span></div>
          <div><span className="text-white/30">Branch:</span> <span className="text-white/60">{getBranchName(data.branchId)}</span></div>
          <div><span className="text-white/30">Purpose:</span> <span className="text-white/60">{data.loanPurpose}</span></div>
          <div><span className="text-white/30">Est. Amount:</span> <span className="text-white/60">${(data.estimatedLoanAmount / 1000).toFixed(0)}K</span></div>
        </div>
      </div>
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[#e91e8c]/10 text-[#e91e8c] text-[10px] font-bold">{t}</span>
          ))}
        </div>
      )}
      {data.notes.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Notes</p>
          {data.notes.map((n, i) => (
            <p key={i} className="text-[12px] text-white/40 mb-1">• {n}</p>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button className="flex-1 h-9 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-[12px] font-bold hover:bg-[#e91e8c]/20 transition-colors">Convert to Borrower</button>
      </div>
    </div>
  );
}

function CRMPreviewDrawer({ data }: { data: CRMRecord }) {
  const entityNotes = allNotes.filter(n => n.entityId === data.id);
  const entityActivities = activities.filter(a => a.entityId === data.id).slice(0, 5);
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-white">{data.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 text-[10px] font-bold">{data.recordType}</span>
          <span className="text-[12px] text-white/30">{data.status}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[13px] text-white/50"><Phone className="w-3.5 h-3.5" /> {data.phone}</div>
        <div className="flex items-center gap-2 text-[13px] text-white/50"><Mail className="w-3.5 h-3.5" /> {data.email}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div><span className="text-white/30">LO:</span> <span className="text-white/60">{data.assignedLO}</span></div>
        <div><span className="text-white/30">Branch:</span> <span className="text-white/60">{data.branch}</span></div>
        <div><span className="text-white/30">Source:</span> <span className="text-white/60">{data.source}</span></div>
      </div>
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] font-bold">{t}</span>
          ))}
        </div>
      )}
      {entityNotes.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Notes</p>
          {entityNotes.map((n) => (
            <div key={n.id} className="mb-2 text-[12px]">
              <p className="text-white/50">{n.content}</p>
              <p className="text-white/20 text-[10px] mt-0.5">{n.author} · {new Date(n.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      {entityActivities.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Recent Activity</p>
          {entityActivities.map((a) => (
            <div key={a.id} className="flex items-start gap-2 mb-2">
              <Clock className="w-3 h-3 text-white/15 mt-0.5" />
              <div>
                <p className="text-[11px] text-white/40">{a.description}</p>
                <p className="text-[10px] text-white/15">{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button className="h-8 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><Phone className="w-3 h-3" /> Call</button>
        <button className="h-8 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Text</button>
        <button className="h-8 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</button>
      </div>
    </div>
  );
}

function CreateFormDrawer({ type }: { type: string }) {
  const { closeDrawer } = useAdminStore();
  const titles: Record<string, string> = { "create-lead": "New Lead", "create-borrower": "New Borrower", "create-loan": "New Loan File", "create-note": "New Note" };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">{titles[type] || "Create"}</h3>
      <div className="space-y-3">
        <input placeholder="First Name" className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-white/[0.15]" />
        <input placeholder="Last Name" className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-white/[0.15]" />
        <input placeholder="Phone" className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-white/[0.15]" />
        <input placeholder="Email" className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-white/[0.15]" />
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={closeDrawer} className="flex-1 h-10 rounded-lg bg-white/[0.06] text-white/50 text-[13px] font-medium hover:bg-white/[0.1] transition-colors">Cancel</button>
        <button className="flex-1 h-10 rounded-lg bg-[#e91e8c] text-white text-[13px] font-bold hover:bg-[#d6197f] transition-colors">Save</button>
      </div>
    </div>
  );
}

export function RightDrawer() {
  const { drawerOpen, drawerData, closeDrawer } = useAdminStore();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeDrawer}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#111] border-l border-white/[0.06] z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <p className="text-[13px] font-bold text-white/50 uppercase tracking-wider">
                {drawerOpen === "lead-detail" && "Lead Detail"}
                {drawerOpen === "crm-preview" && "CRM Preview"}
                {drawerOpen?.startsWith("create-") && "Quick Create"}
              </p>
              <button onClick={closeDrawer} className="text-white/30 hover:text-white/60" data-testid="button-close-drawer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {drawerOpen === "lead-detail" && drawerData && <LeadDetailDrawer data={drawerData} />}
              {drawerOpen === "crm-preview" && drawerData && <CRMPreviewDrawer data={drawerData} />}
              {drawerOpen?.startsWith("create-") && <CreateFormDrawer type={drawerOpen} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
