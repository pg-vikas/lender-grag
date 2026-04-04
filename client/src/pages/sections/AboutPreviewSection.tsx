import { ArrowRight, CheckCircle2, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useRef } from "react";
import gregPhoto from "@assets/bccb6149-2450-49bb-bcc6-1719871865b3_1775248779071.png";

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

function draw(delay: number, duration = 1.2) {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { pathLength: { delay, duration, ease: "easeInOut" }, opacity: { delay, duration: 0.2 } } },
  };
}

function fade(delay: number, duration = 0.6) {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay, duration, ease: "easeOut" } },
  };
}

function rise(delay: number) {
  return {
    hidden: { opacity: 0, y: 20, scaleY: 0 },
    visible: { opacity: 1, y: 0, scaleY: 1, transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };
}

function HouseBuildAnimation({ inView }: { inView: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.svg
        viewBox="0 0 800 600"
        className="w-full h-full max-w-[900px] opacity-[0.12]"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="house-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a94c" />
            <stop offset="100%" stopColor="#f0d88a" />
          </linearGradient>
          <filter id="house-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <motion.line x1="100" y1="450" x2="700" y2="450" stroke="url(#house-glow)" strokeWidth="2" variants={draw(0, 0.8)} />
        <motion.line x1="80" y1="450" x2="720" y2="450" stroke="url(#house-glow)" strokeWidth="0.5" strokeDasharray="4,8" variants={draw(0.1, 0.6)} />

        <motion.rect x="160" y="440" width="480" height="10" rx="2" fill="#d4a94c" variants={fade(0.5)} style={{ originY: 1 }} />

        <motion.line x1="200" y1="440" x2="200" y2="280" stroke="url(#house-glow)" strokeWidth="1.5" variants={draw(1.0, 0.7)} />
        <motion.line x1="600" y1="440" x2="600" y2="280" stroke="url(#house-glow)" strokeWidth="1.5" variants={draw(1.1, 0.7)} />
        <motion.line x1="200" y1="280" x2="600" y2="280" stroke="url(#house-glow)" strokeWidth="1.5" variants={draw(1.3, 0.6)} />

        <motion.line x1="300" y1="440" x2="300" y2="280" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(1.4, 0.5)} />
        <motion.line x1="400" y1="440" x2="400" y2="280" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(1.5, 0.5)} />
        <motion.line x1="500" y1="440" x2="500" y2="280" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(1.6, 0.5)} />

        <motion.line x1="200" y1="360" x2="600" y2="360" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(1.7, 0.5)} />

        <motion.rect x="200" y="280" width="400" height="160" rx="0" fill="#d4a94c" variants={fade(2.0, 0.8)} style={{ opacity: 0.06 }} />

        <motion.rect x="210" y="280" width="180" height="160" rx="0" fill="#d4a94c" variants={rise(2.2)} style={{ opacity: 0.04, originY: 1, transformOrigin: "center bottom" }} />
        <motion.rect x="410" y="280" width="180" height="160" rx="0" fill="#f0d88a" variants={rise(2.4)} style={{ opacity: 0.04, originY: 1, transformOrigin: "center bottom" }} />

        <motion.path d="M 170 280 L 400 160 L 630 280 Z" fill="none" stroke="url(#house-glow)" strokeWidth="2" variants={draw(2.8, 1.0)} />

        <motion.line x1="400" y1="280" x2="400" y2="160" stroke="url(#house-glow)" strokeWidth="1" variants={draw(3.0, 0.5)} />
        <motion.line x1="285" y1="240" x2="515" y2="240" stroke="url(#house-glow)" strokeWidth="0.6" strokeDasharray="3,6" variants={draw(3.2, 0.5)} />

        <motion.path d="M 170 280 L 400 160 L 630 280 Z" fill="#d4a94c" variants={fade(3.5, 0.8)} style={{ opacity: 0.05 }} />

        <motion.rect x="250" y="310" width="50" height="50" rx="3" fill="none" stroke="url(#house-glow)" strokeWidth="1.5" variants={draw(3.8, 0.5)} />
        <motion.line x1="275" y1="310" x2="275" y2="360" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(4.0, 0.3)} />
        <motion.line x1="250" y1="335" x2="300" y2="335" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(4.1, 0.3)} />

        <motion.rect x="500" y="310" width="50" height="50" rx="3" fill="none" stroke="url(#house-glow)" strokeWidth="1.5" variants={draw(3.9, 0.5)} />
        <motion.line x1="525" y1="310" x2="525" y2="360" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(4.1, 0.3)} />
        <motion.line x1="500" y1="335" x2="550" y2="335" stroke="url(#house-glow)" strokeWidth="0.8" variants={draw(4.2, 0.3)} />

        <motion.rect x="370" y="380" width="60" height="60" rx="4" fill="none" stroke="url(#house-glow)" strokeWidth="1.8" variants={draw(4.3, 0.5)} />
        <motion.circle cx="420" cy="410" r="3" fill="#d4a94c" variants={fade(4.6)} />

        <motion.rect x="250" y="310" width="50" height="50" rx="3" fill="#f0d88a" variants={fade(4.5, 0.6)} style={{ opacity: 0.08 }} />
        <motion.rect x="500" y="310" width="50" height="50" rx="3" fill="#f0d88a" variants={fade(4.6, 0.6)} style={{ opacity: 0.08 }} />
        <motion.rect x="370" y="380" width="60" height="60" rx="4" fill="#d4a94c" variants={fade(4.7, 0.6)} style={{ opacity: 0.05 }} />

        <motion.rect x="380" y="175" width="40" height="55" rx="3" fill="none" stroke="url(#house-glow)" strokeWidth="1" variants={draw(4.8, 0.4)} />
        <motion.rect x="385" y="180" width="30" height="6" rx="1" fill="#d4a94c" variants={fade(5.0)} style={{ opacity: 0.3 }} />
        <motion.rect x="385" y="190" width="30" height="6" rx="1" fill="#d4a94c" variants={fade(5.1)} style={{ opacity: 0.2 }} />
        <motion.rect x="385" y="200" width="30" height="6" rx="1" fill="#d4a94c" variants={fade(5.2)} style={{ opacity: 0.15 }} />

        <motion.line x1="160" y1="282" x2="640" y2="282" stroke="#d4a94c" strokeWidth="0.3" variants={fade(5.0)} style={{ opacity: 0.3 }} />
        <motion.line x1="195" y1="442" x2="605" y2="442" stroke="#d4a94c" strokeWidth="0.3" variants={fade(5.1)} style={{ opacity: 0.3 }} />

        <motion.circle cx="150" cy="445" r="15" fill="#d4a94c" variants={fade(5.2)} style={{ opacity: 0.03 }} />
        <motion.circle cx="650" cy="445" r="12" fill="#d4a94c" variants={fade(5.3)} style={{ opacity: 0.03 }} />
        <motion.circle cx="130" cy="442" r="8" fill="#d4a94c" variants={fade(5.4)} style={{ opacity: 0.04 }} />

        <motion.rect
          x="195"
          y="275"
          width="410"
          height="170"
          rx="4"
          fill="none"
          stroke="url(#house-glow)"
          strokeWidth="0.4"
          filter="url(#house-blur)"
          variants={fade(5.5, 1.0)}
          style={{ opacity: 0.15 }}
        />

        {[
          { cx: 180, cy: 300, r: 1.5, d: 5.6 },
          { cx: 620, cy: 350, r: 1, d: 5.8 },
          { cx: 350, cy: 200, r: 1.5, d: 6.0 },
          { cx: 450, cy: 170, r: 1, d: 6.1 },
          { cx: 550, cy: 290, r: 1.2, d: 6.2 },
          { cx: 250, cy: 180, r: 1, d: 6.3 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#f0d88a"
            variants={fade(p.d, 0.4)}
            animate={inView ? { opacity: [0.2, 0.6, 0.2], y: [0, -3, 0] } : {}}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: p.d }}
          />
        ))}
      </motion.svg>
    </div>
  );
}

export const AboutPreviewSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <HouseBuildAnimation inView={inView} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[4/5] max-w-[420px] rounded-[28px] overflow-hidden relative shadow-2xl shadow-black/40">
              <img
                src={gregPhoto}
                alt="Greg Wynn — Branch Manager & Loan Officer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-[22px] font-extrabold tracking-tight">Greg Wynn</p>
                <p className="text-white/50 text-[13px] font-medium">Branch Manager & Loan Officer · NMLS 276890</p>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-5 -right-4 lg:right-[-40px] bg-[#141414] rounded-2xl shadow-xl shadow-black/30 border border-white/[0.08] p-4"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className={`text-center ${i < highlights.length - 1 ? "pr-4 border-r border-white/[0.08]" : ""}`}>
                    <p className="text-[20px] font-extrabold text-[#d4a94c]">{h.stat}</p>
                    <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">{h.label}</p>
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
            <span className="text-[#d4a94c] font-bold text-[13px] uppercase tracking-[0.2em]">Meet Greg</span>
            <h2 className="text-4xl md:text-[44px] font-extrabold text-white tracking-[-0.02em] leading-[1.1]" data-testid="text-about-heading">
              Your Lender, Not
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">Just a Loan Officer</span>
            </h2>
            <p className="text-white/40 text-[16px] leading-[1.75]">
              With over 15 years in the mortgage industry, Greg Wynn has helped hundreds of families navigate the path to homeownership. His approach combines deep market knowledge with genuine care — delivering results that speak for themselves.
            </p>
            <ul className="space-y-3 py-2">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#d4a94c] mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-[15px] font-medium">{b}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/about">
              <motion.div className="inline-block mt-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button className="rounded-xl bg-white text-[#0c0c0c] font-bold gap-2.5 h-12 px-7 text-[15px] hover:bg-white/90 group shadow-lg shadow-white/10" data-testid="button-about-more">
                  Learn More About Greg
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
