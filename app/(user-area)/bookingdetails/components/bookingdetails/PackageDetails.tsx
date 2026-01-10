"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Map,
  Car,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Utensils,
  BedDouble,
  Star,
  MapPin,
  Sparkles,
  Snowflake,
  Check,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import Inclusions from "@/app/(package)/package/_components/Inclusions";
import Exclusions from "@/app/(package)/package/_components/Exclusions";
import IternaryStory from "@/app/(package)/package/_components/IternaryStory";
import { PackType, HotelMeal } from "@/app/types/pack";
import { VehicleDetail } from "@/app/types/vehicle";

// Section Header Component (copied from PackageDetail.tsx)
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "from-gold-500 to-gold-700",
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

// Section Divider Component (copied from PackageDetail.tsx)
const SectionDivider = () => (
  <div className="relative py-8">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-dashed border-slate-200" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-white px-4">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-gold-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gold-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Simplified Hotel Card (No change buttons)
const ViewOnlyHotelCard = ({
  hotel,
  index,
}: {
  hotel: HotelMeal;
  index: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!hotel || typeof hotel !== "object") return null;

  const mealPlans: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    cp: {
      label: "Breakfast Included",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    map: {
      label: "Breakfast & Dinner",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    ap: {
      label: "All Meals Included",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    ep: { label: "Rooms Only", color: "text-slate-600", bg: "bg-slate-50" },
  };

  const hotelName = hotel?.hotelName || "Hotel";
  const hotelImage = hotel?.image || "";
  const mealPlanValue =
    typeof hotel?.mealPlan === "string" ? hotel.mealPlan.toLowerCase() : "ep";
  const mealInfo = mealPlans[mealPlanValue] || {
    label: hotel?.mealPlan || "N/A",
    color: "text-slate-600",
    bg: "bg-slate-50",
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gold-500 text-white text-sm font-bold rounded-lg">
            {index}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Stay {index}</h3>
            <p className="text-xs text-slate-400">
              {hotel?.noOfNight || 0} Night
              {(hotel?.noOfNight || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div className="relative w-full md:w-56 h-40 md:h-44 rounded-xl overflow-hidden flex-shrink-0">
            {hotelImage && !imageError ? (
              <Image
                src={NEXT_PUBLIC_IMAGE_URL + hotelImage}
                fill
                alt={hotelName}
                className="object-cover transition-transform duration-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Building2 size={40} className="text-slate-300" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
              <CalendarDays size={12} />
              {hotel?.noOfNight || 0} Nights
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-700">4.5</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h4 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">
              {hotelName}
            </h4>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
              <MapPin size={14} />
              <span>Prime Location</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {/* Dates */}
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <CalendarDays size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-blue-700">
                  {(() => {
                    const startDate = new Date(hotel?.fullStartDate);
                    const endDate = new Date(hotel?.fullEndDate);
                    if (
                      isNaN(startDate.getTime()) ||
                      isNaN(endDate.getTime())
                    ) {
                      return `${hotel?.fullStartDate || "Check-in"} — ${
                        hotel?.fullEndDate || "Check-out"
                      }`;
                    }
                    return `${startDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} — ${endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}`;
                  })()}
                </span>
              </div>

              {/* Meal Plan */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 ${mealInfo.bg} rounded-lg`}
              >
                <Utensils size={14} className={mealInfo.color} />
                <span className={`text-xs font-medium ${mealInfo.color}`}>
                  {mealInfo.label}
                </span>
              </div>
            </div>

            {/* Room Type */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <BedDouble size={18} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Room Type
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {hotel?.hotelRoomType || "Standard Room"}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {hotel?.viewPoint && hotel.viewPoint.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {hotel.viewPoint
                    .slice(0, showAll ? undefined : 4)
                    .map((vp: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100"
                      >
                        <Sparkles size={10} />
                        {vp}
                      </span>
                    ))}
                  {hotel.viewPoint.length > 4 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      {showAll
                        ? "Show Less"
                        : `+${hotel.viewPoint.length - 4} more`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Cab Card (No change buttons)
const ViewOnlyCabCard = ({ vehicle }: { vehicle: any }) => {
  const [imageError, setImageError] = useState(false);
  if (!vehicle || typeof vehicle !== "object") return null;

  const vehicleName = vehicle?.vehicleName || "Vehicle";
  const vehicleImage = vehicle?.image || "";
  const vehicleInclusions = Array.isArray(vehicle?.inclusion)
    ? vehicle.inclusion
    : [];

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white shadow-md">
            <Car size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Transfer</h3>
            <p className="text-xs text-slate-400">Cab included in package</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-50">
            {vehicleImage && !imageError ? (
              <Image
                src={NEXT_PUBLIC_IMAGE_URL + vehicleImage}
                fill
                alt={vehicleName}
                className="object-contain p-4 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={48} className="text-slate-300" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h4 className="text-xl font-bold text-slate-900 mb-1">
                {vehicleName}
              </h4>
              <p className="text-sm text-slate-500">
                {vehicle?.vehicleCompany || "Vehicle Company"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <Users size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-blue-700">
                  {vehicle?.seater || 0} Seater
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-lg border border-violet-100">
                <Briefcase size={14} className="text-violet-500" />
                <span className="text-xs font-medium text-violet-700">
                  {vehicle?.luggage || 0} Luggage
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  vehicle?.acType
                    ? "bg-cyan-50 border-cyan-100"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <Snowflake
                  size={14}
                  className={
                    vehicle?.acType ? "text-cyan-500" : "text-slate-400"
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    vehicle?.acType ? "text-cyan-700" : "text-slate-500"
                  }`}
                >
                  {vehicle?.acType ? "AC" : "Non-AC"}
                </span>
              </div>
            </div>

            {vehicleInclusions.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                  Included
                </p>
                <div className="flex flex-wrap gap-2">
                  {vehicleInclusions.map((inclusion: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100"
                    >
                      <Check size={10} />
                      {inclusion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PackageDetailsProps {
  pack: any;
}

const PackageDetails = ({ pack }: PackageDetailsProps) => {
  const router = useRouter();
  if (!pack) return null;

  const hotels = pack?.hotelMeal || [];
  const vehicles = pack?.vehicleDetail || [];
  const inclusions = pack?.inclusionDetail || [];
  const exclusions = pack?.exclusionDetail || [];
  const destinations = pack?.destination || [];
  const activity = pack?.activity || [];
  const bookingId = pack?.bookingId;

  return (
    <div className="space-y-8">
      {/* Hotels Section */}
      {hotels.length > 0 && (
        <>
          <div>
            <SectionHeader
              icon={Building2}
              title="Hotels & Stays"
              subtitle={`${hotels.length} handpicked ${
                hotels.length === 1 ? "stay" : "stays"
              }`}
              iconBg="from-blue-500 to-indigo-500"
            />
            <div className="space-y-5">
              {hotels.map((hotel: HotelMeal, index: number) => (
                <ViewOnlyHotelCard
                  key={hotel?._id || index}
                  hotel={hotel}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
          <SectionDivider />
        </>
      )}

      {/* Itinerary Section */}
      <div>
        <SectionHeader
          icon={Map}
          title="Your Itinerary"
          subtitle="Day-by-day planned activities"
          iconBg="from-emerald-500 to-teal-500"
        />
        <IternaryStory
          destinations={destinations}
          activity={activity}
          onViewFull={() =>
            router.push(`/bookingdetails/${bookingId}/itinerary`)
          }
        />
      </div>

      <SectionDivider />

      {/* Transfers Section */}
      {vehicles.length > 0 && (
        <>
          <div>
            <SectionHeader
              icon={Car}
              title="Transfers"
              subtitle="Comfortable transportation included"
              iconBg="from-amber-500 to-orange-500"
            />
            <div className="space-y-5">
              {vehicles.map((vehicle: VehicleDetail, index: number) => (
                <ViewOnlyCabCard key={index} vehicle={vehicle} />
              ))}
            </div>
          </div>
          <SectionDivider />
        </>
      )}

      {/* Inclusions & Exclusions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Inclusions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader
            icon={CheckCircle2}
            title="What's Included"
            iconBg="from-green-500 to-green-600"
          />
          <Inclusions inclusions={inclusions} />
        </div>

        {/* Exclusions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SectionHeader
            icon={XCircle}
            title="Not Included"
            iconBg="from-red-500 to-red-600"
          />
          <Exclusions exclusions={exclusions} />
        </div>
      </div>
    </div>
  );
};

function Users({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default PackageDetails;
