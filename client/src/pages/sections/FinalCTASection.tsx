import { ArrowRight, Phone, Shield, Clock, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const trustPoints = [
  { icon: Clock, text: "Close in as little as 21 days" },
  { icon: Shield, text: "No hidden fees or surprises" },
  { icon: Star, text: "4.9 stars across 150+ reviews" },
];

export const FinalCTASection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-[#004733]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-[0.02]" />
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#05a270]/[0.08] blur-[120px]" />
        <div className="absolute -bottom-[100px] right-[10%] w-[400px] h-[400px] rounded-full bg-white/[0.04] blur-[100px]" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] text-white/80 text-[13px] font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Free consultation · No obligation
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.1]" data-testid="text-final-cta-heading">
            Ready to Move
            <br />
            <span className="text-emerald-300">with Confidence?</span>
          </h2>
          <p className="text-white/50 text-[17px] mt-5 max-w-[480px] mx-auto leading-relaxed">
            Get pre-approved today and take the first step toward smart, strategic home financing.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/apply">
              <Button className="h-[52px] px-8 rounded-xl bg-white text-[#004733] text-[15px] font-semibold hover:bg-white/95 shadow-xl shadow-black/10 gap-2.5 group transition-all duration-300 hover:scale-[1.01]" data-testid="button-final-apply">
                Get Pre-Approved
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="h-[52px] px-8 rounded-xl text-white text-[15px] font-semibold hover:bg-white/10 gap-2.5 group border border-white/15" data-testid="button-final-call">
                <Phone className="w-4 h-4" />
                Book a Free Call
              </Button>
            </Link>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {trustPoints.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-white/40 text-[13px]">
                <t.icon className="w-4 h-4 text-emerald-400/60" />
                {t.text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
