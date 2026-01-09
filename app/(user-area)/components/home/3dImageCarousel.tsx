"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sun } from "lucide-react";

const destinations = [
  {
    id: "bali",
    name: "BALI",
    image: "/3d-destinations/bali_transparent-1.png",
    location: "Island, Indonesia",
    temp: "28°C",
  },
  {
    id: "manali",
    name: "MANALI",
    image: "/3d-destinations/manali_transparent-1.png",
    location: "Himachal, India",
    temp: "8°C",
  },
  {
    id: "andaman",
    name: "ANDAMAN",
    image: "/3d-destinations/andaman_transparent-1.png",
    location: "Islands, India",
    temp: "30°C",
  },
  {
    id: "vietnam",
    name: "VIETNAM",
    image: "/3d-destinations/vietnam_transparent-1.png",
    location: "Vietnam",
    temp: "26°C",
  },
];

const DestinationCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] aspect-[16/10] mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gold-100/50 blur-[60px] rounded-full scale-75 animate-pulse-slow pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Weather Info Overlay */}
        <div className="absolute top-0 z-10 flex flex-col items-center drop-shadow-lg pt-4 md:pt-6">
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-wider mb-1 md:mb-2">
            {destinations[currentIndex].name}
          </h2>

          <div className="flex flex-row items-center gap-2 md:gap-3">
            <Sun className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 fill-yellow-400 animate-[spin_10s_linear_infinite]" />
            <div className="flex flex-col items-start ml-0.5 md:ml-1">
              <span className="text-xs md:text-sm font-bold text-[#0F4C81] opacity-90">
                {destinations[currentIndex].location}
              </span>
              <span className="text-xl md:text-2xl font-black text-[#0F4C81] leading-none">
                {destinations[currentIndex].temp}
              </span>
            </div>
          </div>
        </div>

        {/* 3D Image */}
        <div className="relative w-full h-full drop-shadow-2xl">
          <Image
            src={destinations[currentIndex].image}
            alt={destinations[currentIndex].name}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {destinations.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-8 bg-gold-500" : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationCarousel;
