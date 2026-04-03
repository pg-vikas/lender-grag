import { ArrowRight, BookOpen, CheckSquare, Home, FileText, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const resources = [
  { icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home." },
  { icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast." },
  { icon: Home, title: "How Much House Can I Afford?", desc: "Understand your budget and what lenders look for." },
  { icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare for your application." },
  { icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Common pitfalls that cost borrowers time and money." },
];

export const ResourcesSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">Resources</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-resources-heading">
              Knowledge Is Power
            </h2>
            <p className="text-gray-600 text-lg mt-3 max-w-[480px] leading-relaxed">
              Helpful guides and tools to make you a smarter borrower.
            </p>
          </div>
          <Link href="/resources">
            <span className="inline-flex items-center gap-2 text-[#004733] font-semibold cursor-pointer hover:gap-3 transition-all duration-300">
              View All Resources <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {resources.map((r, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              data-testid={`card-resource-${i}`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center mb-4 group-hover:bg-[#004733] transition-colors duration-300">
                <r.icon className="w-5 h-5 text-[#004733] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-[#0c1a14] mb-2 group-hover:text-[#004733] transition-colors">{r.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{r.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004733] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
