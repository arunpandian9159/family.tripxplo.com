import HeroSection from "./components/home/sections/HeroSection";
import WhyEMI from "./components/home/sections/WhyEMI";
import Testimonials from "./components/home/sections/Testimonials";
import Packages from "./components/home/sections/Packages";
import JourneySteps from "./components/home/sections/JourneySteps";
import Footer from "./components/home/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - The original one from tripxplo.com */}
      <HeroSection />

      {/* Why Family EMI Packages Section */}
      <WhyEMI />

      {/* Top EMI Packages Section */}
      <Packages />

      {/* Journey Steps - How EMI Works */}
      <JourneySteps />

      {/* Testimonials Section - TripXplo Diaries */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </main>
  );
}
