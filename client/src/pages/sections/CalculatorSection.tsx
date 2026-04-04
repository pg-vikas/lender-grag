import { useState, useMemo } from "react";
import { ArrowRight, Phone, DollarSign, Percent, CalendarDays, Home, ChevronDown, ChevronUp, Shield, TrendingUp, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Mode = "mortgage" | "affordability";
type Risk = "conservative" | "aggressive";

function fmt(n: number) { return Math.round(n).toLocaleString(); }
function fmtDec(n: number, d: number) { return n.toFixed(d); }

function AnimNum({ value, prefix = "$", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={Math.round(value * 100)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {prefix}{fmt(value)}{suffix}
      </motion.span>
    </AnimatePresence>
  );
}

function PremiumSlider({ label, icon: Icon, value, onChange, min, max, step, display, fill }: {
  label: string; icon: any; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; display: string; fill: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="text-[13px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/30" /> {label}
        </label>
        <span className="text-[15px] font-bold text-[#d4a94c] bg-[#d4a94c]/10 px-3 py-1 rounded-lg border border-[#d4a94c]/15">{display}</span>
      </div>
      <div className="relative h-[6px] w-full group">
        <div className="absolute inset-0 rounded-full bg-white/[0.06]" />
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#d4a94c] to-[#f0d88a] transition-all duration-150 ease-out"
          style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
        />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-testid={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#d4a94c] shadow-lg shadow-[#d4a94c]/30 pointer-events-none transition-all duration-150 ease-out ring-4 ring-[#d4a94c]/10"
          style={{ left: `calc(${Math.max(0, Math.min(1, fill)) * 100}% - 10px)` }}
        />
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <motion.div
      className="flex items-center justify-between py-2.5"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[13px] text-white/50">{label}</span>
      </div>
      <span className="text-[14px] font-bold text-white/80">${fmt(value)}</span>
    </motion.div>
  );
}

function DonutChart({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative w-[220px] h-[220px]">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLength = pct * circumference;
          const dashOffset = offset;
          offset += dashLength;
          return (
            <circle
              key={i}
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Monthly</p>
        <p className="text-[32px] font-extrabold text-white" data-testid="text-monthly-payment">
          <AnimNum value={total} />
        </p>
        <p className="text-[12px] text-white/30">per month</p>
      </div>
    </div>
  );
}

function MortgageCalc() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.25);
  const [insurance, setInsurance] = useState(1800);
  const [hoa, setHoa] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const downPct = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;

  const calc = useMemo(() => {
    const loan = homePrice - downPayment;
    const mr = rate / 100 / 12;
    const n = term * 12;
    const pi = mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    const tax = (homePrice * (propertyTax / 100)) / 12;
    const ins = insurance / 12;
    const pmi = downPct < 20 ? loan * 0.005 / 12 : 0;
    const total = pi + tax + ins + hoa + pmi;
    return { pi, tax, ins, hoa, pmi, total, loan };
  }, [homePrice, downPayment, rate, term, propertyTax, insurance, hoa, downPct]);

  const segments = [
    { label: "Principal & Interest", value: calc.pi, color: "#d4a94c" },
    { label: "Property Tax", value: calc.tax, color: "#8B7332" },
    { label: "Insurance", value: calc.ins, color: "#f0d88a" },
    ...(calc.pmi > 0 ? [{ label: "PMI", value: calc.pmi, color: "#C4953A" }] : []),
    ...(calc.hoa > 0 ? [{ label: "HOA", value: calc.hoa, color: "#A07A2E" }] : []),
  ];

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] min-h-[600px]">
      <div className="p-8 md:p-10 space-y-6 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
        <div className="mb-2">
          <p className="text-white/30 text-[12px] font-semibold uppercase tracking-wider mb-1">Estimated Payment</p>
          <p className="text-[42px] md:text-[48px] font-extrabold text-white tracking-tight leading-none">
            <AnimNum value={calc.total} /><span className="text-[20px] text-white/40 font-bold">/mo</span>
          </p>
          <p className="text-white/30 text-[13px] mt-1">{term} Year Fixed · {fmtDec(rate, 2)}% APR · ${fmt(calc.loan)} loan</p>
        </div>

        <PremiumSlider icon={Home} label="Home Price" value={homePrice} onChange={setHomePrice} min={100000} max={2000000} step={5000} display={`$${fmt(homePrice)}`} fill={(homePrice - 100000) / 1900000} />

        <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
          <PremiumSlider icon={DollarSign} label={`Down Payment`} value={downPayment} onChange={(v) => setDownPayment(Math.min(v, homePrice * 0.5))} min={0} max={homePrice * 0.5} step={5000} display={`$${fmt(downPayment)}`} fill={homePrice > 0 ? downPayment / (homePrice * 0.5) : 0} />
          <div className="bg-[#d4a94c]/10 border border-[#d4a94c]/20 rounded-xl px-3 py-1.5 text-center mb-[2px]">
            <span className="text-[18px] font-extrabold text-[#d4a94c]">{downPct}%</span>
          </div>
        </div>

        <PremiumSlider icon={Percent} label="Interest Rate" value={rate} onChange={setRate} min={2} max={12} step={0.125} display={`${fmtDec(rate, 3)}%`} fill={(rate - 2) / 10} />

        <div>
          <label className="text-[13px] font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-white/30" /> Loan Term
          </label>
          <div className="flex gap-2 mt-3">
            {[15, 20, 30].map(t => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  term === t
                    ? "bg-[#d4a94c] text-[#0c0c0c] border-[#d4a94c] shadow-lg shadow-[#d4a94c]/20"
                    : "bg-transparent text-white/40 border-white/10 hover:border-[#d4a94c]/40 hover:text-[#d4a94c]"
                }`}
                data-testid={`button-term-${t}`}
              >
                {t} yr
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[13px] font-semibold text-white/30 hover:text-[#d4a94c] transition-colors w-full pt-2"
          data-testid="button-advanced-toggle"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced Settings
        </motion.button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="space-y-5 pt-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PremiumSlider icon={Percent} label="Property Tax Rate" value={propertyTax} onChange={setPropertyTax} min={0} max={4} step={0.05} display={`${fmtDec(propertyTax, 2)}%`} fill={propertyTax / 4} />
              <PremiumSlider icon={Shield} label="Annual Insurance" value={insurance} onChange={setInsurance} min={0} max={6000} step={100} display={`$${fmt(insurance)}`} fill={insurance / 6000} />
              <PremiumSlider icon={DollarSign} label="Monthly HOA" value={hoa} onChange={setHoa} min={0} max={800} step={25} display={`$${fmt(hoa)}`} fill={hoa / 800} />
              {calc.pmi > 0 && (
                <div className="bg-[#d4a94c]/[0.06] border border-[#d4a94c]/15 rounded-xl px-4 py-3">
                  <p className="text-[12px] text-[#d4a94c]/80 font-semibold">PMI estimated at ${fmt(calc.pmi)}/mo (down payment below 20%)</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 md:p-10 flex flex-col items-center justify-center bg-white/[0.02]">
        <DonutChart segments={segments} total={calc.total} />

        <div className="w-full mt-8 space-y-0 divide-y divide-white/[0.06]">
          {segments.map((seg, i) => (
            <BreakdownRow key={seg.label} label={seg.label} value={seg.value} color={seg.color} delay={i * 0.05} />
          ))}
          <div className="pt-3 flex justify-between">
            <span className="text-[14px] font-extrabold text-white">Total Payment</span>
            <span className="text-[14px] font-extrabold text-[#d4a94c]">${fmt(calc.total)}/mo</span>
          </div>
        </div>

        <div className="w-full mt-8 space-y-3">
          <Link href="/apply">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-14 rounded-xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] text-[15px] font-bold gap-2.5 shadow-xl shadow-[#d4a94c]/20 transition-all duration-300" data-testid="button-calc-apply">
                Get a Custom Quote
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="w-full h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] text-[14px] font-semibold gap-2 border border-white/[0.06]" data-testid="button-calc-talk">
              <Phone className="w-4 h-4" />
              Talk to Greg
            </Button>
          </Link>
          <p className="text-[11px] text-white/20 text-center pt-1">Fast answers. Real guidance. Personalized loan strategy.</p>
        </div>
      </div>
    </div>
  );
}

function AffordabilityCalc() {
  const [risk, setRisk] = useState<Risk>("conservative");
  const [income, setIncome] = useState(100000);
  const [debt, setDebt] = useState(0);
  const [downPay, setDownPay] = useState(10000);
  const [rate, setRate] = useState(6.28);
  const [term, setTerm] = useState(30);

  const calc = useMemo(() => {
    const monthlyIncome = income / 12;
    const dtiRatio = risk === "conservative" ? 0.28 : 0.36;
    const maxHousing = monthlyIncome * dtiRatio - debt;
    if (maxHousing <= 0) return { maxPayment: 0, affordable: 0, pi: 0, tax: 0, ins: 0, pmi: 0 };

    const taxRate = 0.0125 / 12;
    const insRate = 0.004 / 12;
    const pmiRate = 0.005 / 12;

    const mr = rate / 100 / 12;
    const n = term * 12;

    const piRatio = mr === 0 ? 1 / n : (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    const totalRate = piRatio + taxRate + insRate + pmiRate;
    const loanAmount = maxHousing / totalRate;
    const homePrice = loanAmount + downPay;

    const pi = loanAmount * piRatio;
    const tax = homePrice * taxRate;
    const ins = homePrice * insRate;
    const pmi = loanAmount * pmiRate;

    return { maxPayment: maxHousing, affordable: homePrice, pi, tax, ins, pmi };
  }, [risk, income, debt, downPay, rate, term]);

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] min-h-[600px]">
      <div className="p-8 md:p-10 space-y-6 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
        <div>
          <label className="text-[13px] font-semibold text-white/40 uppercase tracking-wider mb-3 block">Budget Mode</label>
          <div className="flex gap-2 mt-3">
            {(["conservative", "aggressive"] as Risk[]).map(r => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 border capitalize ${
                  risk === r
                    ? "bg-[#d4a94c] text-[#0c0c0c] border-[#d4a94c] shadow-lg shadow-[#d4a94c]/20"
                    : "bg-transparent text-white/40 border-white/10 hover:border-[#d4a94c]/40 hover:text-[#d4a94c]"
                }`}
                data-testid={`button-risk-${r}`}
              >
                {r === "conservative" ? "Conservative" : "Aggressive"}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-white/20 mt-2">
            {risk === "conservative" ? "Uses 28% debt-to-income — a cautious, comfortable budget." : "Uses 36% debt-to-income — stretches your buying power."}
          </p>
        </div>

        <PremiumSlider icon={DollarSign} label="Annual Income" value={income} onChange={setIncome} min={30000} max={500000} step={5000} display={`$${fmt(income)}`} fill={(income - 30000) / 470000} />
        <PremiumSlider icon={DollarSign} label="Monthly Debt" value={debt} onChange={setDebt} min={0} max={5000} step={50} display={`$${fmt(debt)}`} fill={debt / 5000} />
        <PremiumSlider icon={DollarSign} label="Down Payment" value={downPay} onChange={setDownPay} min={0} max={200000} step={1000} display={`$${fmt(downPay)}`} fill={downPay / 200000} />
        <PremiumSlider icon={Percent} label="Interest Rate" value={rate} onChange={setRate} min={2} max={12} step={0.125} display={`${fmtDec(rate, 2)}%`} fill={(rate - 2) / 10} />

        <div>
          <label className="text-[13px] font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-white/30" /> Loan Term
          </label>
          <div className="flex gap-2 mt-3">
            {[15, 20, 30].map(t => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  term === t
                    ? "bg-[#d4a94c] text-[#0c0c0c] border-[#d4a94c] shadow-lg shadow-[#d4a94c]/20"
                    : "bg-transparent text-white/40 border-white/10 hover:border-[#d4a94c]/40 hover:text-[#d4a94c]"
                }`}
                data-testid={`button-aff-term-${t}`}
              >
                {t} yr
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10 flex flex-col items-center justify-center bg-white/[0.02]">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/30 text-[12px] font-semibold uppercase tracking-wider mb-2">Home Price You Can Afford</p>
          <p className="text-[48px] md:text-[56px] font-extrabold text-white tracking-tight leading-none">
            <AnimNum value={calc.affordable} />
          </p>
          <p className="text-white/25 text-[13px] mt-2 max-w-[320px] mx-auto">
            Based on your income and a {risk === "conservative" ? "28%" : "36%"} debt-to-income ratio.
          </p>
        </motion.div>

        <div className="w-full bg-white/[0.04] rounded-2xl border border-white/[0.06] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-white/40 uppercase tracking-wider">Monthly Budget</span>
            <span className="text-[20px] font-extrabold text-[#d4a94c]">${fmt(calc.maxPayment)}</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-3 mb-5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#d4a94c] to-[#f0d88a]"
              initial={{ width: 0 }}
              animate={{ width: calc.maxPayment > 0 ? `${Math.min(100, ((calc.pi + calc.tax + calc.ins + calc.pmi) / calc.maxPayment) * 100)}%` : "0%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <div className="space-y-0 divide-y divide-white/[0.06]">
            <BreakdownRow label="Principal & Interest" value={calc.pi} color="#d4a94c" delay={0} />
            <BreakdownRow label="Property Tax" value={calc.tax} color="#8B7332" delay={0.05} />
            <BreakdownRow label="Insurance" value={calc.ins} color="#f0d88a" delay={0.1} />
            <BreakdownRow label="Mortgage Insurance" value={calc.pmi} color="#C4953A" delay={0.15} />
          </div>
        </div>

        <div className="w-full bg-white/[0.03] rounded-xl border border-white/[0.05] p-4 mb-6">
          <p className="text-[13px] text-white/35 leading-relaxed text-center">
            This estimate is based on your income. A home at <span className="text-white/70 font-semibold">${fmt(calc.affordable)}</span> should fit {risk === "conservative" ? "comfortably" : "within"} your budget with a {risk} approach.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Link href="/apply">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-14 rounded-xl bg-[#d4a94c] hover:bg-[#c4953a] text-[#0c0c0c] text-[15px] font-bold gap-2.5 shadow-xl shadow-[#d4a94c]/20 transition-all duration-300" data-testid="button-aff-apply">
                Get Pre-Approved
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="w-full h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] text-[14px] font-semibold gap-2 border border-white/[0.06]">
              <Phone className="w-4 h-4" />
              Talk to Greg
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const CalculatorSection = (): JSX.Element => {
  const [mode, setMode] = useState<Mode>("mortgage");

  return (
    <section className="py-24 lg:py-32 bg-[#0c0c0c] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#d4a94c]/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#d4a94c]/[0.02] blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a94c]/10 text-[#d4a94c] text-[13px] font-bold uppercase tracking-[0.15em] border border-[#d4a94c]/20 mb-5">
            <TrendingUp className="w-3.5 h-3.5" /> Financial Tools
          </span>
          <h2 className="text-4xl md:text-[52px] font-extrabold text-white tracking-[-0.02em]" data-testid="text-calculator-heading">
            Know Your Numbers
          </h2>
          <p className="text-white/35 text-[17px] mt-4 max-w-[480px] mx-auto leading-relaxed">
            Premium tools to plan your next move. Real calculations, not guesswork.
          </p>
        </motion.div>

        <motion.div
          className="bg-[#141414] rounded-[28px] border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="flex items-center justify-center gap-1 p-3 bg-white/[0.02] border-b border-white/[0.06]">
            {(["mortgage", "affordability"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-6 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 ${
                  mode === m
                    ? "text-[#0c0c0c]"
                    : "text-white/35 hover:text-white/60"
                }`}
                data-testid={`tab-${m}`}
              >
                {mode === m && (
                  <motion.div
                    className="absolute inset-0 bg-[#d4a94c] rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === "mortgage" ? "Mortgage Calculator" : "Affordability Calculator"}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "mortgage" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "mortgage" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {mode === "mortgage" ? <MortgageCalc /> : <AffordabilityCalc />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-[11px] text-white/15 text-center mt-6 max-w-[700px] mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          This calculator is intended for planning and educational purposes only. It relies on assumptions and information provided by you regarding your goals, expectations, and financial situation, and should not be used as your sole source of information. The output of this tool is not a loan offer or solicitation, and is not financial or legal advice.
        </motion.p>
      </div>
    </section>
  );
};
