import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const StatementSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [60, 0, 0, 0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.92, 1, 1, 1, 0.92]);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center w-full py-40"
      style={{
        background: "linear-gradient(180deg, #f0faf6 0%, #ffffff 50%, #f0faf6 100%)",
      }}
    >
      <motion.h2
        style={{ opacity, y, scale }}
        className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-7xl tracking-[-1px] leading-tight text-center max-w-[800px]"
        data-testid="text-statement"
      >
        I help you own your dream home.
      </motion.h2>
    </section>
  );
};
