import { ArrowRight, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import gregPhoto from "@assets/bccb6149-2450-49bb-bcc6-1719871865b3_1775248779071.png";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const pulseGlow = {
  initial: { boxShadow: "0 0 0 0 rgba(5, 162, 112, 0.4)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(5, 162, 112, 0.4)",
      "0 0 0 12px rgba(5, 162, 112, 0)",
      "0 0 0 0 rgba(5, 162, 112, 0)",
    ],
  },
};

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={gregPhoto}
          alt="Greg Wynn — Branch Manager & Loan Officer"
          className="w-full h-full object-cover object-[100%_top] lg:object-right-top"
          data-testid="img-hero-greg"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="relative w-full">
        <div className="max-w-[1320px] mx-auto px-6 pb-16 md:pb-20 lg:pb-24 pt-[40vh]">
          <motion.div
            className="flex flex-col gap-6 max-w-[580px]"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[13px] font-semibold tracking-wide border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#05a270] animate-pulse" />
                Actively Helping Families Close
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold text-white leading-[1.06] tracking-[-0.02em]"
              data-testid="text-hero-headline"
            >
              Home Financing,{" "}
              <span className="relative inline-block">
                <span className="text-[#3be8a0]">Executed</span>
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
              className="text-[17px] md:text-[18px] text-white/60 max-w-[480px] leading-[1.7]"
            >
              Strategic lending with clear communication, fast closings, and 
              a process designed to keep you confident from pre-approval to keys.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/apply">
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={pulseGlow}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="rounded-2xl"
                >
                  <Button className="h-[64px] md:h-[72px] px-10 md:px-14 rounded-2xl bg-[#05a270] hover:bg-[#04895e] text-white text-[18px] md:text-[20px] font-bold shadow-xl shadow-[#05a270]/30 gap-3 group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]" data-testid="button-hero-apply">
                    Get Pre-Approved
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/tools">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="ghost" className="h-[56px] md:h-[60px] px-8 md:px-10 rounded-2xl text-white/90 text-[16px] md:text-[17px] font-semibold hover:bg-white/10 gap-2.5 group border border-white/20 backdrop-blur-sm transition-all duration-300 hover:border-white/40" data-testid="button-hero-calc">
                    Calculate Payment
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-2"
            >
              <motion.div
                className="inline-flex items-center gap-5 bg-white/[0.08] backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex -space-x-3">
                  {["JM","KD","SR","BW","AL"].map((initials, i) => (
                    <motion.div
                      key={i}
                      className="w-11 h-11 rounded-full border-[3px] border-[#001a10]/80 bg-gradient-to-br from-[#05a270] to-[#004733] flex items-center justify-center text-white text-[11px] font-bold shadow-lg"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.08, type: "spring", stiffness: 300 }}
                    >
                      {initials}
                    </motion.div>
                  ))}
                </div>
                <div className="h-10 w-px bg-white/15" />
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.span
                        key={i}
                        className="relative"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: 1.6 + i * 0.12, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      >
                        <Star className="w-[18px] h-[18px] fill-amber-400 text-amber-400" />
                        <motion.span
                          className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full bg-white"
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                          transition={{ duration: 0.8, delay: 1.8 + i * 0.12, repeat: Infinity, repeatDelay: 3.5 }}
                        />
                      </motion.span>
                    ))}
                    <span className="text-[17px] font-extrabold text-white ml-2">4.9</span>
                  </div>
                  <p className="text-[14px] text-white/50 mt-1 font-medium">
                    <span className="text-white/80 font-bold">150+</span> five-star reviews on Zillow
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 lg:bottom-16 lg:right-16 hidden md:block"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 px-6 py-4 text-right">
            <p className="text-white text-[22px] md:text-[26px] font-extrabold tracking-tight">Greg Wynn</p>
            <p className="text-white/50 text-[13px] font-medium">Branch Manager & Loan Officer</p>
            <p className="text-white/35 text-[12px] mt-0.5">NMLS 276890</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
