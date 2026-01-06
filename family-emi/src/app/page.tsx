import Hero from "@/components/Hero";
import WhyEMI from "@/components/WhyEMI";
import Testimonials from "@/components/Testimonials";
import Packages from "@/components/Packages";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - 3D Carousel + Headlines + Booking Form */}
      <Hero />

      {/* Why Family EMI Packages Section */}
      <WhyEMI />

      {/* Testimonials Section - TripXplo Diaries */}
      <Testimonials />

      {/* Top EMI Packages Section */}
      <Packages />

      {/* Footer */}
      <Footer />
    </main>
  );
}
