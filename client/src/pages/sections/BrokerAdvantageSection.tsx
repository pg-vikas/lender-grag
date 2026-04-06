import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Network, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import gregLogo from "@assets/Sleek_Lender_Greg_logo_design_1775465481480.png";
import uwmLogo from "@assets/New_UWM_Logo_1_1775504391128.png";
import chaseLogo from "@assets/6787fb6fedafc63876131fb8_chase-logo-1_1775504276201.png";
import rocketLogo from "@assets/Logos_RocketMortgage-web-padded_1775504276201.png";
import bofaLogo from "@assets/banbk_of_america_1775504276201.webp";
import pennymacLogo from "@assets/PennyMac_Financial_Services_Logo.svg_1775504276202.png";
import citibankLogo from "@assets/image_1775513707195.png";

const lenders = [
  {
    name: "UWM",
    description: "Wholesale-first pricing and broad loan programs.",
    logo: uwmLogo,
  },
  {
    name: "Chase",
    description: "Retail bank lending with national reach.",
    logo: chaseLogo,
  },
  {
    name: "Rocket Mortgage",
    description: "Digital-forward home financing and fast workflows.",
    logo: rocketLogo,
  },
  {
    name: "Bank of America",
    description: "Large-bank mortgage options with branch support.",
    logo: bofaLogo,
  },
  {
    name: "PennyMac",
    description: "Servicing strength and competitive loan execution.",
    logo: pennymacLogo,
  },
  {
    name: "Citibank",
    description: "Established banking relationships and mortgage options.",
    logo: citibankLogo,
  },
];

const benefits = [
  "Access to multiple lending sources",
  "Broader loan options for different scenarios",
  "More flexibility than a single bank menu",
  "A smarter path to a better fit",
];

const bankPoints = ["one institution", "one loan menu", "one set of limits"];
const brokerPoints = ["multiple lending sources", "broader options", "more ways to match"];

export const BrokerAdvantageSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#141414] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#d4a94c]/[0.08] blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full bg-white/[0.03] blur-[140px]" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <motion.div
          className="flex justify-center mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <img
            src={gregLogo}
            alt="Lender Greg"
            className="w-full max-w-[760px] h-auto object-contain drop-shadow-2xl"
            data-testid="img-broker-greg-logo-title"
          />
        </motion.div>

        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 lg:pt-8 lg:pb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d4a94c]/20 bg-[#d4a94c]/10 text-[#f0d88a] text-[12px] font-bold uppercase tracking-[0.18em] mb-5 lg:hidden"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              data-testid="badge-broker-advantage"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Broker Advantage
            </motion.div>

            <motion.h2
              className="text-4xl md:text-[54px] lg:text-[62px] font-extrabold text-white tracking-[-0.03em] leading-[0.98] max-w-[720px] lg:mt-2"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
              data-testid="text-broker-heading"
            >
              Not Locked to One Bank.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]">Built Around Your Best Fit.</span>
            </motion.h2>

            <motion.p
              className="mt-6 text-[17px] md:text-[18px] leading-[1.8] text-white/60 max-w-[640px] lg:mb-2"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              Lender Greg is a broker, which means he can access loan options from multiple wholesale and lending sources instead of being tied to a single bank’s products. That gives you more room to compare, more flexibility for your scenario, and a stronger chance of finding the right structure for your goals.
            </motion.p>

            <motion.div
              className="mt-8 grid sm:grid-cols-2 gap-3 max-w-[680px] lg:mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                  whileHover={{ y: -3, borderColor: "rgba(212,169,76,0.3)", backgroundColor: "rgba(255,255,255,0.05)" }}
                  transition={{ duration: 0.25 }}
                  data-testid={`card-benefit-${index}`}
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#d4a94c] shrink-0" />
                  <span className="text-[14px] text-white/75 leading-snug">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-9 flex flex-wrap gap-3 lg:mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/apply">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button className="h-14 px-7 rounded-2xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] text-[15px] font-bold shadow-xl shadow-[#d4a94c]/20 flex items-center gap-2.5" data-testid="button-broker-options">
                    Explore Your Options
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button className="h-14 px-7 rounded-2xl border border-white/12 bg-white/[0.03] text-white/80 text-[15px] font-semibold hover:bg-white/[0.06] flex items-center gap-2.5" data-testid="button-broker-talk">
                    Talk to Greg
                    <Sparkles className="w-4 h-4" />
                  </button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              className="mt-10 rounded-[28px] border border-white/[0.08] bg-[#0f0f0f] p-5 md:p-6 max-w-[700px] lg:mb-2"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.35 }}
            >
              <p className="text-[12px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4">Bank vs Broker</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-white text-[15px] font-bold mb-3">Single Bank</p>
                  <div className="space-y-2.5">
                    {bankPoints.map((point) => (
                      <div key={point} className="flex items-center gap-2 text-white/50 text-[13px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#d4a94c]/15 bg-[#d4a94c]/[0.06] p-4">
                  <p className="text-[#f0d88a] text-[15px] font-bold mb-3">Broker</p>
                  <div className="space-y-2.5">
                    {brokerPoints.map((point) => (
                      <div key={point} className="flex items-center gap-2 text-white/75 text-[13px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4a94c]" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full border border-[#d4a94c]/10" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.06]" />
            </div>

              <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              <motion.div
                className="col-span-2 sm:col-span-3 rounded-[28px] border border-[#d4a94c]/18 bg-white/[0.04] backdrop-blur-xl p-5 md:p-6 shadow-2xl shadow-black/30"
                animate={inView ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#d4a94c]/15 border border-[#d4a94c]/20 flex items-center justify-center text-[#f0d88a]">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white text-[16px] font-bold">Broker Access Network</p>
                    <p className="text-white/45 text-[13px]">Greg can compare across multiple lending sources, not just one bank’s products.</p>
                  </div>
                </div>
              </motion.div>

              {lenders.map((lender, index) => (
                <motion.div
                  key={lender}
                  className="min-h-[118px] rounded-[24px] border border-white/[0.08] bg-[#0f0f0f]/90 backdrop-blur-md p-4 flex flex-col justify-between shadow-xl shadow-black/20"
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.12 + index * 0.06 }}
                  whileHover={{ y: -5, borderColor: "rgba(212,169,76,0.3)", boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}
                  data-testid={`card-lender-${index}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/25 font-bold">Source</span>
                    <span className="text-[#d4a94c] text-[11px] font-bold">Access</span>
                  </div>
                  <div className="mt-4 flex-1 rounded-2xl border border-white/[0.07] bg-[#0b0b0b] flex flex-col items-center justify-center text-center px-4 py-4 gap-3">
                    <div className="h-[76px] w-full flex items-center justify-center">
                      <img
                        src={lender.logo}
                        alt={`${lender.name} logo`}
                        className={`max-h-full max-w-full object-contain ${lender.name === "UWM" ? "scale-[1.35]" : "scale-[1.15]"}`}
                        data-testid={`img-lender-logo-${index}`}
                      />
                    </div>
                    <div className="max-w-[220px]">
                      <p className="text-white/40 text-[11px] uppercase tracking-[0.24em] font-bold">Source Access</p>
                      <p className="text-white/70 text-[12px] leading-snug mt-2">{lender.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
