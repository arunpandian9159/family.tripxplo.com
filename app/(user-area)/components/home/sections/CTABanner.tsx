"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Phone, ArrowRight } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gold-gradient" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />

      {/* Decorative icons */}
      <div className="absolute top-10 right-[15%] hidden lg:block">
        <span className="text-4xl opacity-30">✈️</span>
      </div>
      <div className="absolute bottom-10 left-[20%] hidden lg:block">
        <span className="text-3xl opacity-30">🌴</span>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-black/80 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Limited Time Offer
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            Ready to Create Family Memories?
          </h2>

          {/* Subtext */}
          <p className="text-lg lg:text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Start your dream vacation today with easy EMI payments. No interest,
            no hidden charges, just amazing experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/destinations">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Planning
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <a
              href="tel:+919442424492"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-black font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <Phone className="w-5 h-5" />
              Talk to Expert
            </a>
          </div>

          {/* Trust text */}
          <p className="mt-8 text-sm text-black/60">
            Trusted by 5,000+ families • 4.9 ★ Google Rating
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
