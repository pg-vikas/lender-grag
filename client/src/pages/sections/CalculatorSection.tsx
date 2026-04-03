import { useState, useMemo } from "react";
import { ArrowRight, DollarSign, Percent, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const CalculatorSection = (): JSX.Element => {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const { principalInterest, taxes, insurance, total } = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    const pi = monthlyRate === 0
      ? principal / numPayments
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const t = homePrice * 0.0125 / 12;
    const ins = homePrice * 0.004 / 12;
    return { principalInterest: pi, taxes: t, insurance: ins, total: pi + t + ins };
  }, [homePrice, downPayment, rate, term]);

  const downPct = Math.round((downPayment / homePrice) * 100);
  const segments = [
    { label: "Principal & Interest", value: principalInterest, color: "#004733" },
    { label: "Taxes", value: taxes, color: "#05a270" },
    { label: "Insurance", value: insurance, color: "#a3e4c8" },
  ];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="py-24 lg:py-32 bg-[#004733] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#05a270]/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calc-grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-emerald-300/80 font-semibold text-[13px] uppercase tracking-wider">Mortgage Calculator</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight" data-testid="text-calculator-heading">
            Know Your Numbers
          </h2>
          <p className="text-white/50 text-[17px] mt-4 max-w-[440px] mx-auto leading-relaxed">
            Adjust the sliders to see your estimated monthly payment in real time.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-[28px] shadow-2xl shadow-black/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 md:p-10 space-y-7 border-b lg:border-b-0 lg:border-r border-gray-100">
              <SliderInput
                icon={DollarSign}
                label="Home Price"
                value={homePrice}
                onChange={setHomePrice}
                min={100000}
                max={2000000}
                step={5000}
                display={`$${homePrice.toLocaleString()}`}
                fill={(homePrice - 100000) / (2000000 - 100000)}
              />
              <SliderInput
                icon={DollarSign}
                label={`Down Payment (${downPct}%)`}
                value={downPayment}
                onChange={(v) => setDownPayment(Math.min(v, homePrice * 0.5))}
                min={0}
                max={homePrice * 0.5}
                step={5000}
                display={`$${downPayment.toLocaleString()}`}
                fill={homePrice > 0 ? downPayment / (homePrice * 0.5) : 0}
              />
              <SliderInput
                icon={Percent}
                label="Interest Rate"
                value={rate}
                onChange={setRate}
                min={2}
                max={12}
                step={0.125}
                display={`${rate}%`}
                fill={(rate - 2) / 10}
              />
              <div>
                <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" /> Loan Term
                </label>
                <div className="flex gap-2">
                  {[15, 20, 30].map(t => (
                    <button
                      key={t}
                      onClick={() => setTerm(t)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                        term === t
                          ? "bg-[#004733] text-white border-[#004733] shadow-md shadow-[#004733]/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#004733]/30 hover:text-[#004733]"
                      }`}
                      data-testid={`button-term-${t}`}
                    >
                      {t} years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col items-center justify-center bg-gray-50/40">
              <div className="relative w-[180px] h-[180px] mb-6">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {segments.map((seg, i) => {
                    const pct = total > 0 ? seg.value / total : 0;
                    const dashLength = pct * circumference;
                    const dashOffset = offset;
                    offset += dashLength;
                    return (
                      <circle
                        key={i}
                        cx="80" cy="80" r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                        strokeDashoffset={-dashOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Monthly</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={Math.round(total)}
                      className="text-[28px] font-extrabold text-[#004733]"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      data-testid="text-monthly-payment"
                    >
                      ${Math.round(total).toLocaleString()}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-[11px] text-gray-400">per month</p>
                </div>
              </div>

              <div className="w-full space-y-2.5 mb-6">
                {segments.map((seg, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                      <span className="text-[13px] text-gray-600">{seg.label}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-800">
                      ${Math.round(seg.value).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                  <span className="text-[13px] font-bold text-[#0c1a14]">Total</span>
                  <span className="text-[13px] font-bold text-[#004733]">${Math.round(total).toLocaleString()}/mo</span>
                </div>
              </div>

              <div className="w-full space-y-2.5">
                <Link href="/apply">
                  <Button className="w-full h-12 rounded-xl bg-[#004733] hover:bg-[#003525] text-white font-semibold gap-2 shadow-lg shadow-[#004733]/15 transition-all duration-300" data-testid="button-calc-apply">
                    Apply with These Numbers
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-[11px] text-gray-400 text-center">Estimate only. Actual rates may vary.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function SliderInput({ icon: Icon, label, value, onChange, min, max, step, display, fill }: {
  icon: any; label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; display: string; fill: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" /> {label}
        </label>
        <span className="text-[15px] font-bold text-[#004733] bg-[#004733]/[0.06] px-3 py-1 rounded-lg">{display}</span>
      </div>
      <div className="relative h-[6px] w-full">
        <div className="absolute inset-0 rounded-full bg-gray-100" />
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#004733] to-[#05a270] transition-all duration-150 ease-out"
          style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-testid={`slider-${label.replace(/\s+/g, '-').replace(/[()%]/g, '').toLowerCase()}`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-[#004733] shadow-md pointer-events-none transition-all duration-150 ease-out"
          style={{ left: `calc(${Math.max(0, Math.min(1, fill)) * 100}% - 10px)` }}
        />
      </div>
    </div>
  );
}
