"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export interface Package {
  id: string;
  title: string;
  destination: string;
  duration: string;
  nights: number;
  days: number;
  image: string;
  totalPrice: number;
  emiAmount: number;
  emiMonths: number;
  inclusions: string[];
  offerBadge?: string;
  offerType?: "discount" | "earlyBird" | "bestValue";
}

interface PackageCardProps {
  pkg: Package;
  onViewDetails: (pkg: Package) => void;
  index?: number;
}

const inclusionIcons: Record<string, string> = {
  Flights: "fa-plane",
  Hotels: "fa-hotel",
  Meals: "fa-utensils",
  Sightseeing: "fa-camera",
  "Beach Activities": "fa-umbrella-beach",
  Adventure: "fa-mountain",
  Transfers: "fa-car",
  Guide: "fa-user-tie",
};

const badgeStyles: Record<string, string> = {
  discount: "bg-linear-to-r from-red-500 to-orange-500",
  earlyBird: "bg-linear-to-r from-amber-500 to-yellow-400",
  bestValue: "bg-linear-to-r from-teal-500 to-emerald-500",
};

export default function PackageCard({
  pkg,
  onViewDetails,
  index = 0,
}: PackageCardProps) {
  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pkg.image || "/rectangle-14.png"}
          alt={pkg.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Duration Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-semibold">
          {pkg.nights}N / {pkg.days}D
        </div>

        {/* Offer Badge */}
        {pkg.offerBadge && (
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 ${
              badgeStyles[pkg.offerType || "discount"]
            }`}
          >
            <i
              className={`fas ${
                pkg.offerType === "earlyBird"
                  ? "fa-clock"
                  : pkg.offerType === "bestValue"
                  ? "fa-star"
                  : "fa-gift"
              }`}
            ></i>
            {pkg.offerBadge}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-teal-600 transition-colors">
          {pkg.title}
        </h3>

        {/* Inclusions */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {pkg.inclusions.slice(0, 4).map((inclusion) => (
            <div
              key={inclusion}
              className="flex flex-col items-center gap-1 text-center"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <i
                  className={`fas ${
                    inclusionIcons[inclusion] || "fa-check"
                  } text-teal-600 text-sm`}
                ></i>
              </div>
              <span className="text-xs text-gray-600 line-clamp-1">
                {inclusion}
              </span>
            </div>
          ))}
        </div>

        {/* EMI Section */}
        <div className="p-4 rounded-xl bg-linear-to-r from-teal-50 to-emerald-50 border border-teal-100 mb-4">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-extrabold text-teal-600">
              {formatCurrency(pkg.emiAmount)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <p className="text-sm text-gray-600">
            for {pkg.emiMonths} Prepaid EMIs
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total: {formatCurrency(pkg.totalPrice)}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewDetails(pkg)}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
        >
          View Details
          <i className="fas fa-arrow-right text-sm"></i>
        </button>
      </div>
    </motion.div>
  );
}
