import { ArrowRight, CheckCircle2, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const highlights = [
  { icon: Award, stat: "15+", label: "Years in Lending" },
  { icon: Users, stat: "500+", label: "Families Helped" },
  { icon: Clock, stat: "21", label: "Day Avg Close" },
];

const bullets = [
  "Strategic financing guidance tailored to your goals",
  "Clear, responsive communication throughout the process",
  "Focused on smooth closings and strong outcomes",
];

export const AboutPreviewSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafdf9] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#004733]/[0.02] blur-[100px]" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[4/5] max-w-[420px] rounded-[28px] bg-gradient-to-br from-[#004733] to-[#0a6e4e] overflow-hidden relative shadow-2xl shadow-[#004733]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-36 h-36 rounded-full bg-white/15 mx-auto mb-5 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[52px] font-extrabold tracking-tight">GW</span>
                  </div>
                  <p className="text-[22px] font-bold">Greg Wynn</p>
                  <p className="text-white/60 text-[14px] mt-0.5">Branch Manager & Loan Officer</p>
                  <p className="text-white/40 text-[12px] mt-0.5">NMLS 276890</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-white/[0.04] blur-[60px]" />
            </div>

            <motion.div
              className="absolute -bottom-5 -right-4 lg:right-[-40px] bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-gray-100 p-4"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className={`text-center ${i < highlights.length - 1 ? "pr-4 border-r border-gray-100" : ""}`}>
                    <p className="text-[20px] font-extrabold text-[#004733]">{h.stat}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{h.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">Meet Greg</span>
            <h2 className="text-4xl md:text-[44px] font-extrabold text-[#0c1a14] tracking-tight leading-[1.1]" data-testid="text-about-heading">
              Your Lender, Not
              <br />Just a Loan Officer
            </h2>
            <p className="text-gray-500 text-[16px] leading-[1.75]">
              With over 15 years in the mortgage industry, Greg Wynn has helped hundreds of families navigate the path to homeownership. His approach combines deep market knowledge with genuine care — delivering results that speak for themselves.
            </p>
            <ul className="space-y-3 py-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#05a270] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-[15px] font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/about">
              <Button variant="outline" className="w-fit rounded-xl border-[#004733]/15 text-[#004733] font-semibold gap-2 hover:bg-[#004733]/5 group mt-1" data-testid="button-about-more">
                Learn More About Greg
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
