import { SidebarNav } from "./SidebarNav";
import { TopHeader } from "./TopHeader";
import { GlobalSearch } from "./GlobalSearch";
import { QuickCreateMenu } from "./QuickCreateMenu";
import { RightDrawer } from "./RightDrawer";
import { useAdminStore } from "../store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useAdminStore();

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <SidebarNav />
      <TopHeader />
      <GlobalSearch />
      <QuickCreateMenu />
      <RightDrawer />
      <main
        className="pt-14 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
