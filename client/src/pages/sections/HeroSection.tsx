import { ArrowRight, Star, TrendingUp, Shield, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useRef } from "react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const HeroSection = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [4, -4]);
  const rotateY = useTransform(springX, [-300, 300], [-4, 4]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" ref={containerRef}>
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
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center min-h-[calc(100vh-80px)]">
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
            className="relative hidden lg:flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="relative w-full max-w-[520px]"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white rounded-[28px] shadow-2xl shadow-black/[0.08] border border-gray-100/80 overflow-hidden">
                <div className="px-7 pt-6 pb-5 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Dashboard</p>
                      <p className="text-[22px] font-bold text-[#0c1a14] mt-0.5">Loan Overview</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Pre-Approved
                    </div>
                  </div>
                </div>

                <div className="p-7 space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Loan Amount", value: "$360,000", color: "text-[#004733]" },
                      { label: "Rate", value: "6.25%", color: "text-[#0c1a14]" },
                      { label: "Monthly", value: "$2,217", color: "text-[#004733]" },
                    ].map((m, i) => (
                      <motion.div
                        key={i}
                        className="bg-gray-50/80 rounded-xl p-3.5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                      >
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                        <p className={`text-[17px] font-bold ${m.color} mt-0.5`}>{m.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="bg-gradient-to-r from-[#004733] to-[#0a7a55] rounded-2xl p-5 text-white"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] font-medium opacity-80">Approval Progress</p>
                      <p className="text-[12px] font-bold">85%</p>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-[6px]">
                      <motion.div
                        className="bg-white rounded-full h-[6px]"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.4, delay: 1.3, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-[11px] opacity-70">
                      <span>Documents</span>
                      <span>Review</span>
                      <span>Approved</span>
                    </div>
                  </motion.div>

                  <div className="space-y-2.5">
                    {[
                      { icon: Shield, text: "Rate locked for 60 days", time: "2h ago" },
                      { icon: Clock, text: "Estimated close: 21 days", time: "Today" },
                      { icon: TrendingUp, text: "DTI ratio: 32% — strong", time: "Today" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl hover:bg-gray-50/80 transition-colors group"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + i * 0.12 }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#004733]/[0.07] flex items-center justify-center flex-shrink-0 group-hover:bg-[#004733]/10 transition-colors">
                          <item.icon className="w-4 h-4 text-[#004733]" />
                        </div>
                        <p className="text-[13px] font-medium text-gray-700 flex-1">{item.text}</p>
                        <span className="text-[11px] text-gray-400">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-gray-100/80 px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8, type: "spring", stiffness: 200 }}
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
                className="absolute -bottom-3 -left-6 bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-gray-100/80 px-4 py-3"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2, type: "spring", stiffness: 200 }}
                style={{ animation: "float-slow 8s ease-in-out infinite", animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-[#004733] to-[#0a7a55]" />
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0c1a14]">500+</p>
                    <p className="text-[10px] text-gray-400">Families helped</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
