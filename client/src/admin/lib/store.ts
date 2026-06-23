import { create } from 'zustand';

export interface Contract {
  id: string;
  title: string;
  client: string;
  date: string;
  clientStatus: string;
  providerStatus: string;
  status: string;
  pinned: boolean;
  value?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  contracts: Contract[];
  setContracts: (contracts: Contract[]) => void;
  updateContract: (id: string, updatedContract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  addContract: (contract: Contract) => void;
}

export const initialContracts: Contract[] = [
  { id: "CO-00022", title: "Growth Advisor 7-18", client: "Pink Gorilla Software", date: "18-12-2025", clientStatus: "Pending", providerStatus: "Pending", status: "Awaiting Signatures", pinned: false, value: "$5,000", startDate: "2025-12-18", endDate: "2026-12-18", description: "Standard growth advisory services" },
  { id: "CO-00021", title: "Dec 18th 2025 at 6:10", client: "Pink Gorilla Software", date: "18-12-2025", clientStatus: "Pending", providerStatus: "Signed", status: "Awaiting Signatures", pinned: false, value: "$2,500", startDate: "2025-12-18", endDate: "2026-06-18", description: "Project consultation" },
  { id: "CO-00018", title: "test", client: "Recloud", date: "26-10-2025", clientStatus: "Pending", providerStatus: "Pending", status: "Draft", pinned: true, value: "$10,000", startDate: "2025-10-26", endDate: "2026-10-26", description: "Test contract" },
  { id: "CO-00017", title: "Demo", client: "PG Development", date: "27-10-2025", clientStatus: "Signed", providerStatus: "Signed", status: "Active", pinned: false, value: "$15,000", startDate: "2025-10-27", endDate: "2026-10-27", description: "Demo software development" },
  { id: "CO-00016", title: "test4", client: "PG Development", date: "25-10-2025", clientStatus: "Signed", providerStatus: "Signed", status: "Active", pinned: false, value: "$8,000", startDate: "2025-10-25", endDate: "2026-10-25", description: "Test 4 description" },
];

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  
  contracts: initialContracts,
  setContracts: (contracts) => set({ contracts }),
  updateContract: (id, updatedContract) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, ...updatedContract } : c)
  })),
  deleteContract: (id) => set((state) => ({
    contracts: state.contracts.filter(c => c.id !== id)
  })),
  addContract: (contract) => set((state) => ({
    contracts: [contract, ...state.contracts]
  }))
}));
