import { create } from "zustand";
import type { DashboardMode } from "./types";

interface AdminStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  quickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;

  drawerOpen: string | null;
  drawerData: any;
  openDrawer: (id: string, data?: any) => void;
  closeDrawer: () => void;

  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  dashboardMode: DashboardMode;
  setDashboardMode: (mode: DashboardMode) => void;

  pipelineView: "kanban" | "list";
  setPipelineView: (view: "kanban" | "list") => void;

  pipelineFilters: Record<string, string>;
  setPipelineFilter: (key: string, value: string) => void;
  clearPipelineFilters: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  globalSearchOpen: false,
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),

  quickCreateOpen: false,
  setQuickCreateOpen: (open) => set({ quickCreateOpen: open }),

  drawerOpen: null,
  drawerData: null,
  openDrawer: (id, data = null) => set({ drawerOpen: id, drawerData: data }),
  closeDrawer: () => set({ drawerOpen: null, drawerData: null }),

  selectedBranch: "all",
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  dashboardMode: "Executive",
  setDashboardMode: (mode) => set({ dashboardMode: mode }),

  pipelineView: "kanban",
  setPipelineView: (view) => set({ pipelineView: view }),

  pipelineFilters: {},
  setPipelineFilter: (key, value) =>
    set((s) => ({ pipelineFilters: { ...s.pipelineFilters, [key]: value } })),
  clearPipelineFilters: () => set({ pipelineFilters: {} }),
}));
