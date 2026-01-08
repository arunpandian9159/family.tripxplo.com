"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import SearchBox from "../search-packages/SearchBox";
import DestinationCarousel from "../DestinationCarousel";
import { MapPin, Calendar, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white via-coral-50/30 to-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-64 bg-coral-100/40 rounded-full blur-3xl -translate-x-1/2" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral-50 border border-coral-100 rounded-full text-coral-600 text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
              </span>
              Trusted by 50,000+ travelers
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight mb-6 animate-slide-up">
              Discover Your
              <br />
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
                  Perfect Trip
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-coral-200"
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
            <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up stagger-1">
              Explore handcrafted tour packages to stunning destinations. Book
              your dream vacation with confidence.
            </p>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8 animate-slide-up stagger-2">
              {[
                { icon: MapPin, label: "200+ Destinations" },
                { icon: Calendar, label: "Flexible Dates" },
                { icon: Users, label: "Group Discounts" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <item.icon className="w-5 h-5 text-coral-500" />
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
