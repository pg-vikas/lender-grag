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

const D = (delay: number, duration = 1.4) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration, ease: [0.25, 0.1, 0.25, 1] },
      opacity: { delay, duration: 0.15 },
    },
  },
});

const F = (delay: number, duration = 0.8) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay, duration, ease: "easeOut" } },
});

function BlueprintGrid() {
  const lines = [];
  for (let x = 60; x <= 940; x += 40) {
    lines.push(
      <motion.line
        key={`gv-${x}`}
        x1={x} y1={50} x2={x} y2={550}
        stroke="#d4a94c"
        strokeWidth="0.15"
        variants={F(0, 1.5)}
        style={{ opacity: 0.12 }}
      />
    );
  }
  for (let y = 50; y <= 550; y += 40) {
    lines.push(
      <motion.line
        key={`gh-${y}`}
        x1={60} y1={y} x2={940} y2={y}
        stroke="#d4a94c"
        strokeWidth="0.15"
        variants={F(0, 1.5)}
        style={{ opacity: 0.12 }}
      />
    );
  }
  return <g>{lines}</g>;
}

function HouseBuildAnimation({ inView }: { inView: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.svg
        viewBox="0 0 1000 600"
        className="w-full h-full max-w-[1100px] opacity-[0.18]"
        preserveAspectRatio="xMidYMid meet"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gold-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4953a" />
            <stop offset="50%" stopColor="#f0d88a" />
            <stop offset="100%" stopColor="#c4953a" />
          </linearGradient>
          <linearGradient id="gold-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0d88a" />
            <stop offset="100%" stopColor="#c4953a" />
          </linearGradient>
          <linearGradient id="gold-d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a94c" />
            <stop offset="100%" stopColor="#f0d88a" />
          </linearGradient>
          <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0d88a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d4a94c" stopOpacity="0" />
          </radialGradient>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="wide-glow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <BlueprintGrid />

        <g>
          <motion.line x1="180" y1="460" x2="820" y2="460" stroke="url(#gold-h)" strokeWidth="2.5" variants={D(0.3, 1.0)} />
          <motion.line x1="160" y1="462" x2="840" y2="462" stroke="#d4a94c" strokeWidth="0.4" strokeDasharray="2,6" variants={D(0.4, 0.8)} />
          <motion.line x1="160" y1="465" x2="840" y2="465" stroke="#d4a94c" strokeWidth="0.3" variants={D(0.5, 0.6)} />

          {[200, 280, 360, 440, 520, 600, 680, 760].map((x, i) => (
            <motion.line key={`ft-${i}`} x1={x} y1="460" x2={x} y2="456" stroke="#d4a94c" strokeWidth="0.5" variants={F(0.6 + i * 0.03)} />
          ))}
        </g>

        <g>
          <motion.rect x="200" y="450" width="560" height="10" rx="1" fill="none" stroke="url(#gold-h)" strokeWidth="1.2" variants={D(0.8, 0.8)} />
          <motion.rect x="200" y="450" width="560" height="10" rx="1" fill="#d4a94c" variants={F(1.0)} style={{ opacity: 0.06 }} />

          <motion.rect x="610" y="430" width="150" height="20" rx="1" fill="none" stroke="url(#gold-h)" strokeWidth="1" variants={D(0.9, 0.8)} />
          <motion.rect x="610" y="430" width="150" height="20" rx="1" fill="#d4a94c" variants={F(1.1)} style={{ opacity: 0.04 }} />
        </g>

        <g>
          {[
            { x: 210, y1: 450, y2: 290 },
            { x: 290, y1: 450, y2: 290 },
            { x: 370, y1: 450, y2: 290 },
            { x: 450, y1: 450, y2: 290 },
            { x: 530, y1: 450, y2: 290 },
            { x: 600, y1: 430, y2: 290 },
            { x: 680, y1: 430, y2: 290 },
            { x: 750, y1: 430, y2: 290 },
          ].map((s, i) => (
            <motion.line
              key={`stud-${i}`}
              x1={s.x} y1={s.y1} x2={s.x} y2={s.y2}
              stroke="url(#gold-v)"
              strokeWidth={i === 0 || i === 4 || i === 5 || i === 7 ? "1.8" : "0.8"}
              variants={D(1.3 + i * 0.08, 0.9)}
            />
          ))}

          <motion.line x1="200" y1="370" x2="540" y2="370" stroke="#d4a94c" strokeWidth="0.5" strokeDasharray="4,4" variants={D(1.9, 0.6)} />
          <motion.line x1="600" y1="370" x2="760" y2="370" stroke="#d4a94c" strokeWidth="0.5" strokeDasharray="4,4" variants={D(2.0, 0.6)} />

          <motion.line x1="200" y1="290" x2="540" y2="290" stroke="url(#gold-h)" strokeWidth="1.8" variants={D(2.1, 0.7)} />
          <motion.line x1="600" y1="290" x2="760" y2="290" stroke="url(#gold-h)" strokeWidth="1.8" variants={D(2.2, 0.7)} />
        </g>

        <g>
          <motion.rect x="200" y="290" width="340" height="160" fill="#d4a94c" variants={F(2.5, 1.2)} style={{ opacity: 0.035 }} />
          <motion.rect x="600" y="290" width="160" height="140" fill="#c4953a" variants={F(2.6, 1.2)} style={{ opacity: 0.03 }} />

          <motion.rect x="200" y="290" width="340" height="160" rx="0" fill="none" stroke="url(#gold-h)" strokeWidth="1.4" variants={D(2.4, 1.0)} />
          <motion.rect x="600" y="290" width="160" height="140" rx="0" fill="none" stroke="url(#gold-h)" strokeWidth="1.2" variants={D(2.5, 1.0)} />

          <motion.path d="M540 290 L540 450" stroke="url(#gold-v)" strokeWidth="2" variants={D(2.6, 0.6)} />
          <motion.path d="M540 290 L600 290" stroke="url(#gold-h)" strokeWidth="1.2" variants={D(2.7, 0.4)} />
          <motion.path d="M540 430 L600 430" stroke="url(#gold-h)" strokeWidth="1" variants={D(2.8, 0.4)} />
        </g>

        <g>
          <motion.path
            d="M 170 290 L 370 175 L 540 290"
            fill="none"
            stroke="url(#gold-h)"
            strokeWidth="2.2"
            strokeLinejoin="miter"
            variants={D(3.0, 1.2)}
          />

          <motion.path
            d="M 170 290 L 370 175 L 540 290 Z"
            fill="#d4a94c"
            variants={F(3.8, 1.0)}
            style={{ opacity: 0.04 }}
          />

          <motion.line x1="370" y1="290" x2="370" y2="175" stroke="#d4a94c" strokeWidth="0.6" strokeDasharray="3,5" variants={D(3.3, 0.5)} />
          <motion.line x1="270" y1="245" x2="470" y2="245" stroke="#d4a94c" strokeWidth="0.4" strokeDasharray="2,6" variants={D(3.5, 0.4)} />
          <motion.line x1="220" y1="268" x2="520" y2="268" stroke="#d4a94c" strokeWidth="0.3" strokeDasharray="2,6" variants={D(3.6, 0.4)} />

          <motion.line x1="160" y1="290" x2="550" y2="290" stroke="url(#gold-h)" strokeWidth="0.8" filter="url(#line-glow)" variants={D(3.7, 0.5)} />

          <motion.path
            d="M 580 290 L 680 240 L 770 290"
            fill="none"
            stroke="url(#gold-h)"
            strokeWidth="1.8"
            strokeLinejoin="miter"
            variants={D(3.2, 1.0)}
          />
          <motion.path
            d="M 580 290 L 680 240 L 770 290 Z"
            fill="#c4953a"
            variants={F(3.9, 1.0)}
            style={{ opacity: 0.035 }}
          />
        </g>

        <g>
          <motion.rect x="240" y="320" width="55" height="55" rx="2" fill="none" stroke="url(#gold-d)" strokeWidth="1.5" variants={D(4.0, 0.6)} />
          <motion.line x1="267" y1="320" x2="267" y2="375" stroke="#d4a94c" strokeWidth="0.6" variants={D(4.2, 0.3)} />
          <motion.line x1="240" y1="347" x2="295" y2="347" stroke="#d4a94c" strokeWidth="0.6" variants={D(4.3, 0.3)} />
          <motion.rect x="240" y="320" width="55" height="55" rx="2" fill="#f0d88a" variants={F(4.5)} style={{ opacity: 0.06 }} />

          <motion.rect x="360" y="320" width="55" height="55" rx="2" fill="none" stroke="url(#gold-d)" strokeWidth="1.5" variants={D(4.1, 0.6)} />
          <motion.line x1="387" y1="320" x2="387" y2="375" stroke="#d4a94c" strokeWidth="0.6" variants={D(4.3, 0.3)} />
          <motion.line x1="360" y1="347" x2="415" y2="347" stroke="#d4a94c" strokeWidth="0.6" variants={D(4.4, 0.3)} />
          <motion.rect x="360" y="320" width="55" height="55" rx="2" fill="#f0d88a" variants={F(4.6)} style={{ opacity: 0.06 }} />

          <motion.rect x="470" y="320" width="40" height="40" rx="2" fill="none" stroke="url(#gold-d)" strokeWidth="1.2" variants={D(4.2, 0.5)} />
          <motion.line x1="490" y1="320" x2="490" y2="360" stroke="#d4a94c" strokeWidth="0.5" variants={D(4.5, 0.3)} />
          <motion.line x1="470" y1="340" x2="510" y2="340" stroke="#d4a94c" strokeWidth="0.5" variants={D(4.5, 0.3)} />
          <motion.rect x="470" y="320" width="40" height="40" rx="2" fill="#f0d88a" variants={F(4.7)} style={{ opacity: 0.05 }} />

          <motion.rect x="630" y="320" width="45" height="45" rx="2" fill="none" stroke="url(#gold-d)" strokeWidth="1.3" variants={D(4.3, 0.5)} />
          <motion.line x1="652" y1="320" x2="652" y2="365" stroke="#d4a94c" strokeWidth="0.5" variants={D(4.5, 0.3)} />
          <motion.line x1="630" y1="342" x2="675" y2="342" stroke="#d4a94c" strokeWidth="0.5" variants={D(4.6, 0.3)} />
          <motion.rect x="630" y="320" width="45" height="45" rx="2" fill="#f0d88a" variants={F(4.8)} style={{ opacity: 0.05 }} />
        </g>

        <g>
          <motion.rect x="315" y="390" width="65" height="60" rx="3" fill="none" stroke="url(#gold-d)" strokeWidth="2" variants={D(4.6, 0.7)} />
          <motion.path d="M315 390 Q347 383 380 390" fill="none" stroke="#d4a94c" strokeWidth="0.8" variants={D(4.8, 0.4)} />
          <motion.circle cx="370" cy="422" r="3" fill="#f0d88a" variants={F(5.0)} style={{ opacity: 0.6 }} />
          <motion.rect x="315" y="390" width="65" height="60" rx="3" fill="#d4a94c" variants={F(5.0)} style={{ opacity: 0.04 }} />
        </g>

        <g>
          <motion.line x1="350" y1="185" x2="340" y2="155" stroke="url(#gold-v)" strokeWidth="1.5" variants={D(5.0, 0.5)} />
          <motion.rect x="334" y="155" width="12" height="30" rx="1" fill="none" stroke="#d4a94c" strokeWidth="0.8" variants={D(5.1, 0.4)} />
          <motion.rect x="336" y="160" width="8" height="5" rx="0.5" fill="#d4a94c" variants={F(5.2)} style={{ opacity: 0.25 }} />
          <motion.rect x="336" y="168" width="8" height="5" rx="0.5" fill="#d4a94c" variants={F(5.3)} style={{ opacity: 0.2 }} />
          <motion.rect x="336" y="176" width="8" height="5" rx="0.5" fill="#d4a94c" variants={F(5.4)} style={{ opacity: 0.15 }} />
        </g>

        <g>
          <motion.path d="M195 455 L180 462 L200 465 L190 468" stroke="#d4a94c" strokeWidth="0.4" fill="none" variants={D(5.2, 0.4)} />
          <motion.path d="M770 455 L785 460 L765 465 L780 468" stroke="#d4a94c" strokeWidth="0.4" fill="none" variants={D(5.3, 0.4)} />
          <motion.line x1="150" y1="462" x2="180" y2="462" stroke="#d4a94c" strokeWidth="0.3" strokeDasharray="1,4" variants={F(5.4)} style={{ opacity: 0.3 }} />
          <motion.line x1="800" y1="462" x2="850" y2="462" stroke="#d4a94c" strokeWidth="0.3" strokeDasharray="1,4" variants={F(5.4)} style={{ opacity: 0.3 }} />
        </g>

        <g>
          <motion.line x1="120" y1="290" x2="160" y2="290" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.5)} style={{ opacity: 0.4 }} />
          <motion.line x1="120" y1="460" x2="160" y2="460" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.5)} style={{ opacity: 0.4 }} />
          <motion.line x1="130" y1="290" x2="130" y2="460" stroke="#d4a94c" strokeWidth="0.3" variants={D(5.6, 0.5)} />
          <motion.path d="M125 290 L130 285 L135 290" fill="none" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.7)} style={{ opacity: 0.5 }} />
          <motion.path d="M125 460 L130 465 L135 460" fill="none" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.7)} style={{ opacity: 0.5 }} />

          <motion.line x1="200" y1="480" x2="200" y2="490" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.6)} style={{ opacity: 0.4 }} />
          <motion.line x1="540" y1="480" x2="540" y2="490" stroke="#d4a94c" strokeWidth="0.4" variants={F(5.6)} style={{ opacity: 0.4 }} />
          <motion.line x1="200" y1="485" x2="540" y2="485" stroke="#d4a94c" strokeWidth="0.3" variants={D(5.7, 0.5)} />
        </g>

        <g filter="url(#wide-glow)">
          <motion.rect
            x="190"
            y="280"
            width="360"
            height="180"
            rx="6"
            fill="#d4a94c"
            variants={F(5.8, 1.5)}
            style={{ opacity: 0.04 }}
          />
          <motion.path
            d="M 170 290 L 370 175 L 540 290"
            fill="none"
            stroke="#f0d88a"
            strokeWidth="1"
            variants={F(5.9, 1.5)}
            style={{ opacity: 0.15 }}
          />
        </g>

        <motion.rect
          x="185"
          y="170"
          width="590"
          height="300"
          fill="url(#gold-glow)"
          variants={F(6.0, 2.0)}
        />

        {[
          { cx: 190, cy: 310, r: 1.5, d: 6.0 },
          { cx: 550, cy: 295, r: 1, d: 6.2 },
          { cx: 320, cy: 200, r: 1.2, d: 6.1 },
          { cx: 420, cy: 185, r: 1, d: 6.3 },
          { cx: 700, cy: 260, r: 1.3, d: 6.4 },
          { cx: 230, cy: 250, r: 0.8, d: 6.5 },
          { cx: 660, cy: 400, r: 1.1, d: 6.3 },
          { cx: 480, cy: 230, r: 0.9, d: 6.6 },
          { cx: 150, cy: 380, r: 1.0, d: 6.2 },
          { cx: 780, cy: 330, r: 1.2, d: 6.5 },
        ].map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#f0d88a"
            variants={F(p.d, 0.5)}
            animate={inView ? {
              opacity: [0.15, 0.5, 0.15],
              y: [0, -4 - (i % 3), 0],
              scale: [1, 1.3, 1],
            } : {}}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: p.d + 1, ease: "easeInOut" }}
          />
        ))}

        {inView && (
          <motion.rect
            x="150"
            y="280"
            width="0"
            height="3"
            rx="1.5"
            fill="url(#gold-h)"
            style={{ opacity: 0.1 }}
            animate={{ x: [150, 800], width: [120, 120], opacity: [0, 0.12, 0] }}
            transition={{ duration: 4, delay: 7, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
          />
        )}
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
