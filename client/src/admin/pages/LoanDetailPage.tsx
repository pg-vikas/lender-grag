import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { loanFiles, borrowers, getLOName, getProcessorName, getBranchName, notes as allNotes, activities } from "../data/mockData";
import { useLocation, useRoute } from "wouter";
import {
  ArrowLeft, Phone, Mail, FileText, StickyNote, ListChecks, ChevronRight,
  CheckCircle2, Circle, Clock, AlertTriangle, Calendar, User, MapPin, DollarSign,
  Building, Percent
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = ["Overview", "Milestones", "Borrowers", "Notes", "Timeline", "Compliance", "Documents"];

export default function LoanDetailPage() {
  const [, params] = useRoute("/admin/pipeline/:loanId");
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("Overview");

  const loan = loanFiles.find(lf => lf.id === params?.loanId);
  if (!loan) return <AppShell><div className="text-center py-20 text-white/30">Loan file not found</div></AppShell>;

  const loanBorrowers = borrowers.filter(b => loan.borrowerIds.includes(b.id));
  const loanNotes = allNotes.filter(n => n.entityId === loan.id && n.entityType === "loan");
  const loanActivities = activities.filter(a => a.entityId === loan.id);
  const primaryBorrower = loanBorrowers[0];

  return (
    <AppShell>
      <div className="space-y-5">
        <button onClick={() => navigate("/admin/pipeline")} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[13px] transition-colors" data-testid="button-back-pipeline">
          <ArrowLeft className="w-4 h-4" /> Back to Pipeline
        </button>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-black text-white">{primaryBorrower?.fullName || "Unassigned Borrower"}</h1>
                <StatusBadge status={loan.stage} />
                {loan.flags.map((f) => (
                  <span key={f} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3" /> {f.replace("_", " ")}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/40">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {loan.propertyAddress}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${loan.amount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {loan.loanType} · {loan.purpose}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {getLOName(loan.assignedLOId)}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="h-9 px-4 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-[12px] font-bold hover:bg-[#e91e8c]/20 transition-colors">Move Stage</button>
              <button className="h-9 px-4 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors">Add Note</button>
              <button className="h-9 px-4 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors">Create Task</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 space-y-4">
            <div className="flex gap-1 border-b border-white/[0.06] pb-0">
              {tabs.map((tab) => {
                const disabled = ["Compliance", "Documents"].includes(tab);
                return (
                  <button
                    key={tab}
                    onClick={() => !disabled && setActiveTab(tab)}
                    disabled={disabled}
                    className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all ${
                      activeTab === tab ? "border-[#e91e8c] text-white" : disabled ? "border-transparent text-white/15 cursor-not-allowed" : "border-transparent text-white/35 hover:text-white/60"
                    }`}
                    data-testid={`tab-${tab.toLowerCase()}`}
                  >
                    {tab}
                    {disabled && <span className="ml-1 text-[9px] font-bold text-white/15">P2</span>}
                  </button>
                );
              })}
            </div>

            {activeTab === "Overview" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Loan Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div><span className="text-white/30">Type:</span> <span className="text-white/70 font-medium">{loan.loanType}</span></div>
                    <div><span className="text-white/30">Purpose:</span> <span className="text-white/70 font-medium">{loan.purpose}</span></div>
                    <div><span className="text-white/30">Amount:</span> <span className="text-white/70 font-medium">${loan.amount.toLocaleString()}</span></div>
                    <div><span className="text-white/30">Rate:</span> <span className="text-white/70 font-medium">{loan.rate ? `${loan.rate}%` : "TBD"}</span></div>
                    <div><span className="text-white/30">Stage:</span> <span className="text-white/70 font-medium">{loan.stage}</span></div>
                    <div><span className="text-white/30">Est. Close:</span> <span className="text-white/70 font-medium">{loan.estimatedClose ? new Date(loan.estimatedClose).toLocaleDateString() : "TBD"}</span></div>
                  </div>
                </div>
                <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Property</h3>
                  <p className="text-[13px] text-white/60">{loan.propertyAddress}</p>
                </div>
                <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Assignment</h3>
                  <div className="space-y-2 text-[12px]">
                    <div><span className="text-white/30">Loan Officer:</span> <span className="text-white/70">{getLOName(loan.assignedLOId)}</span></div>
                    <div><span className="text-white/30">Processor:</span> <span className="text-white/70">{loan.processorId ? getProcessorName(loan.processorId) : "Unassigned"}</span></div>
                    <div><span className="text-white/30">Branch:</span> <span className="text-white/70">{getBranchName(loan.branchId)}</span></div>
                  </div>
                </div>
                {primaryBorrower && (
                  <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                    <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Borrower</h3>
                    <div className="space-y-2 text-[12px]">
                      <p className="text-white/70 font-medium">{primaryBorrower.fullName}</p>
                      <div><span className="text-white/30">Phone:</span> <span className="text-white/60">{primaryBorrower.phone}</span></div>
                      <div><span className="text-white/30">Email:</span> <span className="text-white/60">{primaryBorrower.email}</span></div>
                    </div>
                    <button onClick={() => navigate(`/admin/borrowers/${primaryBorrower.id}`)} className="text-[12px] text-[#e91e8c] font-bold hover:underline">View Profile →</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Milestones" && (
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
                <div className="space-y-0">
                  {loan.milestoneHistory.map((m, i) => (
                    <div key={m.stage} className="flex items-start gap-4 py-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          m.status === "completed" ? "bg-emerald-400 border-emerald-400" :
                          m.status === "current" ? "border-[#e91e8c] bg-transparent animate-pulse" :
                          "border-white/15 bg-transparent"
                        }`}>
                          {m.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          {m.status === "current" && <div className="w-2 h-2 rounded-full bg-[#e91e8c]" />}
                          {m.status === "upcoming" && <Circle className="w-3 h-3 text-white/15" />}
                        </div>
                        {i < loan.milestoneHistory.length - 1 && (
                          <div className={`w-0.5 h-8 ${m.status === "completed" ? "bg-emerald-400/30" : "bg-white/[0.06]"}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className={`text-[13px] font-bold ${m.status === "current" ? "text-[#e91e8c]" : m.status === "completed" ? "text-white/70" : "text-white/25"}`}>{m.stage}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-white/25">
                          {m.date && <span>{new Date(m.date).toLocaleDateString()}</span>}
                          <span>{getLOName(m.owner)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Borrowers" && (
              <div className="space-y-3">
                {loanBorrowers.length === 0 && <p className="text-white/25 text-sm text-center py-8">No borrowers linked to this file</p>}
                {loanBorrowers.map((bw) => (
                  <div key={bw.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-white/80">{bw.fullName}</p>
                      <p className="text-[12px] text-white/35">{bw.phone} · {bw.email}</p>
                    </div>
                    <button onClick={() => navigate(`/admin/borrowers/${bw.id}`)} className="text-[12px] text-[#e91e8c] font-bold">View Profile →</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="space-y-3">
                <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
                  <textarea placeholder="Add a note..." className="w-full h-20 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none resize-none" />
                  <div className="flex justify-end mt-2">
                    <button className="h-8 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold">Add Note</button>
                  </div>
                </div>
                {loanNotes.length === 0 && <p className="text-white/25 text-sm text-center py-6">No notes yet</p>}
                {loanNotes.map((n) => (
                  <div key={n.id} className={`bg-[#111] border ${n.pinned ? "border-amber-400/20" : "border-white/[0.06]"} rounded-xl p-4`}>
                    <p className="text-[13px] text-white/60">{n.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-white/25">
                      <span>{n.author}</span>
                      <span>·</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                      {n.pinned && <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[9px] font-bold">PINNED</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Timeline" && (
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
                {loanActivities.length === 0 && <p className="text-white/25 text-sm text-center py-6">No activity yet</p>}
                {loanActivities.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-3 border-b border-white/[0.03] last:border-0">
                    <Clock className="w-3.5 h-3.5 text-white/15 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-white/50">{a.description}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-[280px] flex-shrink-0 space-y-3">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4 space-y-3 sticky top-20">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/25">Summary</h4>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between"><span className="text-white/30">Stage</span><StatusBadge status={loan.stage} /></div>
                <div className="flex justify-between"><span className="text-white/30">Days in Stage</span><span className="text-white/60 font-medium">{Math.floor((Date.now() - new Date(loan.updatedAt).getTime()) / 86400000)}</span></div>
                <div className="flex justify-between"><span className="text-white/30">Est. Close</span><span className="text-white/60">{loan.estimatedClose ? new Date(loan.estimatedClose).toLocaleDateString() : "TBD"}</span></div>
                <div className="flex justify-between"><span className="text-white/30">LO</span><span className="text-white/60">{getLOName(loan.assignedLOId)}</span></div>
                <div className="flex justify-between"><span className="text-white/30">Processor</span><span className="text-white/60">{loan.processorId ? getProcessorName(loan.processorId) : "—"}</span></div>
              </div>
              {loan.flags.length > 0 && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/60 mb-2">Flags</p>
                  {loan.flags.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-[11px] text-amber-400">
                      <AlertTriangle className="w-3 h-3" /> {f.replace("_", " ")}
                    </div>
                  ))}
                </div>
              )}
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <button className="w-full h-8 rounded-lg bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5"><Phone className="w-3 h-3" /> Call Borrower</button>
                <button className="w-full h-8 rounded-lg bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-1.5"><Mail className="w-3 h-3" /> Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
