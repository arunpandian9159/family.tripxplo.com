"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, CreditCard, Star, ArrowRight } from "lucide-react";

const packages = [
  {
    id: 1,
    name: "Bali Paradise",
    location: "Indonesia",
    duration: "5N/6D",
    price: 45999,
    emi: 3833,
    rating: 4.9,
    gradient: "from-orange-400 to-pink-500",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Magical Manali",
    location: "Himachal Pradesh",
    duration: "4N/5D",
    price: 18999,
    emi: 1583,
    rating: 4.8,
    gradient: "from-blue-400 to-cyan-500",
    tag: "Family Favorite",
  },
  {
    id: 3,
    name: "Andaman Escape",
    location: "Andaman Islands",
    duration: "5N/6D",
    price: 32999,
    emi: 2750,
    rating: 4.9,
    gradient: "from-teal-400 to-emerald-500",
    tag: "Adventure",
  },
  {
    id: 4,
    name: "Kashmir Dreams",
    location: "Jammu & Kashmir",
    duration: "6N/7D",
    price: 28999,
    emi: 2416,
    rating: 4.8,
    gradient: "from-purple-400 to-indigo-500",
    tag: "Romantic",
  },
];

const Packages = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#d1fbd2]/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#15ab8b]/10 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-[#d1fbd2] text-[#0f8a6f] text-sm font-semibold rounded-full mb-4"
          >
            Popular Destinations
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Top <span className="text-[#15ab8b]">EMI</span> Packages
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Handcrafted family vacation packages with easy monthly payments
          </motion.p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image Placeholder */}
              <div
                className={`relative h-48 bg-gradient-to-br ${pkg.gradient} overflow-hidden`}
              >
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold rounded-full">
                    {pkg.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">
                    {pkg.rating}
                  </span>
                </div>

                {/* Destination Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-white/30" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#15ab8b] transition-colors">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {pkg.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  {pkg.duration}
                </div>

                {/* Price */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500">
                        Starting from
                      </span>
                      <div className="text-2xl font-bold text-slate-800">
                        ₹{pkg.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#15ab8b]">EMI from</span>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-[#15ab8b]" />
                        <span className="text-lg font-bold text-[#15ab8b]">
                          ₹{pkg.emi.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-3 bg-[#15ab8b] hover:bg-[#0f8a6f] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group/btn">
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#15ab8b] text-[#15ab8b] font-bold rounded-xl hover:bg-[#15ab8b] hover:text-white transition-all duration-300">
            View All Packages
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Packages;
