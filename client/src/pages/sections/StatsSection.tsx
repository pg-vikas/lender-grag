import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Users, DollarSign, Zap, Award, Target, Star } from "lucide-react";

const stats = [
  { value: 500, suffix: "+", label: "Families Helped", icon: Users },
  { value: 150, suffix: "M+", label: "Loans Funded", icon: DollarSign },
  { value: 15, suffix: "min", label: "Avg Response", icon: Zap },
  { value: 15, suffix: "yrs", label: "Experience", icon: Award },
  { value: 98, suffix: "%", label: "Close Rate", icon: Target },
  { value: 4.9, suffix: "/5", label: "Client Rating", icon: Star, decimals: 1 },
];

function AnimatedCounter({ value, suffix, decimals = 0, active }: { value: number; suffix: string; decimals?: number; active: boolean }) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;
    const duration = 2200;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(parseFloat((eased * value).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, value, decimals]);

  return <span>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}</span>;
}

export const StatsSection = (): JSX.Element => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-20 lg:py-24 bg-[#004733] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[#05a270]/10 blur-3xl" />
        <div className="absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] rounded-full bg-[#05a270]/[0.07] blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stats-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" />
        </svg>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[13px] font-semibold tracking-wide mb-4">
            <Target className="w-3.5 h-3.5" />
            Proven Track Record
          </span>
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-extrabold text-white tracking-[-0.02em]">
            Numbers That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 150 }}
              data-testid={`stat-${i}`}
            >
              <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-7 flex flex-col items-center text-center transition-all duration-300 group-hover:bg-white/[0.14] group-hover:border-white/20 group-hover:scale-[1.03]">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-[#05a270]/20 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-[#3be8a0]" />
                </motion.div>
                <div className="text-[36px] md:text-[40px] lg:text-[44px] font-extrabold text-white tracking-tight leading-none">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} active={inView} />
                </div>
                <p className="text-[13px] md:text-[14px] text-white/50 font-semibold mt-2 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
