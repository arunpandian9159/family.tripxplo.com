"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Phone, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { FaWhatsapp } from "react-icons/fa6";

const CTABanner = () => {
  return (
    <Section padding="md" className="bg-white">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-600/15 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 rounded-full mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                <span className="text-gold-300 text-xs font-semibold">
                  20% Off Limited Time
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Create Family Memories?
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-md">
                Start your dream vacation today with easy EMI payments. No
                interest, no hidden charges, just amazing experiences.
              </p>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/packages">
                <button className="group px-6 py-3 gold-gradient rounded-xl text-white font-semibold shadow-lg shadow-gold-600/25 hover:shadow-gold-600/40 transition-all hover:scale-105 active:scale-100 flex items-center gap-2">
                  Explore Packages
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4 text-gold-400" />
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CTABanner;
