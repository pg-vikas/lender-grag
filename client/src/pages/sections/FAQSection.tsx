import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How long does pre-approval take?", a: "Most pre-approvals are completed within 24 hours of receiving your documents. We streamline the process so you can start shopping with confidence right away." },
  { q: "What credit score do I need?", a: "This depends on the loan program. Conventional loans typically require 620+, FHA starts at 580, and VA loans can be flexible. We'll review your full picture — not just the score." },
  { q: "How much do I need for a down payment?", a: "Down payments can be as low as 0% for VA loans, 3% for conventional, and 3.5% for FHA. We'll help you explore assistance programs that may reduce this further." },
  { q: "When should I talk to a lender?", a: "The earlier, the better. Even if you're 6–12 months out, an early conversation helps us plan your strategy, improve your positioning, and avoid last-minute surprises." },
  { q: "How fast can we close?", a: "We regularly close loans in 21 days or less. Our streamlined process and proactive communication with all parties keeps timelines tight." },
  { q: "What documents are required?", a: "Typically: 2 years of tax returns, recent pay stubs, 2 months of bank statements, and a valid ID. We'll provide a complete checklist tailored to your situation." },
];

export const FAQSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafcfb]">
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#05a270] font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0c1a14] mt-3 tracking-tight" data-testid="text-faq-heading">
            Common Questions
          </h2>
          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            Quick answers to help you move forward with confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-gray-100 rounded-xl px-6 bg-white hover:border-[#004733]/10 transition-colors data-[state=open]:border-[#004733]/20 data-[state=open]:shadow-sm"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-left font-semibold text-[#0c1a14] py-5 hover:no-underline text-[15px]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5 text-[15px]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
