import { motion } from "framer-motion";

export const StatementSection = (): JSX.Element => {
  return (
    <section
      className="flex items-center justify-center w-full py-40"
      style={{
        background: "linear-gradient(180deg, #f0faf6 0%, #ffffff 50%, #f0faf6 100%)",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-7xl tracking-[-1px] leading-tight text-center max-w-[800px]"
        data-testid="text-statement"
      >
        I help you own your dream home.
      </motion.h2>
    </section>
  );
};
