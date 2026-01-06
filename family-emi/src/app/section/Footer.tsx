'use client';

import React, { useState } from 'react';
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
  X,
  Shield,
  Clock,
  Building2,
  Users,
} from 'lucide-react';

type ModalType = 'about' | 'careers' | 'contact' | 'refund' | null;

const footerLinks = {
  destinations: [
    { name: 'Bali', href: '#' },
    { name: 'Goa', href: '#' },
    { name: 'Manali', href: '#' },
    { name: 'Kashmir', href: '#' },
    { name: 'Andaman', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#', modalType: 'about' as ModalType },
    { name: 'Careers', href: '#', modalType: 'careers' as ModalType },
    { name: 'Contact', href: '#', modalType: 'contact' as ModalType },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy', modalType: null },
    { name: 'Terms & Conditions', href: '/terms-conditions', modalType: null },
    { name: 'Refund Policy', href: '#', modalType: 'refund' as ModalType },
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
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { href: string; modalType?: ModalType | null }
  ) => {
    if (link.modalType) {
      e.preventDefault();
      openModal(link.modalType);
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
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
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
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
                    <a
                      href={link.href}
                      onClick={e => handleLinkClick(e, link)}
                      className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group cursor-pointer"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
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
                {footerLinks.legal.map(link =>
                  link.modalType ? (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={e => handleLinkClick(e, link)}
                        className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group cursor-pointer"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ) : (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-[#15ab8b] transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  )
                )}
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

      {/* Modal Overlay */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                {activeModal === 'about' && (
                  <div className="w-10 h-10 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                )}
                {activeModal === 'careers' && (
                  <div className="w-10 h-10 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                )}
                {activeModal === 'contact' && (
                  <div className="w-10 h-10 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                )}
                {activeModal === 'refund' && (
                  <div className="w-10 h-10 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
                <h2 className="text-xl font-bold text-slate-900">
                  {activeModal === 'about' && 'About TripXplo'}
                  {activeModal === 'careers' && 'Join Our Team'}
                  {activeModal === 'contact' && 'Get in Touch'}
                  {activeModal === 'refund' && 'Cancellations & Refund'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* About TripXplo */}
              {activeModal === 'about' && (
                <div className="space-y-6">
                  <div className="prose prose-sm">
                    <p className="text-slate-600 leading-relaxed">
                      TripXplo, registered as{' '}
                      <strong className="text-slate-900">Tripmilestone Tours Pvt. Ltd</strong>, was
                      founded in 2020 by a team of young travel enthusiasts.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-4">
                      We are a Travel Company for travelers that have big destinations in mind and
                      huge milestones to traverse yet low on pocket.
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-[#15ab8b]/5 to-[#d1fbd2]/30 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                      Our Mission
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      To make travel accessible and enjoyable for everyone, providing carefully
                      curated packages that balance adventure, comfort, and affordability.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-2xl font-bold text-[#15ab8b]">2020</div>
                      <div className="text-xs text-slate-500 mt-1">Founded</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-2xl font-bold text-[#15ab8b]">50K+</div>
                      <div className="text-xs text-slate-500 mt-1">Happy Travelers</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Careers */}
              {activeModal === 'careers' && (
                <div className="space-y-6">
                  <div className="prose prose-sm">
                    <p className="text-slate-600 leading-relaxed">
                      At TripXplo, we are not just selling packages, we are crafting memories. We
                      are looking for passionate storytellers, explorers, and problem solvers to
                      join our mission of making travel accessible and extraordinary for everyone.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                      Why Join Us?
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        '✈️ Travel Perks',
                        '📈 Career Growth',
                        '🌏 Remote Options',
                        '💡 Innovative Culture',
                      ].map(perk => (
                        <li
                          key={perk}
                          className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                        >
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600 mb-4">
                      We are always happy to hear from talented individuals!
                      <br />
                      If you&#39;d like to join our team, please apply via email:
                    </p>
                    <a
                      href="mailto:hello@tripxplo.com?subject=Career Application"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#15ab8b]/25 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      hello@tripxplo.com
                    </a>
                  </div>
                </div>
              )}

              {/* Contact */}
              {activeModal === 'contact' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <a
                      href="mailto:vacations@tripxplo.com"
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Email Us</div>
                        <div className="text-slate-900 font-medium group-hover:text-[#15ab8b] transition-colors">
                          vacations@tripxplo.com
                        </div>
                      </div>
                    </a>

                    <a
                      href="tel:+919442424492"
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Call Us</div>
                        <div className="text-slate-900 font-medium group-hover:text-[#15ab8b] transition-colors">
                          +91 94424 24492
                        </div>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Visit Us</div>
                        <div className="text-slate-900 font-medium">Vellore, Tamil Nadu, India</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-center pt-4 border-t border-slate-100">
                    {socialLinks.map(social => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-all hover:scale-110 ${social.color}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund Policy */}
              {activeModal === 'refund' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                      Cancellation Policy
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Our cancellation policy varies depending on the type of tour package and the
                      booking date. Generally:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-green-600 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-800">
                            More than 30 days before
                          </div>
                          <div className="text-sm text-green-600">Eligible for full refund</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-yellow-600 font-bold text-sm">50%</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-yellow-800">
                            15-30 days before
                          </div>
                          <div className="text-sm text-yellow-600">Eligible for 50% refund</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-red-600 font-bold text-sm">✗</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-red-800">Within 15 days</div>
                          <div className="text-sm text-red-600">Not eligible for refund</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-[#15ab8b]/5 to-[#d1fbd2]/30 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-[#15ab8b]" />
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Refund Duration
                      </h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      All refunds are credited to the original mode of payment within{' '}
                      <strong className="text-slate-900">21 working days</strong> from the day of
                      cancellation of the trip.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-3">Have questions about refunds?</p>
                    <a
                      href="mailto:hello@tripxplo.com?subject=Refund Query"
                      className="inline-flex items-center gap-2 text-[#15ab8b] font-medium hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      Contact us at hello@tripxplo.com
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
