import { useState, useMemo } from "react";
import { Calculator, DollarSign, Percent, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const CalculatorSection = (): JSX.Element => {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const monthly = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [homePrice, downPayment, rate, term]);

  const principalInterest = monthly;
  const taxes = homePrice * 0.0125 / 12;
  const insurance = homePrice * 0.004 / 12;
  const total = principalInterest + taxes + insurance;
  const downPct = ((downPayment / homePrice) * 100).toFixed(0);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-[#004733] to-[#00634a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">Mortgage Tools</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 tracking-tight" data-testid="text-calculator-heading">
            See Your Numbers
          </h2>
          <p className="text-white/70 text-lg mt-4 max-w-[500px] mx-auto leading-relaxed">
            Get a quick estimate of your monthly payment right here.
          </p>
        </motion.div>

        <motion.div
          className="max-w-[900px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <InputSlider icon={DollarSign} label="Home Price" value={homePrice} onChange={setHomePrice} min={100000} max={2000000} step={5000} format="dollar" />
                <InputSlider icon={DollarSign} label={`Down Payment (${downPct}%)`} value={downPayment} onChange={setDownPayment} min={0} max={homePrice * 0.5} step={5000} format="dollar" />
                <InputSlider icon={Percent} label="Interest Rate" value={rate} onChange={setRate} min={2} max={12} step={0.125} format="percent" />
                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Loan Term
                  </label>
                  <div className="flex gap-2">
                    {[15, 20, 30].map(t => (
                      <button
                        key={t}
                        onClick={() => setTerm(t)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          term === t ? "bg-white text-[#004733]" : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                        data-testid={`button-term-${t}`}
                      >
                        {t} yrs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <p className="text-white/60 text-sm font-medium mb-1">Estimated Monthly Payment</p>
                  <p className="text-5xl md:text-6xl font-bold text-white" data-testid="text-monthly-payment">
                    ${Math.round(total).toLocaleString()}
                  </p>
                  <p className="text-white/50 text-sm mt-1">per month</p>
                </div>

                <div className="w-full space-y-3 bg-white/5 rounded-2xl p-5">
                  <BreakdownRow label="Principal & Interest" value={principalInterest} />
                  <BreakdownRow label="Est. Taxes" value={taxes} />
                  <BreakdownRow label="Est. Insurance" value={insurance} />
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-semibold text-sm">Total</span>
                    <span className="text-white font-bold text-sm">${Math.round(total).toLocaleString()}/mo</span>
                  </div>
                </div>

                <Link href="/apply">
                  <Button className="mt-6 w-full h-12 rounded-xl bg-white text-[#004733] font-semibold hover:bg-white/90 shadow-lg gap-2 transition-all duration-300" data-testid="button-calc-apply">
                    <Calculator className="w-4 h-4" />
                    Apply with These Numbers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60 text-sm">{label}</span>
      <span className="text-white/90 text-sm font-medium">${Math.round(value).toLocaleString()}/mo</span>
    </div>
  );
}

function InputSlider({ icon: Icon, label, value, onChange, min, max, step, format }: {
  icon: any; label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format: "dollar" | "percent";
}) {
  const display = format === "dollar" ? `$${value.toLocaleString()}` : `${value}%`;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white/80 text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" /> {label}
        </label>
        <span className="text-white font-semibold text-sm">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-white/20 accent-white cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        data-testid={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </div>
  );
}
