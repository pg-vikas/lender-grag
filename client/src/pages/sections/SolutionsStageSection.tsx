import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const SolutionsStageSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start justify-center pt-[60px] pb-[140px] px-[100px] w-full bg-[#c6f2c5]">
      <div
        className="relative flex items-center w-full rounded-[40px] overflow-hidden pl-[100px]"
        style={{ backgroundImage: "linear-gradient(-61.37deg, rgb(2, 71, 49) 15.97%, rgb(5, 162, 112) 98.24%)" }}
      >
        <div className="flex flex-col gap-12 items-start relative z-10 w-[500px] shrink-0 py-[80px]">
          <div className="flex flex-col gap-6 items-start justify-center w-full">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="[font-family:'Figtree',Helvetica] font-bold text-white text-[44px] tracking-[0] leading-[46.8px]"
            >
              Let&apos;s Begin Your Loan Journey Today
            </motion.h2>

            <div className="pr-10 w-full">
              <p className="[font-family:'DM_Sans',Helvetica] font-normal text-[rgba(255,255,255,0.75)] text-base tracking-[0] leading-[28.8px]">
                Fill out the Questionnaire on this page to start a discussion
                about Your Mortgage needs Today
              </p>
            </div>
          </div>

          <Button className="group inline-flex items-center gap-2 px-[38px] py-3.5 h-auto bg-white hover:bg-white/90 hover:shadow-lg hover:scale-[1.03] rounded-lg transition-all duration-300">
            <span className="[font-family:'DM_Sans',Helvetica] font-semibold text-[#0c382b] text-lg text-center tracking-[0] leading-6 whitespace-nowrap">
              Apply Now
            </span>
            <img
              className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              alt="Arrow"
              src="/figmaAssets/container.svg"
            />
          </Button>
        </div>

        <div className="relative h-[529px] w-[764px] shrink-0" style={{ marginRight: '-100px' }}>
          <img
            className="absolute bottom-[-97px] right-[-255px] w-[896px] h-[496px] object-cover rounded-xl"
            alt="House"
            src="/figmaAssets/house-image.png"
          />
          <img
            className="absolute bottom-0 right-[96px] w-[738px] h-[492px] object-cover"
            alt="Happy couple with keys"
            src="/figmaAssets/shutterstock-2415038437-1-1.png"
          />
        </div>
      </div>
    </section>
  );
};
