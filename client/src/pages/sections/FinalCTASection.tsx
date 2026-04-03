import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export const FinalCTASection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-[#004733] via-[#005c42] to-[#004733]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#05a270]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="max-w-[800px] mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight" data-testid="text-final-cta-heading">
            Ready to Make Your
            <br />Move with Confidence?
          </h2>
          <p className="text-white/70 text-lg max-w-[520px] leading-relaxed">
            Whether you're buying your first home, refinancing, or investing — let's build a mortgage strategy that works for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/apply">
              <Button className="h-14 px-8 rounded-2xl bg-white text-[#004733] text-lg font-semibold hover:bg-white/90 shadow-xl gap-2 transition-all duration-300 hover:scale-[1.02]" data-testid="button-final-apply">
                Get Pre-Approved
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-white/30 text-white text-lg font-semibold hover:bg-white/10 gap-2 transition-all duration-300" data-testid="button-final-call">
                <Phone className="w-5 h-5" />
                Book a Free Call
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
