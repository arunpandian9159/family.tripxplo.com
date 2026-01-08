import GlobalHeader from '@/app/components/GlobalHeader';
import Hero from '@/app/section/Hero';
import WhyEMI from '@/app/section/WhyEMI';
import Testimonials from '@/app/section/Testimonials';
import Packages from '@/app/section/Packages';
import JourneySteps from '@/app/section/JourneySteps';
import Footer from '@/app/section/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <GlobalHeader />

      {/* Hero Section - 3D Carousel + Headlines + Booking Form */}
      <Hero />

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
