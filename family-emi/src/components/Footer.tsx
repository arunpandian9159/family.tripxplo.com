'use client';

import React from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  CreditCard,
} from 'lucide-react';

const footerLinks = {
  destinations: [
    { name: 'Bali', href: '#' },
    { name: 'Goa', href: '#' },
    { name: 'Manali', href: '#' },
    { name: 'Kashmir', href: '#' },
    { name: 'Andaman', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Refund Policy', href: '#' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/mytripxplo',
    color: 'hover:text-pink-500',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/tripmilestone',
    color: 'hover:text-blue-500',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/tripxplo/',
    color: 'hover:text-blue-600',
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Family Tripxplo</h2>
                  <p className="text-xs text-slate-400">EMI Travel Packages</p>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Family Tripxplo, a product of Tripmilestone Tours Pvt. Ltd, makes your dream family
              vacations affordable with easy EMI options. Trusted by 50,000+ happy travelers.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:vacations@tripxplo.com"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#15ab8b] transition-colors"
              >
                <Mail className="w-4 h-4" />
                vacations@tripxplo.com
              </a>
              <a
                href="tel:+919442424492"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#15ab8b] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 94424 24492
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Vellore, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map(social => (
                <Link
                  key={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-all hover:scale-110 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Top Destinations
            </h3>
            <ul className="space-y-3">
              {footerLinks.destinations.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Tripmilestone Tours Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              Made with
              <span className="text-[#15ab8b] animate-pulse">❤️</span>
              in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
