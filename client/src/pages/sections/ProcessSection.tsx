import { Phone, FileCheck, Search, FileText, ShieldCheck, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Phone, title: "Intro Call", desc: "We discuss your goals, timeline, and financial picture to map out a smart plan." },
  { icon: FileCheck, title: "Pre-Approval", desc: "We review your documents, run the numbers, and get you a strong pre-approval letter." },
  { icon: Search, title: "Home Search", desc: "Shop with confidence knowing exactly what you qualify for and can afford." },
  { icon: FileText, title: "Offer & Docs", desc: "We prepare your loan package, coordinate with your agent, and submit for processing." },
  { icon: ShieldCheck, title: "Underwriting", desc: "We manage all conditions, communicate with underwriters, and keep things moving." },
  { icon: PartyPopper, title: "Closing", desc: "Sign your final documents, get the keys, and celebrate your new home." },
];

export const ProcessSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafcfb]">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">The Process</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-process-heading">
            Six Steps to Your New Home
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-[560px] mx-auto leading-relaxed">
            We handle the complexity so you can focus on finding your home.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-0.5 bg-gradient-to-r from-[#004733]/10 via-[#004733]/20 to-[#004733]/10" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center group"
                data-testid={`step-${i}`}
              >
                <div className="relative mb-5">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-white border-2 border-[#004733]/10 flex items-center justify-center shadow-sm group-hover:border-[#004733]/30 group-hover:shadow-lg group-hover:shadow-[#004733]/5 group-hover:-translate-y-1 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-[#004733]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#004733] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#0c1a14] mb-1.5">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
