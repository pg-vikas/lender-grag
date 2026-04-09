import { Upload, MessageSquare, Shield, FileCheck, Bell, ArrowRight, CheckCircle2, User, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const portalFeatures = [
  { icon: Upload, title: "Upload Documents", desc: "Drag & drop tax returns, pay stubs, and bank statements directly into your secure portal." },
  { icon: MessageSquare, title: "Ask Questions Anytime", desc: "Message Greg's team directly from your dashboard — no phone tag, no waiting." },
  { icon: CheckCircle2, title: "Track Loan Progress", desc: "See exactly where your application stands at every step, from submission to closing." },
  { icon: Bell, title: "Real-Time Updates", desc: "Get notified the moment something changes — approvals, conditions, and next steps." },
];

interface DashboardStep {
  label: string;
  done: boolean;
  active?: boolean;
}

const dashboardSteps: DashboardStep[] = [
  { label: "Application Submitted", done: true },
  { label: "Documents Received", done: true },
  { label: "Underwriting Review", done: true },
  { label: "Conditional Approval", active: true, done: false },
  { label: "Clear to Close", done: false },
  { label: "Closing Day", done: false },
];

export const AccountPortalSection = (): JSX.Element => {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0c0c0c] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-[#d4a94c]/[0.06] blur-[160px]" />
        <div className="absolute bottom-[-80px] right-[-40px] w-[500px] h-[500px] rounded-full bg-[#004733]/10 blur-[120px]" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/10 border border-[#d4a94c]/20 text-[#f0d88a] font-bold text-[13px] uppercase tracking-[0.2em]">
              <Shield className="w-4 h-4" />
              Client Portal
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl lg:text-[56px] font-black text-white tracking-[-0.04em] leading-[0.95]">
              Create Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] via-[#f0d88a] to-[#c4953a]">Account Today</span>
            </h2>

            <p className="mt-6 max-w-[580px] text-[17px] leading-[1.8] text-white/60">
              Upload documents, ask questions, and track your loan from pre-approval to closing day — all in one secure, easy-to-use portal built around you.
            </p>

            <div className="mt-8 space-y-4">
              {portalFeatures.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  data-testid={`portal-feature-${index}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#d4a94c]/12 border border-[#d4a94c]/20 flex items-center justify-center text-[#f0d88a] flex-shrink-0 mt-0.5 group-hover:bg-[#d4a94c]/20 transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-[15px]">{item.title}</p>
                    <p className="text-white/45 text-[14px] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/apply">
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2.5 h-12 px-7 rounded-2xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] font-bold text-[15px] shadow-xl shadow-[#d4a94c]/20 cursor-pointer transition-colors" data-testid="button-portal-signup">
                  Sign Up Now
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/apply">
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2.5 h-12 px-7 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-[15px] border border-white/[0.1] cursor-pointer transition-colors" data-testid="button-portal-login">
                  Log In
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>

            <p className="mt-4 text-[13px] text-white/30 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              256-bit encryption. Your data is always safe.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="relative rounded-[28px] border border-white/[0.08] bg-[#141414] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-[#1a1a1a]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.04] text-white/30 text-[11px] font-medium">portal.lendergreg.com</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a94c] to-[#c4953a] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0c0c0c]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-[14px]">Welcome back, Sarah</p>
                    <p className="text-white/35 text-[12px]">Last login: Today at 9:41 AM</p>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-[#28c840]/15 text-[#4ade80] text-[11px] font-bold">Active</div>
                </div>

                <div className="mb-5">
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-wider mb-3">Loan Progress</p>
                  <div className="space-y-0">
                    {dashboardSteps.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-3 py-2">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            step.done
                              ? "bg-[#d4a94c] border-[#d4a94c]"
                              : step.active
                                ? "bg-transparent border-[#d4a94c] animate-pulse"
                                : "bg-transparent border-white/15"
                          }`}>
                            {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-[#0c0c0c]" />}
                            {step.active && <div className="w-2 h-2 rounded-full bg-[#d4a94c]" />}
                          </div>
                          {i < dashboardSteps.length - 1 && (
                            <div className={`w-0.5 h-5 ${step.done ? "bg-[#d4a94c]/40" : "bg-white/[0.06]"}`} />
                          )}
                        </div>
                        <span className={`text-[13px] font-medium ${
                          step.done ? "text-white/80" : step.active ? "text-[#f0d88a] font-bold" : "text-white/25"
                        }`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Upload className="w-5 h-5 text-[#f0d88a] mb-2" />
                    <p className="text-white text-[13px] font-bold">Upload Docs</p>
                    <p className="text-white/30 text-[11px] mt-0.5">2 pending</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <MessageSquare className="w-5 h-5 text-[#f0d88a] mb-2" />
                    <p className="text-white text-[13px] font-bold">Messages</p>
                    <p className="text-white/30 text-[11px] mt-0.5">1 new</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#d4a94c]/10 flex items-center justify-center mb-2">
                    <FileCheck className="w-5 h-5 text-[#f0d88a]" />
                  </div>
                  <p className="text-white/50 text-[12px] font-medium">Drop files here to upload</p>
                  <p className="text-white/25 text-[11px] mt-0.5">PDF, JPG, PNG up to 25MB</p>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-4 -right-4 lg:-right-6 rounded-2xl border border-white/[0.1] bg-[#1a1a1a]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/30"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#28c840]/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                </div>
                <div>
                  <p className="text-white text-[12px] font-bold">Document Verified</p>
                  <p className="text-white/35 text-[10px]">W-2 approved just now</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-3 -left-3 lg:-left-5 rounded-2xl border border-white/[0.1] bg-[#1a1a1a]/95 backdrop-blur-xl p-3 shadow-2xl shadow-black/30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#d4a94c]/15 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-[#f0d88a]" />
                </div>
                <p className="text-white text-[11px] font-bold">Conditional approval received!</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
