import { MessageSquare, Target, Handshake, Eye, Wrench, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: MessageSquare, title: "Fast Communication", desc: "Responsive and clear at every step. You'll never be left wondering what's happening with your loan." },
  { icon: Target, title: "Clear Loan Strategy", desc: "We match you with the right program, structure your file strategically, and position you for the best outcome." },
  { icon: Handshake, title: "Smooth Closings", desc: "Proactive coordination with all parties means fewer surprises and faster closings — often in 21 days." },
  { icon: Eye, title: "Honest Guidance", desc: "No hidden fees, no surprises. We explain your options clearly so you make informed, confident decisions." },
  { icon: Wrench, title: "Problem-Solving Mindset", desc: "Complex scenarios don't scare us. We find creative solutions to get deals done that others can't." },
  { icon: GraduationCap, title: "Buyer Education", desc: "We empower you with knowledge about rates, terms, and market conditions so you understand every choice." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const WhyGregSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafcfb]">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">Why Work With Greg</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-why-greg-heading">
            Lending That Feels Different
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-[560px] mx-auto leading-relaxed">
            A mortgage experience built on expertise, speed, and genuine care for your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#004733]/20 hover:shadow-xl hover:shadow-[#004733]/5 hover:-translate-y-1 transition-all duration-300"
              data-testid={`card-feature-${i}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#004733]/10 flex items-center justify-center mb-5 group-hover:bg-[#004733] transition-colors duration-300">
                <f.icon className="w-6 h-6 text-[#004733] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#0c1a14] mb-2">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
