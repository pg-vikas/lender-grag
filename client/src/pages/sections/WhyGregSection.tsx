import { MessageSquare, Target, Handshake, Eye, Wrench, GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const features = [
  { icon: MessageSquare, title: "Fast Communication", desc: "Responsive and clear at every step. You'll never wonder what's happening with your loan.", accent: "#004733" },
  { icon: Target, title: "Clear Loan Strategy", desc: "We match you with the right program and position you for the best possible outcome.", accent: "#006d4e" },
  { icon: Handshake, title: "Smooth Closings", desc: "Proactive coordination with all parties means fewer surprises — often closing in 21 days.", accent: "#059660" },
  { icon: Eye, title: "Honest Guidance", desc: "No hidden fees, no bait-and-switch. We explain every option so you decide with confidence.", accent: "#059660" },
  { icon: Wrench, title: "Problem Solver", desc: "Complex scenarios don't scare us. We find creative solutions to get deals done.", accent: "#006d4e" },
  { icon: GraduationCap, title: "Buyer Education", desc: "We empower you with knowledge about rates, terms, and market conditions.", accent: "#004733" },
];

export const WhyGregSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#004733]/[0.015] blur-[100px]" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          <motion.div
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">Why Lender Greg</span>
            <h2 className="text-4xl md:text-[44px] font-extrabold text-[#0c1a14] mt-3 tracking-tight leading-[1.1]" data-testid="text-why-greg-heading">
              Lending That
              <br />Feels Different
            </h2>
            <p className="text-gray-500 text-[16px] mt-5 leading-relaxed">
              A mortgage experience built on expertise, speed, and genuine care for your goals — not a template.
            </p>
            <Link href="/about">
              <Button variant="outline" className="mt-6 rounded-xl border-[#004733]/15 text-[#004733] font-semibold gap-2 hover:bg-[#004733]/5 group" data-testid="button-about-link">
                More About Greg
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 24, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/15 hover:shadow-xl hover:shadow-[#004733]/[0.04] hover:-translate-y-1 transition-all duration-400 ease-out"
                data-testid={`card-feature-${i}`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${f.accent}0D` }}
                >
                  <f.icon className="w-[22px] h-[22px] transition-colors duration-300" style={{ color: f.accent }} />
                </div>
                <h3 className="text-[16px] font-bold text-[#0c1a14] mb-1.5">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
