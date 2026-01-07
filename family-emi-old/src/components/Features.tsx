"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "fa-sync-alt",
    title: "Easy Plan Swap",
    description:
      "Swap plans 60 days before the travel date, change destinations or upgrade plans.",
  },
  {
    icon: "fa-calendar-check",
    title: "No Last Minute Rush",
    description:
      "Enjoy your family vacation without the stress of peak season crowds.",
  },
  {
    icon: "fa-check-circle",
    title: "Guaranteed Availability",
    description:
      "Secure your booking without worrying about last-minute availability issues.",
  },
  {
    icon: "fa-medal",
    title: "Rewards on Booking",
    description:
      "Earn benefits on each EMI payment and by referring friends or family.",
  },
];

export default function Features() {
  return (
    <section
      className="py-20 bg-linear-to-b from-gray-50 to-white"
      id="about"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Why{" "}
            <span className="bg-linear-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Family EMI
            </span>{" "}
            Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make your dream vacation affordable with our monthly prepaid EMI
            plans
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-teal-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i
                    className={`fas ${feature.icon} text-2xl text-teal-600`}
                  ></i>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-100/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-teal-50 border border-teal-100">
            <i className="fas fa-shield-alt text-teal-600"></i>
            <span className="text-gray-700 font-medium">
              100% Secure Payments • No Hidden Charges • Easy Cancellation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
