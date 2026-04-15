import { Header } from "@/components/Header";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { LoanOptionsSection } from "./sections/LoanOptionsSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { BrokerAdvantageSection } from "./sections/BrokerAdvantageSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { ResourcesSection } from "./sections/ResourcesSection";
import { LearnBeforeYouBorrowSection } from "./sections/LearnBeforeYouBorrowSection";
import { AccountPortalSection } from "./sections/AccountPortalSection";
import { FAQSection } from "./sections/FAQSection";
import { FinalCTASection } from "./sections/FinalCTASection";
import { FooterSection } from "./sections/FooterSection";

export const HomeScreen = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ResourcesSection />
      <LearnBeforeYouBorrowSection />
      <StatsSection />
      <CalculatorSection />
      <BrokerAdvantageSection />
      <LoanOptionsSection />
      <ProcessSection />
      <ReviewsSection />
      <AccountPortalSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
      <FloatingAssistant />
    </div>
  );
};
