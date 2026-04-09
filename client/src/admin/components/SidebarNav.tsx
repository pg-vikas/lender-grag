import { Link, useLocation } from "wouter";
import { useAdminStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Activity, Bell, Users, UserPlus, Briefcase, Handshake, Radio,
  FileText, FilePlus, FileCheck, ListChecks, Calendar, Zap,
  ShieldCheck, BarChart3, Settings, PanelLeftClose, PanelLeft,
  ChevronRight, PenTool, ClipboardCheck, MessageSquare, CheckSquare,
  DollarSign, Package, Building2, Shield, Crown
} from "lucide-react";

interface NavItem {
  label: string;
  icon: any;
  href?: string;
  disabled?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Activity Feed", icon: Activity, disabled: true },
      { label: "Alerts", icon: Bell, disabled: true },
    ],
  },
  {
    title: "Sales & CRM",
    items: [
      { label: "CRM", icon: Users, href: "/admin/crm" },
      { label: "Leads", icon: UserPlus, href: "/admin/leads" },
      { label: "Borrowers", icon: Briefcase, href: "/admin/borrowers" },
      { label: "Partners", icon: Handshake, disabled: true },
      { label: "Broadcasts", icon: Radio, disabled: true },
    ],
  },
  {
    title: "Loans",
    items: [
      { label: "Loan Pipeline", icon: FileText, href: "/admin/pipeline" },
      { label: "Pre Approvals", icon: FilePlus, disabled: true },
      { label: "Applications", icon: FileCheck, disabled: true },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Documents", icon: FileText, href: "/admin/documents" },
      { label: "E-Sign", icon: PenTool, href: "/admin/esign" },
      { label: "Conditions", icon: ClipboardCheck, href: "/admin/conditions" },
      { label: "Communications", icon: MessageSquare, href: "/admin/communications" },
      { label: "Tasks", icon: CheckSquare, href: "/admin/tasks" },
      { label: "Calendar", icon: Calendar, disabled: true },
      { label: "Automations", icon: Zap, href: "/admin/automations" },
    ],
  },
  {
    title: "Products & Pricing",
    items: [
      { label: "Pricing Desk", icon: DollarSign, href: "/admin/pricing" },
      { label: "Products", icon: Package, href: "/admin/products" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Compliance", icon: ShieldCheck, href: "/admin/compliance" },
      { label: "Branches", icon: Building2, href: "/admin/branches" },
      { label: "Team", icon: Users, href: "/admin/team" },
      { label: "Reports", icon: BarChart3, href: "/admin/reports" },
      { label: "Executive", icon: Crown, href: "/admin/executive" },
      { label: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
];

export function SidebarNav() {
  const [location] = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAdminStore();

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] overflow-hidden"
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between h-14 px-3 border-b border-white/[0.06] flex-shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black">G</span>
              </div>
              <span className="text-white font-bold text-sm whitespace-nowrap">Gorilla Apps</span>
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e91e8c] to-[#8b5cf6] flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-black">G</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
          data-testid="button-toggle-sidebar"
        >
          {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-2 mb-1.5">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href ? (item.href === "/admin" ? location === "/admin" : location.startsWith(item.href)) : false;
                const Icon = item.icon;
                return item.disabled ? (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-white/15 cursor-not-allowed"
                    title={sidebarCollapsed ? `${item.label} (Phase 2)` : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-[13px] whitespace-nowrap flex-1">{item.label}</span>
                    )}
                    {!sidebarCollapsed && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/[0.04] text-white/20 px-1.5 py-0.5 rounded">P2</span>
                    )}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href!}>
                    <div
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 group ${
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-white/45 hover:bg-white/[0.04] hover:text-white/70"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#e91e8c]" : ""}`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-[13px] font-medium whitespace-nowrap flex-1">{item.label}</span>
                          {isActive && <ChevronRight className="w-3 h-3 text-white/30" />}
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3 flex-shrink-0">
        <Link href="/">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all cursor-pointer" data-testid="link-back-to-site">
            <ChevronRight className="w-4 h-4 rotate-180" />
            {!sidebarCollapsed && <span className="text-[12px] font-medium">Back to Site</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
