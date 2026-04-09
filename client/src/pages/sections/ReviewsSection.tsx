import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiGoogle, SiYelp, SiZillow } from "react-icons/si";

const reviews = [
  { name: "Kevan Jones", role: "First-Time Buyer", location: "San Diego, CA", text: "Greg helped throughout the entire process from pre-approval all the way to closing. He answered every question promptly and we even got a lower rate than expected. Couldn't have asked for a better experience." },
  { name: "Brian Diaz", role: "Refinance Client", location: "Carlsbad, CA", text: "Outstanding experience from start to finish. Greg's communication was incredible — he kept us informed at every step and made refinancing feel effortless. We saved over $400/month." },
  { name: "Sarah Mitchell", role: "First-Time Buyer", location: "Oceanside, CA", text: "As a first-time buyer, I was nervous about the process. Greg made everything so clear and simple. He truly cares about finding the right fit for each client. I felt supported every step of the way." },
  { name: "Michael Torres", role: "Investment Property", location: "La Jolla, CA", text: "Greg found us a competitive rate and structured the deal perfectly for our investment goals. His expertise in non-traditional loans is unmatched. Already working with him on our next property." },
  { name: "Jennifer Wu", role: "Home Buyer", location: "Encinitas, CA", text: "Closed in just 19 days! Greg and his team were responsive, professional, and made the impossible feel easy. I've recommended him to everyone I know." },
  { name: "David Kim", role: "VA Loan Client", location: "Chula Vista, CA", text: "Being a veteran, I needed someone who understood VA loans inside and out. Greg was that person. Seamless process, zero stress, zero down. He went above and beyond for our family." },
];

export const ReviewsSection = (): JSX.Element => {
  const [featured, setFeatured] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setFeatured(p => (p + 1) % reviews.length);
    }, 6000);
  };

  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goTo = (index: number) => {
    setFeatured(index);
    startAutoplay();
  };

  const current = reviews[featured];

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">Client Reviews</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-reviews-heading">
              Hear It From Them
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Zillow", href: "https://www.zillow.com/profile/LenderGreg", icon: SiZillow, color: "#0074e4", hoverBg: "hover:bg-[#0074e4]/10", borderColor: "border-[#0074e4]/30" },
              { label: "Yelp", href: "https://www.yelp.com", icon: SiYelp, color: "#d32323", hoverBg: "hover:bg-[#d32323]/10", borderColor: "border-[#d32323]/30" },
              { label: "Google", href: "https://www.google.com/search?q=Lender+Greg+reviews", icon: SiGoogle, color: "#4285f4", hoverBg: "hover:bg-[#4285f4]/10", borderColor: "border-[#4285f4]/30" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2.5 rounded-full border-2 ${item.borderColor} bg-white px-6 py-3 text-base font-extrabold ${item.hoverBg} hover:shadow-md transition-all`}
                style={{ color: item.color }}
                data-testid={`link-review-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-stretch"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="relative bg-gradient-to-br from-[#004733] to-[#0a6e4e] rounded-[24px] p-8 md:p-10 flex flex-col justify-between min-h-[380px] overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.04] blur-[80px]" />
            <Quote className="w-10 h-10 text-white/10 mb-4" />
            <AnimatePresence mode="wait">
              <motion.div
                key={featured}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col justify-center"
              >
                <p className="text-white text-[18px] md:text-[20px] leading-[1.7] font-medium mb-8">
                  "{current.text}"
                </p>
                <div>
                  <p className="text-white font-bold text-[15px]">{current.name}</p>
                  <p className="text-white/50 text-[13px]">{current.role} · {current.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => goTo((featured - 1 + reviews.length) % reviews.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                data-testid="button-review-prev"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === featured ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo((featured + 1) % reviews.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                data-testid="button-review-next"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviews.filter((_, i) => i !== featured).slice(0, 4).map((r, i) => (
              <motion.button
                key={`${r.name}-${featured}`}
                onClick={() => goTo(reviews.indexOf(r))}
                className="text-left p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#004733]/15 hover:shadow-lg hover:shadow-[#004733]/[0.03] transition-all duration-300 flex flex-col group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                data-testid={`card-review-${i}`}
              >
                <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-3">"{r.text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004733] to-[#0a7a55] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0c1a14] text-[12px] truncate">{r.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{r.role}</p>
                  </div>
                  <div className="flex gap-0.5 ml-auto flex-shrink-0">
                    {[1,2,3,4,5].map(j => (
                      <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
