import { ArrowRight, Home, Building2, Shield, Landmark, Key, RefreshCw, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const loans = [
  { icon: Home, title: "Conventional", summary: "Standard financing with competitive rates", tag: "Most Popular", benefits: ["As low as 3% down", "No PMI with 20% down", "Fixed or adjustable rates"] },
  { icon: Shield, title: "FHA", summary: "Government-backed with lower requirements", tag: "Low Down Payment", benefits: ["3.5% minimum down", "Credit scores from 580", "Seller concessions allowed"] },
  { icon: Landmark, title: "VA", summary: "Exclusive benefits for those who served", tag: "$0 Down", benefits: ["Zero down payment", "No monthly PMI", "Competitive interest rates"] },
  { icon: Building2, title: "Jumbo", summary: "Premium financing for high-value homes", tag: "Premium", benefits: ["Loan amounts over $766K", "Competitive jumbo rates", "Flexible underwriting"] },
  { icon: Key, title: "First-Time Buyer", summary: "Programs designed to get you started", tag: "Best For Starters", benefits: ["Down payment assistance", "Reduced mortgage insurance", "Educational guidance"] },
  { icon: RefreshCw, title: "Refinance", summary: "Lower your rate or access equity", tag: "Save Monthly", benefits: ["Rate-and-term refinance", "Cash-out options", "Streamline programs"] },
  { icon: Building, title: "Investment", summary: "Finance your next investment property", tag: "Build Wealth", benefits: ["Multi-unit financing", "Portfolio lending", "DSCR loan options"] },
];

export const LoanOptionsSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafdf9]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">Loan Programs</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-loan-options-heading">
            Find Your Perfect Fit
          </h2>
          <p className="text-gray-500 text-[17px] mt-4 max-w-[500px] mx-auto leading-relaxed">
            Every borrower is different. We offer a full range of programs to match your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {loans.map((loan, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="group p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/15 hover:shadow-xl hover:shadow-[#004733]/[0.04] hover:-translate-y-1 transition-all duration-400 ease-out flex flex-col"
              data-testid={`card-loan-${i}`}
            >
              <div className="flex items-start justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#004733]/[0.07] flex items-center justify-center group-hover:bg-[#004733] transition-colors duration-300">
                  <loan.icon className="w-[20px] h-[20px] text-[#004733] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#004733]/[0.06] text-[#004733] text-[11px] font-semibold">{loan.tag}</span>
              </div>
              <h3 className="text-[16px] font-bold text-[#0c1a14] mb-1">{loan.title}</h3>
              <p className="text-[13px] text-gray-400 mb-3.5">{loan.summary}</p>
              <ul className="flex-1 space-y-1.5 mb-4">
                {loan.benefits.map((b, j) => (
                  <li key={j} className="text-[13px] text-gray-500 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#05a270] mt-[7px] flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/loan-options">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#004733] cursor-pointer group-hover:gap-2.5 transition-all duration-300">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
