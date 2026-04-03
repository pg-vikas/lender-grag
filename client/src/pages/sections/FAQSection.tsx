import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How long does pre-approval take?", a: "Most pre-approvals are completed within 24 hours of receiving your documents. We streamline the process so you can start shopping with confidence right away." },
  { q: "What credit score do I need?", a: "This depends on the loan program. Conventional loans typically require 620+, FHA starts at 580, and VA loans can be flexible. We'll review your full picture — not just the score." },
  { q: "How much do I need for a down payment?", a: "Down payments can be as low as 0% for VA loans, 3% for conventional, and 3.5% for FHA. We'll help you explore down payment assistance programs that may reduce this further." },
  { q: "When should I talk to a lender?", a: "The earlier, the better. Even if you're 6–12 months out, an early conversation helps us plan your strategy, improve your positioning, and avoid last-minute surprises." },
  { q: "How fast can we close?", a: "We regularly close loans in 21 days or less. Our streamlined process and proactive communication with all parties keeps timelines tight." },
  { q: "What documents are required?", a: "Typically: 2 years of tax returns, recent pay stubs, 2 months of bank statements, and a valid ID. We'll provide a complete checklist tailored to your specific situation." },
];

export const FAQSection = (): JSX.Element => {
  return (
    <section className="py-24 lg:py-32 bg-[#fafdf9]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <motion.div
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#05a270] font-semibold text-[13px] uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl md:text-[44px] font-extrabold text-[#0c1a14] mt-3 tracking-tight leading-[1.1]" data-testid="text-faq-heading">
              Questions?
              <br />We've Got You.
            </h2>
            <p className="text-gray-500 text-[16px] mt-5 leading-relaxed">
              Quick answers to the most common mortgage questions. Don't see yours? Let's talk.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="mt-6 rounded-xl border-[#004733]/15 text-[#004733] font-semibold gap-2 hover:bg-[#004733]/5 group" data-testid="button-faq-contact">
                Ask a Question
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Accordion type="single" collapsible className="space-y-2.5">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-gray-100 rounded-xl px-6 bg-white hover:border-[#004733]/10 transition-all duration-200 data-[state=open]:border-[#004733]/15 data-[state=open]:shadow-sm data-[state=open]:shadow-[#004733]/[0.03]"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger className="text-left font-semibold text-[#0c1a14] py-5 hover:no-underline text-[15px]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 leading-[1.75] pb-5 text-[14px]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
