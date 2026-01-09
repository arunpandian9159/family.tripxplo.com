"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import SearchBox from "../search-packages/SearchBox";
import DestinationCarousel from "../DestinationCarousel";
import { MapPin, Calendar, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-64 bg-gold-100/40 rounded-full blur-3xl -translate-x-1/2" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-8 lg:py-0">
          {/* Content Side */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 gold-gradient border border-gold-500 rounded-full text-black text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600"></span>
              </span>
              No-Cost EMI • Zero Down Payment
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[67px] font-bold text-slate-900 tracking-tight mb-6 animate-slide-up">
              Small Payments
              <br />
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                  Massive Memories
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-gold-300"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 8.5C32 2.5 62 1 101 5.5C140 10 170 9 199 3"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up italic leading-relaxed">
              Luxury shouldn't be a lump sum. We've redesigned travel to fit
              into your{" "}
              <span className="text-forest-700 font-semibold">
                monthly budget
              </span>
              .
            </p>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8 animate-slide-up stagger-2">
              {[
                { icon: MapPin, label: "200+ Destinations" },
                { icon: Calendar, label: "Flexible EMI" },
                { icon: Users, label: "No Cost EMI" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <item.icon className="w-5 h-5 text-forest-700" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration Side */}
          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="relative w-full animate-float">
              <DestinationCarousel />
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="mt-8 lg:mt-12 animate-slide-up stagger-3">
          <SearchBox />
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
