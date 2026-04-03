import { PageLayout, PageHero } from "./PageLayout";
import { CalculatorSection } from "./sections/CalculatorSection";

export default function ToolsPage() {
  return (
    <PageLayout>
      <PageHero
        tag="Mortgage Tools"
        title="Know Your Numbers"
        description="Use our calculators to explore scenarios, estimate payments, and understand what you can afford — before you apply."
      />
      <CalculatorSection />
    </PageLayout>
  );
}
