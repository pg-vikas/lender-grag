import { ArrowRight, Home, Building2, Shield, Landmark, Key, RefreshCw, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const loans = [
  { icon: Home, title: "Conventional", summary: "Standard financing with competitive rates", badges: ["Low Rates", "Flexible"], benefits: ["As low as 3% down", "No mortgage insurance with 20%", "Fixed or adjustable rates"] },
  { icon: Shield, title: "FHA", summary: "Government-backed with lower requirements", badges: ["Low Down Payment"], benefits: ["3.5% minimum down", "Credit scores from 580", "Seller concessions allowed"] },
  { icon: Landmark, title: "VA", summary: "Exclusive benefits for those who served", badges: ["$0 Down", "No PMI"], benefits: ["Zero down payment", "No monthly PMI", "Competitive interest rates"] },
  { icon: Building2, title: "Jumbo", summary: "Premium financing for high-value homes", badges: ["Premium"], benefits: ["Loan amounts over $766K", "Competitive jumbo rates", "Flexible underwriting"] },
  { icon: Key, title: "First-Time Buyer", summary: "Programs designed to get you started", badges: ["Best For Starters"], benefits: ["Down payment assistance", "Reduced mortgage insurance", "Educational guidance"] },
  { icon: RefreshCw, title: "Refinance", summary: "Lower your rate or access equity", badges: ["Save Money"], benefits: ["Rate-and-term refinance", "Cash-out options", "Streamline programs"] },
  { icon: Building, title: "Investment", summary: "Finance your next investment property", badges: ["Build Wealth"], benefits: ["Multi-unit financing", "Portfolio lending", "DSCR loan options"] },
];

export const LoanOptionsSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">Loan Programs</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-loan-options-heading">
            Find Your Perfect Fit
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-[560px] mx-auto leading-relaxed">
            Every borrower is different. We offer a full range of mortgage programs to match your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {loans.map((loan, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/20 hover:shadow-xl hover:shadow-[#004733]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              data-testid={`card-loan-${i}`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center mb-4 group-hover:bg-[#004733] transition-colors duration-300">
                <loan.icon className="w-5 h-5 text-[#004733] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-[#0c1a14] mb-1">{loan.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{loan.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {loan.badges.map(b => (
                  <span key={b} className="px-2.5 py-0.5 rounded-full bg-[#004733]/10 text-[#004733] text-xs font-semibold">{b}</span>
                ))}
              </div>
              <ul className="flex-1 space-y-1.5 mb-4">
                {loan.benefits.map((b, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#05a270] mt-1.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/loan-options">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004733] cursor-pointer group-hover:gap-2.5 transition-all duration-300">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
