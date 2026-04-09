const statusColors: Record<string, { bg: string; text: string }> = {
  "New": { bg: "bg-cyan-400/10", text: "text-cyan-400" },
  "Attempted Contact": { bg: "bg-amber-400/10", text: "text-amber-400" },
  "Contacted": { bg: "bg-blue-400/10", text: "text-blue-400" },
  "Qualified": { bg: "bg-green-400/10", text: "text-green-400" },
  "Pre Approval Started": { bg: "bg-purple-400/10", text: "text-purple-400" },
  "Application Started": { bg: "bg-indigo-400/10", text: "text-indigo-400" },
  "Nurture": { bg: "bg-amber-300/10", text: "text-amber-300" },
  "Cold": { bg: "bg-blue-300/10", text: "text-blue-300" },
  "Lost": { bg: "bg-red-400/10", text: "text-red-400" },
  "Lost / Withdrawn": { bg: "bg-red-400/10", text: "text-red-400" },
  "Converted": { bg: "bg-emerald-400/10", text: "text-emerald-400" },
  "Lead": { bg: "bg-cyan-400/10", text: "text-cyan-400" },
  "Consultation": { bg: "bg-blue-400/10", text: "text-blue-400" },
  "Pre Qualified": { bg: "bg-indigo-400/10", text: "text-indigo-400" },
  "Pre Approved": { bg: "bg-purple-400/10", text: "text-purple-400" },
  "Shopping": { bg: "bg-violet-400/10", text: "text-violet-400" },
  "Application Submitted": { bg: "bg-sky-400/10", text: "text-sky-400" },
  "Processing": { bg: "bg-amber-400/10", text: "text-amber-400" },
  "Submitted to Underwriting": { bg: "bg-orange-400/10", text: "text-orange-400" },
  "Conditional Approval": { bg: "bg-yellow-400/10", text: "text-yellow-400" },
  "Clear to Close": { bg: "bg-lime-400/10", text: "text-lime-400" },
  "Closing Scheduled": { bg: "bg-green-400/10", text: "text-green-400" },
  "Funded": { bg: "bg-emerald-400/10", text: "text-emerald-400" },
  "Closed": { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  "Active": { bg: "bg-green-400/10", text: "text-green-400" },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] || { bg: "bg-white/[0.06]", text: "text-white/50" };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}
