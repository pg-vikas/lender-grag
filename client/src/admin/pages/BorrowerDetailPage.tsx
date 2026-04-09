import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { borrowers, loanFiles, getLOName, getProcessorName, getBranchName, notes as allNotes, activities } from "../data/mockData";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Phone, Mail, User, MapPin, FileText, Clock, CheckCircle2, Circle, MessageSquare, ListChecks, StickyNote } from "lucide-react";

const tabs = ["Overview", "Loan Status", "Timeline", "Notes", "Tasks", "Documents"];

export default function BorrowerDetailPage() {
  const [, params] = useRoute("/admin/borrowers/:borrowerId");
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("Overview");

  const borrower = borrowers.find(b => b.id === params?.borrowerId);
  if (!borrower) return <AppShell><div className="text-center py-20 text-white/30">Borrower not found</div></AppShell>;

  const lf = loanFiles.find(l => l.id === borrower.loanFileId);
  const bwNotes = allNotes.filter(n => n.entityId === borrower.id && n.entityType === "borrower");
  const bwActivities = activities.filter(a => a.entityId === borrower.id);

  return (
    <AppShell>
      <div className="space-y-5">
        <button onClick={() => navigate("/admin/borrowers")} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[13px] transition-colors" data-testid="button-back-borrowers">
          <ArrowLeft className="w-4 h-4" /> Back to Borrowers
        </button>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{borrower.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[12px] text-white/40">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {borrower.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {borrower.email}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {borrower.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {lf && <StatusBadge status={lf.stage} />}
                  <span className="text-[11px] text-white/30">{getLOName(borrower.assignedLOId)}</span>
                  {borrower.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="h-9 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><Phone className="w-3 h-3" /> Call</button>
              <button className="h-9 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</button>
              <button className="h-9 px-3 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"><StickyNote className="w-3 h-3" /> Add Note</button>
              {lf && (
                <button onClick={() => navigate(`/admin/pipeline/${lf.id}`)} className="h-9 px-3 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-[12px] font-bold hover:bg-[#e91e8c]/20 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Open Loan File
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 border-b border-white/[0.06]">
          {tabs.map((tab) => {
            const disabled = ["Tasks", "Documents"].includes(tab);
            return (
              <button
                key={tab}
                onClick={() => !disabled && setActiveTab(tab)}
                disabled={disabled}
                className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all ${
                  activeTab === tab ? "border-[#e91e8c] text-white" : disabled ? "border-transparent text-white/15 cursor-not-allowed" : "border-transparent text-white/35 hover:text-white/60"
                }`}
              >
                {tab}{disabled && <span className="ml-1 text-[9px] text-white/15">P2</span>}
              </button>
            );
          })}
        </div>

        {activeTab === "Overview" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
              <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Personal Info</h3>
              <div className="space-y-2 text-[12px]">
                <div><span className="text-white/30">Name:</span> <span className="text-white/70">{borrower.fullName}</span></div>
                <div><span className="text-white/30">Phone:</span> <span className="text-white/70">{borrower.phone}</span></div>
                <div><span className="text-white/30">Email:</span> <span className="text-white/70">{borrower.email}</span></div>
                <div><span className="text-white/30">Address:</span> <span className="text-white/70">{borrower.address}</span></div>
              </div>
            </div>
            {lf && (
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Loan Summary</h3>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-white/30">Stage</span><StatusBadge status={lf.stage} /></div>
                  <div><span className="text-white/30">Type:</span> <span className="text-white/70">{lf.loanType} · {lf.purpose}</span></div>
                  <div><span className="text-white/30">Amount:</span> <span className="text-white/70">${lf.amount.toLocaleString()}</span></div>
                  <div><span className="text-white/30">Rate:</span> <span className="text-white/70">{lf.rate ? `${lf.rate}%` : "TBD"}</span></div>
                  <div><span className="text-white/30">Property:</span> <span className="text-white/70">{lf.propertyAddress}</span></div>
                </div>
              </div>
            )}
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
              <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Assignment</h3>
              <div className="space-y-2 text-[12px]">
                <div><span className="text-white/30">Loan Officer:</span> <span className="text-white/70">{getLOName(borrower.assignedLOId)}</span></div>
                <div><span className="text-white/30">Processor:</span> <span className="text-white/70">{getProcessorName(borrower.processorId)}</span></div>
                <div><span className="text-white/30">Branch:</span> <span className="text-white/70">{getBranchName(borrower.branchId)}</span></div>
              </div>
            </div>
            {lf && (
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-3">
                <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Milestones</h3>
                <div className="space-y-1">
                  {lf.milestoneHistory.slice(0, 5).map((m) => (
                    <div key={m.stage} className="flex items-center gap-2 text-[12px]">
                      {m.status === "completed" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : m.status === "current" ? <Circle className="w-3 h-3 text-[#e91e8c]" /> : <Circle className="w-3 h-3 text-white/10" />}
                      <span className={m.status === "upcoming" ? "text-white/20" : "text-white/50"}>{m.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Loan Status" && lf && (
          <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={lf.stage} />
                <span className="text-[12px] text-white/30">Est. Close: {lf.estimatedClose ? new Date(lf.estimatedClose).toLocaleDateString() : "TBD"}</span>
              </div>
              {lf.milestoneHistory.map((m, i) => (
                <div key={m.stage} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      m.status === "completed" ? "bg-emerald-400 border-emerald-400" :
                      m.status === "current" ? "border-[#e91e8c] animate-pulse" : "border-white/10"
                    }`}>
                      {m.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      {m.status === "current" && <div className="w-2 h-2 rounded-full bg-[#e91e8c]" />}
                    </div>
                    {i < lf.milestoneHistory.length - 1 && <div className={`w-0.5 h-8 ${m.status === "completed" ? "bg-emerald-400/30" : "bg-white/[0.06]"}`} />}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-[13px] font-bold ${m.status === "current" ? "text-[#e91e8c]" : m.status === "completed" ? "text-white/70" : "text-white/20"}`}>{m.stage}</p>
                    {m.date && <p className="text-[11px] text-white/25 mt-0.5">{new Date(m.date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
            {bwActivities.length === 0 && <p className="text-center py-8 text-white/25 text-sm">No activity yet</p>}
            {bwActivities.map((a) => (
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

        {activeTab === "Notes" && (
          <div className="space-y-3">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
              <textarea placeholder="Add a note..." className="w-full h-20 bg-transparent text-white text-[13px] placeholder:text-white/25 focus:outline-none resize-none" />
              <div className="flex justify-end mt-2">
                <button className="h-8 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold">Add Note</button>
              </div>
            </div>
            {bwNotes.length === 0 && <p className="text-center py-6 text-white/25 text-sm">No notes yet</p>}
            {bwNotes.map((n) => (
              <div key={n.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
                <p className="text-[13px] text-white/60">{n.content}</p>
                <p className="text-[11px] text-white/25 mt-2">{n.author} · {new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
