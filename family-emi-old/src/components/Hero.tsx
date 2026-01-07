"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  cn,
  toTitleCase,
  getDestinationIcon,
  detectFamilyType,
  detectFamilyTypeAsync,
  FamilyType,
} from "@/lib/utils";
import TravelerSelector from "./TravelerSelector";
import FamilyTypeInfoModal from "./FamilyTypeInfoModal";

interface Destination {
  destination: string;
}

interface HeroProps {
  destinations: Destination[];
  onSearch: (params: {
    destination: string;
    travelMonth: string;
    travelers: {
      adults: number;
      children: number;
      child: number;
      infants: number;
    };
  }) => void;
}

export default function Hero({ destinations, onSearch }: HeroProps) {
  const [destination, setDestination] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [showFamilyTypeInfo, setShowFamilyTypeInfo] = useState(false);
  const [travelers, setTravelers] = useState({
    adults: 2,
    children: 0,
    child: 0,
    infants: 0,
  });
  const [familyType, setFamilyType] = useState<FamilyType>(() =>
    detectFamilyType({ adults: 2, children: 0, child: 0, infants: 0 })
  );

  // Get filtered destinations based on input
  const filteredDestinations = destinations.filter((d) =>
    d.destination.toLowerCase().includes(destination.toLowerCase())
  );

  // Fetch family type from database when travelers change
  useEffect(() => {
    const fetchFamilyType = async () => {
      try {
        const result = await detectFamilyTypeAsync(travelers);
        setFamilyType(result);
      } catch (error) {
        console.error("Error detecting family type:", error);
        setFamilyType(detectFamilyType(travelers));
      }
    };

    const timeoutId = setTimeout(fetchFamilyType, 300);
    return () => clearTimeout(timeoutId);
  }, [travelers]);

  // Handle destination selection
  const handleSelectDestination = useCallback((dest: string) => {
    setDestination(dest);
    setShowSuggestions(false);
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      travelMonth,
      travelers,
    });
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".destination-input-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get popular destinations for chips
  const popularDestinations = destinations.slice(0, 10).map((d) => ({
    name: toTitleCase(d.destination),
    icon: getDestinationIcon(d.destination),
    original: d.destination,
  }));

  return (
    <section className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50/30 pt-17.5 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/4 right-[15%] opacity-30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/plane.png"
            alt="Plane"
            width={100}
            height={60}
            className="rotate-12"
          />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-[10%] opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/plane.png"
            alt="Plane"
            width={80}
            height={48}
            className="-rotate-12 scale-x-[-1]"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col items-center">
          {/* Hero Text */}
          <motion.div
            className="text-center max-w-3xl mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Your Family Adventure,{" "}
              <span className="bg-linear-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Planned & Paid
              </span>{" "}
              Your Way
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your dream trip details and discover tailored EMI packages
              instantly
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                {/* Destination Input */}
                <div className="destination-input-container relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-map-marker-alt text-teal-500"></i>
                    Where to?
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="e.g., Kashmir, Goa, Manali"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                    autoComplete="off"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions &&
                    destination &&
                    filteredDestinations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
                        {filteredDestinations.map((d) => (
                          <button
                            key={d.destination}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-teal-50 text-gray-700 transition-colors flex items-center gap-3"
                            onClick={() =>
                              handleSelectDestination(d.destination)
                            }
                          >
                            <i
                              className={`fas ${getDestinationIcon(
                                d.destination
                              )} text-teal-500`}
                            ></i>
                            {toTitleCase(d.destination)}
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Month Selector */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-calendar-alt text-teal-500"></i>
                    Select month and year
                  </label>
                  <input
                    type="month"
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    min={new Date().toISOString().slice(0, 7)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-gray-800"
                  />
                </div>

                {/* Traveler Selector */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-users text-teal-500"></i>
                    Who&apos;s going?
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTravelerModal(true)}
                      className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all text-gray-800 bg-white"
                    >
                      <span>{familyType.name}</span>
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFamilyTypeInfo(true)}
                      className="p-3.5 rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-teal-600"
                      title="View family type information"
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <i className="fas fa-map-marked-alt text-teal-500"></i>
                  Top Destinations:
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((dest, index) => (
                    <motion.button
                      key={dest.original}
                      type="button"
                      onClick={() => handleSelectDestination(dest.original)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                        destination.toLowerCase() ===
                          dest.original.toLowerCase()
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <i className={`fas ${dest.icon}`}></i>
                      {dest.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-bold text-white text-lg bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <i className="fas fa-sparkles"></i>
                Find My Trip
              </button>
            </form>

            {/* Family Type Display */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-medium">Family Type:</span>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold">
                {familyType.name} ({familyType.composition})
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Traveler Modal */}
      {showTravelerModal && (
        <TravelerSelector
          travelers={travelers}
          onUpdate={setTravelers}
          onClose={() => setShowTravelerModal(false)}
        />
      )}

      {/* Family Type Info Modal */}
      <FamilyTypeInfoModal
        isOpen={showFamilyTypeInfo}
        onClose={() => setShowFamilyTypeInfo(false)}
      />
    </section>
  );
}
