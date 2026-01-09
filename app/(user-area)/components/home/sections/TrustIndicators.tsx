"use client";

import React, { useEffect, useRef, useState } from "react";
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

    const duration = 500;
    const steps = 40;
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
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 lg:py-16 gold-gradient">
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-gold-900 mb-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={isInView}
                />
              </div>
              <p className="text-sm text-slate-800 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
