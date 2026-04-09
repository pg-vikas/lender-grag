import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { tasks, getBorrowerName, getUserName } from "../data/mockPhase2Data";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskStatus, Priority } from "../types";
import {
  Search, Plus, Filter, X, CheckCircle2, Clock, AlertTriangle, Circle,
  ChevronRight, User, Calendar, ListChecks, Columns3, FileText
} from "lucide-react";

const statusColumns: { status: TaskStatus; color: string; bg: string }[] = [
  { status: "To Do", color: "text-white/40", bg: "border-t-white/20" },
  { status: "In Progress", color: "text-cyan-400", bg: "border-t-cyan-400" },
  { status: "Waiting", color: "text-amber-400", bg: "border-t-amber-400" },
  { status: "Completed", color: "text-green-400", bg: "border-t-green-400" },
  { status: "Overdue", color: "text-red-500", bg: "border-t-red-500" },
];

function taskStatusColor(s: TaskStatus) {
  switch (s) {
    case "To Do": return "bg-white/[0.06] text-white/40";
    case "In Progress": return "bg-cyan-400/10 text-cyan-400";
    case "Waiting": return "bg-amber-400/10 text-amber-400";
    case "Completed": return "bg-green-400/10 text-green-400";
    case "Overdue": return "bg-red-500/10 text-red-500";
  }
}

function priorityColor(p: Priority) {
  switch (p) {
    case "Urgent": return "bg-red-500/10 text-red-500";
    case "High": return "bg-amber-400/10 text-amber-400";
    case "Medium": return "bg-cyan-400/10 text-cyan-400";
    case "Low": return "bg-white/[0.04] text-white/30";
  }
}

export default function TasksPage() {
  const [view, setView] = useState<"list" | "board">("list");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filtered = tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: "Due Today", value: tasks.filter(t => t.dueDate === "2026-04-09" && t.status !== "Completed").length, color: "text-[#e91e8c]" },
    { label: "Overdue", value: tasks.filter(t => t.status === "Overdue").length, color: "text-red-500" },
    { label: "Assigned to Me", value: tasks.filter(t => t.assigneeId === "lo-1").length, color: "text-cyan-400" },
    { label: "High Priority", value: tasks.filter(t => t.priority === "High" || t.priority === "Urgent").length, color: "text-amber-400" },
    { label: "Completed Today", value: tasks.filter(t => t.status === "Completed").length, color: "text-green-400" },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-xl font-black text-white" data-testid="text-tasks-title">Tasks</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[13px] placeholder:text-white/25 focus:outline-none focus:border-[#e91e8c]/40 w-60" data-testid="input-task-search" />
            </div>
            <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
              <button onClick={() => setView("list")} className={`h-9 px-3 text-[12px] font-medium flex items-center gap-1 ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/30 hover:bg-white/[0.04]"}`}><ListChecks className="w-3.5 h-3.5" /> List</button>
              <button onClick={() => setView("board")} className={`h-9 px-3 text-[12px] font-medium flex items-center gap-1 ${view === "board" ? "bg-white/[0.08] text-white" : "text-white/30 hover:bg-white/[0.04]"}`}><Columns3 className="w-3.5 h-3.5" /> Board</button>
            </div>
            <button className="h-9 px-4 rounded-lg bg-[#e91e8c] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#d11a7a] transition-colors" data-testid="button-create-task">
              <Plus className="w-3.5 h-3.5" /> Create Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#111] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[11px] text-white/30 font-medium">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {view === "board" ? (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {statusColumns.map(col => {
              const colItems = filtered.filter(t => t.status === col.status);
              return (
                <div key={col.status} className={`flex-shrink-0 w-[260px] bg-[#0e0e0e] border border-white/[0.06] rounded-xl border-t-2 ${col.bg}`}>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-bold ${col.color}`}>{col.status}</span>
                      <span className="w-5 h-5 rounded-full bg-white/[0.06] text-white/30 text-[10px] font-bold flex items-center justify-center">{colItems.length}</span>
                    </div>
                  </div>
                  <div className="px-2 pb-2 space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto">
                    {colItems.map(task => (
                      <motion.div key={task.id} whileHover={{ scale: 1.01 }} className="bg-[#111] border border-white/[0.06] rounded-lg p-3 cursor-pointer hover:border-white/[0.12] transition-colors" onClick={() => setSelectedTask(task)} data-testid={`card-task-${task.id}`}>
                        <p className="text-[12px] font-semibold text-white mb-1.5 leading-tight">{task.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-white/25 mb-2">
                          <User className="w-2.5 h-2.5" /> {getUserName(task.assigneeId)}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${priorityColor(task.priority)}`}>{task.priority}</span>
                          <span className="text-[9px] text-white/20 flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {new Date(task.dueDate).toLocaleDateString()}</span>
                          {task.borrowerId && <span className="text-[9px] text-white/15">{getBorrowerName(task.borrowerId).split(" ")[0]}</span>}
                        </div>
                      </motion.div>
                    ))}
                    {colItems.length === 0 && <p className="text-center text-white/10 text-[11px] py-6">No tasks</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Task", "Related", "Assignee", "Due Date", "Priority", "Status", "Type"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedTask(task)} data-testid={`row-task-${task.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {task.status === "Completed" ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> : task.status === "Overdue" ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-white/15 flex-shrink-0" />}
                        <span className={`text-[13px] font-medium ${task.status === "Completed" ? "text-white/30 line-through" : "text-white"}`}>{task.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/40">{task.borrowerId ? getBorrowerName(task.borrowerId) : "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-white/50">{getUserName(task.assigneeId)}</td>
                    <td className="px-4 py-3 text-[11px] text-white/30">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColor(task.priority)}`}>{task.priority}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${taskStatusColor(task.status)}`}>{task.status}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/25 text-[10px]">{task.type.replace(/_/g, " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <CheckCircle2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-[14px] font-medium">No tasks found</p>
                <p className="text-white/15 text-[12px] mt-1">Create a task to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTask(null)}>
            <div className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[420px] bg-[#111] border-l border-white/[0.06] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-white">Task Detail</h2>
                <button onClick={() => setSelectedTask(null)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[11px] text-white/30 mb-1">Title</p>
                  <p className="text-white font-semibold text-[14px]">{selectedTask.title}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 mb-1">Description</p>
                  <p className="text-white/50 text-[13px] leading-relaxed">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-white/30 mb-1">Status</p>
                    <select className="w-full h-8 rounded-md bg-white/[0.04] border border-white/[0.06] text-white text-[12px] px-2 focus:outline-none">
                      {statusColumns.map(s => <option key={s.status} value={s.status} selected={s.status === selectedTask.status}>{s.status}</option>)}
                    </select>
                  </div>
                  <div><p className="text-[11px] text-white/30 mb-1">Priority</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] text-white/30 mb-1">Assignee</p><p className="text-white/60 text-[13px]">{getUserName(selectedTask.assigneeId)}</p></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Due Date</p><p className="text-white/60 text-[13px]">{new Date(selectedTask.dueDate).toLocaleDateString()}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] text-white/30 mb-1">Borrower</p><p className="text-white/60 text-[13px]">{selectedTask.borrowerId ? getBorrowerName(selectedTask.borrowerId) : "—"}</p></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Loan File</p><p className="text-white/60 text-[13px]">{selectedTask.loanFileId || "—"}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] text-white/30 mb-1">Type</p><span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[10px]">{selectedTask.type.replace(/_/g, " ")}</span></div>
                  <div><p className="text-[11px] text-white/30 mb-1">Created By</p><p className="text-white/40 text-[12px]">{getUserName(selectedTask.createdBy)}</p></div>
                </div>
                <div className="flex gap-2 pt-2">
                  {selectedTask.status !== "Completed" && (
                    <button className="flex-1 h-9 rounded-lg bg-green-400/10 text-green-400 text-[12px] font-bold hover:bg-green-400/20 transition-colors flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Complete</button>
                  )}
                  <button className="flex-1 h-9 rounded-lg bg-white/[0.06] text-white/40 text-[12px] font-medium hover:bg-white/[0.1] transition-colors flex items-center justify-center gap-1"><User className="w-3.5 h-3.5" /> Reassign</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
