"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Navigation,
  Clock,
  ChevronRight,
  Map,
} from "lucide-react";
import Iternary from "@/app/(package)/package/[packageid]/(activities)/_components/Iternary";
import { Activity } from "@/app/types/pack";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";

// Section Header Component
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "from-emerald-500 to-emerald-700",
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  iconBg?: string;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-start gap-4">
      <div
        className={`p-3 bg-gradient-to-br ${iconBg} rounded-xl text-white shadow-lg`}
      >
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Section Divider Component
const SectionDivider = () => (
  <div className="relative py-8">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-dashed border-slate-200" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-slate-50 px-4">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

interface FullItineraryProps {
  activity: Activity[];
  packageName: string;
  packageImage: string;
  onBack: () => void;
}

const FullItinerary = ({
  activity,
  packageName,
  packageImage,
  onBack,
}: FullItineraryProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const totalActivities =
    activity?.reduce((acc, day) => acc + (day?.event?.length || 0), 0) || 0;
  const hasValidImage = packageImage && !imageError;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Image Section */}
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          {hasValidImage ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 animate-pulse" />
              )}
              <Image
                src={`${NEXT_PUBLIC_IMAGE_URL}${packageImage}`}
                fill
                alt={packageName}
                priority
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-emerald-600 to-purple-700" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Booking</span>
            </button>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-10 px-4 md:px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg mb-3">
              <Map size={14} className="text-emerald-400" />
              <span className="text-white text-sm font-semibold">
                Full Itinerary
              </span>
            </div>

            {/* Package Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight max-w-3xl">
              {packageName}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar size={16} className="text-emerald-400" />
                <span className="text-sm">{activity?.length || 0} Days</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-sm">{totalActivities} Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 -mt-8 relative z-10">
        {/* Itinerary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8">
          <SectionHeader
            icon={Sparkles}
            title="Day-wise Schedule"
            subtitle="Explore your detailed journey"
            iconBg="from-emerald-500 to-teal-500"
          />

          {/* Timeline Content */}
          <div className="relative mt-8">
            {/* Timeline Line */}
            <div className="absolute left-5 lg:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-100 via-emerald-300 to-emerald-100 rounded-full" />

            {/* Days */}
            {activity?.length > 0 ? (
              <div className="space-y-8 lg:space-y-10">
                {activity.map((data, dayIndex) => (
                  <div key={data._id} className="relative">
                    {/* Day Header */}
                    <div className="flex items-start gap-4 lg:gap-6 mb-4">
                      {/* Timeline Node */}
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 flex-shrink-0">
                        <span className="text-white font-bold text-sm lg:text-base">
                          {data?.day}
                        </span>
                      </div>

                      {/* Day Info */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                            Day {data?.day}
                          </h3>
                          {data?.fullStartDate && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md">
                              <Clock className="w-3 h-3" />
                              {data.fullStartDate}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm">
                          {data?.from && data?.to && (
                            <div className="flex items-center gap-1.5">
                              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{data.from}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                              <span>{data.to}</span>
                            </div>
                          )}
                          <span className="text-slate-400">•</span>
                          <span>{data?.event?.length || 0} activities</span>
                        </div>
                      </div>
                    </div>

                    {/* Activities for this day */}
                    <div className="ml-5 lg:ml-6 pl-6 lg:pl-8 border-l-2 border-dashed border-slate-100">
                      <Iternary events={data?.event} day={data?.day} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No Activities Yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Your itinerary activities will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        <SectionDivider />

        {/* End of Trip Card */}
        {activity?.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 lg:p-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-lg lg:text-xl">
                  🎉 End of Trip
                </p>
                <p className="text-emerald-600 text-sm lg:text-base">
                  We hope you enjoyed your amazing journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullItinerary;
