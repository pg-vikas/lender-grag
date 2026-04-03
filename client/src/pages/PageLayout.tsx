import { Header } from "@/components/Header";
import { FooterSection } from "./sections/FooterSection";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <FooterSection />
    </div>
  );
}

export function PageHero({ tag, title, description }: { tag: string; title: string; description: string }) {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-[#f0faf6] via-white to-[#e8f5ee] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[20%] w-[400px] h-[400px] rounded-full bg-[#004733]/5 blur-3xl" />
      </div>
      <div className="max-w-[1320px] mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[640px]"
        >
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">{tag}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0c1a14] mt-3 tracking-tight leading-tight">{title}</h1>
          <p className="text-gray-600 text-lg mt-4 leading-relaxed">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}

export function ComingSoonContent() {
  return (
    <section className="py-24">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-[#0c1a14] mb-4">Full page coming soon</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">We're building out this page with detailed content. In the meantime, get started by reaching out.</p>
        <Link href="/contact">
          <Button className="rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2">
            Contact Greg <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
