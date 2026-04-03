import { Phone, FileCheck, Search, FileText, ShieldCheck, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Phone, title: "Intro Call", desc: "We discuss your goals, timeline, and financial picture to map out a smart plan.", color: "#004733" },
  { icon: FileCheck, title: "Pre-Approval", desc: "We review your documents, run the numbers, and get you a strong pre-approval letter.", color: "#006d4e" },
  { icon: Search, title: "Home Search", desc: "Shop with confidence knowing exactly what you qualify for and can afford.", color: "#059660" },
  { icon: FileText, title: "Offer & Docs", desc: "We prepare your loan package, coordinate with your agent, and submit for processing.", color: "#059660" },
  { icon: ShieldCheck, title: "Underwriting", desc: "We manage all conditions, communicate with underwriters, and keep things moving.", color: "#006d4e" },
  { icon: PartyPopper, title: "Closing", desc: "Sign your final documents, get the keys, and celebrate your new home.", color: "#004733" },
];

export const ProcessSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafdf9] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#004733]/[0.02] blur-[100px]" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-process-heading">
            Six Steps to Your New Home
          </h2>
          <p className="text-gray-500 text-[17px] mt-4 max-w-[480px] mx-auto leading-relaxed">
            We handle the complexity so you can focus on what matters.
          </p>
        </motion.div>

        <div className="hidden lg:block relative">
          <div className="absolute top-[44px] left-[80px] right-[80px] h-px bg-gradient-to-r from-transparent via-[#004733]/15 to-transparent" />
          <motion.div
            className="absolute top-[44px] left-[80px] h-px bg-gradient-to-r from-[#004733] to-[#05a270] origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
            style={{ width: "calc(100% - 160px)" }}
          />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center group"
              data-testid={`step-${i}`}
            >
              <div className="relative mb-5">
                <div className="w-[88px] h-[88px] rounded-[22px] bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:shadow-[#004733]/[0.06] group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${step.color}10` }}>
                    <step.icon className="w-[22px] h-[22px]" style={{ color: step.color }} />
                  </div>
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shadow-md" style={{ backgroundColor: step.color }}>
                  {i + 1}
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#0c1a14] mb-1.5">{step.title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
