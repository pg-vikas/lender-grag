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

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={gregPhoto}
          alt="Greg Wynn — Branch Manager & Loan Officer"
          className="w-full h-full object-cover object-top"
          data-testid="img-hero-greg"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#001a10] via-[#001a10]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001a10]/80 via-[#001a10]/30 to-transparent" />

      <div className="relative w-full">
        <div className="max-w-[1320px] mx-auto px-6 pb-16 md:pb-20 lg:pb-24 pt-[40vh]">
          <motion.div
            className="flex flex-col gap-6 max-w-[640px]"
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

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-wrap gap-3 pt-1">
              <Link href="/apply">
                <Button className="h-[52px] px-7 rounded-xl bg-[#05a270] hover:bg-[#04895e] text-white text-[15px] font-semibold shadow-lg shadow-black/30 gap-2.5 group transition-all duration-300 hover:shadow-xl" data-testid="button-hero-apply">
                  Get Pre-Approved
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="ghost" className="h-[52px] px-7 rounded-xl text-white/90 text-[15px] font-semibold hover:bg-white/10 gap-2 group border border-white/15" data-testid="button-hero-calc">
                  Calculate Payment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-center gap-5 pt-2">
              <div className="flex -space-x-2.5">
                {["JM","KD","SR","BW"].map((initials, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-[2.5px] border-[#001a10] bg-gradient-to-br from-[#05a270] to-[#004733] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {initials}
                  </div>
                ))}
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-[14px] h-[14px] fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[13px] font-bold text-white ml-1.5">4.9</span>
                </div>
                <p className="text-[12px] text-white/40 mt-0.5">150+ reviews on Zillow</p>
              </div>
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
