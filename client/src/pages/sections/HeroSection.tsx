import { ArrowRight, Shield, Clock, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const floatingCards = [
  { icon: Shield, label: "Pre-Approved in 24hrs", value: "Fast Track", delay: 0 },
  { icon: Clock, label: "Avg. Close Time", value: "21 Days", delay: 0.8 },
  { icon: TrendingUp, label: "Rate Lock", value: "Secured", delay: 1.6 },
  { icon: Star, label: "Client Rating", value: "4.9/5", delay: 2.4 },
];

export const HeroSection = (): JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#f0faf6] via-white to-[#e8f5ee]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[20%] w-[500px] h-[500px] rounded-full bg-[#004733]/5 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full bg-[#05a270]/5 blur-3xl animate-glow-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#004733]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#004733]/5" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004733]/10 text-[#004733] text-sm font-semibold mb-4">
                <Star className="w-3.5 h-3.5 fill-[#004733]" />
                Trusted by 500+ Families
              </span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-[68px] font-bold text-[#0c1a14] leading-[1.1] tracking-tight"
              data-testid="text-hero-headline"
            >
              Smart Mortgage
              <br />
              <span className="text-[#004733]">Strategy,</span> Built
              <br />
              Around You
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-lg text-gray-600 max-w-[480px] leading-relaxed"
            >
              Confident home financing backed by clear communication, 
              fast execution, and a strategy that puts your goals first.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/apply">
                <Button className="h-14 px-8 rounded-2xl bg-[#004733] hover:bg-[#003626] text-white text-lg font-semibold shadow-xl shadow-[#004733]/25 gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]" data-testid="button-hero-apply">
                  Get Pre-Approved
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-[#004733]/20 text-[#004733] text-lg font-semibold hover:bg-[#004733]/5 transition-all duration-300" data-testid="button-hero-call">
                  Book a Free Call
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#004733] to-[#05a270] flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">150+ five-star reviews on Zillow</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative hidden lg:block h-[560px]">
            {floatingCards.map((card, i) => {
              const positions = [
                "top-0 right-0",
                "top-[180px] right-[220px]",
                "bottom-[100px] right-[40px]",
                "bottom-0 left-0",
              ];
              return (
                <motion.div
                  key={i}
                  className={`absolute ${positions[i]} w-[240px]`}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 + i * 0.15 }}
                >
                  <div
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    style={{ animation: `float-slow ${6 + i}s ease-in-out infinite`, animationDelay: `${card.delay}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#004733]/10 flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-[#004733]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                        <p className="text-lg font-bold text-[#004733]">{card.value}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              className="absolute top-[60px] left-[20px] w-[280px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-[#004733] to-[#05a270] rounded-2xl p-6 text-white shadow-2xl shadow-[#004733]/30">
                <p className="text-sm font-medium opacity-80 mb-1">Estimated Payment</p>
                <p className="text-3xl font-bold">$2,847</p>
                <p className="text-xs opacity-60 mt-1">Based on $450K · 30yr · 6.5%</p>
                <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs opacity-60 mt-1">Debt-to-income: 32%</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
