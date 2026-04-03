import { PageLayout, PageHero } from "./PageLayout";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const values = [
  { title: "Clarity Over Complexity", desc: "We break down every option, rate, and term so you always know exactly where you stand." },
  { title: "Speed Without Shortcuts", desc: "Fast closings don't mean cutting corners. We're thorough and efficient at the same time." },
  { title: "Your Goals First", desc: "Every recommendation is built around your financial goals — not a commission structure." },
  { title: "Proactive Communication", desc: "You'll never have to chase us for updates. We stay ahead and keep you informed." },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        tag="About Greg"
        title="Lending Built on Trust & Results"
        description="With over 15 years in the mortgage industry, Greg Wynn has helped hundreds of families navigate the path to homeownership with confidence."
      />
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#004733] to-[#05a270] flex items-center justify-center max-w-[440px]">
                <div className="text-center text-white">
                  <div className="w-40 h-40 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center">
                    <span className="text-6xl font-bold">GW</span>
                  </div>
                  <p className="text-2xl font-bold">Greg Wynn</p>
                  <p className="text-white/70">Branch Manager & Loan Officer</p>
                  <p className="text-white/50 text-sm mt-1">NMLS 276890</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-[#0c1a14]">More Than a Loan Officer</h2>
              <p className="text-gray-600 leading-relaxed">
                Greg Wynn is a Branch Manager and Senior Loan Officer who's built his career on one principle: do right by the client. Over 15 years, he's helped first-time buyers, seasoned investors, and everyone in between find smart financing that fits their life.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Based in San Diego, Greg specializes in conventional, FHA, VA, and jumbo loans — with a reputation for closing deals others can't. His clients consistently highlight his responsiveness, clear guidance, and ability to simplify even the most complex transactions.
              </p>
              <div className="space-y-4 pt-4">
                {values.map((v, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#05a270] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0c1a14]">{v.title}</p>
                      <p className="text-gray-500 text-sm">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact">
                <Button className="rounded-xl bg-[#004733] hover:bg-[#003626] text-white font-semibold gap-2 mt-4" data-testid="button-about-contact">
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
