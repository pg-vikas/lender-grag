import { MessageSquare, Target, Handshake, Eye, Wrench, GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const features = [
  { icon: MessageSquare, title: "Fast Communication", desc: "Responsive and clear at every step. You'll never wonder what's happening with your loan.", num: "01" },
  { icon: Target, title: "Clear Loan Strategy", desc: "We match you with the right program and position you for the best possible outcome.", num: "02" },
  { icon: Handshake, title: "Smooth Closings", desc: "Proactive coordination with all parties means fewer surprises — often closing in 21 days.", num: "03" },
  { icon: Eye, title: "Honest Guidance", desc: "No hidden fees, no bait-and-switch. We explain every option so you decide with confidence.", num: "04" },
  { icon: Wrench, title: "Problem Solver", desc: "Complex scenarios don't scare us. We find creative solutions to get deals done.", num: "05" },
  { icon: GraduationCap, title: "Buyer Education", desc: "We empower you with knowledge about rates, terms, and market conditions.", num: "06" },
];

export const WhyGregSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-20 items-start">
          <motion.div
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              className="inline-block text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em] mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Why Lender Greg
            </motion.span>
            <h2 className="text-4xl md:text-[52px] font-extrabold text-white tracking-[-0.03em] leading-[1.05]" data-testid="text-why-greg-heading">
              Lending That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">
                Feels Different
              </span>
            </h2>
            <p className="text-white/40 text-[17px] mt-6 leading-relaxed max-w-[360px]">
              A mortgage experience built on expertise, speed, and genuine care for your goals — not a template.
            </p>
            <Link href="/about">
              <motion.div
                className="mt-8 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button className="rounded-xl bg-white text-[#0c0c0c] font-bold gap-2.5 h-12 px-7 text-[15px] hover:bg-white/90 group shadow-lg shadow-white/10" data-testid="button-about-link">
                  More About Greg
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative p-7 rounded-2xl bg-white/[0.04] border border-white/[0.08] cursor-pointer overflow-hidden"
                data-testid={`card-feature-${i}`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#d4a94c]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent group-hover:via-[#d4a94c]/30 transition-all duration-500" />

                <div className="relative flex items-start justify-between mb-5">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#d4a94c]/15 group-hover:border-[#d4a94c]/25 transition-all duration-300"
                    whileHover={{ rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <f.icon className="w-[22px] h-[22px] text-white/50 group-hover:text-[#d4a94c] transition-colors duration-300" />
                  </motion.div>
                  <span className="text-[42px] font-extrabold text-white/[0.04] leading-none group-hover:text-white/[0.08] transition-colors duration-300 select-none">{f.num}</span>
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2 relative group-hover:text-[#f0d88a] transition-colors duration-300">{f.title}</h3>
                <p className="text-[14px] text-white/35 leading-relaxed relative group-hover:text-white/55 transition-colors duration-300">{f.desc}</p>

                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-white/20 group-hover:text-[#d4a94c] transition-colors duration-300 relative">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
