'use client';

import React from 'react';
import { MapPin, Calendar, Users, Search, ChevronDown } from 'lucide-react';
import DestinationCarousel from './DestinationCarousel';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
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
          {/* Left Side - 3D Destination Carousel */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none order-2 lg:order-1">
            <div className="animate-float-slow">
              <DestinationCarousel />
            </div>
          </div>

          {/* Right Side - Headlines + Booking Form */}
          <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d1fbd2] border border-[#15ab8b]/20 rounded-full text-[#0f8a6f] text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15ab8b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15ab8b]"></span>
              </span>
              Easy EMI Options Available
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight mb-4 animate-slide-up">
              Family Trips on
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] bg-clip-text text-transparent">
                  Easy EMI
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#d1fbd2]"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 8.5C32 2.5 62 1 101 5.5C140 10 170 9 199 3"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up delay-100">
              Plan your dream family vacation with flexible payment options.
              <span className="text-[#15ab8b] font-semibold"> No stress, just memories!</span>
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-8 animate-slide-up delay-200">
              {[
                { icon: MapPin, label: '100+ Destinations' },
                { icon: Calendar, label: 'Flexible Dates' },
                { icon: Users, label: 'Family Friendly' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-600">
                  <item.icon className="w-5 h-5 text-[#15ab8b]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Booking Search Box */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8 animate-slide-up delay-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Start Planning Your Trip</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Destination */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Where to?</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15ab8b]" />
                    <select className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#15ab8b]/20 focus:border-[#15ab8b] appearance-none cursor-pointer transition-all">
                      <option value="">Select Destination</option>
                      <option value="bali">Bali, Indonesia</option>
                      <option value="manali">Manali, India</option>
                      <option value="andaman">Andaman Islands</option>
                      <option value="goa">Goa, India</option>
                      <option value="kashmir">Kashmir, India</option>
                      <option value="vietnam">Vietnam</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15ab8b]" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#15ab8b]/20 focus:border-[#15ab8b] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Guests & Rooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Guests & Rooms
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15ab8b]" />
                  <select className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#15ab8b]/20 focus:border-[#15ab8b] appearance-none cursor-pointer transition-all">
                    <option value="">Select Guests & Rooms</option>
                    <option value="2-1">2 Adults, 1 Room</option>
                    <option value="2-1-1">2 Adults, 1 Child, 1 Room</option>
                    <option value="4-2">4 Adults, 2 Rooms</option>
                    <option value="4-2-2">4 Adults, 2 Children, 2 Rooms</option>
                    <option value="6-3">6 Adults, 3 Rooms</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full py-4 gradient-primary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 animate-pulse-glow">
                <Search className="w-5 h-5" />
                Search EMI Packages
              </button>

              {/* EMI Note */}
              <p className="mt-4 text-center text-sm text-slate-500">
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
