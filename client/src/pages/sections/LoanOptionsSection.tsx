import { ArrowRight, Home, Building2, Shield, Landmark, Key, RefreshCw, Building, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useRef } from "react";

const loans = [
  { icon: Home, title: "Conventional", summary: "Standard financing with competitive rates", tag: "Most Popular", benefits: ["As low as 3% down", "No PMI with 20% down", "Fixed or adjustable rates"] },
  { icon: Shield, title: "FHA", summary: "Government-backed with lower requirements", tag: "Low Down Payment", benefits: ["3.5% minimum down", "Credit scores from 580", "Seller concessions allowed"] },
  { icon: Landmark, title: "VA", summary: "Exclusive benefits for those who served", tag: "$0 Down", benefits: ["Zero down payment", "No monthly PMI", "Competitive interest rates"] },
  { icon: Building2, title: "Jumbo", summary: "Premium financing for high-value homes", tag: "Premium", benefits: ["Loan amounts over $766K", "Competitive jumbo rates", "Flexible underwriting"] },
  { icon: Key, title: "First-Time Buyer", summary: "Programs designed to get you started", tag: "Best For Starters", benefits: ["Down payment assistance", "Reduced mortgage insurance", "Educational guidance"] },
  { icon: RefreshCw, title: "Refinance", summary: "Lower your rate or access equity", tag: "Save Monthly", benefits: ["Rate-and-term refinance", "Cash-out options", "Streamline programs"] },
  { icon: Building, title: "Investment", summary: "Finance your next investment property", tag: "Build Wealth", benefits: ["Multi-unit financing", "Portfolio lending", "DSCR loan options"] },
];

function CityBlock({ x, y, w, h, fill }: { x: number; y: number; w: number; h: number; fill: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} />;
}

function BirdsEyeCity() {
  const cityRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cityRef,
    offset: ["start end", "end start"],
  });
  const cityY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const cityScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <div ref={cityRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: cityY, scale: cityScale }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 2400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="1200" height="2400" fill="#0f1410" />

          <rect x="0" y="0" width="1200" height="2400" fill="#0d100e" />

          <rect x="280" y="0" width="80" height="2400" fill="#151a16" />
          <rect x="840" y="0" width="80" height="2400" fill="#151a16" />
          {Array.from({ length: 48 }).map((_, i) => (
            <rect key={`vl-${i}`} x="318" y={i * 50} width="4" height="30" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 48 }).map((_, i) => (
            <rect key={`vr-${i}`} x="878" y={i * 50 + 25} width="4" height="30" rx="2" fill="#2a352c" opacity="0.6" />
          ))}

          <rect x="0" y="500" width="1200" height="70" fill="#151a16" />
          <rect x="0" y="1100" width="1200" height="70" fill="#151a16" />
          <rect x="0" y="1700" width="1200" height="70" fill="#151a16" />
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h1-${i}`} x={i * 50} y="533" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h2-${i}`} x={i * 50 + 15} y="1133" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={`h3-${i}`} x={i * 50} y="1733" width="30" height="4" rx="2" fill="#2a352c" opacity="0.6" />
          ))}

          <CityBlock x={30} y={40} w={220} h={140} fill="#1a2a1e" />
          <CityBlock x={50} y={60} w={80} h={100} fill="#1f3024" />
          <CityBlock x={160} y={50} w={70} h={120} fill="#1c2c20" />
          {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => (
            <rect key={`w1-${r}-${c}`} x={58 + c * 22} y={68 + r * 14} width={8} height={6} rx="1" fill="#d4a94c" opacity={0.15 + Math.random() * 0.25} />
          )))}

          <CityBlock x={390} y={30} w={200} h={160} fill="#1a2a1e" />
          <CityBlock x={400} y={40} w={90} h={130} fill="#223a28" />
          <CityBlock x={510} y={60} w={60} h={100} fill="#1e3022" />
          {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w2-${r}-${c}`} x={408 + c * 20} y={48 + r * 14} width={7} height={5} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.3} />
          )))}

          <CityBlock x={950} y={50} w={210} h={130} fill="#1a2a1e" />
          <CityBlock x={960} y={55} w={100} h={110} fill="#1f3024" />
          <CityBlock x={1080} y={70} w={60} h={80} fill="#1c2c20" />
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w3-${r}-${c}`} x={968 + c * 22} y={63 + r * 18} width={8} height={7} rx="1" fill="#d4a94c" opacity={0.12 + Math.random() * 0.2} />
          )))}

          <CityBlock x={30} y={220} w={230} h={250} fill="#182620" />
          <CityBlock x={40} y={230} w={110} h={230} fill="#1e3424" />
          <CityBlock x={170} y={260} w={70} h={180} fill="#1a2e1e" />
          {Array.from({ length: 12 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => (
            <rect key={`w4-${r}-${c}`} x={48 + c * 20} y={238 + r * 18} width={7} height={6} rx="1" fill="#d4a94c" opacity={0.08 + Math.random() * 0.3} />
          )))}

          <CityBlock x={400} y={240} w={180} h={220} fill="#1a2a1e" />
          <CityBlock x={410} y={250} w={80} h={200} fill="#213528" />
          <CityBlock x={510} y={280} w={50} h={150} fill="#1c2e22" />

          <CityBlock x={950} y={230} w={220} h={240} fill="#182620" />
          <CityBlock x={960} y={240} w={95} h={220} fill="#1f3024" />
          <CityBlock x={1075} y={260} w={80} h={180} fill="#1c2c20" />
          {Array.from({ length: 10 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w5-${r}-${c}`} x={968 + c * 20} y={248 + r * 20} width={7} height={7} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.25} />
          )))}

          <CityBlock x={40} y={610} w={210} h={180} fill="#1a2a1e" />
          <CityBlock x={50} y={620} w={100} h={160} fill="#1f3424" />
          <CityBlock x={170} y={640} w={60} h={120} fill="#1c2e20" />
          {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
            <rect key={`w6-${r}-${c}`} x={58 + c * 22} y={628 + r * 18} width={8} height={6} rx="1" fill="#d4a94c" opacity={0.1 + Math.random() * 0.25} />
          )))}

          <CityBlock x={400} y={620} w={160} h={160} fill="#182620" />
          <CityBlock x={410} y={630} w={70} h={140} fill="#1e3022" />

          <CityBlock x={950} y={600} w={200} h={200} fill="#1a2a1e" />
          <CityBlock x={960} y={610} w={90} h={180} fill="#203226" />
          <CityBlock x={1070} y={630} w={60} h={140} fill="#1c2c20" />

          <CityBlock x={40} y={850} w={220} h={210} fill="#182620" />
          <CityBlock x={400} y={830} w={200} h={230} fill="#1a2a1e" />
          <CityBlock x={950} y={860} w={210} h={200} fill="#1a2a1e" />

          <CityBlock x={40} y={1200} w={220} h={180} fill="#1a2a1e" />
          <CityBlock x={400} y={1210} w={180} h={170} fill="#182620" />
          <CityBlock x={950} y={1190} w={200} h={190} fill="#1a2a1e" />

          <CityBlock x={40} y={1430} w={210} h={240} fill="#182620" />
          <CityBlock x={400} y={1450} w={190} h={210} fill="#1a2a1e" />
          <CityBlock x={950} y={1420} w={220} h={250} fill="#1a2a1e" />

          <CityBlock x={40} y={1800} w={220} h={200} fill="#1a2a1e" />
          <CityBlock x={400} y={1810} w={180} h={180} fill="#182620" />
          <CityBlock x={950} y={1790} w={210} h={210} fill="#1a2a1e" />

          <CityBlock x={40} y={2050} w={200} h={180} fill="#182620" />
          <CityBlock x={400} y={2060} w={190} h={170} fill="#1a2a1e" />
          <CityBlock x={950} y={2040} w={220} h={190} fill="#1a2a1e" />

          <rect x="310" y="120" width="26" height="14" rx="4" fill="#d4a94c" opacity="0.5" />
          <rect x="850" y="380" width="22" height="12" rx="3" fill="#4a4a4a" opacity="0.6" />
          <rect x="300" y="700" width="24" height="14" rx="4" fill="#3a5a4a" opacity="0.5" />
          <rect x="870" y="950" width="28" height="14" rx="4" fill="#d4a94c" opacity="0.4" />
          <rect x="310" y="1300" width="22" height="12" rx="3" fill="#555" opacity="0.5" />
          <rect x="860" y="1600" width="26" height="14" rx="4" fill="#3a5a4a" opacity="0.4" />

          <rect x="140" y="520" width="14" height="26" rx="4" fill="#555" opacity="0.5" />
          <rect x="500" y="515" width="14" height="28" rx="4" fill="#d4a94c" opacity="0.4" />
          <rect x="1020" y="525" width="14" height="24" rx="4" fill="#3a5a4a" opacity="0.5" />
          <rect x="200" y="1115" width="14" height="26" rx="4" fill="#d4a94c" opacity="0.45" />
          <rect x="700" y="1110" width="14" height="28" rx="4" fill="#555" opacity="0.4" />
          <rect x="80" y="1720" width="14" height="24" rx="4" fill="#3a5a4a" opacity="0.5" />
          <rect x="600" y="1725" width="14" height="26" rx="4" fill="#d4a94c" opacity="0.35" />

          <circle cx="100" cy="350" r="12" fill="#1a2a1e" opacity="0.5" />
          <circle cx="620" cy="150" r="10" fill="#1a2a1e" opacity="0.4" />
          <circle cx="750" cy="650" r="14" fill="#1a2a1e" opacity="0.45" />
          <circle cx="650" cy="1050" r="11" fill="#1a2a1e" opacity="0.4" />
          <circle cx="200" cy="1500" r="13" fill="#1a2a1e" opacity="0.5" />
          <circle cx="780" cy="1850" r="12" fill="#1a2a1e" opacity="0.4" />
          <circle cx="680" cy="400" r="8" fill="#1a2a1e" opacity="0.35" />
          <circle cx="120" cy="980" r="10" fill="#1a2a1e" opacity="0.4" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410] via-transparent to-[#0f1410] pointer-events-none" />
      <div className="absolute inset-0 bg-[#0f1410]/40 pointer-events-none" />
    </div>
  );
}

export const LoanOptionsSection = (): JSX.Element => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <BirdsEyeCity />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/10 text-[#d4a94c] text-[13px] font-bold uppercase tracking-[0.15em] border border-[#d4a94c]/20 mb-5">
            Loan Programs
          </span>
          <h2 className="text-4xl md:text-[52px] font-extrabold text-white mt-3 tracking-[-0.02em]" data-testid="text-loan-options-heading">
            Find Your Perfect Fit
          </h2>
          <p className="text-white/40 text-[17px] mt-4 max-w-[500px] mx-auto leading-relaxed">
            Every borrower is different. We offer a full range of programs to match your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {loans.map((loan, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 24, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative p-6 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#d4a94c]/30 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              data-testid={`card-loan-${i}`}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-[#d4a94c]/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent group-hover:via-[#d4a94c]/30 transition-all duration-500" />

              <div className="relative flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#d4a94c]/15 group-hover:border-[#d4a94c]/25 transition-all duration-300">
                  <loan.icon className="w-[20px] h-[20px] text-white/50 group-hover:text-[#d4a94c] transition-colors duration-300" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#d4a94c]/10 text-[#d4a94c] text-[10px] font-bold uppercase tracking-wider border border-[#d4a94c]/15">{loan.tag}</span>
              </div>
              <h3 className="text-[18px] font-bold text-white mb-1 relative group-hover:text-[#f0d88a] transition-colors duration-300">{loan.title}</h3>
              <p className="text-[13px] text-white/35 mb-4 relative">{loan.summary}</p>
              <ul className="flex-1 space-y-2 mb-5 relative">
                {loan.benefits.map((b, j) => (
                  <li key={j} className="text-[13px] text-white/45 flex items-start gap-2.5 group-hover:text-white/60 transition-colors duration-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4a94c]/50 mt-[2px] flex-shrink-0 group-hover:text-[#d4a94c] transition-colors duration-300" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/loan-options">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white/30 group-hover:text-[#d4a94c] cursor-pointer group-hover:gap-2.5 transition-all duration-300 relative">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
