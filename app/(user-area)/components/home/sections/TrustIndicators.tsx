"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Users, MapPin, Star, CheckCircle } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}

const stats: StatItem[] = [
  { value: 1000, suffix: "K", label: "Happy Travelers", icon: Users },
  { value: 200, suffix: "+", label: "Destinations", icon: MapPin },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: Star },
  { value: 24, suffix: "/7", label: "Support Available", icon: CheckCircle },
];

const trustBadges = [
  { icon: Shield, label: "100% Secure Payments", color: "text-emerald-500" },
  { icon: Award, label: "Verified Company", color: "text-gold-600" },
  { icon: CheckCircle, label: "No Hidden Charges", color: "text-blue-500" },
];

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const TrustIndicators = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-cream-100 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Stats Row */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-gold-100 text-gold-600 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={isInView}
                />
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-4 lg:gap-8"
        >
          {trustBadges.map((badge, index) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300"
            >
              <badge.icon className={`w-5 h-5 ${badge.color}`} />
              <span className="text-sm font-medium text-slate-700">
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Payment Partners */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">
            Trusted Payment Partners
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Razorpay */}
            <div className="text-slate-600 font-bold text-lg">Razorpay</div>
            {/* Visa */}
            <div className="text-slate-600 font-bold text-lg">VISA</div>
            {/* Mastercard */}
            <div className="text-slate-600 font-bold text-lg">Mastercard</div>
            {/* UPI */}
            <div className="text-slate-600 font-bold text-lg">UPI</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;
