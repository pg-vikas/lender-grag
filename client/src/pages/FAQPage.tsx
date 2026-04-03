import { PageLayout, PageHero } from "./PageLayout";
import { FAQSection } from "./sections/FAQSection";
import { FinalCTASection } from "./sections/FinalCTASection";

export default function FAQPage() {
  return (
    <PageLayout>
      <PageHero
        tag="FAQ"
        title="Frequently Asked Questions"
        description="Answers to the most common mortgage questions to help you move forward with confidence."
      />
      <FAQSection />
      <FinalCTASection />
    </PageLayout>
  );
}
