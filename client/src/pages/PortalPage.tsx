import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { FooterSection } from "./sections/FooterSection";
import { motion } from "framer-motion";
import {
  Upload,
  FileCheck,
  Bell,
  CheckCircle2,
  Clock,
  Shield,
  User,
  LogOut,
  Calendar,
  FileText,
  MessageSquare,
  Download,
  ChevronRight,
  CheckSquare2,
  Circle,
} from "lucide-react";

const loanSteps = [
  { label: "Application Submitted", done: true, date: "Mar 28" },
  { label: "Documents Received", done: true, date: "Apr 1" },
  { label: "Processing", done: true, date: "Apr 4" },
  { label: "Underwriting Review", active: true, date: "In Progress" },
  { label: "Conditional Approval", done: false, date: "" },
  { label: "Clear to Close", done: false, date: "" },
];

const checklist = [
  { label: "Upload 2 recent pay stubs", done: false },
  { label: "Upload 2024 tax returns", done: false },
  { label: "Review lender notes", done: true },
  { label: "Download pre-approval letter", done: true },
];

const mockDocs = [
  { name: "W-2 Form (2025)", status: "verified", date: "Apr 1" },
  { name: "Bank Statements (3 mo)", status: "verified", date: "Apr 2" },
  { name: "Pay Stubs (Recent)", status: "pending", date: "Requested Apr 5" },
  { name: "Tax Returns (2024)", status: "pending", date: "Requested Apr 5" },
];

const lenderNotes = [
  { title: "Next step", text: "Please upload your most recent pay stubs so we can complete underwriting.", time: "Today" },
  { title: "Good news", text: "Your W-2 and bank statements have been reviewed and accepted.", time: "Yesterday" },
];

export default function PortalPage() {
  const { user, isAuthenticated, logout, loadSession } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("lg_user")) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return (
    <div className="min-h-screen bg-[#fafdf9] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#004733]/30 border-t-[#004733] rounded-full animate-spin" />
    </div>
  );

  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="min-h-screen bg-[#fafdf9]">
      <Header />

      <div className="pt-28 pb-6 px-6 bg-gradient-to-br from-[#004733] to-[#006d4e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-[30px] font-black text-white">Welcome back, {firstName}</h1>
                <p className="text-white/70 text-[15px] font-medium mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors" data-testid="button-portal-notifications">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                </button>
              </div>
              <button onClick={() => { logout(); navigate("/"); }} className="h-10 px-4 rounded-xl bg-white/10 border border-white/15 text-white/70 text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2" data-testid="button-portal-logout">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            {[
              { label: "Current Stage", value: "Underwriting Review", icon: CheckCircle2 },
              { label: "Docs Needed", value: "2 items", icon: Upload },
              { label: "Pre-Approval", value: "Ready to view", icon: FileText },
              { label: "Messages", value: "1 unread", icon: MessageSquare },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white/70">{card.label}</p>
                    <p className="text-[15px] font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 -mt-1">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-12">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Loan Progress</h3>
                  <p className="text-[13px] font-medium text-gray-500">Your mortgage file status at a glance</p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#004733]/5 text-[#004733] text-[12px] font-bold">Underwriting Review</div>
              </div>
              <div className="space-y-0">
                {loanSteps.map((step, i) => (
                  <div key={step.label} className="flex items-start gap-4 py-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                        step.done ? "bg-[#05a270] border-[#05a270]"
                          : step.active ? "border-[#004733] bg-white animate-pulse"
                          : "border-gray-200 bg-white"
                      }`}>
                        {step.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {step.active && <div className="w-2.5 h-2.5 rounded-full bg-[#004733]" />}
                        {!step.done && !step.active && <Circle className="w-3.5 h-3.5 text-gray-300" />}
                      </div>
                      {i < loanSteps.length - 1 && <div className={`w-0.5 h-8 ${step.done ? "bg-[#05a270]/30" : "bg-gray-100"}`} />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-[15px] font-bold ${step.done ? "text-gray-700" : step.active ? "text-[#004733]" : "text-gray-400"}`}>{step.label}</p>
                      {step.date && <p className={`text-[12px] mt-0.5 ${step.active ? "text-[#004733]/60 font-medium" : "text-gray-400"}`}>{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Documents & Uploads</h3>
                  <p className="text-[13px] font-medium text-gray-500">Send files securely to your lender</p>
                </div>
                <button className="h-10 px-4 rounded-xl bg-[#004733] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#003626] transition-colors" data-testid="button-upload-doc">
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
              <div className="space-y-2">
                {mockDocs.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#004733]/[0.03] via-white to-[#05a270]/[0.03]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === "verified" ? "bg-green-50" : "bg-amber-50"}`}>
                      {doc.status === "verified" ? <FileCheck className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#0c1a14]">{doc.name}</p>
                      <p className="text-[12px] text-gray-400">{doc.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${doc.status === "verified" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                      {doc.status === "verified" ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gradient-to-r from-white to-[#004733]/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-[#004733]/5 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#004733]" />
                </div>
                <p className="text-[14px] font-bold text-gray-700">Drag & drop files here</p>
                <p className="text-[12px] text-gray-400 mt-1">PDF, JPG, PNG up to 25MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Pre-Approval</h3>
                  <p className="text-[13px] font-medium text-gray-500">Access your current approval letter</p>
                </div>
                <FileText className="w-5 h-5 text-[#004733]" />
              </div>
              <div className="rounded-2xl border border-[#004733]/10 bg-gradient-to-r from-[#004733]/[0.06] to-[#05a270]/[0.08] p-5">
                <p className="text-[12px] font-bold text-[#004733] uppercase tracking-wider mb-2">Pre-Approval Letter</p>
                <p className="text-[18px] font-black text-[#0c1a14]">Ready to download</p>
                <p className="text-[13px] text-gray-600 mt-1">Updated Apr 9, 2026 • Valid for 30 days</p>
                <button className="mt-4 h-10 px-4 rounded-xl bg-[#004733] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#003626] transition-colors" data-testid="button-download-preapproval">
                  <Download className="w-4 h-4" /> Download Letter
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Lender Notes</h3>
                  <p className="text-[13px] font-medium text-gray-500">Updates and next steps from your team</p>
                </div>
                <MessageSquare className="w-5 h-5 text-[#004733]" />
              </div>
              <div className="space-y-3">
                {lenderNotes.map((note) => (
                  <div key={note.title} className="rounded-2xl border border-gray-100 p-4 bg-gradient-to-r from-[#004733]/[0.03] via-white to-[#05a270]/[0.03]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[14px] font-bold text-[#0c1a14]">{note.title}</p>
                      <span className="text-[11px] text-gray-400">{note.time}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-[#004733]" />
                  <p className="text-[13px] font-bold text-[#0c1a14]">Recent lender update</p>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">Your file is currently in underwriting review. Please check the checklist below and upload anything still outstanding.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Checklist</h3>
                  <p className="text-[13px] font-medium text-gray-500">Simple next steps to keep things moving</p>
                </div>
                <CheckSquare2 className="w-5 h-5 text-[#004733]" />
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 bg-gradient-to-r from-white via-[#004733]/[0.02] to-white">
                    {item.done ? <CheckCircle2 className="w-5 h-5 text-[#05a270]" /> : <Circle className="w-5 h-5 text-gray-300" />}
                    <div className="flex-1">
                      <p className={`text-[14px] font-semibold ${item.done ? "text-[#0c1a14]" : "text-gray-700"}`}>{item.label}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${item.done ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                      {item.done ? "Done" : "Needed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[18px] font-black text-[#0c1a14]">Pre-Approval</h3>
                  <p className="text-[13px] font-medium text-gray-500">Access your current approval letter</p>
                </div>
                <FileText className="w-5 h-5 text-[#004733]" />
              </div>
              <div className="rounded-2xl border border-[#004733]/10 bg-gradient-to-r from-[#004733]/[0.06] to-[#05a270]/[0.08] p-5">
                <p className="text-[12px] font-bold text-[#004733] uppercase tracking-wider mb-2">Pre-Approval Letter</p>
                <p className="text-[18px] font-black text-[#0c1a14]">Ready to download</p>
                <p className="text-[13px] text-gray-600 mt-1">Updated Apr 9, 2026 • Valid for 30 days</p>
                <button className="mt-4 h-10 px-4 rounded-xl bg-[#004733] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#003626] transition-colors" data-testid="button-download-preapproval">
                  <Download className="w-4 h-4" /> Download Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
