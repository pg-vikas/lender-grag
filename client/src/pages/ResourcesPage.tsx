import { PageLayout, PageHero } from "./PageLayout";
import { ResourcesSection } from "./sections/ResourcesSection";

export default function ResourcesPage() {
  return (
    <PageLayout>
      <PageHero
        tag="Resources"
        title="Your Mortgage Knowledge Base"
        description="Guides, checklists, and tools to help you navigate the mortgage process with confidence."
      />
      <ResourcesSection />
    </PageLayout>
  );
}
