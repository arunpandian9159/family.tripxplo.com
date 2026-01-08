"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Headphones,
  ChevronRight,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

const Help = () => {
  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "vacations@tripxplo.com",
      href: "mailto:vacations@tripxplo.com",
      color: "bg-blue-50 text-blue-500",
      responseTime: "24-48 hours",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat with us directly",
      value: "+91 9876543210",
      href: "https://wa.me/919876543210",
      color: "bg-emerald-50 text-emerald-500",
      responseTime: "Usually instant",
    },
  ];

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Headphones className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-slate-800">Help & Support</h3>
            <p className="text-sm text-slate-500">Get assistance anytime</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="bg-linear-to-br from-purple-500 to-purple-600 p-6 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Need Help?</h2>
            <p className="text-purple-100">
              We&apos;re here to make your travel experience smooth
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Options */}
          <div className="space-y-3 mb-6">
            {contactOptions.map((option, index) => (
              <a
                key={index}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", option.color)}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{option.title}</h3>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-coral-500 font-medium truncate">{option.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{option.responseTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-900 text-sm mb-1">Quick Tip</h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  For faster assistance, include your booking ID and registered phone number when contacting us.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-1">
              Thank you for choosing{" "}
              <span className="font-semibold text-coral-500">TripXplo</span>
            </p>
            <p className="text-xs text-slate-400">
              We&apos;re here to make your travel experience smooth and enjoyable!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-6 pb-6">
          <AlertDialogCancel className="w-full h-12 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 transition-colors">
            Close
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Help;
