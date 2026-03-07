import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SolutionsStageSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start justify-center pt-10 pb-[100px] px-[100px] w-full bg-[#c6f2c5]">
      <div className="relative w-full rounded-[40px] overflow-hidden bg-[linear-gradient(322deg,rgba(2,71,49,1)_0%,rgba(5,162,112,1)_100%)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 p-10 lg:p-20">
          <div className="flex flex-col items-start gap-10 max-w-[500px] z-10">
            <div className="flex flex-col items-start justify-center gap-6 w-full">
              <h2 className="[font-family:'Figtree',Helvetica] font-bold text-white text-[44px] tracking-[0] leading-[46.8px]">
                Let&apos;s Begin Your Loan Journey Today
              </h2>

              <p className="[font-family:'DM_Sans',Helvetica] font-normal text-[#ffffffbf] text-base tracking-[0] leading-[28.8px]">
                Fill out the Questionnaire on this page to start a discussion
                about Your Mortgage needs Today
              </p>
            </div>

            <Button className="inline-flex items-center gap-2 px-[38px] py-3.5 h-auto bg-white hover:bg-white/90 rounded-lg">
              <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-lg text-center tracking-[0] leading-6 whitespace-nowrap">
                Apply Now
              </span>
              <ArrowRightIcon className="w-5 h-5 text-[#0c382b]" />
            </Button>
          </div>

          <div className="relative w-full lg:w-auto flex-shrink-0">
            <img
              className="w-full lg:w-[738px] h-auto lg:h-[492px] object-cover rounded-lg"
              alt="Happy couple with house model"
              src="/figmaAssets/shutterstock-2415038437-1-1.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
