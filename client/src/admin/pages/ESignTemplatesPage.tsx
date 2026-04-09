import { AppShell } from "../components/AppShell";
import { esignTemplates } from "../data/mockPhase2Data";
import { Link } from "wouter";
import { ChevronLeft, FileText, Copy, Eye, PenTool, Plus, Layers } from "lucide-react";

export default function ESignTemplatesPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/esign">
              <button className="flex items-center gap-1 text-white/30 hover:text-white/60 text-[13px]"><ChevronLeft className="w-4 h-4" /> Back to E-Sign</button>
            </Link>
            <h1 className="text-xl font-black text-white" data-testid="text-templates-title">Template Library</h1>
          </div>
          <button className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#d11a7a] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Create Template
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {esignTemplates.map(tpl => (
            <div key={tpl.id} className="bg-[#111] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors group" data-testid={`card-template-${tpl.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e91e8c]/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#e91e8c]" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/25 text-[10px] font-medium">{tpl.category}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white mb-1">{tpl.name}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed mb-4">{tpl.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-white/25 mb-4">
                <span>{tpl.pageCount} pages</span>
                <span>·</span>
                <span>{tpl.fieldCount} fields</span>
                <span>·</span>
                <span>Used {tpl.usageCount}x</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 h-8 rounded-lg bg-white/[0.04] text-white/40 text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-white/[0.08]"><Eye className="w-3 h-3" /> Preview</button>
                <button className="flex-1 h-8 rounded-lg bg-white/[0.04] text-white/40 text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-white/[0.08]"><PenTool className="w-3 h-3" /> Edit</button>
                <button className="flex-1 h-8 rounded-lg bg-white/[0.04] text-white/40 text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-white/[0.08]"><Copy className="w-3 h-3" /> Duplicate</button>
                <button className="flex-1 h-8 rounded-lg bg-[#e91e8c]/10 text-[#e91e8c] text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#e91e8c]/20"><FileText className="w-3 h-3" /> Use</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
