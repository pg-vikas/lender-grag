import { SidebarNav } from "./SidebarNav";
import { TopHeader } from "./TopHeader";
import { GlobalSearch } from "./GlobalSearch";
import { QuickCreateMenu } from "./QuickCreateMenu";
import { RightDrawer } from "./RightDrawer";
import { useAdminStore } from "../store";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
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
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">{title}</h1>
              {subtitle && <p className="text-sm text-white/40 mt-1" data-testid="text-page-subtitle">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
