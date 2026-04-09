import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { FooterSection } from "./sections/FooterSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, MessageSquare, FileCheck, Bell, CheckCircle2, Clock, Shield,
  User, LogOut, ChevronRight, BarChart3, Phone, Mail, Home, Calendar,
  ArrowRight, FileText, AlertCircle, X, Send
} from "lucide-react";

const loanSteps = [
  { label: "Application Submitted", done: true, date: "Mar 28" },
  { label: "Documents Received", done: true, date: "Apr 1" },
  { label: "Processing", done: true, date: "Apr 4" },
  { label: "Underwriting Review", active: true, date: "In Progress" },
  { label: "Conditional Approval", done: false, date: "" },
  { label: "Clear to Close", done: false, date: "" },
  { label: "Closing Day", done: false, date: "" },
];

const mockDocs = [
  { name: "W-2 Form (2025)", status: "verified", date: "Apr 1" },
  { name: "Bank Statements (3 mo)", status: "verified", date: "Apr 2" },
  { name: "Pay Stubs (Recent)", status: "pending", date: "Requested Apr 5" },
  { name: "Tax Returns (2024)", status: "pending", date: "Requested Apr 5" },
];

const mockMessages = [
  { from: "Greg Wynn", message: "Great news — your file has been submitted to underwriting. I'll keep you posted on conditions.", time: "Today, 9:41 AM", unread: true },
  { from: "Jessica Ramirez", message: "I've received your W-2 and bank statements. We still need your most recent pay stubs.", time: "Yesterday, 2:15 PM", unread: false },
  { from: "Greg Wynn", message: "Welcome to the portal! Feel free to upload any documents here or message me directly.", time: "Mar 28, 10:00 AM", unread: false },
];

const mockNotifications = [
  { text: "Pay stubs requested — please upload within 48 hours", type: "action", time: "2h ago" },
  { text: "Your file moved to Underwriting Review", type: "update", time: "Today" },
  { text: "W-2 Form verified by processor", type: "success", time: "Yesterday" },
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

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "loan-status", label: "Loan Status", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#fafdf9]">
      <Header />

      <div className="pt-28 pb-4 px-6 bg-gradient-to-br from-[#004733] to-[#006d4e] relative overflow-hidden">
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
                <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}</h1>
                <p className="text-white/60 text-sm mt-0.5">{user.email}</p>
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
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 -mt-1">
        <div className="flex gap-1 bg-white rounded-t-2xl border border-b-0 border-gray-100 shadow-sm px-2 pt-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-[13px] font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#004733]/[0.06] text-[#004733] border-b-2 border-[#004733]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              data-testid={`portal-tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "messages" && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-12">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Loan Status", value: "Underwriting Review", icon: BarChart3, color: "text-amber-600 bg-amber-50" },
                    { label: "Estimated Close", value: "May 15, 2026", icon: Calendar, color: "text-[#004733] bg-[#004733]/5" },
                    { label: "Loan Amount", value: "$525,000", icon: Home, color: "text-blue-600 bg-blue-50" },
                  ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] text-gray-400 font-medium">{card.label}</p>
                        <p className="text-[15px] font-bold text-[#0c1a14]">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-[1fr_300px] gap-6">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0c1a14] mb-4">Loan Progress</h3>
                    <div className="space-y-0">
                      {loanSteps.map((step, i) => (
                        <div key={step.label} className="flex items-start gap-4 py-2.5">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                              step.done ? "bg-[#05a270] border-[#05a270]"
                                : step.active ? "border-[#004733] bg-white animate-pulse"
                                : "border-gray-200 bg-white"
                            }`}>
                              {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              {step.active && <div className="w-2 h-2 rounded-full bg-[#004733]" />}
                            </div>
                            {i < loanSteps.length - 1 && (
                              <div className={`w-0.5 h-6 ${step.done ? "bg-[#05a270]/30" : "bg-gray-100"}`} />
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between pt-0.5">
                            <span className={`text-[13px] font-medium ${
                              step.done ? "text-gray-700" : step.active ? "text-[#004733] font-bold" : "text-gray-300"
                            }`}>{step.label}</span>
                            <span className={`text-[11px] ${step.active ? "text-[#004733] font-bold" : "text-gray-300"}`}>{step.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#0c1a14] mb-3">Notifications</h4>
                      <div className="space-y-2">
                        {mockNotifications.map((n, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${
                            n.type === "action" ? "border-amber-200 bg-amber-50" :
                            n.type === "success" ? "border-green-200 bg-green-50" :
                            "border-gray-100 bg-gray-50"
                          }`}>
                            <div className="flex items-start gap-2">
                              {n.type === "action" && <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />}
                              {n.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />}
                              {n.type === "update" && <Bell className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />}
                              <div>
                                <p className="text-[12px] text-gray-700">{n.text}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-bold text-[#0c1a14] mb-3">Your Team</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Greg Wynn", role: "Loan Officer", phone: "(619) 555-1234" },
                          { name: "Jessica Ramirez", role: "Processor", phone: "(619) 555-5678" },
                        ].map((person) => (
                          <div key={person.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                            <div className="w-9 h-9 rounded-full bg-[#004733]/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-[#004733]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-semibold text-[#0c1a14]">{person.name}</p>
                              <p className="text-[11px] text-gray-400">{person.role}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#004733] hover:border-[#004733]/20 transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                              <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#004733] hover:border-[#004733]/20 transition-colors"><Mail className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div key="documents" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-bold text-[#0c1a14]">Your Documents</h3>
                  <button className="h-9 px-4 rounded-xl bg-[#004733] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#003626] transition-colors" data-testid="button-upload-doc">
                    <Upload className="w-4 h-4" /> Upload Document
                  </button>
                </div>

                <div className="space-y-2 mb-8">
                  {mockDocs.map((doc) => (
                    <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === "verified" ? "bg-green-50" : "bg-amber-50"}`}>
                        {doc.status === "verified" ? <FileCheck className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-[#0c1a14]">{doc.name}</p>
                        <p className="text-[11px] text-gray-400">{doc.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        doc.status === "verified" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {doc.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#004733]/5 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-[#004733]" />
                  </div>
                  <p className="text-[14px] font-medium text-gray-600">Drag & drop files here</p>
                  <p className="text-[12px] text-gray-400 mt-1">PDF, JPG, PNG up to 25MB</p>
                </div>
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <h3 className="text-[15px] font-bold text-[#0c1a14] mb-6">Messages</h3>

                <div className="space-y-3 mb-6">
                  {mockMessages.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${msg.unread ? "border-[#004733]/20 bg-[#004733]/[0.02]" : "border-gray-100"}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#004733]/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#004733]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-[#0c1a14]">{msg.from}</span>
                            {msg.unread && <span className="w-2 h-2 rounded-full bg-[#004733]" />}
                            <span className="text-[11px] text-gray-400 ml-auto">{msg.time}</span>
                          </div>
                          <p className="text-[13px] text-gray-600 leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex gap-3">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message to Greg's team..."
                      className="flex-1 resize-none h-20 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
                      data-testid="input-portal-message"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button className="h-9 px-5 rounded-xl bg-[#004733] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#003626] transition-colors" data-testid="button-send-message">
                      <Send className="w-4 h-4" /> Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "loan-status" && (
              <motion.div key="loan-status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <h3 className="text-[15px] font-bold text-[#0c1a14] mb-6">Loan Details</h3>

                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
                    <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Loan Summary</h4>
                    <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                      <div><span className="text-gray-400">Type:</span></div><div className="font-medium text-[#0c1a14]">Conventional</div>
                      <div><span className="text-gray-400">Purpose:</span></div><div className="font-medium text-[#0c1a14]">Purchase</div>
                      <div><span className="text-gray-400">Amount:</span></div><div className="font-medium text-[#0c1a14]">$525,000</div>
                      <div><span className="text-gray-400">Rate:</span></div><div className="font-medium text-[#0c1a14]">6.375%</div>
                      <div><span className="text-gray-400">Term:</span></div><div className="font-medium text-[#0c1a14]">30 Year Fixed</div>
                      <div><span className="text-gray-400">Est. Payment:</span></div><div className="font-medium text-[#0c1a14]">$3,276/mo</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
                    <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Property</h4>
                    <div className="text-[13px] space-y-2">
                      <p className="font-medium text-[#0c1a14]">4521 Ocean Blvd</p>
                      <p className="text-gray-500">San Diego, CA 92109</p>
                      <div className="grid grid-cols-2 gap-y-2 mt-3">
                        <div><span className="text-gray-400">Purchase Price:</span></div><div className="font-medium text-[#0c1a14]">$650,000</div>
                        <div><span className="text-gray-400">Down Payment:</span></div><div className="font-medium text-[#0c1a14]">$125,000 (19.2%)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-[13px] font-bold text-[#0c1a14] mb-4">Full Milestone History</h4>
                <div className="space-y-0">
                  {loanSteps.map((step, i) => (
                    <div key={step.label} className="flex items-start gap-4 py-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          step.done ? "bg-[#05a270] border-[#05a270]"
                            : step.active ? "border-[#004733] bg-white animate-pulse"
                            : "border-gray-200 bg-white"
                        }`}>
                          {step.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                          {step.active && <div className="w-2.5 h-2.5 rounded-full bg-[#004733]" />}
                        </div>
                        {i < loanSteps.length - 1 && <div className={`w-0.5 h-8 ${step.done ? "bg-[#05a270]/30" : "bg-gray-100"}`} />}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`text-[14px] font-semibold ${
                          step.done ? "text-gray-700" : step.active ? "text-[#004733]" : "text-gray-300"
                        }`}>{step.label}</p>
                        {step.date && <p className={`text-[12px] mt-0.5 ${step.active ? "text-[#004733]/60 font-medium" : "text-gray-400"}`}>{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
