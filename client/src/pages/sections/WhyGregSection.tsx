import { MessageSquare, Target, Handshake, Eye, Wrench, GraduationCap, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useRef } from "react";

const features = [
  { icon: MessageSquare, title: "Fast Communication", desc: "Responsive and clear at every step. You'll never wonder what's happening with your loan.", num: "01" },
  { icon: Target, title: "Clear Loan Strategy", desc: "We match you with the right program and position you for the best possible outcome.", num: "02" },
  { icon: Handshake, title: "Smooth Closings", desc: "Proactive coordination with all parties means fewer surprises — often closing in 21 days.", num: "03" },
  { icon: Eye, title: "Honest Guidance", desc: "No hidden fees, no bait-and-switch. We explain every option so you decide with confidence.", num: "04" },
  { icon: Wrench, title: "Problem Solver", desc: "Complex scenarios don't scare us. We find creative solutions to get deals done.", num: "05" },
  { icon: GraduationCap, title: "Buyer Education", desc: "We empower you with knowledge about rates, terms, and market conditions.", num: "06" },
];

function ScrollStreet() {
  const streetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: streetRef,
    offset: ["start end", "end start"],
  });
  const streetY = useTransform(scrollYProgress, [0, 1], [0, -800]);

  return (
    <div ref={streetRef} className="relative w-full h-[200px] my-12 overflow-hidden rounded-2xl border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-transparent to-[#0c0c0c] z-10 pointer-events-none" />

      <motion.div className="absolute inset-x-0 w-full" style={{ y: streetY, height: 2000 }}>
        <svg width="100%" height="2000" viewBox="0 0 1200 2000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="2000" fill="#1a1a1a" />

          <rect x="100" y="0" width="8" height="2000" fill="#2a2a2a" />
          <rect x="1092" y="0" width="8" height="2000" fill="#2a2a2a" />

          <rect x="200" y="0" width="2" height="2000" fill="#333" rx="1" />
          <rect x="998" y="0" width="2" height="2000" fill="#333" rx="1" />

          {Array.from({ length: 40 }).map((_, i) => (
            <rect key={`cl-${i}`} x="598" y={i * 50} width="4" height="30" rx="2" fill="#444" />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <rect key={`ll-${i}`} x="398" y={i * 50 + 10} width="3" height="20" rx="1.5" fill="#2d2d2d" />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <rect key={`rl-${i}`} x="798" y={i * 50 + 10} width="3" height="20" rx="1.5" fill="#2d2d2d" />
          ))}

          <rect x="0" y="0" width="100" height="2000" fill="#141414" />
          <rect x="1100" y="0" width="100" height="2000" fill="#141414" />

          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={`sl-${i}`} x="80" y={i * 200 + 20} width="12" height="3" rx="1.5" fill="#2a2a2a" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={`sr-${i}`} x="1108" y={i * 200 + 120} width="12" height="3" rx="1.5" fill="#2a2a2a" />
          ))}

          <g>
            <rect x="320" y="180" width="60" height="28" rx="6" fill="#d4a94c" opacity="0.7" />
            <rect x="324" y="183" width="10" height="6" rx="2" fill="#f0d88a" opacity="0.8" />
            <rect x="366" y="199" width="10" height="6" rx="2" fill="#c43030" opacity="0.7" />
          </g>
          <g>
            <rect x="820" y="520" width="60" height="28" rx="6" fill="#3a3a3a" opacity="0.8" />
            <rect x="824" y="523" width="10" height="6" rx="2" fill="#eee" opacity="0.6" />
            <rect x="866" y="539" width="10" height="6" rx="2" fill="#c43030" opacity="0.5" />
          </g>
          <g>
            <rect x="440" y="900" width="55" height="26" rx="5" fill="#555" opacity="0.7" />
            <rect x="443" y="903" width="9" height="5" rx="2" fill="#fff" opacity="0.5" />
            <rect x="482" y="918" width="9" height="5" rx="2" fill="#c43030" opacity="0.6" />
          </g>
          <g>
            <rect x="700" y="1300" width="64" height="30" rx="7" fill="#d4a94c" opacity="0.5" />
            <rect x="704" y="1303" width="11" height="6" rx="2" fill="#f0d88a" opacity="0.7" />
            <rect x="749" y="1321" width="11" height="6" rx="2" fill="#c43030" opacity="0.6" />
          </g>
          <g>
            <rect x="280" y="1600" width="58" height="27" rx="6" fill="#2a5a4a" opacity="0.7" />
            <rect x="284" y="1603" width="10" height="5" rx="2" fill="#aaffcc" opacity="0.5" />
            <rect x="324" y="1619" width="10" height="5" rx="2" fill="#c43030" opacity="0.6" />
          </g>
          <g>
            <rect x="880" y="1100" width="50" height="24" rx="5" fill="#4a4a4a" opacity="0.6" />
            <rect x="883" y="1103" width="8" height="5" rx="2" fill="#fff" opacity="0.4" />
            <rect x="918" y="1116" width="8" height="5" rx="2" fill="#c43030" opacity="0.5" />
          </g>

          <circle cx="130" cy="300" r="20" fill="#1a2a1a" opacity="0.4" />
          <circle cx="1070" cy="700" r="18" fill="#1a2a1a" opacity="0.3" />
          <circle cx="140" cy="1200" r="22" fill="#1a2a1a" opacity="0.35" />
          <circle cx="1060" cy="1500" r="16" fill="#1a2a1a" opacity="0.3" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-[#0c0c0c]/60 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10">
          <p className="text-white/50 text-[13px] font-semibold tracking-wide uppercase">Driving Results — Scroll to Explore</p>
        </div>
      </div>
    </div>
  );
}

export const WhyGregSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <motion.div
          className="text-center max-w-[640px] mx-auto mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            Lending That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">
              Feels Different
            </span>
          </h2>
          <p className="text-white/40 text-[17px] mt-5 leading-relaxed">
            A mortgage experience built on expertise, speed, and genuine care for your goals — not a template.
          </p>
        </motion.div>

        <ScrollStreet />

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
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

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/about">
            <motion.div
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
      </div>
    </section>
  );
};
