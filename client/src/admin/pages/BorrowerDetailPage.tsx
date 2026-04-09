import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { borrowers, loanFiles, getLOName, getProcessorName, getBranchName, notes as allNotes, activities } from "../data/mockData";
import { documents, esignPackages, conditions, commThreads, commMessages, tasks, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Phone, Mail, User, MapPin, FileText, Clock, CheckCircle2, Circle, MessageSquare, ListChecks, StickyNote, PenTool, ClipboardCheck, CheckSquare, AlertTriangle, Eye, Send } from "lucide-react";

const tabs = ["Overview", "Loan Status", "Timeline", "Notes", "Documents", "E-Sign", "Conditions", "Communications", "Tasks"];

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

        <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab ? "border-[#e91e8c] text-white" : "border-transparent text-white/35 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
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

        {activeTab === "Documents" && (() => {
          const bwDocs = documents.filter(d => d.borrowerId === borrower.id);
          return (
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/[0.06]">{["Document", "Category", "Status", "Requested", "Uploaded"].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>)}</tr></thead>
                <tbody>
                  {bwDocs.map(doc => (
                    <tr key={doc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-[13px] font-medium text-white flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-white/20" /> {doc.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 text-[10px]">{doc.category}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.status === "Accepted" ? "bg-green-400/10 text-green-400" : doc.status === "Needs Revision" ? "bg-red-400/10 text-red-400" : doc.status === "Requested" ? "bg-amber-400/10 text-amber-400" : "bg-cyan-400/10 text-cyan-400"}`}>{doc.status}</span></td>
                      <td className="px-4 py-3 text-[11px] text-white/30">{new Date(doc.requestedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[11px] text-white/30">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bwDocs.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No documents for this borrower</p>}
            </div>
          );
        })()}

        {activeTab === "E-Sign" && (() => {
          const bwEsign = esignPackages.filter(p => p.borrowerId === borrower.id);
          return (
            <div className="space-y-3">
              {bwEsign.map(pkg => (
                <div key={pkg.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PenTool className="w-4 h-4 text-white/20" />
                    <div>
                      <p className="text-[13px] font-semibold text-white">{pkg.name}</p>
                      <p className="text-[11px] text-white/25">{pkg.sentAt ? `Sent ${new Date(pkg.sentAt).toLocaleDateString()}` : "Draft"} · {pkg.recipientCount} recipients</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pkg.status === "Completed" ? "bg-green-400/10 text-green-400" : pkg.status === "Expired" ? "bg-red-400/10 text-red-400" : pkg.status === "Draft" ? "bg-white/[0.06] text-white/40" : "bg-cyan-400/10 text-cyan-400"}`}>{pkg.status}</span>
                </div>
              ))}
              {bwEsign.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No e-sign packages for this borrower</p>}
            </div>
          );
        })()}

        {activeTab === "Conditions" && (() => {
          const bwConds = conditions.filter(c => c.borrowerId === borrower.id);
          return (
            <div className="space-y-3">
              {bwConds.map(cond => (
                <div key={cond.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-white">{cond.title}</p>
                      <p className="text-[12px] text-white/35 mt-1">{cond.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cond.priority === "Urgent" ? "bg-red-500/10 text-red-500" : cond.priority === "High" ? "bg-amber-400/10 text-amber-400" : "bg-cyan-400/10 text-cyan-400"}`}>{cond.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cond.status === "Cleared" ? "bg-green-400/10 text-green-400" : cond.status === "Overdue" ? "bg-red-500/10 text-red-500" : cond.status === "Requested" ? "bg-amber-400/10 text-amber-400" : "bg-cyan-400/10 text-cyan-400"}`}>{cond.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/25">
                    <span>Due: {new Date(cond.dueDate).toLocaleDateString()}</span>
                    <span>Reviewer: {getUserName(cond.assignedReviewerId)}</span>
                    {cond.linkedDocumentIds.length > 0 && <span className="flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> {cond.linkedDocumentIds.length} docs</span>}
                  </div>
                </div>
              ))}
              {bwConds.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No conditions for this borrower</p>}
            </div>
          );
        })()}

        {activeTab === "Communications" && (() => {
          const bwThreads = commThreads.filter(t => t.borrowerId === borrower.id);
          return (
            <div className="space-y-3">
              {bwThreads.map(thread => {
                const msgs = commMessages.filter(m => m.threadId === thread.id);
                const lastMsg = msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                return (
                  <div key={thread.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`w-3.5 h-3.5 ${thread.channel === "sms" ? "text-green-400" : thread.channel === "email" ? "text-cyan-400" : "text-amber-400"}`} />
                        <span className="text-[13px] font-semibold text-white">{thread.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 text-[9px] font-medium">{thread.channel.toUpperCase()}</span>
                        {thread.unreadCount > 0 && <span className="w-4 h-4 rounded-full bg-[#e91e8c] text-white text-[9px] font-bold flex items-center justify-center">{thread.unreadCount}</span>}
                      </div>
                    </div>
                    {lastMsg && <p className="text-[12px] text-white/35 truncate">{lastMsg.senderName}: {lastMsg.content}</p>}
                    <p className="text-[10px] text-white/15 mt-1">{new Date(thread.lastMessageAt).toLocaleString()}</p>
                  </div>
                );
              })}
              {bwThreads.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No communication threads for this borrower</p>}
            </div>
          );
        })()}

        {activeTab === "Tasks" && (() => {
          const bwTasks = tasks.filter(t => t.borrowerId === borrower.id);
          return (
            <div className="space-y-3">
              {bwTasks.map(task => (
                <div key={task.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                  {task.status === "Completed" ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> : task.status === "Overdue" ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-white/15 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-[13px] font-medium ${task.status === "Completed" ? "text-white/30 line-through" : "text-white"}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-white/25">
                      <span>{getUserName(task.assigneeId)}</span>
                      <span>·</span>
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${task.priority === "Urgent" ? "bg-red-500/10 text-red-500" : task.priority === "High" ? "bg-amber-400/10 text-amber-400" : "bg-cyan-400/10 text-cyan-400"}`}>{task.priority}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${task.status === "Completed" ? "bg-green-400/10 text-green-400" : task.status === "Overdue" ? "bg-red-500/10 text-red-500" : "bg-white/[0.06] text-white/40"}`}>{task.status}</span>
                  </div>
                </div>
              ))}
              {bwTasks.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No tasks for this borrower</p>}
            </div>
          );
        })()}
      </div>
    </AppShell>
  );
}
