import HeroV2 from "@/components/v2/HeroV2";
import ResultsStrip from "@/components/v2/ResultsStrip";
import SocialProofV2 from "@/components/v2/SocialProofV2";
import CurriculumSection from "@/components/v2/CurriculumSection";
import WhoIsItFor from "@/components/v2/WhoIsItFor";
import ApplyCTA from "@/components/v2/ApplyCTA";
import FooterV2 from "@/components/v2/FooterV2";

export default function Page() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      <HeroV2 />
      <ResultsStrip />
      <CurriculumSection />
      <SocialProofV2 />
      <WhoIsItFor />
      <ApplyCTA />
      <FooterV2 />
    </main>
  );
}
