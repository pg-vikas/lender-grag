import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { motion } from "framer-motion";
import {
  Settings, Building2, Users, Bell, Shield, Palette, Globe, Database,
  Key, FileText, Mail, MessageSquare, Zap, ChevronRight, Save,
  CheckCircle2, ToggleLeft, ToggleRight
} from "lucide-react";


const sections = [
  { key: "company", label: "Company Profile", icon: Building2, description: "Business info, branding, and contact details" },
  { key: "users", label: "User Management", icon: Users, description: "User invitations, roles, and access control" },
  { key: "notifications", label: "Notifications", icon: Bell, description: "Email, SMS, and in-app notification preferences" },
  { key: "compliance", label: "Compliance Rules", icon: Shield, description: "Auto-flag rules, audit settings, and SLA thresholds" },
  { key: "branding", label: "Branding & Theme", icon: Palette, description: "Colors, logos, and portal appearance" },
  { key: "integrations", label: "Integrations", icon: Globe, description: "CRM, LOS, and third-party connections" },
  { key: "data", label: "Data & Storage", icon: Database, description: "Backup, export, and retention policies" },
  { key: "security", label: "Security", icon: Key, description: "MFA, session policies, and IP restrictions" },
  { key: "templates", label: "Email Templates", icon: Mail, description: "Customize automated email templates" },
  { key: "sms", label: "SMS Templates", icon: MessageSquare, description: "Customize automated SMS messages" },
  { key: "automations", label: "Automation Rules", icon: Zap, description: "Global automation settings and limits" },
  { key: "documents", label: "Document Settings", icon: FileText, description: "Required docs, naming conventions, and categories" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

function CompanySection() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Company Name</label>
        <input defaultValue="Lender Greg / Wynn Capital Mortgage" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-company-name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">NMLS #</label>
          <input defaultValue="123456" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-nmls" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Phone</label>
          <input defaultValue="(619) 550-9885" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-phone" />
        </div>
      </div>
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Primary Email</label>
        <input defaultValue="admin@lendergreg.com" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-email" />
      </div>
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Address</label>
        <input defaultValue="123 Main St, San Diego, CA 92101" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-address" />
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const toggles = [
    { label: "Email Notifications", desc: "Receive email alerts for new leads, stage changes, and task assignments", value: emailNotifs, set: setEmailNotifs },
    { label: "SMS Notifications", desc: "Send SMS alerts to team members for urgent items", value: smsNotifs, set: setSmsNotifs },
    { label: "In-App Notifications", desc: "Show badge counts and alerts in the admin dashboard", value: inAppNotifs, set: setInAppNotifs },
    { label: "Daily Digest", desc: "Send a daily summary email to managers and executives", value: dailyDigest, set: setDailyDigest },
  ];

  return (
    <div className="space-y-3">
      {toggles.map(t => (
        <div key={t.label} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
          <div>
            <p className="text-sm text-white/70 font-medium">{t.label}</p>
            <p className="text-xs text-white/30 mt-0.5">{t.desc}</p>
          </div>
          <button onClick={() => t.set(!t.value)} className="flex-shrink-0" data-testid={`toggle-${t.label.toLowerCase().replace(/\s+/g, "-")}`}>
            {t.value ? <ToggleRight className="w-8 h-8 text-[#e91e8c]" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
          </button>
        </div>
      ))}
    </div>
  );
}

function ComplianceRulesSection() {
  return (
    <div className="space-y-4">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-sm text-white/70 font-medium mb-3">SLA Thresholds</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Lead Response Time (minutes)</label>
            <input type="number" defaultValue={15} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-lead-sla" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Condition Due Days</label>
            <input type="number" defaultValue={7} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-condition-sla" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Stale File Days</label>
            <input type="number" defaultValue={7} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-stale-sla" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Lock Expiry Warning Days</label>
            <input type="number" defaultValue={5} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white outline-none" data-testid="input-lock-sla" />
          </div>
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-sm text-white/70 font-medium mb-2">Auto-Flag Rules</p>
        <p className="text-xs text-white/30 mb-3">Compliance flags are automatically created when thresholds are exceeded.</p>
        <div className="space-y-2 text-xs text-white/50">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Missing critical documents flagged as HIGH</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Overdue conditions flagged as CRITICAL</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Stale files flagged as HIGH after SLA days</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Lock expiring within warning days flagged as CRITICAL</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Missing disclosures flagged as MEDIUM</div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <div>
          <p className="text-sm text-white/70 font-medium">Multi-Factor Authentication</p>
          <p className="text-xs text-white/30 mt-0.5">Require MFA for all admin users</p>
        </div>
        <button onClick={() => setMfaEnabled(!mfaEnabled)} data-testid="toggle-mfa">
          {mfaEnabled ? <ToggleRight className="w-8 h-8 text-[#e91e8c]" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
        </button>
      </div>
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <div>
          <p className="text-sm text-white/70 font-medium">Session Timeout</p>
          <p className="text-xs text-white/30 mt-0.5">Auto-logout after 30 minutes of inactivity</p>
        </div>
        <button onClick={() => setSessionTimeout(!sessionTimeout)} data-testid="toggle-session-timeout">
          {sessionTimeout ? <ToggleRight className="w-8 h-8 text-[#e91e8c]" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
        </button>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-sm text-white/70 font-medium mb-3">Password Policy</p>
        <div className="space-y-2 text-xs text-white/50">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Minimum 12 characters</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Require uppercase, lowercase, number, special char</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Password expires every 90 days</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Cannot reuse last 5 passwords</div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
      <Settings className="w-8 h-8 text-white/10 mx-auto mb-3" />
      <p className="text-sm text-white/40">{label} settings coming soon</p>
      <p className="text-xs text-white/20 mt-1">This section will be configurable in a future update</p>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("company");

  const activeItem = sections.find(s => s.key === activeSection)!;

  function renderSection() {
    switch (activeSection) {
      case "company": return <CompanySection />;
      case "notifications": return <NotificationsSection />;
      case "compliance": return <ComplianceRulesSection />;
      case "security": return <SecuritySection />;
      default: return <PlaceholderSection label={activeItem.label} />;
    }
  }

  return (
    <AppShell title="Settings" subtitle="System configuration and preferences">
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0 space-y-1">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = activeSection === s.key;
            return (
              <button key={s.key} onClick={() => setActiveSection(s.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? "bg-white/[0.06] text-white" : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"}`} data-testid={`settings-nav-${s.key}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#e91e8c]" : ""}`} />
                <span className="text-xs font-medium">{s.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-white/30" />}
              </button>
            );
          })}
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">{activeItem.label}</h3>
            <p className="text-xs text-white/40 mt-0.5">{activeItem.description}</p>
          </div>
          <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {renderSection()}
          </motion.div>
          <div className="flex justify-end mt-6">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e91e8c] text-white text-xs font-medium" data-testid="button-save-settings">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
