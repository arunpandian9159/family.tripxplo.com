import HeroSection from "./components/home/sections/HeroSection";
import TrustIndicators from "./components/home/sections/TrustIndicators";
import WhyEMI from "./components/home/sections/WhyEMI";
import DestinationShowcase from "./components/home/sections/DestinationShowcase";
import Testimonials from "./components/home/sections/Testimonials";
import Packages from "./components/home/sections/Packages";
import JourneySteps from "./components/home/sections/JourneySteps";
import FAQSection from "./components/home/sections/FAQSection";
import CTABanner from "./components/home/sections/CTABanner";
import Footer from "./components/home/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <DestinationShowcase />

      {/* Top EMI Packages Section */}
      <Packages />

      {/* Why Family EMI Packages Section */}
      <WhyEMI />

      {/* Journey Steps - How EMI Works */}
      <JourneySteps />

      {/* Testimonials Section - TripXplo Diaries */}
      <Testimonials />

      {/* Trust Indicators - Stats & Badges */}
      <TrustIndicators />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </main>
  );
}
