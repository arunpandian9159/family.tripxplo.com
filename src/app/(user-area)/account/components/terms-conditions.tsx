"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  ChevronRight,
  Shield,
  Eye,
  Lock,
  Globe,
  Camera,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TermSection {
  id: string;
  icon: React.ElementType;
  title: string;
  content: string;
  color: string;
}

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const termSections: TermSection[] = [
    {
      id: "applicability",
      icon: ScrollText,
      title: "Applicability of Agreement",
      content: `This agreement ("User Agreement") outlines the terms and conditions for Tripmilestone Tours Pvt Ltd (TripXplo) to provide services to individuals ("the User") who are purchasing or inquiring about any products and/or services from TripXplo. This includes using TripXplo's websites or any other customer interface channels such as salespersons, offices, call centers, advertisements, and information campaigns.`,
      color: "bg-blue-50 text-blue-500",
    },
    {
      id: "awareness",
      icon: Eye,
      title: "User's Responsibility",
      content: `By availing services from TripXplo, Users are deemed to have read, understood, and expressly accepted the terms and conditions of this agreement. TripXplo reserves the right, at its sole discretion, to terminate access to any or all TripXplo websites or other sales channels and related services at any time without notice. Users must read and accept the relevant TOS for the service or product they avail.`,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      id: "thirdparty",
      icon: Lock,
      title: "Third-Party Account Information",
      content: `By using the Account Access service on TripXplo's websites, the User authorizes TripXplo and its agents to access third-party sites, including banks and other payment gateways, designated by them for retrieving requested information. The User is fully responsible for all activities that occur under their password or account. TripXplo will not be liable for any loss incurred by the User as a result of unauthorized use.`,
      color: "bg-purple-50 text-purple-500",
    },
    {
      id: "confidentiality",
      icon: Shield,
      title: "Confidentiality",
      content: `Any information specifically mentioned by TripXplo as confidential shall be maintained as confidential by the User and shall not be disclosed unless required by law or to fulfill the purposes of this agreement and the obligations of both parties herein.`,
      color: "bg-amber-50 text-amber-500",
    },
    {
      id: "website",
      icon: Globe,
      title: "Website and Web App Usage",
      content: `Your use of any information or materials on the TripXplo website and Web app is entirely at your own risk. You are prohibited from altering, duplicating, distributing, transmitting, reproducing, publishing, licensing, or selling any information, software, products, or services obtained from this website or app. TripXplo reserves the right to modify, revise, and delete any contents without prior notice.`,
      color: "bg-coral-50 text-coral-500",
    },
    {
      id: "media",
      icon: Camera,
      title: "Usage of Travel Pictures",
      content: `Any pictures or videos shared by customers during or after their trip in support groups or via email may be used on our social media platforms to engage with our audience. If you prefer not to have your media shared, please email us at hello@tripxplo.com, and we will promptly address your request.`,
      color: "bg-pink-50 text-pink-500",
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-slate-800">Terms & Conditions</h3>
            <p className="text-sm text-slate-500">Read our user agreement</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl max-h-[85vh] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-linear-to-br from-slate-700 to-slate-800 p-6 text-white relative overflow-hidden shrink-0">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <ScrollText className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Terms & Conditions</h2>
            <p className="text-slate-300 text-sm">
              Last updated: December 2024
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Introduction */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 leading-relaxed">
                Please read these terms and conditions carefully before using our services. 
                By using TripXplo, you agree to be bound by these terms.
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-3">
              {termSections.map((section) => (
                <div
                  key={section.id}
                  className="border border-slate-100 rounded-xl overflow-hidden transition-all hover:border-slate-200"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", section.color)}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-medium text-slate-800">
                      {section.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform duration-200",
                        expandedSection === section.id && "rotate-180"
                      )}
                    />
                  </button>
                  
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      expandedSection === section.id ? "max-h-96" : "max-h-0"
                    )}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-[52px]">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Your privacy matters
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    TripXplo is committed to protecting your personal information. 
                    For more details, please read our{" "}
                    <a href="/privacypolicy" className="text-coral-500 hover:underline">
                      Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Close Button */}
        <div className="p-6 pt-0 bg-white shrink-0">
          <AlertDialogCancel className="w-full h-12 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 transition-colors">
            I Understand
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TermsAndConditions;
