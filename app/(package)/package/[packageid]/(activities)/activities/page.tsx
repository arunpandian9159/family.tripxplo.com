"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
  Navigation,
  Clock,
  ChevronRight,
  Heart,
  Star,
  Map,
} from "lucide-react";
import Iternary from "../_components/Iternary";
import { Activity } from "@/app/types/pack";
import PackagesLoadingFull from "@/app/(user-area)/components/loading/PackagesLoadingFull";
import { useSelector } from "react-redux";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { generateActivityShareMessage } from "@/lib/generateShareMessage";

// Section Header Component (consistent with PackageDetail)
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

// Section Divider Component (consistent with PackageDetail)
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

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const packageData = useSelector((store: any) => store.package);
  const searchParams = useSelector((store: any) => store.searchPackage);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [packageName, setPackageName] = useState("");
  const [packageImage, setPackageImage] = useState("");
  const [packageSlug, setPackageSlug] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const clickBack = () => {
    router.back();
  };

  // Scroll to top when page loads to ensure Day 1 is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    function validatePackage() {
      setLoading(true);
      const location = window.location.pathname;
      const urlIdentifier = location.split("/")[2];

      // Check if URL identifier matches either packageId OR slug
      const isValidPackage =
        packageData.data.packageId === urlIdentifier ||
        packageData.data.slug === urlIdentifier;

      if (isValidPackage) {
        setActivity(packageData.data.activity);
        setPackageName(packageData.data.packageName);
        setPackageImage(packageData.data.packageImg?.[0] || "");
        setPackageSlug(packageData.data.slug || null);
        setLoading(false);
      } else {
        setLoading(false);
        setError(true);
      }
    }
    validatePackage();
  }, [
    packageData.data.activity,
    packageData.data.packageId,
    packageData.data.slug,
    packageData.data.packageName,
    packageData.data.packageImg,
    packageData.packageId,
  ]);

  if (isLoading) {
    return <PackagesLoadingFull />;
  }

  // Share function
  const handleShare = async () => {
    const identifier = packageSlug || packageData.data?.packageId;
    if (!identifier) return;

    // Build URL with query parameters
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    let shareUrl = `${baseUrl}/package/${identifier}/activities`;

    // Add search params if available
    const params = new URLSearchParams();
    if (searchParams?.date) params.set("date", searchParams.date);
    if (searchParams?.noOfAdult)
      params.set("adults", searchParams.noOfAdult.toString());
    if (searchParams?.noRoomCount)
      params.set("rooms", searchParams.noRoomCount.toString());

    const queryString = params.toString();
    if (queryString) {
      shareUrl += `?${queryString}`;
    }

    // Try native share API first, fallback to clipboard
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${packageName} - Full Itinerary`,
          text: generateActivityShareMessage(shareUrl),
        });
      } catch (err) {
        // User cancelled or error - fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const totalActivities =
    activity?.reduce((acc, day) => acc + (day?.event?.length || 0), 0) || 0;
  const hasValidImage = packageImage && !imageError;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Image Section (consistent with PackageImage component) */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] bg-slate-900">
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
            <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-rose-600 to-purple-700" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={clickBack}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                  isLiked
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 relative"
              >
                <Share2 size={18} />
                {showCopied && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded whitespace-nowrap">
                    Link copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-16 pt-10 px-4 md:px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg mb-3">
              <Map size={14} className="text-emerald-400" />
              <span className="text-white text-sm font-semibold">
                Full Itinerary
              </span>
            </div>

            {/* Package Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
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

        {/* Bottom Curved Edge */}
        <div className="absolute -bottom-1 left-0 right-0 z-30">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V20C240 0 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Itinerary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8 animate-slide-up">
          <SectionHeader
            icon={Sparkles}
            title="Your Itinerary"
            subtitle="Day-by-day planned activities"
            iconBg="from-emerald-500 to-teal-500"
          />

          {/* Timeline Content */}
          <div className="relative mt-8">
            {/* Timeline Line */}
            <div className="absolute left-5 lg:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-rose-200 to-emerald-200 rounded-full" />

            {/* Days */}
            {activity?.length > 0 ? (
              <div className="space-y-8 lg:space-y-10">
                {activity.map((data, dayIndex) => (
                  <div key={data._id} className="relative">
                    {/* Day Header */}
                    <div className="flex items-start gap-4 lg:gap-6 mb-4">
                      {/* Timeline Node */}
                      <div className="relative z-10 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/25 flex-shrink-0">
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
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 lg:p-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-lg lg:text-xl">
                  🎉 End of Trip
                </p>
                <p className="text-emerald-600 text-sm lg:text-base">
                  We hope you have an amazing journey!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
