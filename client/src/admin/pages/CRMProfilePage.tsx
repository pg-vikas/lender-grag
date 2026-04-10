import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { crmRecords, borrowers, loanFiles, leads, loanOfficers, processors, branches, notes as allNotes, activities } from "../data/mockData";
import { commThreads, commMessages, tasks, documents, esignPackages, conditions, timelineEvents, getUserName } from "../data/mockPhase2Data";
import { complianceFlags } from "../data/mockPhase3Data";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, MessageSquare, Building2, User, MapPin, Edit2,
  Send, Paperclip, Clock, CheckCircle2, Circle, AlertTriangle, Plus,
  FileText, PenTool, ShieldAlert, ChevronRight, ChevronDown,
  Bold, Italic, Underline, Link2, Image, Tag, ExternalLink, CalendarClock
} from "lucide-react";

const commTabs = ["Email", "SMS", "Call"] as const;
const activityFilters = ["All Activities", "Communications", "Documents", "Tasks", "Stage Changes"] as const;

function priorityColor(p: string) {
  switch (p) {
    case "Urgent": return "bg-red-400/10 text-red-400";
    case "High": return "bg-orange-400/10 text-orange-400";
    case "Medium": return "bg-amber-400/10 text-amber-400";
    case "Low": return "bg-blue-400/10 text-blue-400";
    default: return "bg-white/[0.06] text-white/40";
  }
}

function taskStatusIcon(s: string) {
  switch (s) {
    case "Completed": return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
    case "In Progress": return <Circle className="w-3.5 h-3.5 text-cyan-400" />;
    case "Overdue": return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    case "Waiting": return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    default: return <Circle className="w-3.5 h-3.5 text-white/20" />;
  }
}

function timelineIcon(type: string) {
  if (type.includes("document")) return <FileText className="w-3.5 h-3.5" />;
  if (type.includes("esign")) return <PenTool className="w-3.5 h-3.5" />;
  if (type.includes("task")) return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (type.includes("message")) return <MessageSquare className="w-3.5 h-3.5" />;
  if (type.includes("condition")) return <ShieldAlert className="w-3.5 h-3.5" />;
  return <Circle className="w-3.5 h-3.5" />;
}

function timelineColor(type: string) {
  if (type.includes("document")) return "text-blue-400 bg-blue-400/10";
  if (type.includes("esign")) return "text-purple-400 bg-purple-400/10";
  if (type.includes("task")) return "text-green-400 bg-green-400/10";
  if (type.includes("message")) return "text-cyan-400 bg-cyan-400/10";
  if (type.includes("condition")) return "text-amber-400 bg-amber-400/10";
  return "text-white/40 bg-white/[0.06]";
}

export default function CRMProfilePage() {
  const [, params] = useRoute("/admin/crm/:recordId");
  const [, navigate] = useLocation();
  const [activeCommTab, setActiveCommTab] = useState<string>("Email");
  const [activityFilter, setActivityFilter] = useState<string>("All Activities");
  const [messageText, setMessageText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [contactsExpanded, setContactsExpanded] = useState(true);

  const recordId = params?.recordId || "";
  const crmRecord = crmRecords.find(r => r.id === recordId);

  if (!crmRecord) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">Client record not found</p>
          <button onClick={() => navigate("/admin/crm")} className="mt-3 text-[#e91e8c] text-sm font-medium" data-testid="button-back-crm">Back to CRM</button>
        </div>
      </AppShell>
    );
  }

  const isLead = crmRecord.recordType === "Lead";
  const isBorrower = crmRecord.recordType === "Borrower";

  const lead = isLead ? leads.find(l => l.id === recordId) : null;
  const borrower = isBorrower ? borrowers.find(b => b.id === recordId) : null;
  const loanFile = borrower ? loanFiles.find(lf => lf.id === borrower.loanFileId) : null;

  const assignedLO = isLead && lead ? loanOfficers.find(lo => lo.id === lead.assignedLOId) : borrower ? loanOfficers.find(lo => lo.id === borrower.assignedLOId) : null;
  const assignedProcessor = borrower ? processors.find(p => p.id === borrower.processorId) : null;
  const branchInfo = isLead && lead ? branches.find(b => b.id === lead.branchId) : borrower ? branches.find(b => b.id === borrower.branchId) : null;

  const clientThreads = commThreads.filter(t => t.borrowerId === recordId);
  const clientMessages = commMessages.filter(m => clientThreads.some(t => t.id === m.threadId));
  const channelMessages = clientMessages.filter(m => {
    if (activeCommTab === "Email") return m.channel === "email";
    if (activeCommTab === "SMS") return m.channel === "sms";
    return m.channel === "internal";
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const clientTasks = tasks.filter(t => t.borrowerId === recordId);
  const clientDocs = documents.filter(d => d.borrowerId === recordId);
  const clientEsigns = esignPackages.filter(e => e.borrowerId === recordId);
  const clientConditions = conditions.filter(c => c.borrowerId === recordId);
  const clientFlags = complianceFlags.filter(f => f.borrowerId === recordId);
  const clientNotes = allNotes.filter(n => n.entityId === recordId);
  const clientActivities = activities.filter(a => a.entityId === recordId);

  const clientTimeline = timelineEvents
    .filter(te => te.linkedObjectId === recordId || (loanFile && te.linkedObjectId === loanFile.id))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredTimeline = clientTimeline.filter(te => {
    if (activityFilter === "Communications") return te.type.includes("message");
    if (activityFilter === "Documents") return te.type.includes("document") || te.type.includes("esign");
    if (activityFilter === "Tasks") return te.type.includes("task");
    if (activityFilter === "Stage Changes") return te.type.includes("condition") || te.type.includes("stage");
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/crm")} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[13px] transition-colors" data-testid="button-back-crm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-[11px] text-white/35 uppercase tracking-wider">
            <span>CRM</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/50">Client Details</span>
          </div>
        </div>

        <h1 className="text-xl font-black text-white tracking-tight" data-testid="text-client-name">
          Client — {crmRecord.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <button onClick={() => setDetailsExpanded(!detailsExpanded)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors" data-testid="button-toggle-details">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#e91e8c]" />
                  <span className="text-sm font-semibold text-white">Contact Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-white/20 hover:text-white/50 transition-colors" onClick={e => e.stopPropagation()} data-testid="button-edit-details">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${detailsExpanded ? "" : "-rotate-90"}`} />
                </div>
              </button>
              <AnimatePresence>
                {detailsExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white">{crmRecord.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{crmRecord.name}</p>
                          <p className="text-[10px] text-white/30">No communication yet</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/40">Status</span>
                          <StatusBadge status={crmRecord.status} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/40">Type</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLead ? "bg-[#e91e8c]/10 text-[#e91e8c]" : "bg-cyan-400/10 text-cyan-400"}`}>{crmRecord.recordType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/40">Source</span>
                          <span className="text-xs text-white/50">{crmRecord.source}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-white/40">Assigned to</span>
                          <p className="text-xs text-white/60 mt-0.5">{assignedLO?.fullName || crmRecord.assignedLO}</p>
                        </div>
                        {lead?.estimatedLoanAmount && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Est. Loan</span>
                            <span className="text-xs text-green-400 font-mono">${lead.estimatedLoanAmount.toLocaleString()}</span>
                          </div>
                        )}
                        {lead?.loanPurpose && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Purpose</span>
                            <span className="text-xs text-white/50">{lead.loanPurpose}</span>
                          </div>
                        )}
                        {loanFile && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/40">Loan File</span>
                            <button onClick={() => navigate(`/admin/pipeline/${loanFile.id}`)} className="text-xs text-[#e91e8c] hover:underline flex items-center gap-1" data-testid="link-loan-file">
                              {loanFile.id} <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {crmRecord.tags.length > 0 && (
                          <div>
                            <span className="text-[11px] text-white/40">Tags</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crmRecord.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-full bg-[#e91e8c]/10 text-[#e91e8c] text-[9px] font-bold flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5" /> {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <button onClick={() => setContactsExpanded(!contactsExpanded)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors" data-testid="button-toggle-contacts">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-sm font-semibold text-white">Contacts & Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-5 h-5 rounded bg-[#e91e8c]/10 flex items-center justify-center text-[#e91e8c] hover:bg-[#e91e8c]/20 transition-colors" onClick={e => e.stopPropagation()} data-testid="button-add-contact">
                    <Plus className="w-3 h-3" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${contactsExpanded ? "" : "-rotate-90"}`} />
                </div>
              </button>
              <AnimatePresence>
                {contactsExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-[10px] text-white/35 uppercase tracking-wider font-bold">Primary Contact</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#e91e8c]">{crmRecord.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/70 font-medium truncate">{crmRecord.name}</p>
                            <p className="text-[10px] text-white/30">{crmRecord.recordType}</p>
                          </div>
                        </div>
                        <div className="pl-10 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Phone className="w-3 h-3" />
                            <span>{crmRecord.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{crmRecord.email}</span>
                          </div>
                          {(borrower?.address && borrower.address !== "TBD") && (
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{borrower.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/[0.09] pt-3">
                        <p className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-2">Team Members</p>
                        <div className="space-y-2">
                          {assignedLO && (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-400/10 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-blue-400">{assignedLO.fullName.split(" ").map(n => n[0]).join("")}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/60 truncate">{assignedLO.fullName}</p>
                                <p className="text-[10px] text-white/25">Loan Officer</p>
                              </div>
                            </div>
                          )}
                          {assignedProcessor && (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-cyan-400/10 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-cyan-400">{assignedProcessor.fullName.split(" ").map(n => n[0]).join("")}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/60 truncate">{assignedProcessor.fullName}</p>
                                <p className="text-[10px] text-white/25">Processor</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {branchInfo && (
                        <div className="border-t border-white/[0.09] pt-3">
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Building2 className="w-3 h-3" />
                            <span>{branchInfo.name} — {branchInfo.location}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isBorrower && (
              <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" /> Quick Stats
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.05] rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-blue-400">{clientDocs.length}</p>
                    <p className="text-[9px] text-white/30">Documents</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-purple-400">{clientEsigns.length}</p>
                    <p className="text-[9px] text-white/30">E-Signs</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-amber-400">{clientConditions.length}</p>
                    <p className="text-[9px] text-white/30">Conditions</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-2.5 text-center">
                    <p className={`text-lg font-bold ${clientFlags.filter(f => f.status === "Open").length > 0 ? "text-red-400" : "text-green-400"}`}>{clientFlags.filter(f => f.status === "Open").length}</p>
                    <p className="text-[9px] text-white/30">Open Flags</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.09]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Communications</span>
                </div>
                <div className="flex gap-1">
                  {commTabs.map(tab => (
                    <button key={tab} onClick={() => setActiveCommTab(tab)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeCommTab === tab ? "bg-[#e91e8c]/20 text-[#e91e8c]" : "bg-white/[0.04] text-white/30 hover:text-white/50"}`} data-testid={`tab-comm-${tab.toLowerCase()}`}>{tab}</button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-b border-white/[0.09] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-1 block">To *</label>
                    <input defaultValue={crmRecord.email} className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white outline-none" data-testid="input-comm-to" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-1 block">From *</label>
                    <input defaultValue={assignedLO ? `${assignedLO.fullName} (${assignedLO.email})` : ""} className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white/50 outline-none" readOnly data-testid="input-comm-from" />
                  </div>
                </div>
                {activeCommTab === "Email" && (
                  <div>
                    <label className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-1 block">Subject *</label>
                    <input placeholder="What is this email about?" className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-white/20" data-testid="input-comm-subject" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-1 block">Message *</label>
                  {activeCommTab === "Email" && (
                    <div className="flex items-center gap-1 mb-1.5 border-b border-white/[0.04] pb-1.5">
                      <button className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/50"><Bold className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/50"><Italic className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/50"><Underline className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/50"><Link2 className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/50"><Image className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  <textarea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-white/20 resize-none h-24"
                    data-testid="input-comm-message"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors" data-testid="button-attach-file">
                    <Paperclip className="w-3.5 h-3.5" /> Attach Files
                  </button>
                  <div className="flex items-center gap-2">
                    {(activeCommTab === "Email" || activeCommTab === "SMS") && (
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.09] text-white/50 text-xs font-medium hover:bg-white/[0.1] hover:text-white/70 transition-colors" data-testid="button-schedule-message">
                        <CalendarClock className="w-3.5 h-3.5" /> Schedule
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e91e8c] text-white text-xs font-medium hover:bg-[#e91e8c]/80 transition-colors" data-testid="button-send-message">
                      <Send className="w-3.5 h-3.5" /> Send {activeCommTab}
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {channelMessages.length > 0 ? channelMessages.map(msg => (
                  <div key={msg.id} className="p-4 border-b border-white/[0.05] hover:bg-white/[0.01] transition-colors" data-testid={`msg-${msg.id}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-white/40">{msg.senderName.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-white/70">{msg.senderName}</span>
                          <span className="text-[10px] text-white/20">{new Date(msg.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center">
                    <MessageSquare className="w-6 h-6 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/25">No {activeCommTab.toLowerCase()} messages yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.09]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">Tasks</span>
                  <span className="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">{clientTasks.length}</span>
                </div>
                <button onClick={() => setShowAddTask(!showAddTask)} className="w-6 h-6 rounded bg-[#e91e8c]/10 flex items-center justify-center text-[#e91e8c] hover:bg-[#e91e8c]/20 transition-colors" data-testid="button-add-task">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {clientTasks.length > 0 ? clientTasks.map(task => (
                  <div key={task.id} className="px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors cursor-pointer" data-testid={`task-item-${task.id}`}>
                    <div className="flex items-start gap-2.5">
                      {taskStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 font-medium truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${priorityColor(task.priority)}`}>{task.priority}</span>
                          <span className="text-[10px] text-white/25">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center">
                    <CheckCircle2 className="w-6 h-6 text-white/10 mx-auto mb-2" />
                    <p className="text-[11px] text-white/25">No tasks found</p>
                    <p className="text-[10px] text-white/15 mt-0.5">Click + to create a task</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.09]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Activity Log</span>
                </div>
                <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="bg-white/[0.04] border border-white/[0.09] rounded-lg px-2 py-1 text-[10px] text-white/40 outline-none" data-testid="select-activity-filter">
                  {activityFilters.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredTimeline.length > 0 ? filteredTimeline.map(te => (
                  <div key={te.id} className="px-4 py-3 border-b border-white/[0.05]" data-testid={`activity-${te.id}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${timelineColor(te.type)}`}>
                        {timelineIcon(te.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 font-medium">{te.title}</p>
                        <p className="text-[11px] text-white/35 mt-0.5 line-clamp-2">{te.detail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-white/20">by {getUserName(te.userId)}</span>
                          <span className="text-[10px] text-white/15">{new Date(te.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center">
                    <Clock className="w-6 h-6 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/25">No activity yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.09]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Notes</span>
                </div>
                <button className="text-xs text-[#e91e8c] font-medium hover:text-[#e91e8c]/80 transition-colors" data-testid="button-add-note">+ Add New</button>
              </div>
              <div className="p-4 border-b border-white/[0.09]">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write a note..."
                  className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-white/20 resize-none h-16"
                  data-testid="input-note"
                />
                {noteText.trim() && (
                  <div className="flex justify-end mt-2">
                    <button className="px-3 py-1.5 rounded-lg bg-[#e91e8c] text-white text-[11px] font-medium" data-testid="button-save-note">Save Note</button>
                  </div>
                )}
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {clientNotes.length > 0 ? clientNotes.map(note => (
                  <div key={note.id} className="px-4 py-3 border-b border-white/[0.05]" data-testid={`note-${note.id}`}>
                    <p className="text-xs text-white/50 leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-white/20">{note.author}</span>
                      <span className="text-[10px] text-white/15">{new Date(note.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                )) : clientActivities.length > 0 ? clientActivities.slice(0, 5).map((act, i) => (
                  <div key={i} className="px-4 py-3 border-b border-white/[0.05]">
                    <p className="text-xs text-white/50">{act.description}</p>
                    <span className="text-[10px] text-white/20">{new Date(act.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                )) : (
                  <div className="py-8 text-center">
                    <FileText className="w-5 h-5 text-white/10 mx-auto mb-2" />
                    <p className="text-[11px] text-white/20">No notes yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
