import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { StatusBadge } from "../components/StatusBadge";
import { documents, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { loanFiles, borrowers } from "../data/mockData";
import { useAdminStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import type { Document, DocumentStatus, DocumentCategory } from "../types";
import {
  Search, Upload, FileDown, Filter, Eye, CheckCircle2, XCircle, RotateCcw,
  StickyNote, X, FileText, Clock, AlertTriangle, ChevronDown, Plus
} from "lucide-react";

const views = ["All Documents", "Requests Queue", "Under Review", "Accepted", "Needs Revision", "By Loan File", "By Borrower"] as const;
const categories: DocumentCategory[] = ["Identification", "Income", "Assets", "Tax Returns", "Bank Statements", "Purchase Contract", "Disclosures", "Title / Escrow", "Insurance", "Conditions", "Miscellaneous"];

function statusColor(s: DocumentStatus) {
  switch (s) {
    case "Accepted": return "bg-green-400/10 text-green-400";
    case "Under Review": return "bg-cyan-400/10 text-cyan-400";
    case "Uploaded": return "bg-blue-400/10 text-blue-400";
    case "Requested": return "bg-amber-400/10 text-amber-400";
    case "Borrower Received": return "bg-purple-400/10 text-purple-400";
    case "Needs Revision": return "bg-red-400/10 text-red-400";
    case "Rejected": return "bg-red-500/10 text-red-500";
  }
}

export default function DocumentsPage() {
  const [activeView, setActiveView] = useState<string>("All Documents");
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const [groupByLoan, setGroupByLoan] = useState<string | null>(null);
  const [groupByBorrower, setGroupByBorrower] = useState<string | null>(null);

  const filtered = documents.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !getBorrowerName(d.borrowerId).toLowerCase().includes(search.toLowerCase())) return false;
    if (activeView === "Requests Queue") return d.status === "Requested" || d.status === "Borrower Received";
    if (activeView === "Under Review") return d.status === "Under Review" || d.status === "Uploaded";
    if (activeView === "Accepted") return d.status === "Accepted";
    if (activeView === "Needs Revision") return d.status === "Needs Revision" || d.status === "Rejected";
    if (activeView === "By Loan File" && groupByLoan) return d.loanFileId === groupByLoan;
    if (activeView === "By Borrower" && groupByBorrower) return d.borrowerId === groupByBorrower;
    return true;
  });

  const uniqueLoanIds = [...new Set(documents.map(d => d.loanFileId))];
  const uniqueBorrowerIds = [...new Set(documents.map(d => d.borrowerId))];

  const stats = [
    { label: "Active Requests", value: documents.filter(d => d.status === "Requested" || d.status === "Borrower Received").length, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Pending Review", value: documents.filter(d => d.status === "Uploaded" || d.status === "Under Review").length, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Approved", value: documents.filter(d => d.status === "Accepted").length, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Needs Revision", value: documents.filter(d => d.status === "Needs Revision").length, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Missing Critical", value: documents.filter(d => d.status === "Requested" && ["Income", "Tax Returns", "Bank Statements"].includes(d.category)).length, color: "text-[#e91e8c]", bg: "bg-[#e91e8c]/10" },
    { label: "Total Documents", value: documents.length, color: "text-white/60", bg: "bg-white/[0.04]" },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white" data-testid="text-documents-title">Documents</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#e91e8c]/40 w-64" data-testid="input-doc-search" />
            </div>
            <button onClick={() => setShowUpload(true)} className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#d11a7a] transition-colors" data-testid="button-upload-doc">
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
            <button className="h-9 px-4 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium flex items-center gap-1.5 hover:bg-white/[0.1] transition-colors" data-testid="button-request-docs">
              <Plus className="w-3.5 h-3.5" /> Request Docs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[11px] text-white/30 font-medium">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 items-center">
          {views.map(v => (
            <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${activeView === v ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/50 hover:bg-white/[0.04]"}`}>{v}</button>
          ))}
          {activeView === "By Loan File" && (
            <select value={groupByLoan || ""} onChange={e => setGroupByLoan(e.target.value || null)} className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none ml-2">
              <option value="">All Loans</option>
              {uniqueLoanIds.map(id => { const lf = loanFiles.find(l => l.id === id); return <option key={id} value={id}>{lf?.propertyAddress?.split(",")[0] || id}</option>; })}
            </select>
          )}
          {activeView === "By Borrower" && (
            <select value={groupByBorrower || ""} onChange={e => setGroupByBorrower(e.target.value || null)} className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none ml-2">
              <option value="">All Borrowers</option>
              {uniqueBorrowerIds.map(id => <option key={id} value={id}>{getBorrowerName(id)}</option>)}
            </select>
          )}
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Document", "Borrower", "Loan", "Category", "Status", "Requested", "Uploaded", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => {
                  const loan = loanFiles.find(l => l.id === doc.loanFileId);
                  return (
                    <tr key={doc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedDoc(doc)} data-testid={`row-doc-${doc.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-white/20" />
                          <span className="text-[13px] font-medium text-white">{doc.name}</span>
                          {doc.notesCount > 0 && <span className="w-4 h-4 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-bold flex items-center justify-center">{doc.notesCount}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-white/50">{getBorrowerName(doc.borrowerId)}</td>
                      <td className="px-4 py-3 text-[12px] text-white/40">{loan?.propertyAddress?.split(",")[0] || doc.loanFileId}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] font-medium">{doc.category}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(doc.status)}`}>{doc.status}</span></td>
                      <td className="px-4 py-3 text-[11px] text-white/30">{new Date(doc.requestedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[11px] text-white/30">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button className="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="w-7 h-7 rounded-md bg-green-400/10 hover:bg-green-400/20 flex items-center justify-center text-green-400 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                          <button className="w-7 h-7 rounded-md bg-red-400/10 hover:bg-red-400/20 flex items-center justify-center text-red-400 transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-[14px] font-medium">No documents found</p>
              <p className="text-white/15 text-[12px] mt-1">Try adjusting your filters or upload a new document</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedDoc(null)}>
            <div className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[420px] bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-white">Document Review</h2>
                <button onClick={() => setSelectedDoc(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[11px] text-white/30 font-medium mb-1">File Name</p>
                  <p className="text-white font-semibold text-[14px]">{selectedDoc.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Category</p>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/50 text-[11px] font-medium">{selectedDoc.category}</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusColor(selectedDoc.status)}`}>{selectedDoc.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Borrower</p>
                    <p className="text-white/60 text-[13px]">{getBorrowerName(selectedDoc.borrowerId)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Loan File</p>
                    <p className="text-white/60 text-[13px]">{selectedDoc.loanFileId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Requested By</p>
                    <p className="text-white/60 text-[13px]">{getUserName(selectedDoc.requestedBy)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Requested At</p>
                    <p className="text-white/60 text-[13px]">{new Date(selectedDoc.requestedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedDoc.uploadedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-white/30 font-medium mb-1">Uploaded By</p>
                      <p className="text-white/60 text-[13px]">{getUserName(selectedDoc.uploadedBy)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/30 font-medium mb-1">Uploaded At</p>
                      <p className="text-white/60 text-[13px]">{new Date(selectedDoc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {selectedDoc.reviewNotes && (
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Review Notes</p>
                    <p className="text-white/60 text-[13px] bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">{selectedDoc.reviewNotes}</p>
                  </div>
                )}
                {selectedDoc.borrowerVisibleNotes && (
                  <div>
                    <p className="text-[11px] text-white/30 font-medium mb-1">Borrower Feedback</p>
                    <p className="text-amber-400/80 text-[13px] bg-amber-400/5 border border-amber-400/10 rounded-lg p-3">{selectedDoc.borrowerVisibleNotes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 h-9 rounded-lg bg-green-400/10 text-green-400 text-[12px] font-bold hover:bg-green-400/20 transition-colors flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                  <button className="flex-1 h-9 rounded-lg bg-amber-400/10 text-amber-400 text-[12px] font-bold hover:bg-amber-400/20 transition-colors flex items-center justify-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Revision</button>
                  <button className="flex-1 h-9 rounded-lg bg-red-400/10 text-red-400 text-[12px] font-bold hover:bg-red-400/20 transition-colors flex items-center justify-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowUpload(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[500px] bg-[#111] border border-white/[0.06] rounded-2xl p-6 mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-bold text-white">Upload Document</h2>
                <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-5 hover:border-[#e91e8c]/30 transition-colors">
                <Upload className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="text-white/40 text-[13px] font-medium">Drag & drop files here</p>
                <p className="text-white/20 text-[11px] mt-1">PDF, JPG, PNG up to 25MB</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-white/30 font-medium mb-1 block">Category</label>
                  <select className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] px-3 focus:outline-none focus:border-[#e91e8c]/40">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/30 font-medium mb-1 block">Borrower</label>
                    <select className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] px-3 focus:outline-none">
                      <option value="">Select borrower</option>
                      {borrowers.map(b => <option key={b.id} value={b.id}>{b.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 font-medium mb-1 block">Loan File</label>
                    <select className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] px-3 focus:outline-none">
                      <option value="">Select loan file</option>
                      {loanFiles.map(lf => <option key={lf.id} value={lf.id}>{lf.propertyAddress?.split(",")[0] || lf.id}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-white/30 font-medium mb-1 block">Internal Note</label>
                  <textarea className="w-full h-20 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] p-3 resize-none focus:outline-none focus:border-[#e91e8c]/40 placeholder:text-white/20" placeholder="Optional note..." />
                </div>
              </div>
              <button className="w-full h-10 mt-5 rounded-lg bg-[#e91e8c] text-white text-[13px] font-bold hover:bg-[#d11a7a] transition-colors" onClick={() => setShowUpload(false)}>Upload Document</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
