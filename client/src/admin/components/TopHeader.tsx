import { useAdminStore } from "../store";
import { Search, Plus, Bell, ListChecks, MessageSquare, ChevronDown, User } from "lucide-react";
import { branches } from "../data/mockData";

export function TopHeader() {
  const { sidebarCollapsed, setGlobalSearchOpen, setQuickCreateOpen, selectedBranch, setSelectedBranch, dashboardMode, setDashboardMode } = useAdminStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-14 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center gap-3 px-4"
      style={{ left: sidebarCollapsed ? 64 : 240, transition: "left 0.2s ease-in-out" }}
    >
      <button
        onClick={() => setGlobalSearchOpen(true)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.1] transition-all flex-1 max-w-[320px]"
        data-testid="button-global-search"
      >
        <Search className="w-4 h-4" />
        <span className="text-[13px]">Search leads, borrowers, loans...</span>
        <kbd className="ml-auto text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      <button
        onClick={() => setQuickCreateOpen(true)}
        className="h-9 px-3 rounded-lg bg-[#e91e8c]/10 border border-[#e91e8c]/20 text-[#e91e8c] hover:bg-[#e91e8c]/20 transition-all flex items-center gap-1.5 text-[13px] font-bold"
        data-testid="button-quick-create"
      >
        <Plus className="w-4 h-4" />
        Create
      </button>

      <div className="flex-1" />

      <select
        value={dashboardMode}
        onChange={(e) => setDashboardMode(e.target.value as any)}
        className="h-8 px-2 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/50 text-[12px] focus:outline-none cursor-pointer"
        data-testid="select-dashboard-mode"
      >
        <option value="Executive">Executive</option>
        <option value="Sales">Sales</option>
        <option value="Operations">Operations</option>
      </select>

      <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
        className="h-8 px-2 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/50 text-[12px] focus:outline-none cursor-pointer"
        data-testid="select-branch"
      >
        <option value="all">All Branches</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all relative" data-testid="button-notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e91e8c]" />
        </button>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all" data-testid="button-tasks">
          <ListChecks className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all" data-testid="button-messages">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-white/[0.06]" />

      <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer" data-testid="button-user-menu">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-[12px] font-bold text-white/80">Greg Wynn</p>
          <p className="text-[10px] text-white/30">Super Admin</p>
        </div>
        <ChevronDown className="w-3 h-3 text-white/30 hidden lg:block" />
      </button>
    </header>
  );
}
