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
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section ref={ref} className="relative py-14 lg:py-16 bg-white border-y border-gray-100/80">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={`flex flex-col items-center text-center py-2 ${
                i < stats.length - 1 ? "lg:border-r lg:border-gray-100" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-testid={`stat-${i}`}
            >
              <stat.icon className="w-5 h-5 text-[#05a270] mb-2" />
              <div className="text-[28px] md:text-[32px] font-extrabold text-[#004733] tracking-tight leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} active={inView} />
              </div>
              <p className="text-[12px] text-gray-400 font-semibold mt-1.5 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
