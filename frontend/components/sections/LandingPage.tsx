import { FeatureGrid } from "./FeatureGrid";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Metrics } from "./Metrics";
import { ProblemSolution } from "./ProblemSolution";
import { RolePreview } from "./RolePreview";
import { SocialProofBar } from "./SocialProofBar";

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fff1f2_45%,#eef2ff_100%)]">
      <Hero />
      <SocialProofBar />
      <FeatureGrid />
      <RolePreview />
      <ProblemSolution />
      <Metrics />
      <FinalCta />
      <Footer />
    </main>
  );
}
