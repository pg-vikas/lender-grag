import { useState, useEffect } from "react";
import { Button } from "@/admin/components/ui/button";
import { 
  Menu, 
  Search, 
  Bell, 
  User,
  LogOut,
  Users,
  BarChart2,
  PieChart,
  HelpCircle,
  ArrowUpRight,
  ArrowRight,
  Home as HomeIcon,
  FolderOpen,
  DollarSign,
  FileText,
  MessageSquare,
  FileBarChart,
  Globe,
  ChevronDown,
  Filter,
  Download,
  Building2,
  ChevronUp,
  Plus,
  X,
  Edit,
  Mail,
  Pin,
  Star,
  Activity,
  TrendingUp,
  Link as LinkIcon,
  List,
  Image as ImageIcon,
  Video,
  AlignLeft,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Rocket,
  Eye,
  Lock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Settings
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/admin/lib/store";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/admin/hooks/use-toast";
import {
  EditClientProfileModal,
  type ClientEditFormData,
  formatClientPhoneNumber,
  getDefaultClientEditFormData,
  getFriendlyClientSaveError,
  normalizeClientStatus,
  validateClientCreateForm,
  validateClientEditForm,
} from "@/admin/components/clients/EditClientProfileModal";
import { normalizeRichTextValue } from "@/admin/components/clients/RichTextEditor";

type ClientListItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  industry: string;
  compliance: boolean;
  photoUrl?: string;
  revenue: string;
  billing: string;
  contacted: string;
  assigned: string;
  status: string;
  background?: string;
  currentAddress?: string;
  loanPurpose?: string;
  propertyType?: string;
  estimatedValue?: string;
  downPayment?: string;
  targetLoanAmount?: string;
  createdAt?: string;
};

type ClientsApiResponse = {
  clients: ClientListItem[];
};

const getClientListValue = (value?: string, fallback = "Not added") => {
  const cleanValue = value?.trim();
  return cleanValue || fallback;
};

const getClientTargetLoanDisplay = (client: ClientListItem) => {
  return getClientListValue(client.targetLoanAmount);
};

// Reusable Sidebar Component
export function Sidebar({ openMenus, toggleMenu, currentPath }: { openMenus: string, toggleMenu: (m: string) => void, currentPath: string }) {
  const { sidebarOpen } = useAppStore();
  const { logout } = useAuth();
  const [, navigate] = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [currentPath, sidebarOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setProfileMenuOpen(false);
      setIsLoggingOut(false);
      navigate('/login');
    }
  };
  
  return (
    <aside className={`${sidebarOpen ? 'w-[260px]' : 'w-[80px]'} bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-30`}>
      <div className={`p-5 border-b border-slate-800 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            className={`flex items-center justify-center bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl hover:bg-slate-700 transition-all group ${sidebarOpen ? 'w-full py-2.5 px-3 justify-between' : 'w-11 h-11 mx-auto'}`}
            data-testid="button-admin-profile-menu"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-shadow">
                 <User className="w-4 h-4" />
              </div>
              {sidebarOpen && <span className="text-sm font-bold text-[#e2e8f0] tracking-wide whitespace-nowrap">Greg Wynn</span>}
            </div>
            {sidebarOpen && <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />}
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              className={`absolute top-full mt-2 z-50 rounded-xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/40 overflow-hidden ${sidebarOpen ? 'left-0 right-0' : 'left-1/2 w-44 -translate-x-1/2'}`}
              data-testid="menu-admin-profile"
            >
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-bold text-slate-100">Greg Wynn</p>
                <p className="text-xs text-slate-500 mt-0.5">Admin Account</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="button-admin-logout"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        <nav className="space-y-2 px-4">
          <Link href="/admin/home">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath === '/admin/home' || currentPath === '/' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <HomeIcon className={`w-5 h-5 shrink-0 ${currentPath === '/admin/home' || currentPath === '/' ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Dashboard</span>}
              </div>
            </div>
          </Link>
          
          {/* CRM Group */}
          <div className="relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('crm') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/clients') || currentPath.includes('/admin/tasks') || currentPath.includes('/admin/growth') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "CRM" : ""}
            >
              <div className="flex items-center space-x-3">
                <Users className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/clients') || currentPath.includes('/admin/tasks') || currentPath.includes('/admin/growth') ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">CRM</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'crm' || currentPath.includes('/admin/clients') || currentPath.includes('/admin/tasks') || currentPath.includes('/admin/growth') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'crm' || currentPath.includes('/admin/clients') || currentPath.includes('/admin/tasks') || currentPath.includes('/admin/growth')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/clients/active">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/clients/active' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>Active Clients</div>
                </Link>
                <Link href="/admin/clients">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/clients' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>Clients</div>
                </Link>
                <Link href="/admin/tasks">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/tasks' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>Tasks</div>
                </Link>
                <Link href="/admin/growth/kpi-overview">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/growth/kpi-overview' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>Growth KPI</div>
                </Link>
              </div>
            )}
          </div>

          {/* Pre-Approvals Group */}
          <div className="relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('pre-approvals') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/pre-approvals') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Pre-Approvals" : ""}
            >
              <div className="flex items-center space-x-3">
                <FileText className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/pre-approvals') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Pre-Approvals</span>}
              </div>
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'pre-approvals' || currentPath.includes('/admin/pre-approvals')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/pre-approvals">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath.includes('/admin/pre-approvals') ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Letters
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Projects Standalone - hidden */}
          <Link href="/admin/projects">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/projects') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <FolderOpen className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/projects') ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Credit Repair</span>}
              </div>
            </div>
          </Link>

          {/* E-Signatures Group - hidden */}
          <div className="hidden relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('esignatures') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/esignatures') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "E-Signatures" : ""}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FileText className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/esignatures') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:text-slate-300'}`} />
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full">
                    <Edit className="w-3 h-3 text-indigo-400" />
                  </div>
                </div>
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">E-Signatures</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'esignatures' || currentPath.includes('/admin/esignatures') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'esignatures' || currentPath.includes('/admin/esignatures')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/esignatures/send">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/esignatures/send' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Send for Signature
                  </div>
                </Link>
                <Link href="/admin/esignatures/documents">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/esignatures/documents' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Manage Documents
                  </div>
                </Link>
                <Link href="/admin/esignatures/templates">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/esignatures/templates' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Templates
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Contracts Group - hidden */}
          <div className="hidden relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('contracts') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/contracts') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Contracts" : ""}
            >
              <div className="flex items-center space-x-3">
                <FileText className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/contracts') ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Contracts</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'contracts' || currentPath.includes('/admin/contracts') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'contracts' || currentPath.includes('/admin/contracts')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/contracts">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/contracts' ? 'bg-yellow-500/20 text-yellow-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Contracts
                  </div>
                </Link>
                <Link href="/admin/contracts/templates">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/contracts/templates' ? 'bg-yellow-500/20 text-yellow-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Templates
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Support Group - hidden */}
          <div className="hidden relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('support') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/tickets') || currentPath.includes('/admin/messages') ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Support" : ""}
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/tickets') || currentPath.includes('/admin/messages') ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Support</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'support' || currentPath.includes('/admin/tickets') || currentPath.includes('/admin/messages') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'support' || currentPath.includes('/admin/tickets') || currentPath.includes('/admin/messages')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/tickets">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath.includes('/admin/tickets') ? 'bg-fuchsia-500/20 text-fuchsia-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Active Tickets
                  </div>
                </Link>
                <Link href="/admin/messages">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath.includes('/admin/messages') ? 'bg-fuchsia-500/20 text-fuchsia-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Messages
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Loan Pipeline Group */}
          <div className="relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('pipeline') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/pipeline') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Loan Pipeline" : ""}
            >
              <div className="flex items-center space-x-3">
                <BarChart2 className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/pipeline') ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Loan Pipeline</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'pipeline' || currentPath.includes('/admin/pipeline') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'pipeline' || currentPath.includes('/admin/pipeline')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/pipeline/active">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/pipeline/active' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Active Loans
                  </div>
                </Link>
                <Link href="/admin/pipeline/funded">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/pipeline/funded' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Funded
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Conditions Standalone - hidden */}
          <Link href="/admin/conditions">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/conditions') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/conditions') ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Conditions</span>}
              </div>
            </div>
          </Link>

          {/* Pricing Desk Standalone - hidden */}
          <Link href="/admin/pricing-desk">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/pricing-desk') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <DollarSign className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/pricing-desk') ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Pricing Desk</span>}
              </div>
            </div>
          </Link>

          {/* Compliance Standalone - hidden */}
          <Link href="/admin/compliance">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/compliance') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/compliance') ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Compliance</span>}
              </div>
            </div>
          </Link>

          {/* Team Standalone - hidden */}
          <Link href="/admin/team">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/team') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <Users className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/team') ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Team</span>}
              </div>
            </div>
          </Link>
          <div className="hidden relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('reports') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/reports') || currentPath.includes('/admin/performance') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Reports" : ""}
            >
              <div className="flex items-center space-x-3">
                <BarChart2 className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/reports') || currentPath.includes('/admin/performance') ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Reports</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'reports' || currentPath.includes('/admin/reports') || currentPath.includes('/admin/performance') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'reports' || currentPath.includes('/admin/reports') || currentPath.includes('/admin/performance')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/reports">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/reports' ? 'bg-orange-500/20 text-orange-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Reports
                  </div>
                </Link>
                <Link href="/admin/performance">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath.includes('/admin/performance') ? 'bg-orange-500/20 text-orange-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Performance Report
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Social Media Group - hidden */}
          <div className="hidden relative group">
            <button 
              onClick={() => sidebarOpen ? toggleMenu('social-media') : null}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all group ${currentPath.includes('/admin/social') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}
              title={!sidebarOpen ? "Social Media" : ""}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/social') ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Social Media</span>}
              </div>
              {sidebarOpen && <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openMenus === 'social-media' || currentPath.includes('/admin/social') ? '' : '-rotate-90'}`} />}
            </button>
            {useAppStore.getState().sidebarOpen && (openMenus === 'social-media' || currentPath.includes('/admin/social')) && (
              <div className="py-2 space-y-1 animate-in slide-in-from-top-2 duration-200 pl-4 border-l border-slate-800 ml-6 mt-1">
                <Link href="/admin/social/publisher">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/social/publisher' ? 'bg-purple-500/20 text-purple-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Publisher
                  </div>
                </Link>
                <Link href="/admin/social/analytics">
                  <div className={`block w-[95%] px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer ${currentPath === '/admin/social/analytics' ? 'bg-purple-500/20 text-purple-300 font-medium' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800'}`}>
                    Analytics
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Analytics Standalone - hidden */}
          <Link href="/admin/analytics">
            <div className={`hidden flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/analytics') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <PieChart className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/analytics') ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Analytics</span>}
              </div>
            </div>
          </Link>

          {/* User Standalone */}
          <Link href="/admin/users">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/users') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <User className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/users') ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Website Users</span>}
              </div>
            </div>
          </Link>
          
          {/* Settings Standalone */}
          <Link href="/admin/settings">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 cursor-pointer group ${currentPath.includes('/admin/settings') ? 'bg-slate-500/10 text-slate-300 border border-slate-500/30 shadow-[0_0_15px_rgba(148,163,184,0.15)]' : 'text-slate-400 hover:text-[#e2e8f0] hover:bg-slate-800/50'}`}>
              <div className="flex items-center space-x-3">
                <Settings className={`w-5 h-5 shrink-0 ${currentPath.includes('/admin/settings') ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(148,163,184,0.8)]' : 'group-hover:text-slate-300'}`} />
                {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Settings</span>}
              </div>
            </div>
          </Link>
        </nav>
      </div>
      
      <div className={`p-5 mt-auto border-t border-slate-800 ${sidebarOpen ? '' : 'flex justify-center px-2'}`}>
         <div className={`rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden relative group cursor-pointer ${sidebarOpen ? 'w-full h-14' : 'w-12 h-12'}`}>
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
           {sidebarOpen ? (
             <div className="flex items-center gap-2 relative z-10 group/logo">
                <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center group-hover/logo:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </div>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 tracking-wider text-lg uppercase drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-text-gradient">
                  GREG GORILLA HUB
                </span>
             </div>
           ) : (
             <div className="relative z-10 flex items-center justify-center">
               <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 tracking-tighter text-xl drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-text-gradient">
                 GH
               </span>
             </div>
           )}
         </div>
      </div>
    </aside>
  );
}

// Reusable Header Component
export function Header({ title }: { title: string }) {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="h-[72px] bg-[#0f172a]/90 backdrop-blur-xl flex items-center px-8 shrink-0 sticky top-0 z-20 border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <button 
        onClick={toggleSidebar}
        className="p-2 mr-4 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg border border-slate-600 bg-slate-950 transition-all group"
      >
        <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      
      <div className="flex items-center text-sm font-semibold text-slate-400 tracking-wide uppercase">
        Greg Wynn <span className="mx-3 text-slate-600">/</span> <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{title}</span>
      </div>

      <div className="ml-auto flex items-center space-x-6">
        <div className="relative hidden md:block w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text"
            placeholder="Global search..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 bg-slate-950 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
             <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-800 border border-slate-600 bg-slate-950 rounded">⌘</kbd>
             <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-800 border border-slate-600 bg-slate-950 rounded">K</kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)] hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Online
          </div>
          
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg border border-slate-600 bg-slate-950 transition-all relative group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ClientsPage({ isActiveOnly = false }: { isActiveOnly?: boolean }) {
  const { toast } = useToast();
  const [openMenus, setOpenMenus] = useState<string>('crm');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isSendMailModalOpen, setIsSendMailModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isStateSectionOpen, setIsStateSectionOpen] = useState(true);
  const [pinnedClients, setPinnedClients] = useState<Set<number>>(new Set());
  const [starredClients, setStarredClients] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [editingClientData, setEditingClientData] = useState<ClientEditFormData>(getDefaultClientEditFormData());
  const [newClientData, setNewClientData] = useState<ClientEditFormData>(getDefaultClientEditFormData());
  const [newClientPassword, setNewClientPassword] = useState("");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [editClientError, setEditClientError] = useState("");
  const [addClientError, setAddClientError] = useState("");
  const [deleteClientError, setDeleteClientError] = useState("");
  
  // State for dynamic links and toggles
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [clientLinks, setClientLinks] = useState([{ label: '', url: '' }]);
  
  const [location, navigate] = useLocation();

  const handleAddLink = () => {
    setClientLinks([...clientLinks, { label: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setClientLinks(clientLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...clientLinks];
    newLinks[index][field] = value;
    setClientLinks(newLinks);
  };

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setActiveFilter('All');
  };

  const resetNewClientForm = () => {
    setNewClientData(getDefaultClientEditFormData());
    setNewClientPassword("");
    setSendWelcomeEmail(true);
    setAddClientError("");
  };

  const openAddClientModal = () => {
    resetNewClientForm();
    setIsAddClientModalOpen(true);
  };

  const closeAddClientModal = () => {
    setIsAddClientModalOpen(false);
    resetNewClientForm();
  };

  const handleCreateClient = async () => {
    const validationMessage = validateClientCreateForm(newClientData, newClientPassword);
    if (validationMessage) {
      setAddClientError(validationMessage);
      toast({
        title: "Please check the form",
        description: validationMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingClient(true);
      setAddClientError("");

      const normalizedBackground = normalizeRichTextValue(newClientData.background);

      const response = await fetch("/api/admin/clients", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newClientData,
          name: newClientData.name.trim(),
          email: newClientData.email.trim(),
          phone: formatClientPhoneNumber(newClientData.phone),
          background: normalizedBackground,
          password: newClientPassword,
          sendWelcomeEmail,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || "Unable to create client");
      }

      const data = (await response.json()) as {
        client: ClientListItem;
        welcomeEmailSent?: boolean;
        warning?: string;
      };
      const createdClient = {
        ...data.client,
        status: normalizeClientStatus(data.client.status),
      };

      setAllClients((prev) => [createdClient, ...prev]);
      closeAddClientModal();
      toast({
        title: "Client created",
        description: data.warning || (sendWelcomeEmail ? "Client was created and the welcome email was sent." : "Client was created successfully."),
        variant: data.warning ? "destructive" : undefined,
      });
    } catch (error) {
      const message = getFriendlyClientSaveError(error);
      setAddClientError(message);
      toast({
        title: "Couldn’t create client",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingClient(false);
    }
  };

  const openEditClientModal = (client: ClientListItem, clientIndex: number) => {
    setSelectedClientIndex(clientIndex);
    setEditingClientData({
      name: client.name,
      email: client.email || "",
      phone: formatClientPhoneNumber(client.phone || ""),
      industry: client.industry || "Mortgage Client",
      status: normalizeClientStatus(client.status),
      background: client.background || "",
      photoUrl: client.photoUrl || "",
      photoDataUrl: "",
      photoFileName: "",
      removePhoto: false,
      currentAddress: client.currentAddress || "",
      loanPurpose: client.loanPurpose || "Purchase",
      propertyType: client.propertyType || "Single Family",
      estimatedValue: client.estimatedValue || "",
      downPayment: client.downPayment || "",
      targetLoanAmount: client.targetLoanAmount || "",
    });
    setIsEditorEnabled(Boolean(client.background?.trim()));
    setEditClientError("");
    setIsEditClientModalOpen(true);
  };

  const handleSaveClientChanges = async () => {
    if (selectedClientIndex === null) {
      return;
    }

    const selectedClient = allClients[selectedClientIndex];
    if (!selectedClient) {
      const message = "This client could not be found. Refresh the page and try again.";
      setEditClientError(message);
      toast({
        title: "Couldn’t update client",
        description: message,
        variant: "destructive",
      });
      return;
    }

    const validationMessage = validateClientEditForm(editingClientData);
    if (validationMessage) {
      setEditClientError(validationMessage);
      toast({
        title: "Please check the form",
        description: validationMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingClient(true);
      setEditClientError("");

      const normalizedBackground = normalizeRichTextValue(editingClientData.background);

      const response = await fetch(`/api/admin/clients/${selectedClient.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingClientData,
          name: editingClientData.name.trim(),
          email: editingClientData.email.trim(),
          phone: formatClientPhoneNumber(editingClientData.phone),
          background: normalizedBackground,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || "Unable to update client");
      }

      const data = (await response.json()) as { client: ClientListItem };
      const updatedClient = {
        ...data.client,
        status: normalizeClientStatus(data.client.status),
      };

      setAllClients((prev) =>
        prev.map((client) => client.id === selectedClient.id ? updatedClient : client)
      );
      setSelectedClientIndex(null);
      setIsEditClientModalOpen(false);
      toast({
        title: "Client profile updated",
        description: `${updatedClient.name} was saved successfully.`,
      });
    } catch (error) {
      const message = getFriendlyClientSaveError(error);
      setEditClientError(message);
      toast({
        title: "Couldn’t update client",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSavingClient(false);
    }
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => prev === menu ? '' : menu);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const togglePin = (index: number) => {
    setPinnedClients(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleStar = (index: number) => {
    setStarredClients(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    if (activeDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  const title = isActiveOnly ? "Active Clients" : "Clients";

  useEffect(() => {
    if (isActiveOnly && activeFilter !== 'All') {
      setActiveFilter('All');
      return;
    }

    if (!isActiveOnly && activeFilter === 'Active') {
      setActiveFilter('All');
    }
  }, [isActiveOnly, activeFilter]);

  const [allClients, setAllClients] = useState<ClientListItem[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientsError, setClientsError] = useState("");

  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadClients() {
      try {
        setIsLoadingClients(true);
        setClientsError("");

        const response = await fetch("/api/admin/clients", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load live clients");
        }

        const data = (await response.json()) as ClientsApiResponse;

        if (isMounted) {
          setAllClients(
            Array.isArray(data.clients)
              ? data.clients.map((client) => ({
                  ...client,
                  status: normalizeClientStatus(client.status),
                }))
              : [],
          );
        }
      } catch (error) {
        if (isMounted) {
          setAllClients([]);
          setClientsError(error instanceof Error ? error.message : "Unable to load live clients");
        }
      } finally {
        if (isMounted) {
          setIsLoadingClients(false);
        }
      }
    }

    loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

  const pageClients = allClients.filter((client) =>
    isActiveOnly ? client.status === 'Active' : client.status !== 'Active',
  );

  const filteredClients = pageClients.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
    const normalizedSearchQuery = appliedSearchQuery.toLowerCase();
    const searchableClientFields = [
      c.name,
      c.assigned,
      c.email,
      c.phone,
      c.currentAddress,
      c.loanPurpose,
      c.propertyType,
      c.estimatedValue,
      c.downPayment,
      c.targetLoanAmount,
    ];
    const matchesSearch = !appliedSearchQuery || searchableClientFields.some((field) =>
      (field ?? "").toLowerCase().includes(normalizedSearchQuery),
    );
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Clients', count: allClients.length, colorClass: 'border-purple-500', filterValue: 'All', pageScope: 'clients' },
    { label: 'Active Clients', count: allClients.filter(c=>c.status==='Active').length, colorClass: 'border-purple-400', filterValue: 'All', pageScope: 'active' },
    { label: 'Brand New Clients', count: allClients.filter(c=>c.status==='Brand New').length, colorClass: 'border-indigo-400', filterValue: 'Brand New', pageScope: 'clients' },
    { label: 'Lead Clients', count: allClients.filter(c=>c.status==='Lead').length, colorClass: 'border-blue-500', filterValue: 'Lead', pageScope: 'clients' },
    { label: 'Nurture Clients', count: allClients.filter(c=>c.status==='Nurture').length, colorClass: 'border-cyan-500', filterValue: 'Nurture', pageScope: 'clients' },
    { label: 'Suspended Clients', count: allClients.filter(c=>c.status==='Suspended').length, colorClass: 'border-orange-400', filterValue: 'Suspended', pageScope: 'clients' },
    { label: 'Hot Clients', count: allClients.filter(c=>c.status==='Hot').length, colorClass: 'border-orange-300', filterValue: 'Hot', pageScope: 'clients' },
    { label: 'Inactive Clients', count: allClients.filter(c=>c.status==='Inactive').length, colorClass: 'border-rose-400', filterValue: 'Inactive', pageScope: 'clients' },
  ];

  const handleStatsFilter = (stat: typeof stats[number]) => {
    const targetPath = stat.pageScope === 'active' ? '/admin/clients/active' : '/admin/clients';

    if (location !== targetPath) {
      navigate(targetPath);
    }

    setActiveFilter(stat.filterValue);
  };

  const isStatsCardSelected = (stat: typeof stats[number]) => {
    const currentScope = isActiveOnly ? 'active' : 'clients';
    return stat.pageScope === currentScope && activeFilter === stat.filterValue;
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title={title} />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-7xl mx-auto">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{title}</h1>
                  <p className="text-slate-400 text-sm">{isActiveOnly ? "Manage and monitor active client accounts" : "Manage and monitor all non-active client accounts"}</p>
                </div>
                <Button 
                  onClick={openAddClientModal}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2 border-none"
                >
                  <Plus className="w-5 h-5" /> New Client
                </Button>
              </div>

              
              {/* Tasks Needed Section */}
              <div className="mb-8 bg-slate-800 rounded-xl border border-slate-600 bg-slate-950 border-t-purple-500 border-t-4 shadow-lg overflow-hidden relative z-10">
                <div className="p-4 bg-purple-900/30 border-b border-purple-500/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-white text-[15px]">Tasks Needed - FOLLOW UPS</span>
                  </div>
                  <Link href="/admin/tasks">
                    <button className="text-[12px] font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-lg">
                      View All Tasks <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-slate-600 bg-slate-950/80">
                      <tr>
                        <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Task</th>
                        <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Client</th>
                        <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
                        <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                        <th className="py-3 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {[
                        { task: 'Initial Discovery Call', client: 'NexGen Dynamics', date: 'Today', priority: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                        { task: 'Send Proposal', client: 'Aqua Pure', date: 'Tomorrow', priority: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                        { task: 'Website Audit', client: 'HealthPlus+', date: 'Apr 10, 2026', priority: 'Normal', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                        { task: 'Setup Email Campaign', client: 'Red Hot Sales', date: 'Apr 12, 2026', priority: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                      ].map((task, i) => (
                        <tr key={i} className="hover:bg-slate-700/30 transition-colors group">
                          <td className="py-3.5 px-5 text-[13px] font-medium text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
                            {task.task}
                          </td>
                          <td className="py-3.5 px-5 text-[13px] text-slate-300">
                            {task.client}
                          </td>
                          <td className="py-3.5 px-5 text-[13px] text-slate-400">
                            {task.date}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${task.color}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-[11px] font-bold transition-colors">
                              Mark Done
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Bar & Filters */}

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-panel p-4 rounded-2xl border-t-cyan-500 border-t-4 shadow-lg bg-cyan-900/10">
                  <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="relative min-w-[200px] flex-1 md:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-600 bg-slate-950 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500" 
                      />
                    </div>
                    
                    <button 
                      onClick={handleSearch}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 text-sm font-medium shrink-0"
                    >
                      Filter <Filter className="w-4 h-4" />
                    </button>

                    {(appliedSearchQuery || activeFilter !== 'All') && (
                      <button 
                        onClick={handleReset}
                        className="px-4 py-2.5 bg-slate-800/50 border border-slate-600 bg-slate-950 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium shrink-0"
                      >
                        Reset
                      </button>
                    )}

                    <button 
                      onClick={() => setIsStateSectionOpen(!isStateSectionOpen)}
                      className={`p-2.5 border rounded-xl transition-all flex items-center justify-center shrink-0 ${isStateSectionOpen ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-800 border-slate-600 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                      <TrendingUp className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/admin/tasks?tab=today">
                        <button className="px-3 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl text-sm text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">Tasks 0</button>
                      </Link>
                      <Link href="/admin/tasks?tab=missing">
                        <button className="px-3 py-2 bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl text-sm text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">Missing Tasks 0</button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <button 
                      onClick={() => setIsExportPanelOpen(true)}
                      className="px-4 py-2.5 bg-slate-800 border border-slate-600 bg-slate-950 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>

                {/* State Section Toggle */}
                {isStateSectionOpen && (
                  <div className="glass-panel p-6 rounded-2xl border-t border-indigo-500/30 animate-in slide-in-from-top-4 fade-in duration-300 overflow-x-auto scrollbar-hide">
                    <div className="flex md:grid md:grid-cols-4 lg:grid-cols-8 gap-6 min-w-[800px]">
                      {stats.map((stat, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleStatsFilter(stat)}
                          className={`flex flex-col gap-2 flex-1 border-b-[3px] pb-3 cursor-pointer transition-all hover:bg-slate-800/30 rounded-t-lg px-2 pt-2 -mx-2 hover:-translate-y-1 ${stat.colorClass} ${isStatsCardSelected(stat) ? 'bg-slate-800/50 shadow-[inset_0_-4px_10px_-4px_rgba(255,255,255,0.1)]' : ''}`}
                        >
                          <span className="text-3xl font-bold text-white">{stat.count}</span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="glass-panel rounded-2xl overflow-visible border-t-indigo-500 border-t-4 shadow-lg pb-[100px] bg-indigo-900/10">
                <div className="overflow-visible">
                  <table className="w-full text-left dark-table">
                    <thead>
                      <tr>
                        <th className="py-4 px-6">Client Name</th>
                        <th className="py-4 px-6">Loan Purpose</th>
                        <th className="py-4 px-6 text-right">Target Loan</th>
                        <th className="py-4 px-6">Contacted</th>
                        <th className="py-4 px-6">Assigned To</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingClients ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            Loading clients...
                          </td>
                        </tr>
                      ) : filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            {clientsError || (isActiveOnly ? "No active clients found." : "No non-active clients found matching your criteria.")}
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map((client, i) => {
                          const clientIndex = allClients.findIndex((savedClient) => savedClient.id === client.id);
                          const listIndex = clientIndex === -1 ? i : clientIndex;
                          const isPinned = pinnedClients.has(listIndex);
                          const isStarred = starredClients.has(listIndex);
                          
                          return (
                          <tr key={client.id} className={`group ${isPinned ? 'bg-amber-500/5 border-l-2 border-l-amber-400' : 'border-l-2 border-l-transparent'}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-600 bg-slate-950 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors overflow-hidden">
                                {client.photoUrl ? (
                                  <img src={client.photoUrl} alt={`${client.name} photo`} className="h-full w-full object-cover" />
                                ) : (
                                  <Building2 className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link href={`/admin/clients/${client.id}`}>
                                  <span className="text-sm font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2">
                                    {client.name}
                                    {isStarred && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />}
                                  </span>
                                </Link>
                                {(client.email || client.phone) && (
                                  <div className="mt-1 text-[11px] text-slate-500 truncate max-w-[260px]">
                                    {[client.email, client.phone].filter(Boolean).join(" • ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-300">
                            <div className="font-medium text-slate-200">{getClientListValue(client.loanPurpose)}</div>
                            <div className="mt-1 text-xs text-slate-500">{getClientListValue(client.propertyType)}</div>
                          </td>
                          <td className="py-4 px-6 text-sm text-right">
                            <div className="font-mono font-semibold text-emerald-300">{getClientTargetLoanDisplay(client)}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {client.estimatedValue?.trim() ? `Value: ${client.estimatedValue}` : "Value not added"}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-400">{client.contacted}</td>
                          <td className="py-4 px-6 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                {client.assigned.charAt(0)}
                              </div>
                              <span className="truncate max-w-[120px]">{client.assigned}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${
                              client.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                              client.status === 'Suspended' ? 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]' :
                              client.status === 'Brand New' ? 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20 shadow-[0_0_10px_rgba(129,140,248,0.1)]' :
                              client.status === 'Lead' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' :
                              client.status === 'Nurture' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20 shadow-[0_0_10px_rgba(192,132,252,0.1)]' :
                              client.status === 'Hot' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20 shadow-[0_0_10px_rgba(251,146,60,0.1)]' :
                              'text-slate-400 bg-slate-400/10 border-slate-400/20 shadow-[0_0_10px_rgba(148,163,184,0.1)]'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === listIndex ? null : listIndex);
                              }}
                              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-auto"
                            >
                              Action <ChevronDown className="w-4 h-4" />
                            </button>

                            {activeDropdown === listIndex && (
                              <div className="absolute right-6 top-full mt-2 w-48 bg-slate-900 border border-slate-600 bg-slate-950 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                <div className="py-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedClientIndex(listIndex); setDeleteClientError(""); setIsSuspendModalOpen(true); setActiveDropdown(null); }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-400" /> Delete
                                  </button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      openEditClientModal(client, listIndex);
                                      setActiveDropdown(null); 
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                  >
                                    <Edit className="w-4 h-4 text-teal-400" /> Edit
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setIsSendMailModalOpen(true); setActiveDropdown(null); }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                  >
                                    <Mail className="w-4 h-4 text-purple-400" /> Send email
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); togglePin(listIndex); setActiveDropdown(null); }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                  >
                                    <Pin className={`w-4 h-4 ${pinnedClients.has(listIndex) ? 'text-indigo-400 fill-indigo-400' : 'text-slate-400'}`} /> Pinning
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleStar(listIndex); setActiveDropdown(null); }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                                  >
                                    <Star className={`w-4 h-4 ${starredClients.has(listIndex) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} /> Star Client
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {useAppStore.getState().sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}

      <EditClientProfileModal
        isOpen={isAddClientModalOpen}
        mode="create"
        clientData={newClientData}
        setClientData={setNewClientData}
        isSaving={isCreatingClient}
        errorMessage={addClientError}
        password={newClientPassword}
        setPassword={setNewClientPassword}
        sendWelcomeEmail={sendWelcomeEmail}
        setSendWelcomeEmail={setSendWelcomeEmail}
        onClose={closeAddClientModal}
        onSave={handleCreateClient}
      />
      <EditClientProfileModal
        isOpen={isEditClientModalOpen}
        clientData={editingClientData}
        setClientData={setEditingClientData}
        isSaving={isSavingClient}
        errorMessage={editClientError}
        isEditorEnabled={isEditorEnabled}
        setIsEditorEnabled={setIsEditorEnabled}
        onClose={() => {
          setIsEditClientModalOpen(false);
          setEditClientError("");
        }}
        onSave={handleSaveClientChanges}
      />

      {/* Send Mail Modal */}
      {isSendMailModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSendMailModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Send email</h2>
              <button 
                onClick={() => setIsSendMailModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none">
                  <option>Select recipient...</option>
                  <option>vikas@pinkgorillasoftware.com</option>
                  <option>maria@pir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="Enter subject"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Use A Template</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none">
                  <option>Select template...</option>
                  <option>Welcome Email</option>
                  <option>Follow Up</option>
                </select>
              </div>

              {/* Rich Text Editor */}
              <div className="border border-slate-600 bg-slate-950 rounded-xl overflow-hidden bg-slate-950">
                <div className="px-4 py-2 border-b border-slate-600 bg-slate-950 flex items-center gap-4 text-slate-400 overflow-x-auto">
                  <button className="hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
                  <button className="hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></button>
                  <button className="hover:text-white transition-colors"><List className="w-4 h-4" /></button>
                  <button className="hover:text-white transition-colors"><AlignLeft className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-slate-700"></div>
                  <button className="hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <button className="hover:text-white transition-colors"><Video className="w-4 h-4" /></button>
                </div>
                <textarea 
                  className="w-full h-48 px-4 py-3 bg-transparent text-sm text-white focus:outline-none resize-none placeholder:text-slate-600"
                  placeholder="Write your email here..."
                ></textarea>
              </div>

              {/* File Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-600 bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all cursor-pointer group">
                <UploadCloud className="w-10 h-10 mb-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <p className="text-sm font-medium">Drop files here or click to upload</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
              <button 
                onClick={() => setIsSendMailModalOpen(false)}
                className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => setIsSendMailModalOpen(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Client Modal (Used for Delete/Suspend) */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <h2 className="text-[20px] font-bold text-white mb-2">Delete Client</h2>
            <p className="text-[15px] text-slate-300 mb-6">
              Are you sure?
            </p>
            {deleteClientError && (
              <p className="text-sm text-rose-400 mb-4 text-center">{deleteClientError}</p>
            )}

            <div className="flex items-center justify-center gap-4 w-full">
              <button
                disabled={isDeletingClient}
                onClick={() => { setIsSuspendModalOpen(false); setDeleteClientError(""); }}
                className="px-6 py-2.5 bg-[#1e293b] border border-slate-600 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors w-28"
              >
                Cancel
              </button>
              <button
                disabled={isDeletingClient}
                onClick={async () => {
                  if (selectedClientIndex === null) return;
                  const clientToDelete = allClients[selectedClientIndex];
                  if (!clientToDelete) return;
                  setIsDeletingClient(true);
                  setDeleteClientError("");
                  try {
                    const response = await fetch(`/api/admin/clients/${clientToDelete.id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    if (!response.ok) {
                      const errorBody = await response.json().catch(() => null);
                      throw new Error(errorBody?.message || "Failed to delete client");
                    }
                    setAllClients(prev => prev.filter((_, i) => i !== selectedClientIndex));
                    setSelectedClientIndex(null);
                    setIsSuspendModalOpen(false);
                  } catch (err) {
                    setDeleteClientError(err instanceof Error ? err.message : "Failed to delete client");
                  } finally {
                    setIsDeletingClient(false);
                  }
                }}
                className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all w-28 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {isDeletingClient ? "Deleting..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Slide-in Panel */}
      {isExportPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsExportPanelOpen(false)}
          ></div>
          
          {/* Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 text-white">
                <Download className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Export Clients</h2>
              </div>
              <button 
                onClick={() => setIsExportPanelOpen(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
              {/* Date Created */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Date Created</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">Today</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">This Week</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">This Month</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-600 bg-slate-950 rounded-md hover:bg-slate-800 hover:text-white transition-colors">All Time</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="From"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50" 
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="To"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 shadow-inner focus:border-sky-500 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50" 
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              {/* Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Client Name", "Date Created", 
                    "Client Email", "Phone No.",
                    "Loan Purpose", "Target Loan",
                    "Property Type", "Status"
                  ].map((field) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="w-5 h-5 rounded border border-slate-600 bg-slate-950 bg-slate-900 peer-checked:bg-[#8b5cf6] peer-checked:border-[#8b5cf6] transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0)] peer-checked:shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                          <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-center">
              <button 
                onClick={() => {
                  // Client export logic
                  import('xlsx').then(XLSX => {
                    const ws = XLSX.utils.json_to_sheet(allClients);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Clients");
                    XLSX.writeFile(wb, "clients_export.xlsx");
                    setIsExportPanelOpen(false);
                  });
                }}
                className="w-1/2 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all"
              >
                Export
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
