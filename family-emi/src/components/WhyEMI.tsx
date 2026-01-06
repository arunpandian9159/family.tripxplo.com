'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, ShieldCheck, Gift } from 'lucide-react';

const benefits = [
  {
    icon: RefreshCw,
    title: 'Easy Plan Swap',
    description:
      'Change your travel plans anytime with our flexible booking options. No hidden charges.',
    gradient: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    icon: Clock,
    title: 'No Last Minute Rush',
    description: 'Book ahead and enjoy stress-free planning. Pay in easy EMIs over time.',
    gradient: 'from-orange-500 to-amber-500',
    bgLight: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Availability',
    description: 'Your bookings are secured. Get confirmed hotels, flights, and activities.',
    gradient: 'from-[#15ab8b] to-emerald-500',
    bgLight: 'bg-[#d1fbd2]',
    iconBg: 'bg-[#15ab8b]/20',
    iconColor: 'text-[#15ab8b]',
  },
  {
    icon: Gift,
    title: 'Rewards on Booking',
    description: 'Earn exclusive rewards, discounts, and loyalty points on every booking.',
    gradient: 'from-purple-500 to-pink-500',
    bgLight: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
  },
];

const WhyEMI = () => {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d1fbd2]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#15ab8b]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-[#d1fbd2] text-[#0f8a6f] text-sm font-semibold rounded-full mb-4"
          >
            Why Choose Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Why <span className="text-[#15ab8b]">Family EMI</span> Packages?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Experience the freedom of travel without financial stress. Our EMI packages make your
            dream vacations affordable.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`group relative ${benefit.bgLight} rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-transparent overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`relative w-14 h-14 ${benefit.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#15ab8b] transition-colors">
                {benefit.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>

              {/* Decorative arrow */}
              <div className="mt-4 flex items-center text-[#15ab8b] font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#15ab8b] to-[#1ec9a5] text-white px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-left">
              <p className="text-sm opacity-90">Start your journey today</p>
              <p className="text-xl font-bold">EMI from ₹2,999/month</p>
            </div>
            <button className="bg-white text-[#15ab8b] px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Explore
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyEMI;
