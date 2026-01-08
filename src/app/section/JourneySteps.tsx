'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Calendar, Plane } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '1.',
    title: 'Find Your Trip',
    description: 'Browse our curated packages and select your dream dates and destination.',
    borderColor: 'border-cyan-400',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-400/30',
  },
  {
    icon: Lock,
    number: '2.',
    title: 'Choose Your Plan',
    description:
      'Select a 3, 6, or 12-month prepaid EMI plan. Pay the first installment to lock price.',
    borderColor: 'border-teal-400',
    iconColor: 'text-teal-400',
    glowColor: 'shadow-teal-400/30',
  },
  {
    icon: Calendar,
    number: '3.',
    title: 'Easy Installments',
    description:
      'Make automated monthly payments via our secure portal. Track your progress instantly.',
    borderColor: 'border-orange-400',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-400/30',
  },
  {
    icon: Plane,
    number: '4.',
    title: 'Pack & Go!',
    description:
      'Once your final payment is made, your booking is confirmed instantly. Bon Voyage!',
    borderColor: 'border-slate-300',
    iconColor: 'text-white',
    glowColor: 'shadow-slate-300/20',
  },
];

const JourneySteps = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#0d1829] relative overflow-hidden">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0a1320] via-[#0d1829] to-[#0d1829]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-white mb-4"
          >
            Your Journey Starts with a Single Payment
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Four simple steps to turn your dream vacation into reality.
          </motion.p>
        </div>

        {/* Steps Grid */}
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
              {/* Icon Circle */}
              <div
                className={`relative w-16 h-16 rounded-full border-2 ${step.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${step.glowColor}`}
              >
                <step.icon className={`w-7 h-7 ${step.iconColor}`} strokeWidth={1.5} />

                {/* Subtle glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-full ${step.glowColor} opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300`}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                {step.number} {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-[55%] left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-slate-700 to-transparent -z-1" />
      </div>
    </section>
  );
};

export default JourneySteps;
