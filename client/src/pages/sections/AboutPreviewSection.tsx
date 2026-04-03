import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const bullets = [
  "Strategic financing guidance tailored to your goals",
  "Clear, responsive communication throughout the process",
  "Focused on smooth closings and strong outcomes",
];

export const AboutPreviewSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafcfb]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#004733] to-[#05a270] overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-5xl font-bold">GW</span>
                  </div>
                  <p className="text-xl font-semibold">Greg Wynn</p>
                  <p className="text-white/70 text-sm">Branch Manager & Loan Officer</p>
                  <p className="text-white/50 text-xs mt-1">NMLS 276890</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#004733]/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#004733]">15</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0c1a14]">Years of Experience</p>
                  <p className="text-xs text-gray-500">Licensed since 2009</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">About Greg</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] tracking-tight" data-testid="text-about-heading">
              Lending Built on
              <br />Trust & Execution
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              With over 15 years in the mortgage industry, Greg Wynn has helped hundreds of families navigate the path to homeownership. His approach combines deep market knowledge with genuine care — delivering results that speak for themselves.
            </p>
            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#05a270] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/about">
              <Button variant="outline" className="w-fit rounded-xl border-[#004733]/20 text-[#004733] font-semibold gap-2 hover:bg-[#004733]/5 mt-2" data-testid="button-about-more">
                Learn More About Greg
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
