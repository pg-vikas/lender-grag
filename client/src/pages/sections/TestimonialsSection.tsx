import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { iconComponents } from "@/components/MortgageServiceIcons";

const mortgageServices = [
  {
    title: "New Mortgage Applications",
    description:
      "Buying a home? We'll guide you through the application process and help you secure the right loan with clarity and confidence.",
    cta: "Start Your Application",
  },
  {
    title: "Mortgage Pre-Qualification",
    description:
      "Know what you can afford before you shop. We'll review your finances and give you a clear, realistic buying range.",
    cta: "Get Pre-Qualified",
  },
  {
    title: "First-Time Home Buyer Mortgages",
    description:
      "New to homeownership? We simplify the process, explain every step, and help you choose a loan that fits your future.",
    cta: "Start Your Home Journey",
  },
  {
    title: "Mortgage Renewals",
    description:
      "Don't just sign and renew. We review your options, negotiate better terms, and make sure your next term works in your favor.",
    cta: "Review My Renewal Options",
  },
  {
    title: "Mortgage Refinancing",
    description:
      "Lower your rate, reduce your payments, or access your home equity. We'll help you decide if refinancing makes sense for you.",
    cta: "Explore Refinancing Options",
  },
];

export const TestimonialsSection = (): JSX.Element => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="flex items-center justify-center gap-[80px] px-[100px] w-full min-h-screen snap-start snap-always bg-[#024731]">
      <div className="flex flex-col items-start gap-10 flex-1">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="[font-family:'Figtree',Helvetica] font-bold text-white text-[52px] tracking-[-0.52px] leading-[58.2px]"
        >
          Solutions for Every Stage of Home-ownership
        </motion.h2>

        <div className="flex flex-col max-w-[528px] items-start justify-end gap-12">
          <p className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#e1e1e1] text-lg leading-7">
            Whether you're buying your first home, refinancing, or investing,
            we'll help you choose the right option.
          </p>

          <Button className="h-[52px] px-[38px] py-2 bg-white hover:bg-white/90 hover:shadow-lg hover:scale-[1.03] rounded-lg transition-all duration-300">
            <span className="[font-family:'Figtree',Helvetica] font-bold text-[#004733] text-lg leading-[27px]">
              View All Mortgage Services
            </span>
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[552px] flex-1" style={{ overscrollBehavior: 'contain' }}>
        <motion.div
          className="flex flex-col gap-10 pr-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {mortgageServices.map((service, index) => {
            const IconComponent = iconComponents[index];
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
              <Card
                className="bg-[#1b5945] border-0 rounded-[20px] transition-colors duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-testid={`card-service-${index}`}
              >
                <CardContent className="flex items-start gap-8 p-8">
                  <IconComponent
                    isHovered={hoveredIndex === index}
                    className="w-[100px] h-[100px] flex-shrink-0"
                  />

                  <div className="flex flex-col items-start gap-[21px] flex-1">
                    <div className="flex flex-col items-start gap-5 w-full">
                      <h3 className="[font-family:'Figtree',Helvetica] font-bold text-white text-2xl leading-[26.4px]">
                        {service.title}
                      </h3>

                      <p className="[font-family:'Figtree',Helvetica] font-normal text-[#e1e1e1] text-base leading-[28.8px]">
                        {service.description}
                      </p>
                    </div>

                    <button className="inline-flex items-center gap-2.5 group cursor-pointer" data-testid={`button-cta-${index}`}>
                      <span className="[font-family:'Figtree',Helvetica] font-bold text-white text-base leading-6 transition-colors duration-200 group-hover:text-[#4CDBC4]">
                        {service.cta}
                      </span>
                      <ArrowRightIcon className="w-4 h-4 text-white transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#4CDBC4]" />
                    </button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </ScrollArea>
    </section>
  );
};
