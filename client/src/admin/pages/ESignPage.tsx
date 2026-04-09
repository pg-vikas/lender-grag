import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { esignPackages, esignFields, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { loanFiles, borrowers } from "../data/mockData";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { ESignPackage, ESignStatus, ESignField } from "../types";
import {
  Search, Plus, FileText, Filter, Eye, Send, CheckCircle2, Clock, AlertTriangle,
  X, ChevronRight, ChevronLeft, PenTool, Square, Type, Calendar, Hash, User,
  ZoomIn, ZoomOut, GripVertical, Layers
} from "lucide-react";

function signStatusColor(s: ESignStatus) {
  switch (s) {
    case "Draft": return "bg-white/[0.06] text-white/40";
    case "Sent": return "bg-cyan-400/10 text-cyan-400";
    case "Viewed": return "bg-blue-400/10 text-blue-400";
    case "In Progress": return "bg-amber-400/10 text-amber-400";
    case "Completed": return "bg-green-400/10 text-green-400";
    case "Expired": return "bg-red-400/10 text-red-400";
    case "Failed": return "bg-red-500/10 text-red-500";
  }
}

const fieldTypes = [
  { type: "signature", icon: PenTool, label: "Signature" },
  { type: "initials", icon: Hash, label: "Initials" },
  { type: "date_signed", icon: Calendar, label: "Date Signed" },
  { type: "date", icon: Calendar, label: "Date" },
  { type: "full_name", icon: User, label: "Full Name" },
  { type: "text", icon: Type, label: "Text Field" },
  { type: "checkbox", icon: Square, label: "Checkbox" },
] as const;

export default function ESignPage() {
  const [search, setSearch] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<ESignPackage | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderPage, setBuilderPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const stats = [
    { label: "Drafts", value: esignPackages.filter(p => p.status === "Draft").length, color: "text-white/40" },
    { label: "Sent", value: esignPackages.filter(p => p.status === "Sent").length, color: "text-cyan-400" },
    { label: "Viewed", value: esignPackages.filter(p => p.status === "Viewed").length, color: "text-blue-400" },
    { label: "In Progress", value: esignPackages.filter(p => p.status === "In Progress").length, color: "text-amber-400" },
    { label: "Completed", value: esignPackages.filter(p => p.status === "Completed").length, color: "text-green-400" },
    { label: "Expired", value: esignPackages.filter(p => p.status === "Expired").length, color: "text-red-400" },
    { label: "Failed", value: esignPackages.filter(p => p.status === "Failed").length, color: "text-red-500" },
  ];

  const filtered = esignPackages.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !getBorrowerName(p.borrowerId).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (showBuilder) {
    const draftPkg = esignPackages.find(p => p.status === "Draft");
    const fields = esignFields.filter(f => f.packageId === (draftPkg?.id || "es-7"));
    const pageFields = fields.filter(f => f.page === builderPage);
    const totalPages = 3;

    return (
      <AppShell>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowBuilder(false)} className="flex items-center gap-1 text-white/30 hover:text-white/60 text-[13px]"><ChevronLeft className="w-4 h-4" /> Back</button>
              <h1 className="text-lg font-black text-white">E-Sign Builder</h1>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 text-[10px] font-bold">DRAFT</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium hover:bg-white/[0.1] transition-colors">Save Draft</button>
              <button className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold hover:bg-[#d11a7a] transition-colors flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Send for Signing</button>
            </div>
          </div>

          <div className="grid grid-cols-[220px_1fr_260px] gap-4 min-h-[calc(100vh-200px)]">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4 space-y-4 overflow-y-auto">
              <h3 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Signers</h3>
              {[{ id: "bw-5", name: "Lisa Nakamura", role: "Borrower", color: "bg-cyan-400" }, { id: "lo-4", name: "Sarah Kim", role: "Loan Officer", color: "bg-[#e91e8c]" }].map(signer => (
                <div key={signer.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${signer.color}`} />
                    <span className="text-[12px] font-semibold text-white">{signer.name}</span>
                  </div>
                  <p className="text-[10px] text-white/25 ml-4">{signer.role}</p>
                  <div className="ml-4 space-y-1">
                    {fieldTypes.map(ft => (
                      <div key={ft.type} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.04] cursor-grab text-[11px] transition-colors">
                        <ft.icon className="w-3 h-3" />
                        {ft.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <button onClick={() => setBuilderPage(Math.max(1, builderPage - 1))} className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-[12px] text-white/40">Page {builderPage} of {totalPages}</span>
                  <button onClick={() => setBuilderPage(Math.min(totalPages, builderPage + 1))} className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><ZoomOut className="w-3.5 h-3.5" /></button>
                  <span className="text-[11px] text-white/30 w-10 text-center">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><ZoomIn className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
                <div className="relative bg-white rounded-lg shadow-2xl" style={{ width: `${612 * (zoom / 100)}px`, height: `${792 * (zoom / 100)}px`, transform: `scale(${zoom / 100})`, transformOrigin: "center" }}>
                  <div className="absolute inset-0 p-8">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                    <div className="space-y-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${50 + Math.random() * 50}%` }} />
                      ))}
                    </div>
                  </div>
                  {pageFields.map(field => (
                    <div
                      key={field.id}
                      className={`absolute border-2 rounded cursor-move flex items-center justify-center text-[10px] font-bold ${
                        field.signerId.startsWith("bw") ? "border-cyan-400 bg-cyan-400/10 text-cyan-500" : "border-[#e91e8c] bg-[#e91e8c]/10 text-[#e91e8c]"
                      }`}
                      style={{ left: field.x * (zoom / 100), top: field.y * (zoom / 100), width: field.width * (zoom / 100), height: field.height * (zoom / 100) }}
                    >
                      <GripVertical className="w-3 h-3 mr-1 opacity-40" />
                      {field.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-1.5 px-4 py-2 border-t border-white/[0.06] overflow-x-auto">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setBuilderPage(i + 1)} className={`w-16 h-20 rounded-md border flex items-center justify-center text-[10px] font-bold transition-colors ${builderPage === i + 1 ? "border-[#e91e8c] bg-[#e91e8c]/10 text-[#e91e8c]" : "border-white/[0.06] bg-white/[0.02] text-white/20 hover:border-white/10"}`}>
                    P{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-4 space-y-4 overflow-y-auto">
              <h3 className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Field Properties</h3>
              {pageFields.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-white/30 mb-1 block">Label</label>
                    <input className="w-full h-8 rounded-md bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none" defaultValue={pageFields[0]?.label} />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 mb-1 block">Assigned To</label>
                    <select className="w-full h-8 rounded-md bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none">
                      <option>Lisa Nakamura</option>
                      <option>Sarah Kim</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/30">Required</span>
                    <div className="w-8 h-4 rounded-full bg-[#e91e8c] relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" /></div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 mb-1 block">Placeholder</label>
                    <input className="w-full h-8 rounded-md bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none" placeholder="Enter text..." />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Position</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-white/40">
                      <div className="bg-white/[0.02] rounded p-1.5">X: {pageFields[0]?.x}</div>
                      <div className="bg-white/[0.02] rounded p-1.5">Y: {pageFields[0]?.y}</div>
                      <div className="bg-white/[0.02] rounded p-1.5">W: {pageFields[0]?.width}</div>
                      <div className="bg-white/[0.02] rounded p-1.5">H: {pageFields[0]?.height}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/20 text-[12px] text-center py-8">Select a field to edit properties</p>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white" data-testid="text-esign-title">E-Sign</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages..." className="h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#e91e8c]/40 w-60" data-testid="input-esign-search" />
            </div>
            <button onClick={() => setShowBuilder(true)} className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#d11a7a] transition-colors" data-testid="button-create-package">
              <Plus className="w-3.5 h-3.5" /> Create Package
            </button>
            <Link href="/admin/esign/templates">
              <button className="h-9 px-4 rounded-lg bg-white/[0.06] text-white/50 text-[12px] font-medium flex items-center gap-1.5 hover:bg-white/[0.1] transition-colors" data-testid="button-template-lib">
                <Layers className="w-3.5 h-3.5" /> Templates
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-3 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/25 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Package", "Borrower", "Loan File", "Recipients", "Sent", "Status", "Completed", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(pkg => (
                <tr key={pkg.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedPkg(pkg)} data-testid={`row-esign-${pkg.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-white/20" />
                      <span className="text-[13px] font-medium text-white">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-white/50">{getBorrowerName(pkg.borrowerId)}</td>
                  <td className="px-4 py-3 text-[12px] text-white/40">{pkg.loanFileId}</td>
                  <td className="px-4 py-3 text-[12px] text-white/40">{pkg.recipientCount}</td>
                  <td className="px-4 py-3 text-[11px] text-white/30">{pkg.sentAt ? new Date(pkg.sentAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${signStatusColor(pkg.status)}`}>{pkg.status}</span></td>
                  <td className="px-4 py-3 text-[11px] text-white/30">{pkg.completedAt ? new Date(pkg.completedAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button className="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60"><Eye className="w-3.5 h-3.5" /></button>
                      {pkg.status === "Draft" && <button onClick={() => setShowBuilder(true)} className="w-7 h-7 rounded-md bg-[#e91e8c]/10 hover:bg-[#e91e8c]/20 flex items-center justify-center text-[#e91e8c]"><PenTool className="w-3.5 h-3.5" /></button>}
                      {(pkg.status === "Draft" || pkg.status === "Expired") && <button className="w-7 h-7 rounded-md bg-cyan-400/10 hover:bg-cyan-400/20 flex items-center justify-center text-cyan-400"><Send className="w-3.5 h-3.5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <PenTool className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-[14px] font-medium">No packages found</p>
              <p className="text-white/15 text-[12px] mt-1">Create your first e-sign package to get started</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedPkg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedPkg(null)}>
            <div className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[420px] bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-white">Package Details</h2>
                <button onClick={() => setSelectedPkg(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[11px] text-white/30 mb-1">Package Name</p>
                  <p className="text-white font-semibold">{selectedPkg.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Borrower</p>
                    <p className="text-white/60 text-[13px]">{getBorrowerName(selectedPkg.borrowerId)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${signStatusColor(selectedPkg.status)}`}>{selectedPkg.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 mb-2">Activity Log</p>
                  <div className="space-y-2">
                    {selectedPkg.eventLog.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.03] last:border-0">
                        <div className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-white/25" />
                        </div>
                        <div>
                          <p className="text-[12px] text-white/60">{ev.action}</p>
                          <p className="text-[10px] text-white/25">{new Date(ev.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
