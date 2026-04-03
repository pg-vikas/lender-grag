import { ArrowRight, BookOpen, CheckSquare, Home, FileText, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const resources = [
  { icon: BookOpen, title: "First-Time Buyer Guide", desc: "Everything you need to know before buying your first home — from credit to closing.", color: "#004733" },
  { icon: CheckSquare, title: "Pre-Approval Checklist", desc: "The documents and steps needed to get pre-approved fast and stress-free.", color: "#006d4e" },
  { icon: Home, title: "How Much House Can I Afford?", desc: "Understand your real budget based on what lenders actually look for.", color: "#059660" },
  { icon: FileText, title: "Documents You'll Need", desc: "A complete list of what to prepare before starting your mortgage application.", color: "#006d4e" },
  { icon: AlertTriangle, title: "Mortgage Mistakes to Avoid", desc: "Five common pitfalls that cost borrowers time, money, and deals.", color: "#004733" },
];

export const ResourcesSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">Resources</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-resources-heading">
              Learn Before You Borrow
            </h2>
            <p className="text-gray-500 text-[16px] mt-3 max-w-[420px] leading-relaxed">
              Guides and tools to help you navigate the process with clarity.
            </p>
          </div>
          <Link href="/resources">
            <span className="inline-flex items-center gap-2 text-[#004733] text-[14px] font-semibold cursor-pointer hover:gap-3 transition-all duration-300 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {resources.map((r, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/15 hover:shadow-lg hover:shadow-[#004733]/[0.03] hover:-translate-y-1 transition-all duration-400 ease-out cursor-pointer"
              data-testid={`card-resource-${i}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ backgroundColor: `${r.color}0D` }}
              >
                <r.icon className="w-5 h-5 transition-colors duration-300" style={{ color: r.color }} />
              </div>
              <h3 className="text-[15px] font-bold text-[#0c1a14] mb-1.5 group-hover:text-[#004733] transition-colors">{r.title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-3">{r.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#004733] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
