import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Families Helped" },
  { value: 150, suffix: "M+", label: "Loans Closed" },
  { value: 15, suffix: "min", label: "Avg Response" },
  { value: 15, suffix: "yrs", label: "Experience" },
  { value: 98, suffix: "%", label: "Close Rate" },
  { value: 4.9, suffix: "/5", label: "Client Rating", decimals: 1 },
];

function AnimatedCounter({ value, suffix, decimals = 0, inView }: { value: number; suffix: string; decimals?: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * value).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, value, decimals]);

  return <span>{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

export const StatsSection = (): JSX.Element => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-16 bg-white border-y border-gray-100">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-testid={`stat-${i}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-[#004733]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} inView={inView} />
              </div>
              <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
