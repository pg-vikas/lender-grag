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

const streaks = [
  { top: "18%", duration: 4, delay: 0, width: 120, opacity: 0.12 },
  { top: "35%", duration: 3.2, delay: 1.5, width: 180, opacity: 0.08 },
  { top: "52%", duration: 5, delay: 0.8, width: 100, opacity: 0.1 },
  { top: "70%", duration: 3.8, delay: 2.2, width: 150, opacity: 0.06 },
  { top: "85%", duration: 4.5, delay: 0.3, width: 130, opacity: 0.09 },
  { top: "10%", duration: 6, delay: 3, width: 200, opacity: 0.05 },
  { top: "42%", duration: 3.5, delay: 1, width: 90, opacity: 0.11 },
  { top: "62%", duration: 4.2, delay: 2.8, width: 160, opacity: 0.07 },
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
    <section ref={ref} className="relative py-14 lg:py-16 overflow-hidden bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111]">
      <div className="absolute inset-0 pointer-events-none">
        {streaks.map((s, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] rounded-full"
            style={{
              top: s.top,
              width: s.width,
              background: `linear-gradient(90deg, transparent, rgba(212,169,76,${s.opacity}), rgba(240,216,138,${s.opacity * 1.5}), transparent)`,
            }}
            initial={{ x: "-200px" }}
            animate={{ x: "calc(100vw + 200px)" }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4a94c]/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 160 }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              data-testid={`stat-${i}`}
            >
              <motion.div
                className="relative rounded-xl overflow-hidden p-5 lg:p-6 flex flex-col items-center text-center bg-gradient-to-b from-[#d4a94c] via-[#c4953a] to-[#a07a2e] shadow-lg shadow-black/30 border border-[#e2c06e]/40 cursor-pointer"
                whileHover={{ boxShadow: "0 8px 40px rgba(212,169,76,0.35), 0 0 20px rgba(240,216,138,0.15)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-[#f0d88a]/20 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5e6b0]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a6520]/60 to-transparent" />

                <stat.icon className="w-5 h-5 text-[#1a1a1a]/60 mb-2.5 relative" />
                <div className="text-[32px] md:text-[36px] lg:text-[40px] font-extrabold text-[#1a1a1a] tracking-tight leading-none relative drop-shadow-[0_1px_0_rgba(240,216,138,0.5)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} active={inView} />
                </div>
                <p className="text-[11px] md:text-[12px] text-[#1a1a1a]/50 font-bold mt-2 uppercase tracking-wider relative">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
