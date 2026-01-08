"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container } from "@/components/ui/container";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { initialLoad } from "@/app/store/features/roomCapacitySlice";
import {
  changeDate,
  changeDestination,
  changeDestinationId,
} from "@/app/store/features/searchPackageSlice";

const footerLinks = {
  destinations: [
    { name: "Bali", destinationId: "4ebe5f1e-99d4-4dbb-a4e5-538a353ba81c" },
    { name: "Goa", destinationId: "1961511a-2d52-4dc4-95f5-9478c3e9a04f" },
    { name: "Manali", destinationId: "9380c50d-62ee-443b-a5c9-6beb90770e8f" },
    { name: "Kashmir", destinationId: "009b592f-9b73-4990-8068-1c299d1f15e5" },
    {
      name: "Meghalaya",
      destinationId: "e431c796-3946-4d73-a9b9-99a7b138680d",
    },
  ],
  company: [
    { name: "About Us", href: "#", isModal: true, modalType: "about" },
    { name: "Careers", href: "#", isModal: true, modalType: "careers" },
    { name: "Contact", href: "#", isModal: true, modalType: "contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacypolicy" },
    { name: "Terms & Conditions", href: "/termsandconditions" },
    { name: "Cancellations & Refund Policy", href: "/refundpolicy" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/mytripxplo",
    color: "hover:text-pink-500",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/tripmilestone",
    color: "hover:text-blue-500",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/tripxplo/",
    color: "hover:text-blue-600",
  },
];

const Footer = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDestinationClick = (name: string, destinationId: string) => {
    dispatch(changeDestination(name));
    dispatch(changeDestinationId(destinationId));

    // Calculate date 10 days from now
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 10);
    const localDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000
    );
    dispatch(changeDate(localDate.toISOString()));
    dispatch(initialLoad());
    router.push(`/destinations`);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="TripXplo Logo"
                width={140}
                height={45}
                className="w-auto h-10 brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              TripXplo, registered as Tripmilestone Tours Pvt. Ltd, was founded
              in 2020 by a team of young travel enthusiasts. Your trusted
              partner for memorable journeys across India and beyond.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:vacations@tripxplo.com"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                vacations@tripxplo.com
              </a>
              <a
                href="tel:+919442424492"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
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
              {socialLinks.map((social) => (
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
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() =>
                      handleDestinationClick(link.name, link.destinationId)
                    }
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
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
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.isModal ? (
                    <AlertDialog>
                      <AlertDialogTrigger className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group">
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[90%] sm:w-[500px] rounded-2xl">
                        {link.modalType === "about" && (
                          <>
                            <h1 className="text-xl font-bold text-slate-900">
                              About TripXplo
                            </h1>
                            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                              TripXplo, registered as Tripmilestone Tours Pvt.
                              Ltd, was founded in 2020 by a team of young travel
                              enthusiasts. We are a Travel Company for travelers
                              that have big destinations in mind and huge
                              milestones to traverse yet low on pocket.
                            </p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                              Our mission is to make travel accessible and
                              enjoyable for everyone, providing carefully
                              curated packages that balance adventure, comfort,
                              and affordability.
                            </p>
                          </>
                        )}
                        {link.modalType === "careers" && (
                          <>
                            <div className="flex items-center gap-3 mb-6">
                              <h1 className="text-2xl font-bold text-slate-900">
                                Join Our Team
                              </h1>
                            </div>

                            <div className="space-y-6">
                              {/* Intro */}
                              <div className="prose prose-sm">
                                <p className="text-slate-600 leading-relaxed">
                                  At TripXplo, we are not just selling packages,
                                  we are crafting memories. We are looking for
                                  passionate storytellers, explorers, and
                                  problem solvers to join our mission of making
                                  travel accessible and extraordinary for
                                  everyone.
                                </p>
                              </div>

                              {/* Why Join Us */}
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                                  Why Join Us?
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {[
                                    "✈️ Travel Perks",
                                    "📈 Career Growth",
                                    "🌏 Remote Options",
                                    "💡 Innovative Culture",
                                  ].map((perk) => (
                                    <li
                                      key={perk}
                                      className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                                    >
                                      {perk}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* CTA */}
                              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-600 mb-4">
                                  We are always happy to hear from talented
                                  individuals!
                                  <br />
                                  If you'd like to join our team, please apply
                                  via email:
                                </p>
                                <a
                                  href="mailto:careers@tripxplo.com"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
                                >
                                  <Mail className="w-5 h-5" />
                                  hello@tripxplo.com
                                </a>
                              </div>
                            </div>
                          </>
                        )}
                        {link.modalType === "contact" && (
                          <>
                            <div className="flex items-center gap-3">
                              <h1 className="text-xl font-bold text-slate-900">
                                Get in Touch
                              </h1>
                            </div>
                            <div className="mt-4 space-y-3">
                              <a
                                href="mailto:vacations@tripxplo.com"
                                className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                              >
                                <Mail className="w-5 h-5 text-emerald-500" />
                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    Email Us
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    vacations@tripxplo.com
                                  </p>
                                </div>
                              </a>
                              <a
                                href="tel:+919442424492"
                                className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                              >
                                <Phone className="w-5 h-5 text-emerald-500" />
                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    Call Us
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    +91 94424 24492
                                  </p>
                                </div>
                              </a>
                              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                <MapPin className="w-5 h-5 text-emerald-500" />
                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    Visit Us
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Vellore, Tamil Nadu, India
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="rounded-xl">
                            Close
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  )}
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
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
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
              © {new Date().getFullYear()} Tripmilestone Tours Pvt. Ltd. All
              rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              Made with
              <span className="text-emerald-500 animate-pulse">❤️</span>
              in India 🇮🇳
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
