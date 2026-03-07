import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const guides = [
  {
    id: 1,
    title: "A Step-by-Step Guide to Shopping for a New Home",
    image: "/figmaAssets/rectangle-43.png",
    imageClass: "object-cover",
  },
  {
    id: 2,
    title: "Unlock Your Dream Home: A Guide to Mortgage Options",
    image: "/figmaAssets/rectangle-43-1.png",
    imageClass: "object-cover",
  },
  {
    id: 3,
    title: "First-Time Homebuyer's Handbook",
    image: "/figmaAssets/rectangle-43-2.png",
    imageClass: "",
  },
  {
    id: 4,
    title: "The Ultimate Mortgage Refinance Checklist",
    image: "/figmaAssets/rectangle-43-3.png",
    imageClass: "object-cover",
  },
];

export const LoanJourneyWrapperSection = (): JSX.Element => {
  return (
    <section className="p-[100px] flex flex-col items-center gap-[60px] w-full bg-[#c6f2c5]">
      <div className="flex flex-col items-start gap-16 w-full">
        <div className="flex items-end gap-20 w-full">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 [font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-[52px] tracking-[-0.52px] leading-[64.5px]"
          >
            Latest Guide from <br />
            Greg Wynn
          </motion.h2>

          <Button
            variant="outline"
            className="h-[52px] gap-2 px-7 py-2 bg-white rounded-lg border-[#e1e1e1] hover:bg-white/90"
          >
            <span className="[font-family:'Figtree',Helvetica] font-semibold text-[#0c382b] text-lg tracking-[0] leading-[27px]">
              View All Guides
            </span>
            <img
              className="flex-shrink-0"
              alt="Arrow"
              src="/figmaAssets/container.svg"
            />
          </Button>
        </div>

        <div className="flex items-center justify-between w-full gap-4">
          {guides.map((guide) => (
            <Card
              key={guide.id}
              className="w-[280px] h-[380px] rounded-3xl overflow-hidden border-0 bg-transparent"
            >
              <CardContent className="p-0 relative w-full h-full flex flex-col justify-end">
                <img
                  className={`absolute left-0 bottom-0 w-[280px] h-[380px] ${guide.imageClass}`}
                  alt={guide.title}
                  src={guide.image}
                />

                <div className="relative z-10 w-full">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)] pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)' }} />
                  <div className="relative pt-10 pb-6 px-4 flex flex-col items-start gap-[15.1px] w-full">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <h3 className="[font-family:'DM_Sans',Helvetica] font-bold text-white text-lg tracking-[0] leading-[25.2px]">
                        {guide.title}
                      </h3>

                      <div className="flex flex-col items-start pt-3 w-full">
                        <Button
                          variant="link"
                          className="h-auto p-0 inline-flex items-end gap-2.5 text-white hover:no-underline"
                        >
                          <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-base tracking-[0] leading-6">
                            Learn More
                          </span>
                          <img
                            className="flex-shrink-0"
                            alt="Arrow"
                            src="/figmaAssets/container.svg"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
