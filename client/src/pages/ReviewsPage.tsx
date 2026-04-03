import { PageLayout, PageHero } from "./PageLayout";
import { ReviewsSection } from "./sections/ReviewsSection";
import { FinalCTASection } from "./sections/FinalCTASection";

export default function ReviewsPage() {
  return (
    <PageLayout>
      <PageHero
        tag="Client Reviews"
        title="What Our Clients Say"
        description="150+ five-star reviews from real families who trusted us with their mortgage. Read their stories."
      />
      <ReviewsSection />
      <FinalCTASection />
    </PageLayout>
  );
}
