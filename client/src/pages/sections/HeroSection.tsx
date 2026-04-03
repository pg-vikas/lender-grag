import { ArrowRight, Star, Shield, Clock, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import gregPhoto from "@assets/bccb6149-2450-49bb-bcc6-1719871865b3_1775248779071.png";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#fafdf9]" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[200px] -right-[200px] w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[#004733]/[0.04] to-transparent" />
        <div className="absolute -bottom-[300px] -left-[200px] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-[#05a270]/[0.04] to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#004733" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-28 lg:py-0 w-full relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
          <motion.div
            className="flex flex-col gap-7"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004733]/[0.07] text-[#004733] text-[13px] font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#05a270] animate-pulse" />
                Actively Helping Families Close
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-extrabold text-[#0c1a14] leading-[1.08] tracking-[-0.02em]"
              data-testid="text-hero-headline"
            >
              Home Financing,{" "}
              <span className="relative">
                <span className="text-[#004733]">Executed</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#05a270] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                />
              </span>
              <br />
              with Precision
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-[17px] text-gray-500 max-w-[460px] leading-[1.7]"
            >
              Strategic lending with clear communication, fast closings, and 
              a process designed to keep you confident from pre-approval to keys.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-wrap gap-3 pt-1">
              <Link href="/apply">
                <Button className="h-[52px] px-7 rounded-xl bg-[#004733] hover:bg-[#003525] text-white text-[15px] font-semibold shadow-lg shadow-[#004733]/20 gap-2.5 group transition-all duration-300 hover:shadow-xl" data-testid="button-hero-apply">
                  Get Pre-Approved
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="ghost" className="h-[52px] px-7 rounded-xl text-[#004733] text-[15px] font-semibold hover:bg-[#004733]/5 gap-2 group" data-testid="button-hero-calc">
                  Calculate Payment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-center gap-5 pt-3">
              <div className="flex -space-x-2.5">
                {["JM","KD","SR","BW"].map((initials, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-[2.5px] border-[#fafdf9] bg-gradient-to-br from-[#004733] to-[#0a7a55] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {initials}
                  </div>
                ))}
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-[14px] h-[14px] fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[13px] font-bold text-[#0c1a14] ml-1.5">4.9</span>
                </div>
                <p className="text-[12px] text-gray-400 mt-0.5">150+ reviews on Zillow</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex items-end justify-center lg:justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[520px]">
              <motion.div
                className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#004733]/[0.08] to-[#05a270]/[0.04] blur-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              <motion.div
                className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-black/[0.12]"
                initial={{ y: 30, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={gregPhoto}
                  alt="Greg Wynn — Branch Manager & Loan Officer"
                  className="w-full h-auto object-cover"
                  data-testid="img-hero-greg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004733]/60 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <p className="text-white text-[22px] md:text-[26px] font-extrabold tracking-tight">Greg Wynn</p>
                  <p className="text-white/70 text-[14px] font-medium">Branch Manager & Loan Officer · NMLS 276890</p>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute -top-3 -right-3 lg:-right-6 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-gray-100/80 px-4 py-3 flex items-center gap-3 z-10"
                initial={{ opacity: 0, scale: 0.8, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 200 }}
                style={{ animation: "float-slow 7s ease-in-out infinite" }}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#0c1a14]">Fast Track</p>
                  <p className="text-[11px] text-gray-400">Pre-approved in 24hrs</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-[30%] -left-4 lg:-left-10 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-gray-100/80 px-4 py-3 z-10"
                initial={{ opacity: 0, scale: 0.8, x: 16 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5, type: "spring", stiffness: 200 }}
                style={{ animation: "float-slow 8s ease-in-out infinite", animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#004733]/[0.08] flex items-center justify-center">
                    <Clock className="w-4.5 h-4.5 text-[#004733]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0c1a14]">21-Day Close</p>
                    <p className="text-[11px] text-gray-400">Average timeline</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-3 lg:-left-8 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-gray-100/80 px-4 py-3 z-10"
                initial={{ opacity: 0, scale: 0.8, y: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8, type: "spring", stiffness: 200 }}
                style={{ animation: "float-slow 9s ease-in-out infinite", animationDelay: "3s" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-[#004733] to-[#0a7a55]" />
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0c1a14]">500+ Families</p>
                    <p className="text-[10px] text-gray-400">Helped close on homes</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[25%] -right-3 lg:-right-8 bg-gradient-to-br from-[#004733] to-[#0a6e4e] rounded-2xl shadow-xl shadow-[#004733]/20 px-4 py-3 z-10"
                initial={{ opacity: 0, scale: 0.8, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2, type: "spring", stiffness: 200 }}
                style={{ animation: "float-slow 7.5s ease-in-out infinite", animationDelay: "2s" }}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                  <div>
                    <p className="text-[12px] font-bold text-white">98% Close Rate</p>
                    <p className="text-[10px] text-white/50">Industry-leading</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
