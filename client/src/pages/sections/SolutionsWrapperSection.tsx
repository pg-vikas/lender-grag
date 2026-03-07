import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const solutionsData = [
  {
    icon: "/figmaAssets/fi-1040988.svg",
    title: "We Understand Your Financial Goals",
    description:
      "We take time to review your income, credit, and long-term plans so we can recommend options that truly fit your situation.",
  },
  {
    icon: "/figmaAssets/fi-1548203.svg",
    title: "We Secure a Strong Pre-Approval",
    description:
      "We analyze your documents, structure your file properly, and position you for a smooth and confident home search.",
  },
  {
    icon: "/figmaAssets/fi-6476003.svg",
    title: "We Design the Right Loan Strategy",
    description:
      "We compare programs, explain rates and terms clearly, and structure your mortgage for both short-term comfort and long-term success.",
  },
  {
    icon: "/figmaAssets/fi-5336635.svg",
    title: "We Manage Every Detail Until Closing",
    description:
      "From underwriting to final approval, we coordinate with all parties, solve issues proactively, and keep you informed every step of the way.",
  },
];

export const SolutionsWrapperSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row items-stretch justify-between w-full bg-neutral-100">
      <div className="flex-1 relative min-h-[400px] lg:min-h-[821px]">
        <img
          className="w-full h-full object-cover"
          alt="Family with house model"
          src="/figmaAssets/rectangle-41.png"
        />
      </div>

      <div className="flex flex-col w-full lg:w-[720px] items-start gap-12 p-8 md:p-16 lg:p-[100px]">
        <header className="flex flex-col">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="[font-family:'Figtree',Helvetica] font-bold text-[#0c382b] text-4xl md:text-5xl tracking-[0] leading-tight md:leading-[59.5px]"
          >
            Here&apos;s How We <br />
            Make It Simple.
          </motion.h2>
        </header>

        <div className="flex flex-col items-center gap-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {solutionsData.map((solution, index) => (
              <Card key={index} className="border-0 shadow-none bg-transparent">
                <CardContent className="flex flex-col items-start gap-6 p-0">
                  <img
                    className="w-12 h-12"
                    alt={`${solution.title} icon`}
                    src={solution.icon}
                  />

                  <div className="flex flex-col items-start gap-3.5 w-full">
                    <h3 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#0c1300] text-[22px] tracking-[0] leading-[30.8px]">
                      {solution.title}
                    </h3>

                    <p className="[font-family:'DM_Sans',Helvetica] font-normal text-[#4c4c4c] text-base tracking-[0] leading-[28.8px]">
                      {solution.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
