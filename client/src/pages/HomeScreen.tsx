import { Header } from "@/components/Header";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { WhyGregSection } from "./sections/WhyGregSection";
import { LoanOptionsSection } from "./sections/LoanOptionsSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { BrokerAdvantageSection } from "./sections/BrokerAdvantageSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { AboutPreviewSection } from "./sections/AboutPreviewSection";
import { ResourcesSection } from "./sections/ResourcesSection";
import { SecurePortalSection } from "./sections/SecurePortalSection";
import { FAQSection } from "./sections/FAQSection";
import { FinalCTASection } from "./sections/FinalCTASection";
import { FooterSection } from "./sections/FooterSection";

export const HomeScreen = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ResourcesSection />
      <SecurePortalSection />
      <StatsSection />
      <WhyGregSection />
      <CalculatorSection />
      <BrokerAdvantageSection />
      <LoanOptionsSection />
      <ProcessSection />
      <ReviewsSection />
      <AboutPreviewSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
      <FloatingAssistant />
    </div>
  );
};
