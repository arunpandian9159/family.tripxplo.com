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
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WhatsappIcon from "@/components/ui/whatsappicon";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Holiday Calendar Animated Link - Google Style */}
      <div className="flex justify-center py-6 bg-slate-50/50">
        <Link href="/holiday-hack" className="group">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-emerald-50 rounded-full border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Animated Party Emoji */}
            <span className="text-xl animate-bounce" style={{ animationDuration: '1s' }}>🎉</span>

            {/* Text */}
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              2026 Holiday Hack:
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              13 Leaves → 63 Days!
            </span>

            {/* Calendar Emoji with subtle animation */}
            <span className="text-xl group-hover:animate-pulse">🗓️</span>

            {/* Arrow */}
            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Featured Destinations */}
      <DestinationShowcase />

      {/* Top EMI Packages Section */}
      <Packages />

      {/* Why Family EMI Packages Section */}
      <WhyEMI />

      {/* Journey Steps - How EMI Works */}
      <JourneySteps />

      {/* Trust Indicators - Stats & Badges */}
      <TrustIndicators />

      {/* Testimonials Section - TripXplo Diaries */}
      <Testimonials />


      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Banner */}
      <CTABanner />

      {/* WhatsApp Floating Button */}
      <WhatsappIcon />

      {/* Footer */}
      <Footer />
    </main>
  );
}
