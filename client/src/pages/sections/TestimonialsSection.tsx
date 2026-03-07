import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const mortgageServices = [
  {
    icon: "/figmaAssets/background-border.svg",
    title: "New Mortgage Applications",
    description:
      "Buying a home? We'll guide you through the application process and help you secure the right loan with clarity and confidence.",
    cta: "Start Your Application",
  },
  {
    icon: "/figmaAssets/background-border-1.svg",
    title: "Mortgage Pre-Qualification",
    description:
      "Know what you can afford before you shop. We'll review your finances and give you a clear, realistic buying range.",
    cta: "Get Pre-Qualified",
  },
  {
    icon: "/figmaAssets/fi-3967512.svg",
    title: "First-Time Home Buyer Mortgages",
    description:
      "New to homeownership? We simplify the process, explain every step, and help you choose a loan that fits your future.",
    cta: "Start Your Home Journey",
  },
  {
    icon: "/figmaAssets/fi-426107.svg",
    title: "Mortgage Renewals",
    description:
      "Don't just sign and renew. We review your options, negotiate better terms, and make sure your next term works in your favor.",
    cta: "Review My Renewal Options",
  },
  {
    icon: "/figmaAssets/fi-8086820.svg",
    title: "Mortgage Refinancing",
    description:
      "Lower your rate, reduce your payments, or access your home equity. We'll help you decide if refinancing makes sense for you.",
    cta: "Explore Refinancing Options",
  },
];

export const TestimonialsSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center gap-[60px] p-[100px] w-full bg-[#024731]">
      <div className="flex flex-col items-start gap-8 flex-1">
        <h2 className="[font-family:'Figtree',Helvetica] font-bold text-white text-[52px] tracking-[-0.52px] leading-[58.2px]">
          Solutions for Every Stage of Home-ownership
        </h2>

        <div className="flex flex-col max-w-[528px] items-start justify-end gap-10">
          <p className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#e1e1e1] text-lg leading-7">
            Whether you're buying your first home, refinancing, or investing,
            we'll help you choose the right option.
          </p>

          <Button className="h-[52px] px-[38px] py-2 bg-white hover:bg-white/90 rounded-lg">
            <span className="[font-family:'Figtree',Helvetica] font-bold text-[#004733] text-lg leading-[27px]">
              View All Mortgage Services
            </span>
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[552px] flex-1">
        <div className="flex flex-col gap-10 pr-4">
          {mortgageServices.map((service, index) => (
            <Card key={index} className="bg-[#1b5945] border-0 rounded-[20px]">
              <CardContent className="flex items-start gap-8 p-8">
                <img
                  className="w-[100px] h-[100px] flex-shrink-0"
                  alt={service.title}
                  src={service.icon}
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

                  <button className="inline-flex items-center gap-2.5 group cursor-pointer">
                    <span className="[font-family:'Figtree',Helvetica] font-bold text-white text-base leading-6">
                      {service.cta}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};
