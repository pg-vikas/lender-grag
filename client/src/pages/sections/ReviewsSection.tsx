import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  { name: "Kevan Jones", role: "First-Time Buyer", text: "Greg helped throughout the entire process from pre-approval all the way to closing. He answered every question promptly and we even got a lower rate than expected.", rating: 5 },
  { name: "Brian Diaz", role: "Refinance Client", text: "Outstanding experience from start to finish. Greg's communication was incredible — he kept us informed at every step and made refinancing feel effortless.", rating: 5 },
  { name: "Sarah Mitchell", role: "Home Buyer", text: "As a first-time buyer, I was nervous about the process. Greg made everything so clear and simple. He truly cares about finding the right fit for each client.", rating: 5 },
  { name: "Michael Torres", role: "Investment Property", text: "Greg found us a competitive rate and structured the deal perfectly for our investment goals. His expertise in non-traditional loans is unmatched.", rating: 5 },
  { name: "Jennifer Wu", role: "Home Buyer", text: "Closed in just 19 days! Greg and his team were responsive, professional, and made the impossible feel easy. I've recommended him to everyone I know.", rating: 5 },
  { name: "David Kim", role: "VA Loan Client", text: "Being a veteran, I needed someone who understood VA loans inside and out. Greg was that person. Seamless process, zero stress, zero down.", rating: 5 },
];

export const ReviewsSection = (): JSX.Element => {
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
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">Client Reviews</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-reviews-heading">
            Trusted by Hundreds
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-[560px] mx-auto leading-relaxed">
            150+ five-star reviews from real clients on Zillow.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              className="group p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-[#004733]/5 hover:border-[#004733]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              data-testid={`card-review-${i}`}
            >
              <Quote className="w-8 h-8 text-[#004733]/15 mb-4" />
              <p className="text-gray-700 leading-relaxed flex-1 mb-5">{r.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004733] to-[#05a270] flex items-center justify-center text-white text-sm font-bold">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0c1a14] text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
