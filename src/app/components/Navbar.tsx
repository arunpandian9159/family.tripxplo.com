'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, MapPin, CreditCard, Users, LogIn, Home } from 'lucide-react';

interface NavbarProps {
  staticMode?: boolean;
}

const Navbar = ({ staticMode = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'EMI Plans', href: '/#why-emi', icon: CreditCard },
    { name: 'Testimonials', href: '/#testimonials', icon: Users },
  ];

  return (
    <nav
      className={`${
        staticMode ? 'sticky top-0 bg-white shadow-sm' : 'fixed top-0 bg-transparent'
      } left-0 right-0 z-50 transition-all duration-500 ${
        !staticMode && isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-black/5' : ''
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Family Tripxplo"
              width={140}
              height={45}
              className="transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </a>

          {/* Right Side - Navigation + Login + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#15ab8b]/10 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-[#15ab8b]'
                      : 'text-slate-700 hover:text-[#15ab8b]'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 text-[#15ab8b]" />
                  {link.name}
                </a>
              ))}
            </div>

            {/* Login Button - Desktop */}
            <a
              href="/login"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#15ab8b]/30 hover:shadow-xl hover:shadow-[#15ab8b]/40 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-white/20 backdrop-blur-sm text-slate-700'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-[#15ab8b]/10 hover:text-[#15ab8b] transition-all duration-300"
              >
                <link.icon className="w-5 h-5 text-[#15ab8b]" />
                {link.name}
              </a>
            ))}

            {/* Mobile Login Button */}
            <a
              href="/login"
              className="flex items-center justify-center gap-2 mt-2 px-5 py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-semibold rounded-xl shadow-lg shadow-[#15ab8b]/30"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
