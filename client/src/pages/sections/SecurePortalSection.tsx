import { ShieldCheck, Upload, MessageCircleQuestion, Clock3, LockKeyhole, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import portalImg from "@assets/couple-new-home.png";

const features = [
  { icon: LockKeyhole, label: "Secure personal access" },
  { icon: Upload, label: "Fast document uploads" },
  { icon: MessageCircleQuestion, label: "Clear communication" },
  { icon: Clock3, label: "Simple next steps" },
];

export const SecurePortalSection = (): JSX.Element => {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0c0c0c] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#d4a94c]/10 blur-[180px]" />
        <div className="absolute bottom-[-120px] right-[-60px] w-[520px] h-[520px] rounded-full bg-white/[0.04] blur-[140px]" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/10 border border-[#d4a94c]/20 text-[#f0d88a] font-bold text-[13px] uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" />
              Secure Client Portal
            </span>
            <h2 className="mt-5 text-4xl md:text-5xl lg:text-[64px] font-black text-white tracking-[-0.04em] leading-[0.95] max-w-[12ch]">
              Secure Client Portal.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] via-[#f0d88a] to-[#c4953a]">Simple From The Start.</span>
            </h2>
            <p className="mt-6 max-w-[640px] text-[17px] md:text-[18px] leading-[1.8] text-white/68">
              Create your secure login to upload documents, manage your next steps, and ask questions anytime. Our portal is built to make the loan process feel easier, faster, and more organized, with real support behind every step.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-[680px]">
              {features.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-white"
                  whileHover={{ y: -3, scale: 1.02, borderColor: "rgba(212,169,76,0.35)" }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  data-testid={`feature-portal-${index}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#d4a94c]/15 border border-[#d4a94c]/20 flex items-center justify-center text-[#f0d88a]">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[14px] font-semibold text-white/88">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-9">
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <button className="h-14 px-8 rounded-2xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] font-bold text-[15px] shadow-xl shadow-[#d4a94c]/20 flex items-center gap-2.5" data-testid="button-create-secure-login">
                    Create Secure Login
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </motion.div>
              </Link>
              <p className="mt-4 text-[13px] text-white/40 font-medium">Encrypted access. Human support. Built for peace of mind.</p>
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative rounded-[32px] overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.img
                src={portalImg}
                alt="Couple in front of their new home"
                className="w-full h-full min-h-[520px] object-cover"
                style={{ objectPosition: "center" }}
                animate={{ scale: [1.02, 1.06, 1.02] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,169,76,0.18),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.12),transparent_30%)]" />
            </motion.div>

            <motion.div
              className="absolute left-4 sm:left-8 top-6 sm:top-10 w-[260px] sm:w-[300px] rounded-[28px] border border-white/[0.16] bg-white/15 backdrop-blur-xl p-5 shadow-2xl shadow-black/25"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-white text-[13px] uppercase tracking-[0.2em] font-bold mb-3">Portal Overview</p>
              <div className="space-y-3">
                {["Secure Login", "Upload Documents", "Ask A Question", "Progress Tracking"].map((label) => (
                  <div key={label} className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-[#d4a94c]/20 border border-[#d4a94c]/25 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-[#f0d88a]" />
                    </div>
                    <span className="text-[14px] font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};