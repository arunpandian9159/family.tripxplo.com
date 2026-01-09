"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Lock, Calendar, Plane } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Find Your Trip",
    description:
      "Browse our curated packages and select your dream dates and destination.",
  },
  {
    icon: Lock,
    number: "02",
    title: "Choose Your Plan",
    description:
      "Select a 3, 6, or 12-month prepaid EMI plan. Pay the first installment to lock price.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Easy Installments",
    description:
      "Make automated monthly payments via our secure portal. Track your progress.",
  },
  {
    icon: Plane,
    number: "04",
    title: "Pack & Go!",
    description:
      "Once your final payment is made, your booking is confirmed instantly. Bon Voyage!",
  },
];

const JourneySteps = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#0d1829] relative overflow-hidden">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1320] via-[#0d1829] to-[#0d1829]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-gold-500/10 text-gold-400 text-sm font-semibold rounded-full mb-4 border border-gold-500/20"
          >
            How It Works
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-white mb-4"
          >
            Your Journey Starts with a <br />{" "}
            <span className="text-gold-400">Single Payment</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Four simple steps to turn your dream vacation into reality.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting line - Desktop only */}
          <div className="hidden lg:block absolute top-[72px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Number + Icon Circle */}
                <div className="relative mb-6">
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-xs font-bold text-black z-10">
                    {step.number}
                  </div>

                  {/* Icon Circle */}
                  <div className="relative w-20 h-20 rounded-full bg-slate-800/80 border-2 border-gold-500/30 flex items-center justify-center group-hover:border-gold-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-gold-500/10">
                    <step.icon
                      className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors"
                      strokeWidth={1.5}
                    />

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-gold-500/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-gold-300 transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySteps;
