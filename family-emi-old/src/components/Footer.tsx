"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
    { label: "Blog", href: "#blog" },
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "FAQs", href: "#faqs" },
    { label: "Refund Policy", href: "#refund" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
  destinations: [
    { label: "Goa", href: "#goa" },
    { label: "Kashmir", href: "#kashmir" },
    { label: "Kerala", href: "#kerala" },
    { label: "Manali", href: "#manali" },
  ],
};

const socialLinks = [
  { icon: "fa-facebook-f", href: "#", label: "Facebook" },
  { icon: "fa-instagram", href: "#", label: "Instagram" },
  { icon: "fa-twitter", href: "#", label: "Twitter" },
  { icon: "fa-youtube", href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" id="contact">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <i className="fas fa-credit-card text-white"></i>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Family Tripxplo
                </h3>
                <p className="text-xs text-gray-400">EMI Travel Packages</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Experience hassle-free family vacations with our flexible Prepaid
              EMI packages. Turn your dream destinations into reality with
              affordable monthly payments.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <i className={`fab ${social.icon} text-sm`}></i>
                </Link>
              ))}
            </div>

            {/* Partner Logos */}
            <div className="flex items-center gap-6 mt-8">
              <Image
                src="/startupindia-logo.png"
                alt="Startup India"
                width={100}
                height={40}
                className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/startupTN-logo.png"
                alt="Startup TN"
                width={80}
                height={40}
                className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-4">
              Popular Destinations
            </h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              <a
                href="tel:+919159325225"
                className="flex items-center gap-2 hover:text-teal-400 transition-colors"
              >
                <i className="fas fa-phone text-teal-500"></i>
                +91 9159 325 225
              </a>
              <a
                href="mailto:family@tripxplo.com"
                className="flex items-center gap-2 hover:text-teal-400 transition-colors"
              >
                <i className="fas fa-envelope text-teal-500"></i>
                family@tripxplo.com
              </a>
              <span className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-teal-500"></i>
                Chennai, India
              </span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">We accept:</span>
              <div className="flex items-center gap-2">
                <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                <i className="fab fa-google-pay text-2xl text-gray-400"></i>
                <span className="px-2 py-1 rounded bg-gray-800 text-xs font-medium">
                  UPI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} TripXplo. All rights reserved.</p>
            <div className="flex gap-4">
              <Link
                href="/privacy-policy"
                className="hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="hover:text-teal-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
