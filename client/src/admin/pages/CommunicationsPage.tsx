import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { commThreads, commMessages, cannedResponses, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { loanFiles, borrowers } from "../data/mockData";
import type { CommThread, CommMessage } from "../types";
import {
  Search, Mail, MessageSquare, Hash, Globe, Pin, Send, Paperclip,
  StickyNote, ChevronDown, User, Phone, MapPin, FileText, Clock,
  CheckSquare, Zap
} from "lucide-react";

const channelIcons = { sms: MessageSquare, email: Mail, internal: Hash, portal: Globe };

export default function CommunicationsPage() {
  const [selectedThread, setSelectedThread] = useState<CommThread | null>(commThreads[0]);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [showUnread, setShowUnread] = useState(false);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showCanned, setShowCanned] = useState(false);

  const filteredThreads = commThreads.filter(t => {
    if (channelFilter !== "all" && t.channel !== channelFilter) return false;
    if (showUnread && t.unreadCount === 0) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const threadMessages = selectedThread ? commMessages.filter(m => m.threadId === selectedThread.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];
  const threadBorrower = selectedThread ? borrowers.find(b => b.id === selectedThread.borrowerId) : null;
  const threadLoan = selectedThread ? loanFiles.find(l => l.id === selectedThread.loanFileId) : null;

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h1 className="text-xl font-black text-white" data-testid="text-comms-title">Communications</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowUnread(!showUnread)} className={`px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${showUnread ? "bg-[#e91e8c] text-white" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`} data-testid="button-toggle-unread">
              {commThreads.reduce((a, t) => a + t.unreadCount, 0)} unread {showUnread && "✓"}
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[280px_1fr_300px] gap-0 bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden min-h-0">
          <div className="border-r border-white/[0.06] flex flex-col">
            <div className="p-3 border-b border-white/[0.06] space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." className="w-full h-8 pl-8 pr-3 rounded-md bg-white/[0.04] border border-white/[0.06] text-white text-[12px] placeholder:text-white/20 focus:outline-none" data-testid="input-comm-search" />
              </div>
              <div className="flex gap-1">
                {["all", "sms", "email", "internal"].map(ch => (
                  <button key={ch} onClick={() => setChannelFilter(ch)} className={`flex-1 h-7 rounded-md text-[10px] font-bold transition-colors ${channelFilter === ch ? "bg-white/[0.08] text-white" : "text-white/20 hover:text-white/40"}`}>{ch === "all" ? "All" : ch.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map(thread => {
                const ChannelIcon = channelIcons[thread.channel];
                const lastMsg = commMessages.filter(m => m.threadId === thread.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                const isActive = selectedThread?.id === thread.id;
                return (
                  <div key={thread.id} onClick={() => setSelectedThread(thread)} className={`px-3 py-3 border-b border-white/[0.04] cursor-pointer transition-colors ${isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.02]"}`} data-testid={`thread-${thread.id}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ChannelIcon className={`w-3.5 h-3.5 flex-shrink-0 ${thread.channel === "sms" ? "text-green-400" : thread.channel === "email" ? "text-cyan-400" : "text-amber-400"}`} />
                        <span className="text-[12px] font-semibold text-white truncate">{thread.subject}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {thread.pinned && <Pin className="w-2.5 h-2.5 text-amber-400/50 rotate-45" />}
                        {thread.unreadCount > 0 && <span className="w-4 h-4 rounded-full bg-[#e91e8c] text-white text-[9px] font-bold flex items-center justify-center">{thread.unreadCount}</span>}
                      </div>
                    </div>
                    {lastMsg && <p className="text-[11px] text-white/25 mt-1 truncate pl-5">{lastMsg.content}</p>}
                    <div className="flex items-center gap-2 mt-1.5 pl-5">
                      <span className="text-[9px] text-white/15">{new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/15 text-[8px] font-medium">{thread.loanStage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col border-r border-white/[0.06]">
            {selectedThread ? (
              <>
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-bold text-white">{selectedThread.subject}</h3>
                    <p className="text-[11px] text-white/25">{selectedThread.channel.toUpperCase()} · {getBorrowerName(selectedThread.borrowerId)}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {threadMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isInternal ? "opacity-80" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.senderId.startsWith("bw") ? "bg-cyan-400/10" : "bg-[#e91e8c]/10"}`}>
                        <User className={`w-3.5 h-3.5 ${msg.senderId.startsWith("bw") ? "text-cyan-400" : "text-[#e91e8c]"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-semibold text-white">{msg.senderName}</span>
                          {msg.isInternal && <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[8px] font-bold">INTERNAL</span>}
                          <span className="text-[10px] text-white/20">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-[13px] text-white/60 leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-white/[0.06]">
                  <div className="flex gap-2 mb-2">
                    <button className="h-7 px-2.5 rounded-md bg-white/[0.04] text-white/25 text-[10px] font-medium flex items-center gap-1 hover:bg-white/[0.08]"><Paperclip className="w-3 h-3" /> Attach</button>
                    <button onClick={() => setShowCanned(!showCanned)} className="h-7 px-2.5 rounded-md bg-white/[0.04] text-white/25 text-[10px] font-medium flex items-center gap-1 hover:bg-white/[0.08]"><Zap className="w-3 h-3" /> Templates</button>
                    <button className="h-7 px-2.5 rounded-md bg-white/[0.04] text-white/25 text-[10px] font-medium flex items-center gap-1 hover:bg-white/[0.08]"><StickyNote className="w-3 h-3" /> Internal</button>
                  </div>
                  {showCanned && (
                    <div className="mb-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 max-h-32 overflow-y-auto">
                      {cannedResponses.map(cr => (
                        <button key={cr.id} onClick={() => { setMessageText(cr.content); setShowCanned(false); }} className="w-full text-left px-2 py-1.5 rounded-md text-[11px] text-white/40 hover:bg-white/[0.04] hover:text-white/60 transition-colors">
                          <span className="font-medium text-white/50">{cr.title}</span>
                          <span className="text-white/20 ml-1.5">— {cr.category}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Type a message..." className="flex-1 h-16 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] p-2.5 resize-none focus:outline-none focus:border-[#e91e8c]/40 placeholder:text-white/20" data-testid="input-comm-message" />
                    <button className="w-10 h-10 rounded-lg bg-[#e91e8c] flex items-center justify-center text-white hover:bg-[#d11a7a] transition-colors self-end" data-testid="button-send-message"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-[14px]">Select a thread</p>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-y-auto p-4 space-y-4">
            {threadBorrower ? (
              <>
                <div>
                  <h4 className="text-[11px] text-white/25 font-bold uppercase tracking-wider mb-3">Borrower</h4>
                  <div className="space-y-2">
                    <p className="text-[13px] font-semibold text-white">{threadBorrower.fullName}</p>
                    <div className="space-y-1 text-[11px] text-white/30">
                      <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {threadBorrower.phone}</p>
                      <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {threadBorrower.email}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {threadBorrower.address}</p>
                    </div>
                  </div>
                </div>

                {threadLoan && (
                  <div>
                    <h4 className="text-[11px] text-white/25 font-bold uppercase tracking-wider mb-3">Loan File</h4>
                    <div className="space-y-1.5 text-[11px] text-white/30">
                      <p className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {threadLoan.loanType} · {threadLoan.purpose}</p>
                      <p className="flex items-center gap-1.5"><span className="text-white/50 font-medium">${threadLoan.amount.toLocaleString()}</span> @ {threadLoan.rate}%</p>
                      <div className="px-2 py-1 rounded-md bg-white/[0.04] text-white/40 text-[10px] font-medium mt-1">{threadLoan.stage}</div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[11px] text-white/25 font-bold uppercase tracking-wider mb-3">Assigned LO</h4>
                  <p className="text-[12px] text-white/50">{getUserName(threadBorrower.assignedLOId)}</p>
                </div>

                <div>
                  <h4 className="text-[11px] text-white/25 font-bold uppercase tracking-wider mb-3">Quick Actions</h4>
                  <div className="space-y-1.5">
                    <button className="w-full h-8 rounded-md bg-white/[0.04] text-white/30 text-[11px] font-medium flex items-center gap-2 px-2.5 hover:bg-white/[0.08] transition-colors"><FileText className="w-3 h-3" /> View Loan File</button>
                    <button className="w-full h-8 rounded-md bg-white/[0.04] text-white/30 text-[11px] font-medium flex items-center gap-2 px-2.5 hover:bg-white/[0.08] transition-colors"><CheckSquare className="w-3 h-3" /> Create Task</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/15 text-[12px]">Select a thread to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
