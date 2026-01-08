"use client";
import { HotelMeal } from "@/app/types/pack";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  CalendarDays,
  Utensils,
  BedDouble,
  ArrowRightLeft,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setReplaceHotel } from "@/app/store/features/hotelChangeSlice";
import { useState } from "react";
import Image from "next/image";
import ChangeHotelModal from "./modals/ChangeHotelModal";
import ChangeRoomModal from "./modals/ChangeRoomModal";
import { HotelChangeDataType } from "@/app/types/hotel";

export default function HotelData({
  hotel,
  index,
}: {
  hotel: HotelMeal;
  index: number;
}) {
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedNewHotel, setSelectedNewHotel] =
    useState<HotelChangeDataType | null>(null);

  if (!hotel || typeof hotel !== "object") {
    return null;
  }

  function openRoomModal() {
    dispatch(setReplaceHotel(hotel));
    setSelectedNewHotel(null); // No new hotel, just changing room in same hotel
    setIsRoomModalOpen(true);
  }

  function openHotelModal() {
    dispatch(setReplaceHotel(hotel));
    setIsHotelModalOpen(true);
  }

  function handleRoomChangeFromHotelModal(selectedHotel: HotelChangeDataType) {
    setIsHotelModalOpen(false);
    // Store the new hotel so Room modal can use changeHotelAndCalculatePrice
    setSelectedNewHotel(selectedHotel);
    setIsRoomModalOpen(true);
  }

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
  // Safely get mealPlan as string
  const mealPlanValue =
    typeof hotel?.mealPlan === "string" ? hotel.mealPlan.toLowerCase() : "ep";
  const mealInfo = mealPlans[mealPlanValue] || {
    label: hotel?.mealPlan || "N/A",
    color: "text-slate-600",
    bg: "bg-slate-50",
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-coral-500 text-white text-sm font-bold rounded-lg">
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
          <button
            onClick={openHotelModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral-500 to-coral-400 text-white hover:from-coral-600 hover:to-coral-500 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowRightLeft size={14} />
            Change Hotel
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Image */}
            <div className="relative w-full md:w-56 h-40 md:h-44 rounded-xl overflow-hidden flex-shrink-0 group/image">
              {hotelImage && !imageError ? (
                <Image
                  src={NEXT_PUBLIC_IMAGE_URL + hotelImage}
                  fill
                  alt={hotelName}
                  className="object-cover group-hover/image:scale-110 transition-transform duration-700"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Building2 size={40} className="text-slate-300" />
                </div>
              )}

              {/* Duration Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                <CalendarDays size={12} />
                {hotel?.noOfNight || 0} Nights
              </div>

              {/* Rating Badge (if available) */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-slate-700">
                  4.5
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <h4 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">
                {hotelName}
              </h4>

              {/* Location (placeholder) */}
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
                <MapPin size={14} />
                <span>Prime Location</span>
              </div>

              {/* Info Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Dates */}
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <CalendarDays size={14} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700">
                    {(() => {
                      try {
                        // 1. Try to use dynamic calculation based on Search Date + Day Offset
                        // This fixes the "Wrong Day" issue if the backend returns old static dates
                        const searchDateStr = useSelector(
                          (state: any) => state.searchPackage.date,
                        );

                        // Check if we have necessary data for dynamic calculation
                        if (
                          searchDateStr &&
                          typeof hotel?.startDateWise === "number"
                        ) {
                          const tripStartDate = new Date(searchDateStr);

                          if (!isNaN(tripStartDate.getTime())) {
                            // Calculate Check-in: TripStart + (DayOffset - 1)
                            const checkInDate = new Date(tripStartDate);
                            checkInDate.setDate(
                              tripStartDate.getDate() +
                                (hotel.startDateWise - 1),
                            );

                            // Calculate Check-out: CheckIn + Nights
                            // OR TripStart + (EndOffset - 1) if endDateWise is reliable
                            const checkOutDate = new Date(checkInDate);
                            checkOutDate.setDate(
                              checkInDate.getDate() + (hotel.noOfNight || 1),
                            );

                            const startStr = checkInDate.toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            );
                            const endStr = checkOutDate.toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            );

                            return `${startStr} — ${endStr}`;
                          }
                        }

                        // 2. Fallback to existing logic (parsing the string from backend)
                        const startDate = new Date(hotel?.fullStartDate);
                        const endDate = new Date(hotel?.fullEndDate);

                        if (
                          isNaN(startDate.getTime()) ||
                          isNaN(endDate.getTime())
                        ) {
                          return `${hotel?.fullStartDate || "Check-in"} — ${hotel?.fullEndDate || "Check-out"}`;
                        }

                        const startStr = startDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        });
                        const endStr = endDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });

                        return `${startStr} — ${endStr}`;
                      } catch (e) {
                        return `${hotel?.fullStartDate || "Check-in"} — ${hotel?.fullEndDate || "Check-out"}`;
                      }
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
                <button
                  onClick={openRoomModal}
                  className="flex items-center gap-1 px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  Change
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Amenities/Viewpoints */}
              {hotel?.viewPoint && hotel.viewPoint.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.viewPoint
                      .slice(0, showAll ? undefined : 4)
                      .map((vp, i) => (
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

      {/* Modals */}
      <ChangeHotelModal
        isOpen={isHotelModalOpen}
        onClose={() => setIsHotelModalOpen(false)}
        hotel={hotel}
        onRoomChangeClick={handleRoomChangeFromHotelModal}
      />

      <ChangeRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setSelectedNewHotel(null);
        }}
        hotel={hotel}
        newHotel={selectedNewHotel || undefined}
      />
    </>
  );
}

function Building2({ size, className }: { size: number; className?: string }) {
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
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
