import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { LoanJourneySection } from "./sections/LoanJourneySection";
import { LoanJourneyWrapperSection } from "./sections/LoanJourneyWrapperSection";
import { SolutionsStageSection } from "./sections/SolutionsStageSection";
import { SolutionsWrapperSection } from "./sections/SolutionsWrapperSection";
import { StatementSection } from "./sections/StatementSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { TestimonialsWrapperSection } from "./sections/TestimonialsWrapperSection";

export const HomeScreen = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full relative">
      <HeroSection />
      <TestimonialsSection />
      <TestimonialsWrapperSection />
      <SolutionsStageSection />
      <SolutionsWrapperSection />
      <StatementSection />
      <LoanJourneySection />
      <LoanJourneyWrapperSection />
      <FooterSection />
    </div>
  );
};
