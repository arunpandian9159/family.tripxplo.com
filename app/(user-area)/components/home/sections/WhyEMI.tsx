import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const benefits = [
  {
    image: "/plan-swap.png",
    title: "Easy Plan Swap",
    description:
      "Change your travel plans anytime with our flexible booking options. No hidden charges.",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    image: "/no-last-minute-rush.png",
    title: "No Last Minute Rush",
    description:
      "Book ahead and enjoy stress-free planning. Pay in easy EMIs over time.",
    gradient: "from-gold-400 to-gold-600",
    bgLight: "bg-gold-50",
    iconBg: "bg-gold-100",
    iconColor: "text-gold-600",
    hoverColor: "group-hover:text-gold-700",
  },
  {
    image: "/secure-accomodation.png",
    title: "Guaranteed Availability",
    description:
      "Your bookings are secured. Get confirmed hotels, flights, and activities.",
    gradient: "from-[#15ab8b] to-emerald-500",
    bgLight: "bg-[#d1fbd2]",
    iconBg: "bg-[#15ab8b]/20",
    iconColor: "text-[#15ab8b]",
    hoverColor: "group-hover:text-emerald-700",
  },
  {
    image: "/rewards.png",
    title: "Rewards on Booking",
    description:
      "Earn exclusive rewards, discounts, and loyalty points on every booking.",
    gradient: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    hoverColor: "group-hover:text-purple-600",
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
          <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 text-sm font-semibold rounded-full mb-4">
            Why Choose Us
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Why <span className="text-gold-600">Family EMI</span> Packages?
          </h2>

          <p className="text-lg text-slate-600">
            Experience the freedom of travel without financial stress. Our EMI
            packages make your dream vacations affordable.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative ${benefit.bgLight} rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 hover:border-transparent overflow-hidden hover:-translate-y-1`}
            >
              {/* Number badge */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-gold-600 transition-colors">
                0{index + 1}
              </div>

              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`relative mx-auto rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  width={170}
                  height={170}
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <h3
                className={cn(
                  "text-xl font-bold text-slate-800 mb-3 transition-colors",
                  benefit.hoverColor
                )}
              >
                {benefit.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {benefit.description}
              </p>

              {/* Decorative arrow */}
              <div
                className={cn(
                  "mt-4 flex items-center font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300",
                  benefit.hoverColor
                )}
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 gold-gradient text-black px-8 py-4 rounded-2xl shadow-lg shadow-gold-500/20">
            <div className="text-left">
              <p className="text-sm text-black opacity-90">
                Start your journey today
              </p>
              <p className="text-xl font-bold text-black">
                EMI from ₹2,999/month
              </p>
            </div>
            <button className="bg-white text-gold-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEMI;
