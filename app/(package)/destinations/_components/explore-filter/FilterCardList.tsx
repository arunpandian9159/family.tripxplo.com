"use client";

import { useState } from "react";
import {
  Building,
  CarFront,
  MapPin,
  Calendar,
  Heart,
  Utensils,
  Snowflake,
  Users,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";
import { LuDices } from "react-icons/lu";
import { BsCashCoin } from "react-icons/bs";
import Image from "next/image";
import { PackageType } from "@/app/types/package";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { cn, formatIndianNumber } from "@/lib/utils";
import { Badge, PlanBadge } from "@/components/ui/badge";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useRouter } from "next/navigation";
import LoginModal from "@/app/(package)/package/_components/LoginModal";
import { userApi } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/app/store/features/wishlistSlice";
import { initializePackage } from "@/app/store/features/packageSlice";

// Helper function to get meal plan display name
const getMealPlanName = (mealPlan: string): string => {
  const plans: Record<string, string> = {
    cp: "Breakfast",
    map: "Breakfast & Dinner",
    ap: "All Meals",
    ep: "No Meals",
  };
  return plans[mealPlan?.toLowerCase()] || mealPlan;
};

const FilterCardList = ({
  package: pkg,
  viewMode = "grid",
}: {
  package: PackageType;
  viewMode?: "grid" | "list";
}) => {
  const price = pkg.perPerson;
  const router = useRouter();
  const dispatch = useDispatch();
  const { isInWishlist, toggleWishlist, isLoggedIn } = useWishlist();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const packageId = pkg.packageId;
  const isWishlisted = isInWishlist(packageId);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    await toggleWishlist(packageId);
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);

    try {
      dispatch(addToWishlist(packageId)); // Optimistic update
      const response = await userApi.addToWishlist(packageId);
      if (response.success) {
        toast.success("Added to wishlist!");
      } else {
        toast.error(response.message || "Failed to add to wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("Failed to add to wishlist");
    }
  };

  const handleViewDetails = () => {
    // Clear old package data before navigation to prevent stale cache
    dispatch(initializePackage());
    router.push(`/package/${packageId}`);
  };

  if (viewMode === "list") {
    // Extract data for enhanced display (list view)
    const listFirstHotelMeal = pkg.hotelMeal?.[0];
    const listMealPlan = listFirstHotelMeal
      ? getMealPlanName(listFirstHotelMeal.mealPlan)
      : null;
    const listHasAC = listFirstHotelMeal?.isAc;
    const listRoomType = listFirstHotelMeal?.hotelRoomType;
    const listOriginalPrice = Math.round(price * 1.25);

    return (
      <>
        <div
          className="group relative bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl hover:border-gold-200/50 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row h-auto cursor-pointer"
          onClick={handleViewDetails}
        >
          {/* List View - Image Section */}
          <div className="relative w-full sm:w-[280px] md:w-[320px] aspect-[4/3] sm:aspect-[4/5] md:aspect-auto md:h-full min-h-[325px] overflow-hidden flex-shrink-0">
            <Image
              src={
                pkg.packageImg?.[0]
                  ? pkg.packageImg[0].startsWith("http")
                    ? pkg.packageImg[0]
                    : NEXT_PUBLIC_IMAGE_URL + pkg.packageImg[0]
                  : "/home.png"
              }
              fill
              alt={pkg.packageName}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {pkg.planName && <PlanBadge plan={pkg.planName} />}
            </div>

            {/* Duration Badge - Mobile */}
            <div className="absolute top-3 right-3">
              <div className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-bold text-[11px] border border-white/30 flex items-center gap-1.5 shadow-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {pkg.noOfNight}N/{pkg.noOfDays}D
                </span>
              </div>
            </div>
          </div>

          {/* List View - Content Section */}
          <div className="p-5 flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 transition-colors mb-2 group-hover:text-gold-600">
                  {pkg.packageName}
                </h3>

                {/* Destinations with Nights */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap items-center gap-1.5">
                    {pkg.destination
                      ?.filter((d) => d.noOfNight > 0)
                      .slice(0, 4)
                      .map((d, i, arr) => (
                        <span key={d._id} className="inline-flex items-center">
                          <span className="text-sm text-slate-600 font-medium hover:text-gold-600 transition-colors">
                            {d.destinationName}
                          </span>
                          <span className="text-gold-500 font-bold text-xs ml-0.5">
                            ({d.noOfNight}N)
                          </span>
                          {i < arr.length - 1 && (
                            <span className="text-slate-300 mx-1.5">→</span>
                          )}
                        </span>
                      ))}
                    {pkg.destination &&
                      pkg.destination.filter((d) => d.noOfNight > 0).length >
                        4 && (
                        <span className="text-gold-500 text-xs font-semibold cursor-help">
                          +
                          {pkg.destination.filter((d) => d.noOfNight > 0)
                            .length - 4}{" "}
                          more
                        </span>
                      )}
                  </div>
                </div>

                {/* Starts From Badge + Meal Type + Room Type */}
                <div className="flex items-center gap-2 flex-wrap">
                  {pkg.startFrom && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-50 to-amber-50 text-gold-700 px-3 py-1.5 rounded-lg border border-gold-200/50 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                      <span className="text-xs font-bold">
                        Starts @ {pkg.startFrom}
                      </span>
                    </div>
                  )}
                  {listMealPlan && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/50 shadow-sm">
                      <Utensils className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                        {listMealPlan}
                      </span>
                    </div>
                  )}
                  {listRoomType && (
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-200/50 shadow-sm">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-tight">
                        {listRoomType}
                      </span>
                    </div>
                  )}
                  {listHasAC && (
                    <div className="flex items-center gap-1.5 bg-cyan-50 px-2.5 py-1.5 rounded-lg border border-cyan-200/50 shadow-sm">
                      <Snowflake className="w-3 h-3 text-cyan-500" />
                      <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-tight">
                        AC
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className={cn(
                  "flex-shrink-0 p-2.5 rounded-full transition-all duration-300 shadow-md",
                  isWishlisted
                    ? "bg-red-50 text-red-500 hover:bg-red-100 scale-110"
                    : "bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:scale-110"
                )}
              >
                <Heart
                  className={cn("w-5 h-5", isWishlisted && "animate-pulse")}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Hotels
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.hotelCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CarFront size={18} className="text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Transfers
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.vehicleCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <LuDices size={18} className="text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Activities
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.activityCount}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Group
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    Family
                  </span>
                </div>
              </div>
            </div>

            {/* EMI Section + Price Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-3 border-t border-slate-100 mt-auto">
              {/* EMI Section */}
              <div className="flex items-center justify-between sm:justify-start gap-4 px-4 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-teal-100 rounded-xl shadow-sm flex-1 max-w-md">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <BsCashCoin size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">
                      Prepaid EMI
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      ₹{formatIndianNumber(Math.round(price / 12))}
                      <span className="text-[10px] text-slate-500 font-medium">
                        /month
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-end justify-between sm:justify-end gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-slate-400 font-medium line-through decoration-red-400 decoration-2">
                      ₹{formatIndianNumber(listOriginalPrice)}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
                      SAVE ₹{formatIndianNumber(listOriginalPrice - price)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹{formatIndianNumber(price)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    per person
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails();
                  }}
                  className="group/btn px-6 py-3 gold-gradient text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/30 active:scale-[0.98] flex items-center gap-2"
                >
                  View Details
                  <svg
                    className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-gold-500/5 via-transparent to-transparent" />
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Extract data for enhanced display
  const firstHotelMeal = pkg.hotelMeal?.[0];
  const mealPlan = firstHotelMeal
    ? getMealPlanName(firstHotelMeal.mealPlan)
    : null;
  const hasAC = firstHotelMeal?.isAc;
  const roomType = firstHotelMeal?.hotelRoomType;
  const originalPrice = Math.round(price * 1.25);

  // Enhanced grid layout
  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl hover:border-gold-200/50 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-1"
        onClick={handleViewDetails}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={
              pkg.packageImg?.[0]
                ? pkg.packageImg[0].startsWith("http")
                  ? pkg.packageImg[0]
                  : NEXT_PUBLIC_IMAGE_URL + pkg.packageImg[0]
                : "/home.png"
            }
            fill
            alt={pkg.packageName}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

          {/* Top Badges: Plan & Duration */}
          <div className="absolute top-3 left-3 right-14 flex items-start gap-2 z-10">
            {pkg.planName && <PlanBadge plan={pkg.planName} />}
            {/* Duration Badge */}
            <div className="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-bold text-[11px] border border-white/30 flex items-center gap-1.5 shadow-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {pkg.noOfNight}N/{pkg.noOfDays}D
              </span>
            </div>
          </div>

          {/* Wishlist Button - Floating */}
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg z-30 group/heart",
              isWishlisted
                ? "bg-white text-red-500 scale-110"
                : "bg-black/30 text-white hover:bg-white hover:text-red-500 hover:scale-110"
            )}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-transform",
                isWishlisted && "animate-pulse"
              )}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {/* Bottom Info - Package Name */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <h3
              className="text-lg font-bold text-white leading-snug line-clamp-1 transition-colors"
              title={pkg.packageName}
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              {pkg.packageName}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow gap-3">
          {/* Destinations & Start Point */}
          <div className="flex flex-col gap-2">
            {/* Destinations List */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {pkg.destination
                  ?.filter((d) => d.noOfNight > 0)
                  .slice(0, 3)
                  .map((d, i, arr) => (
                    <span key={d._id} className="inline-flex items-center">
                      <span className="hover:text-gold-600 transition-colors">
                        {d.destinationName}
                      </span>
                      <span className="text-gold-500 font-bold text-[11px] ml-0.5">
                        ({d.noOfNight}N)
                      </span>
                      {i < arr.length - 1 && (
                        <span className="text-slate-300 mx-1.5">→</span>
                      )}
                    </span>
                  ))}
                {pkg.destination &&
                  pkg.destination.filter((d) => d.noOfNight > 0).length > 3 && (
                    <span className="text-gold-500 ml-1 text-xs font-semibold">
                      +{pkg.destination.length - 3} more
                    </span>
                  )}
              </p>
            </div>

            {/* Starts From Badge */}
            {pkg.startFrom && (
              <div className="ml-6">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-50 to-amber-50 text-gold-700 px-2.5 py-1 rounded-lg border border-gold-200/50 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-xs font-bold">
                    Starts @ {pkg.startFrom}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Features Grid - Compact */}
          <div className="grid grid-cols-3 gap-1 py-1">
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <Building size={14} className="text-blue-500 mb-0.5" />
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                Hotels
              </span>
              <span className="text-sm font-bold text-slate-700">
                {pkg.hotelCount}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors">
              <CarFront size={14} className="text-green-600 mb-0.5" />
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                Transfers
              </span>
              <span className="text-sm font-bold text-slate-700">
                {pkg.vehicleCount}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors">
              <LuDices size={14} className="text-amber-500 mb-0.5" />
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                Activities
              </span>
              <span className="text-sm font-bold text-slate-700">
                {pkg.activityCount}
              </span>
            </div>
          </div>

          {/* Quick Stats Row (Grid View) */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {mealPlan && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                <Utensils className="w-2.5 h-2.5 text-amber-500" />
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-tight">
                  {mealPlan}
                </span>
              </div>
            )}
            {hasAC && (
              <div className="flex items-center gap-1 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                <Snowflake className="w-2.5 h-2.5 text-cyan-500" />
                <span className="text-[9px] font-bold text-cyan-700 uppercase tracking-tight">
                  AC
                </span>
              </div>
            )}
            {roomType && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                <Star className="w-2.5 h-2.5 text-yellow-500" />
                <span className="text-[9px] font-bold text-yellow-700 uppercase tracking-tight">
                  {roomType}
                </span>
              </div>
            )}
          </div>

          {/* EMI Section - Enhanced */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-teal-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <BsCashCoin size={14} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">
                  Prepaid EMI
                </span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{formatIndianNumber(Math.round(price / 12))}
                  <span className="text-[10px] text-slate-500 font-medium">
                    /month
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Price and Action - Enhanced */}
          <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-100">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-slate-400 font-medium line-through decoration-red-400 decoration-2">
                  ₹{formatIndianNumber(originalPrice)}
                </span>
                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
                  SAVE ₹{formatIndianNumber(originalPrice - price)}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{formatIndianNumber(price)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                per person
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="group/btn px-5 py-2.5 gold-gradient text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/30 active:scale-[0.98] flex items-center gap-2"
            >
              View Details
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-gold-500/5 via-transparent to-transparent" />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default FilterCardList;
