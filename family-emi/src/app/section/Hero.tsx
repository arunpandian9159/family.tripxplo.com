'use client';

import React from 'react';
import { MapPin, Calendar, Users, Search, ChevronDown } from 'lucide-react';
import DestinationCarousel from '../components/DestinationCarousel';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-15">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#15ab8b]/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-[#d1fbd2]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-64 bg-[#15ab8b]/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2315ab8b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-12 lg:py-0">
          {/* Left Side - Headlines + 3D Destination Carousel */}
          <div className="flex-1 w-full max-w-2xl order-2 lg:order-1">
            {/* Text Content */}
            <div className="text-center lg:text-left mb-3 lg:mb-4">
              {/* Badge with Shimmer Effect */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#d1fbd2] to-[#e8fde9] border border-[#15ab8b]/20 rounded-full text-[#0f8a6f] text-sm font-semibold mb-6 animate-fade-in shadow-lg shadow-[#15ab8b]/10 relative overflow-hidden group">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000" />
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15ab8b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15ab8b]"></span>
                </span>
                No-Cost EMI • Zero Down Payment
              </div>
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight mb-6 animate-slide-up">
                Small Payments
                <br />
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-[#15ab8b] via-[#1ec9a5] to-[#15ab8b] bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient">
                    Massive Memories
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#d1fbd2]"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C50 3 100 2 150 6C200 10 250 8 298 4"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Quote */}
              <div className="relative mb-2 animate-slide-up delay-100">
                <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  <span className="font-medium text-slate-700">"</span>
                  Luxury shouldn't be a lump sum. We've redesigned travel to fit into your
                  <span className="text-[#15ab8b] font-semibold"> monthly budget</span>.
                  <span className="font-medium text-slate-700">"</span>
                </p>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8 animate-slide-up stagger-2">
              {[
                { icon: MapPin, label: "200+ Destinations" },
                { icon: Calendar, label: "Flexible EMI" },
                { icon: Users, label: "No Cost EMI" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-600">
                  <item.icon className="w-5 h-5 text-[#15ab8b]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* 3D Destination Carousel */}
            <div className="animate-float-slow">
              <DestinationCarousel />
            </div>
          </div>

          {/* Right Side - Search Form */}
          <div className="flex-1 w-full max-w-xl order-1 lg:order-2 animate-slide-up">
            {/* Search Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-10">
              {/* Heading */}
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                Find Your Next
              </h2>
              <h2 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] bg-clip-text text-transparent mb-4">
                Adventure
              </h2>

              {/* Search Fields */}
              <div className="space-y-4">
                {/* Destination */}
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#15ab8b]/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="w-12 h-12 bg-[#e8f8f5] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#d1fbd2] transition-colors">
                    <MapPin className="w-5 h-5 text-[#15ab8b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Destination
                    </p>
                    <select className="w-full bg-transparent text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer">
                      <option value="">Where are you going?</option>
                      <option value="bali">Bali, Indonesia</option>
                      <option value="manali">Manali, India</option>
                      <option value="andaman">Andaman Islands</option>
                      <option value="goa">Goa, India</option>
                      <option value="kashmir">Kashmir, India</option>
                      <option value="vietnam">Vietnam</option>
                    </select>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#15ab8b]/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="w-12 h-12 bg-[#e8f8f5] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#d1fbd2] transition-colors">
                    <Calendar className="w-5 h-5 text-[#15ab8b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Dates
                    </p>
                    <input
                      type="text"
                      placeholder="Check-in - Check-out"
                      className="w-full bg-transparent text-slate-700 font-medium focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Guests & Rooms */}
                <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#15ab8b]/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="w-12 h-12 bg-[#e8f8f5] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#d1fbd2] transition-colors">
                    <Users className="w-5 h-5 text-[#15ab8b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Guests & Rooms
                    </p>
                    <select className="w-full bg-transparent text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer">
                      <option value="">2 adults, 1 room</option>
                      <option value="2-1">2 Adults, 1 Room</option>
                      <option value="2-1-1">2 Adults, 1 Child, 1 Room</option>
                      <option value="4-2">4 Adults, 2 Rooms</option>
                      <option value="4-2-2">4 Adults, 2 Children, 2 Rooms</option>
                      <option value="6-3">6 Adults, 3 Rooms</option>
                    </select>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full mt-6 py-4 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#15ab8b]/30 hover:shadow-xl hover:shadow-[#15ab8b]/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
                <Search className="w-5 h-5" />
                Search Flights & Hotels
              </button>

              {/* EMI Note */}
              <p className="mt-5 text-center text-sm text-slate-500">
                💳 EMI starting from <span className="font-bold text-[#15ab8b]">₹2,999/month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
