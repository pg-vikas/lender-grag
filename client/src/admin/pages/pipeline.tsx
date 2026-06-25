import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { Header, Sidebar } from "./clients";
import {
  Search, Filter, Plus, Clock, AlertCircle,
  CheckCircle2, DollarSign, Percent, TrendingUp, Calendar,
  Edit2, X, ChevronDown, Loader2, User,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/admin/components/ui/sheet";
import { apiRequest } from "@/admin/lib/queryClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoanStage =
  | "application"
  | "processing"
  | "underwriting"
  | "conditional_approval"
  | "clear_to_close"
  | "funded";

type LoanStatus = "active" | "cancelled" | "archived" | "funded";

type AdminLoanRecord = {
  id: string;
  clientUserId: string;
  loanNumber: string;
  stage: LoanStage;
  loanStatus: LoanStatus;
  loanType: string;
  loanPurpose: string;
  loanAmount: string;
  propertyType: string;
  propertyAddress: string;
  estimatedValue: string;
  downPayment: string;
  ltv: string;
  ficoScore: string;
  coBorrowerName: string;
  interestRate: string;
  rateType: string;
  rateLockExpiresAt: string | null;
  applicationSubmittedAt: string;
  documentsReceivedAt: string | null;
  processingStartedAt: string | null;
  underwritingStartedAt: string | null;
  conditionalApprovalAt: string | null;
  clearToCloseAt: string | null;
  fundedAt: string | null;
  assignedTo: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
};

type ClientOption = { id: string; name: string; email: string };
type AdminUser = { id: string; fullName: string; email: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const DB_STAGES: LoanStage[] = [
  "application", "processing", "underwriting",
  "conditional_approval", "clear_to_close", "funded",
];

const STAGE_LABELS: Record<LoanStage, string> = {
  application: "Application",
  processing: "Processing",
  underwriting: "Underwriting",
  conditional_approval: "Conditional Approval",
  clear_to_close: "Clear to Close",
  funded: "Funded",
};

const STAGE_COLORS: Record<LoanStage, string> = {
  application:         "bg-slate-800 text-slate-300 border border-slate-700",
  processing:          "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  underwriting:        "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  conditional_approval:"bg-purple-500/10 text-purple-400 border border-purple-500/20",
  clear_to_close:      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  funded:              "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
};

const LOAN_TYPES = [
  "Conventional 30YR", "Conventional 15YR", "FHA 30YR", "FHA 15YR",
  "VA 30YR", "VA 15YR", "USDA 30YR", "Jumbo 30YR", "Jumbo 15YR",
  "ARM 5/1", "ARM 7/1", "ARM 10/1",
];

const PROPERTY_TYPES = [
  "Single Family", "Condo", "Townhouse", "Multi-Family (2-4 units)",
  "Manufactured Home", "Co-op",
];

const RATE_TYPES = ["Fixed", "Floating", "ARM"];
const LOAN_PURPOSES = ["Purchase", "Refinance", "Cash-Out Refinance", "Rate & Term Refinance"];
const LOAN_STATUSES: LoanStatus[] = ["active", "cancelled", "archived", "funded"];

const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  archived: "Archived",
  funded: "Funded",
};

const LOAN_STATUS_COLORS: Record<LoanStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  archived: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  funded: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseDollars(val: string): number {
  return parseFloat(val.replace(/[$,]/g, "")) || 0;
}

function formatDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

function lockLabel(loan: AdminLoanRecord): string {
  const days = daysUntil(loan.rateLockExpiresAt);
  if (days === null) return "Floating";
  if (days <= 0) return "Expired";
  return `Exp: ${days} Days`;
}

function lockIsUrgent(loan: AdminLoanRecord): boolean {
  const days = daysUntil(loan.rateLockExpiresAt);
  return days !== null && days <= 7 && days > 0;
}

// ─── Form defaults ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  clientUserId: "",
  coBorrowerName: "",
  stage: "application" as LoanStage,
  loanStatus: "active" as LoanStatus,
  loanType: "",
  loanPurpose: "Purchase",
  loanAmount: "",
  propertyType: "",
  propertyAddress: "",
  estimatedValue: "",
  downPayment: "",
  ltv: "",
  ficoScore: "",
  interestRate: "",
  rateType: "Fixed",
  rateLockExpiresAt: "",
  assignedTo: "Greg Wynn",
};

type LoanForm = typeof EMPTY_FORM;

function loanToForm(loan: AdminLoanRecord): LoanForm {
  return {
    clientUserId: loan.clientUserId,
    coBorrowerName: loan.coBorrowerName,
    stage: loan.stage,
    loanStatus: loan.loanStatus ?? "active",
    loanType: loan.loanType,
    loanPurpose: loan.loanPurpose,
    loanAmount: loan.loanAmount,
    propertyType: loan.propertyType,
    propertyAddress: loan.propertyAddress,
    estimatedValue: loan.estimatedValue ?? "",
    downPayment: loan.downPayment ?? "",
    ltv: loan.ltv,
    ficoScore: loan.ficoScore,
    interestRate: loan.interestRate,
    rateType: loan.rateType || "Fixed",
    rateLockExpiresAt: loan.rateLockExpiresAt
      ? new Date(loan.rateLockExpiresAt).toISOString().split("T")[0]
      : "",
    assignedTo: loan.assignedTo,
  };
}

// ─── Shared form fields renderer ──────────────────────────────────────────────

function LoanFormFields({
  form,
  setForm,
  clients,
  adminUsers,
  showClientField,
  clientSearch,
  setClientSearch,
  clientDropdownOpen,
  setClientDropdownOpen,
}: {
  form: LoanForm;
  setForm: (fn: (prev: LoanForm) => LoanForm) => void;
  clients: ClientOption[];
  adminUsers: AdminUser[];
  showClientField: boolean;
  clientSearch: string;
  setClientSearch: (v: string) => void;
  clientDropdownOpen: boolean;
  setClientDropdownOpen: (v: boolean) => void;
}) {
  const field = (key: keyof LoanForm, label: string, type: "text" | "select" | "date" = "text", options?: string[]) => (
    <div>
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {type === "select" && options ? (
        <select
          value={form[key] as string}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          {key !== "stage" && <option value="">— Select —</option>}
          {options.map((o) => (
            <option key={o} value={key === "stage" ? DB_STAGES[DB_STAGES.indexOf(o as LoanStage)] : o}>
              {key === "stage" ? STAGE_LABELS[o as LoanStage] : o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
          placeholder=""
        />
      )}
    </div>
  );

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const selectedClient = clients.find((c) => c.id === form.clientUserId);

  return (
    <div className="space-y-4">
      {showClientField && (
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Borrower (Client) *</label>
          <div className="relative">
            <div
              onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white cursor-pointer flex items-center justify-between hover:border-indigo-500 transition-colors"
            >
              {selectedClient ? (
                <span>{selectedClient.name} <span className="text-slate-500 text-xs">({selectedClient.email})</span></span>
              ) : (
                <span className="text-slate-500">Search for a client…</span>
              )}
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            </div>
            {clientDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-slate-700">
                  <input
                    autoFocus
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <p className="p-3 text-sm text-slate-500 text-center">No clients found</p>
                  ) : (
                    filteredClients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setForm((p) => ({ ...p, clientUserId: c.id }));
                          setClientDropdownOpen(false);
                          setClientSearch("");
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-700 transition-colors text-sm"
                      >
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.email}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {field("stage", "Loan Stage", "select", DB_STAGES as unknown as string[])}
        {field("coBorrowerName", "Co-Borrower Name")}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Loan Status</label>
          <select
            value={form.loanStatus}
            onChange={(e) => setForm((p) => ({ ...p, loanStatus: e.target.value as LoanStatus }))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {LOAN_STATUSES.map((s) => (
              <option key={s} value={s}>{LOAN_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Loan Details</p>
        <div className="grid grid-cols-2 gap-3">
          {field("loanType", "Loan Type", "select", LOAN_TYPES)}
          {field("loanPurpose", "Purpose", "select", LOAN_PURPOSES)}
          {field("estimatedValue", "Estimated Value")}
          {field("downPayment", "Down Payment")}
          {field("loanAmount", "Loan Amount")}
          {field("propertyType", "Property Type", "select", PROPERTY_TYPES)}
          {field("ltv", "LTV %")}
          {field("ficoScore", "FICO Score")}
        </div>
        <div className="mt-3">
          {field("propertyAddress", "Property Address")}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Rate & Lock</p>
        <div className="grid grid-cols-3 gap-3">
          {field("interestRate", "Rate")}
          {field("rateType", "Rate Type", "select", RATE_TYPES)}
          {field("rateLockExpiresAt", "Lock Expires", "date")}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned To</label>
          <select
            value={form.assignedTo}
            onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">— Select Admin —</option>
            {adminUsers.map((u) => (
              <option key={u.id} value={u.fullName}>{u.fullName}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Loan Sheet ──────────────────────────────────────────────────────────

function EditLoanSheet({
  loan,
  clients,
  adminUsers,
  onClose,
  onSaved,
}: {
  loan: AdminLoanRecord;
  clients: ClientOption[];
  adminUsers: AdminUser[];
  onClose: () => void;
  onSaved: (updated: AdminLoanRecord) => void;
}) {
  const [form, setForm] = useState<LoanForm>(() => loanToForm(loan));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {};
      (Object.keys(form) as (keyof LoanForm)[]).forEach((k) => {
        if (k === "clientUserId") return;
        const val = form[k];
        if (k === "rateLockExpiresAt") {
          body[k] = val ? new Date(val as string).toISOString() : null;
        } else {
          body[k] = val;
        }
      });

      const res = await apiRequest("PATCH", `/api/admin/pipeline/${loan.id}`, body);
      const data = (await res.json()) as { loan: AdminLoanRecord };
      onSaved(data.loan);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <SheetHeader>
            <SheetTitle>Edit Loan #{loan.loanNumber}</SheetTitle>
            <SheetDescription>{loan.borrowerName} · {loan.borrowerEmail}</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <LoanFormFields
            form={form}
            setForm={setForm}
            clients={clients}
            adminUsers={adminUsers}
            showClientField={false}
            clientSearch=""
            setClientSearch={() => {}}
            clientDropdownOpen={false}
            setClientDropdownOpen={() => {}}
          />
        </div>

        {error && (
          <div className="px-6 py-2 bg-rose-500/10 border-t border-rose-500/20">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        <div className="p-6 border-t border-slate-800 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── New Loan Sheet ───────────────────────────────────────────────────────────

function NewLoanSheet({
  clients,
  adminUsers,
  onClose,
  onCreated,
}: {
  clients: ClientOption[];
  adminUsers: AdminUser[];
  onClose: () => void;
  onCreated: (loan: AdminLoanRecord) => void;
}) {
  const [form, setForm] = useState<LoanForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  const handleCreate = async () => {
    if (!form.clientUserId) {
      setError("Please select a borrower");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = { ...form };
      if (form.rateLockExpiresAt) {
        body.rateLockExpiresAt = new Date(form.rateLockExpiresAt).toISOString();
      } else {
        body.rateLockExpiresAt = null;
      }

      const res = await apiRequest("POST", "/api/admin/pipeline", body);
      const data = (await res.json()) as { loan: AdminLoanRecord };
      onCreated(data.loan);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create loan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <SheetHeader>
            <SheetTitle>New Loan</SheetTitle>
            <SheetDescription>Create a loan record for an existing client</SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <LoanFormFields
            form={form}
            setForm={setForm}
            clients={clients}
            adminUsers={adminUsers}
            showClientField
            clientSearch={clientSearch}
            setClientSearch={setClientSearch}
            clientDropdownOpen={clientDropdownOpen}
            setClientDropdownOpen={setClientDropdownOpen}
          />
        </div>

        {error && (
          <div className="px-6 py-2 bg-rose-500/10 border-t border-rose-500/20">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        <div className="p-6 border-t border-slate-800 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Creating…" : "Create Loan"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Row Action Menu ──────────────────────────────────────────────────────────

function RowActionMenu({
  onEdit,
  onViewClient,
}: {
  onEdit: () => void;
  onViewClient: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-auto"
      >
        Action <ChevronDown className="w-4 h-4" />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
          className="w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> Edit Loan
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onViewClient(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" /> View Client
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [location, navigate] = useLocation();
  const [openMenus, setOpenMenus] = useState<string>("pipeline");
  const [activeStage, setActiveStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [loans, setLoans] = useState<AdminLoanRecord[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [editingLoan, setEditingLoan] = useState<AdminLoanRecord | null>(null);
  const [newLoanOpen, setNewLoanOpen] = useState(false);

  const toggleMenu = (menu: string) => setOpenMenus(openMenus === menu ? "" : menu);

  // ── Fetch loans + clients on mount ─────────────────────────────────────────
  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/pipeline", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load pipeline");
      const data = (await res.json()) as { loans: AdminLoanRecord[] };
      setLoans(data.loans);
    } catch {
      setFetchError("Could not load loan pipeline. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLoans();
    fetch("/api/admin/clients", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data: { clients: ClientOption[] } | null) => {
        if (data?.clients) setClients(data.clients);
      })
      .catch(() => undefined);
    fetch("/api/admin/team", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data: { admins: AdminUser[] } | null) => {
        if (data?.admins) setAdminUsers(data.admins);
      })
      .catch(() => undefined);
  }, [fetchLoans]);

  // ── Derived KPIs ───────────────────────────────────────────────────────────
  const activeLoans = loans.filter((l) => l.stage !== "funded");
  const pipelineVolume = activeLoans.reduce((s, l) => s + parseDollars(l.loanAmount), 0);
  const clearToCloseCount = loans.filter((l) => l.stage === "clear_to_close").length;
  const expiringCount = loans.filter(
    (l) => l.rateLockExpiresAt && daysUntil(l.rateLockExpiresAt) !== null && daysUntil(l.rateLockExpiresAt)! <= 7 && daysUntil(l.rateLockExpiresAt)! > 0,
  ).length;
  const fundedVolume = loans.filter((l) => l.stage === "funded").reduce((s, l) => s + parseDollars(l.loanAmount), 0);

  // ── Filtered table rows ────────────────────────────────────────────────────
  const filteredLoans = loans.filter((loan) => {
    const stageMatch = activeStage === "All" || loan.stage === activeStage;
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || loan.borrowerName.toLowerCase().includes(q) || loan.loanNumber.includes(q);
    return stageMatch && searchMatch;
  });

  const stageCounts = Object.fromEntries(
    DB_STAGES.map((s) => [s, loans.filter((l) => l.stage === s).length]),
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-500/10 via-[#0f172a] to-[#0f172a] pointer-events-none" />
        <Header title="Loan Pipeline" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10 p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Active Pipeline</h1>
                <p className="text-slate-400 mt-1 text-[14px]">Manage your active loans and track progress.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search borrower or loan #"
                    className="w-64 pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[13px] font-bold transition-all border border-slate-700">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button
                  onClick={() => setNewLoanOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  <Plus className="w-4 h-4" /> New Loan
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[11px] font-bold">{activeLoans.length} active</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Active Pipeline Volume</h3>
                <p className="text-2xl font-bold text-white">{pipelineVolume > 0 ? `$${pipelineVolume.toLocaleString()}` : "—"}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  {clearToCloseCount > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">{clearToCloseCount} closing</span>
                  )}
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Clear to Close</h3>
                <p className="text-2xl font-bold text-white">{clearToCloseCount} Loan{clearToCloseCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  {expiringCount > 0 && (
                    <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[11px] font-bold">{expiringCount} expiring</span>
                  )}
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Locks Expiring (&lt; 7 Days)</h3>
                <p className="text-2xl font-bold text-white">{expiringCount} Loan{expiringCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold">YTD</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Funded Volume</h3>
                <p className="text-2xl font-bold text-white">{fundedVolume > 0 ? formatDollars(fundedVolume) : "—"}</p>
              </div>
            </div>

            {/* Stage Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveStage("All")}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeStage === "All" ? "bg-indigo-500 text-white shadow-md" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"}`}
              >
                All Active ({loans.length})
              </button>
              {DB_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeStage === stage ? "bg-indigo-500 text-white shadow-md" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"}`}
                >
                  {STAGE_LABELS[stage]} ({stageCounts[stage] ?? 0})
                </button>
              ))}
            </div>

            {/* Pipeline Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              {loading ? (
                <div className="flex items-center justify-center p-16 gap-3 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading pipeline…
                </div>
              ) : fetchError ? (
                <div className="flex items-center justify-center p-16 gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5" /> {fetchError}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-800">
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Borrower / Loan #</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Stage</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Amount / Product</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">Rate / Lock</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">FICO</th>
                        <th className="p-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((loan) => (
                        <tr
                          key={loan.id}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                          onClick={() => setEditingLoan(loan)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                                {loan.borrowerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                  {loan.borrowerName}
                                  {loan.coBorrowerName && (
                                    <span className="text-slate-400 font-normal"> &amp; {loan.coBorrowerName}</span>
                                  )}
                                </div>
                                <div className="text-[12px] text-slate-500 font-mono mt-0.5">#{loan.loanNumber}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold ${STAGE_COLORS[loan.stage]}`}>
                              {loan.stage === "clear_to_close" && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {loan.stage === "underwriting" && <Clock className="w-3.5 h-3.5" />}
                              {STAGE_LABELS[loan.stage]}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${LOAN_STATUS_COLORS[loan.loanStatus ?? "active"]}`}>
                              {LOAN_STATUS_LABELS[loan.loanStatus ?? "active"]}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{loan.loanAmount || "—"}</div>
                            <div className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-2">
                              {loan.loanType || "—"}
                              {loan.ltv && <><span className="text-slate-600">•</span> LTV: {loan.ltv}</>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white flex items-center gap-1">
                              {loan.interestRate || "—"}
                              {loan.interestRate && <Percent className="w-3 h-3 text-slate-500" />}
                            </div>
                            <div className={`text-[12px] mt-0.5 flex items-center gap-1 ${lockIsUrgent(loan) ? "text-rose-400 font-medium" : "text-slate-400"}`}>
                              {loan.rateLockExpiresAt && <Calendar className="w-3 h-3" />}
                              {lockLabel(loan)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold text-white">{loan.ficoScore || "—"}</span>
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <RowActionMenu
                              onEdit={() => setEditingLoan(loan)}
                              onViewClient={() => navigate(`/admin/clients/${loan.clientUserId}`)}
                            />
                          </td>
                        </tr>
                      ))}
                      {filteredLoans.length === 0 && !loading && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-500">
                            {searchQuery || activeStage !== "All"
                              ? "No loans match your filter."
                              : "No loan records yet. Use the + New Loan button above to get started."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Modals */}
      {editingLoan && (
        <EditLoanSheet
          loan={editingLoan}
          clients={clients}
          adminUsers={adminUsers}
          onClose={() => setEditingLoan(null)}
          onSaved={(updated) => {
            setLoans((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            setEditingLoan(null);
          }}
        />
      )}

      {newLoanOpen && (
        <NewLoanSheet
          clients={clients}
          adminUsers={adminUsers}
          onClose={() => setNewLoanOpen(false)}
          onCreated={(loan) => setLoans((prev) => [loan, ...prev])}
        />
      )}

    </div>
  );
}
