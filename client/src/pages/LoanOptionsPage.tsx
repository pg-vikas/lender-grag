import { PageLayout, PageHero } from "./PageLayout";
import { LoanOptionsSection } from "./sections/LoanOptionsSection";
import { FinalCTASection } from "./sections/FinalCTASection";

export default function LoanOptionsPage() {
  return (
    <PageLayout>
      <PageHero
        tag="Loan Programs"
        title="Find the Right Loan for You"
        description="From conventional to VA, FHA to jumbo — we offer a full range of mortgage programs tailored to your unique situation."
      />
      <LoanOptionsSection />
      <FinalCTASection />
    </PageLayout>
  );
}
