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
    <section ref={ref} className="relative py-14 lg:py-16 bg-[#1a1a1a]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 160 }}
              data-testid={`stat-${i}`}
            >
              <div className="relative rounded-xl overflow-hidden p-5 lg:p-6 flex flex-col items-center text-center bg-gradient-to-b from-[#d4a94c] via-[#c4953a] to-[#a07a2e] shadow-lg shadow-black/30 border border-[#e2c06e]/40 transition-transform duration-300 group-hover:scale-[1.04]">
                <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-[#f0d88a]/20 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5e6b0]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a6520]/60 to-transparent" />

                <stat.icon className="w-5 h-5 text-[#1a1a1a]/60 mb-2.5 relative" />
                <div className="text-[32px] md:text-[36px] lg:text-[40px] font-extrabold text-[#1a1a1a] tracking-tight leading-none relative drop-shadow-[0_1px_0_rgba(240,216,138,0.5)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} active={inView} />
                </div>
                <p className="text-[11px] md:text-[12px] text-[#1a1a1a]/50 font-bold mt-2 uppercase tracking-wider relative">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
