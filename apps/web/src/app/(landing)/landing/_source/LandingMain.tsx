"use client";

import LandingFeatures from "./LandingFeatures";
import LandingFooterCta from "./LandingFooterCta";
import LandingHero from "./LandingHero";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingVisualPlaceholder from "./LandingVisualPlaceholder";

const LandingMain: React.FC = () => {
  return (
    <div className="min-h-dvh bg-background">
      <LandingHero />
      <LandingVisualPlaceholder variant="hero" />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingVisualPlaceholder variant="mid" />
      <LandingFooterCta />
    </div>
  );
};

export default LandingMain;
