import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { loanFiles, borrowers, getLOName, getProcessorName, getBranchName, notes as allNotes, activities } from "../data/mockData";
import { documents, esignPackages, conditions, commThreads, commMessages, tasks, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { useLocation, useRoute } from "wouter";
import {
  ArrowLeft, Phone, Mail, FileText, StickyNote, ListChecks, ChevronRight,
  CheckCircle2, Circle, Clock, AlertTriangle, Calendar, User, MapPin, DollarSign,
  Building, Percent, PenTool, ClipboardCheck, CheckSquare, Eye, Send, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = ["Overview", "Milestones", "Borrowers", "Notes", "Timeline", "Documents", "E-Sign", "Conditions", "Communications", "Tasks"];

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
            <div className="flex gap-1 border-b border-white/[0.06] pb-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab ? "border-[#e91e8c] text-white" : "border-transparent text-white/35 hover:text-white/60"
                  }`}
                  data-testid={`tab-${tab.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {tab}
                </button>
              ))}
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

            {activeTab === "Documents" && (() => {
              const loanDocs = documents.filter(d => d.loanFileId === loan.id);
              return (
                <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/[0.06]">{["Document", "Borrower", "Category", "Status", "Requested", "Uploaded"].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody>
                      {loanDocs.map(doc => (
                        <tr key={doc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-[13px] font-medium text-white flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-white/20" /> {doc.name}</td>
                          <td className="px-4 py-3 text-[12px] text-white/40">{getBorrowerName(doc.borrowerId)}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 text-[10px]">{doc.category}</span></td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.status === "Accepted" ? "bg-green-400/10 text-green-400" : doc.status === "Needs Revision" ? "bg-red-400/10 text-red-400" : doc.status === "Requested" ? "bg-amber-400/10 text-amber-400" : "bg-cyan-400/10 text-cyan-400"}`}>{doc.status}</span></td>
                          <td className="px-4 py-3 text-[11px] text-white/30">{new Date(doc.requestedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-[11px] text-white/30">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loanDocs.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No documents for this loan</p>}
                </div>
              );
            })()}

            {activeTab === "E-Sign" && (() => {
              const loanEsign = esignPackages.filter(p => p.loanFileId === loan.id);
              return (
                <div className="space-y-3">
                  {loanEsign.map(pkg => (
                    <div key={pkg.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PenTool className="w-4 h-4 text-white/20" />
                        <div>
                          <p className="text-[13px] font-semibold text-white">{pkg.name}</p>
                          <p className="text-[11px] text-white/25">{getBorrowerName(pkg.borrowerId)} · {pkg.sentAt ? new Date(pkg.sentAt).toLocaleDateString() : "Draft"} · {pkg.recipientCount} recipients</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pkg.status === "Completed" ? "bg-green-400/10 text-green-400" : pkg.status === "Expired" ? "bg-red-400/10 text-red-400" : pkg.status === "Draft" ? "bg-white/[0.06] text-white/40" : "bg-cyan-400/10 text-cyan-400"}`}>{pkg.status}</span>
                    </div>
                  ))}
                  {loanEsign.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No e-sign packages for this loan</p>}
                </div>
              );
            })()}

            {activeTab === "Conditions" && (() => {
              const loanConds = conditions.filter(c => c.loanFileId === loan.id);
              return (
                <div className="space-y-3">
                  {loanConds.map(cond => (
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
                      </div>
                    </div>
                  ))}
                  {loanConds.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No conditions for this loan</p>}
                </div>
              );
            })()}

            {activeTab === "Communications" && (() => {
              const loanThreads = commThreads.filter(t => t.loanFileId === loan.id);
              return (
                <div className="space-y-3">
                  {loanThreads.map(thread => {
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
                  {loanThreads.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No communication threads for this loan</p>}
                </div>
              );
            })()}

            {activeTab === "Tasks" && (() => {
              const loanTasks = tasks.filter(t => t.loanFileId === loan.id);
              return (
                <div className="space-y-3">
                  {loanTasks.map(task => (
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
                  {loanTasks.length === 0 && <p className="py-8 text-center text-white/25 text-[13px]">No tasks for this loan</p>}
                </div>
              );
            })()}
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
