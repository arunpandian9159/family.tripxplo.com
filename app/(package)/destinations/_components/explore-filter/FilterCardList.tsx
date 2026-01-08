"use client";

import { useState } from "react";
import { Building, CarFront, MapPin, Calendar, Heart } from "lucide-react";
import { LuDices } from "react-icons/lu";
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
    return (
      <>
        <div
          className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row h-auto cursor-pointer"
          onClick={handleViewDetails}
        >
          {/* List View - Image Section */}
          <div className="relative w-full sm:w-[280px] md:w-[320px] aspect-[4/3] sm:aspect-[4/5] md:aspect-auto md:h-full min-h-[250px] overflow-hidden flex-shrink-0">
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 sm:hidden" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {pkg.planName && <PlanBadge plan={pkg.planName} />}
            </div>

            <div className="absolute top-3 right-3 sm:hidden">
              <div
                className="bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md border border-white/20 flex items-center gap-1.5"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {pkg.noOfNight}N/{pkg.noOfDays}D
                </span>
              </div>
            </div>
          </div>

          {/* List View - Content Section */}
          <div className="p-5 flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <div className="hidden sm:flex items-center gap-2 mb-2">
                  <div
                    className="bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-md border border-white/20 flex items-center gap-1.5"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {pkg.noOfNight}N/{pkg.noOfDays}D
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 transition-colors mb-2">
                  {pkg.packageName}
                </h3>

                {/* Destinations with Nights */}
                <div className="mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pkg.destination
                          ?.filter((d) => d.noOfNight > 0)
                          .slice(0, 3)
                          .map((d, i, arr) => (
                            <span
                              key={d._id}
                              className="text-sm text-slate-600 font-medium"
                            >
                              {d.destinationName} - {d.noOfNight}N
                              {i < arr.length - 1 && (
                                <span className="text-slate-400 mx-0.5">,</span>
                              )}
                            </span>
                          ))}
                        {pkg.destination &&
                          pkg.destination.filter((d) => d.noOfNight > 0)
                            .length > 3 && (
                            <span
                              className="text-sm text-slate-400 font-medium relative group cursor-help"
                              tabIndex={0}
                            >
                              ...
                              {/* Tooltip */}
                              <div className="absolute left-0 top-full mt-2 hidden group-hover:block group-focus:block z-50 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl min-w-max">
                                <div className="flex flex-col gap-1">
                                  {pkg.destination
                                    .filter((d) => d.noOfNight > 0)
                                    .map((d) => (
                                      <span key={d._id}>
                                        {d.destinationName} - {d.noOfNight}N
                                      </span>
                                    ))}
                                </div>
                                <div className="absolute -top-1 left-2 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                              </div>
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Button and Starts @ */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleWishlistClick}
                  className={cn(
                    "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                    isWishlisted
                      ? "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                      : "bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                  )}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
                {pkg.startFrom && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
                    <MapPin className="w-3 h-3 animate-pulse" />
                    <span className="text-xs font-semibold">
                      Starts @{pkg.startFrom}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 my-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Hotels
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.hotelCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CarFront size={18} className="text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Transfer
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.vehicleCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <LuDices size={18} className="text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Activities
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {pkg.activityCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-100">
              <div>
                <span className="text-sm text-slate-500 font-semibold block mb-1">
                  Starts from
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{formatIndianNumber(price)}
                  </span>
                  <span className="text-sm text-slate-400 font-medium line-through decoration-slate-300 decoration-2">
                    ₹{formatIndianNumber(Math.round(price * 1.25))}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  /person
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center gap-2"
              >
                View Details
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
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

  // existing grid layout
  return (
    <>
      <div
        className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 overflow-hidden flex flex-col h-full cursor-pointer"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity" />

          {/* Top Badges: Plan, Duration & Wishlist */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              {pkg.planName && <PlanBadge plan={pkg.planName} />}
              {/* Duration Badge */}
              <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md font-semibold text-[11px] border border-white/20 flex items-center gap-1 shadow-sm">
                <Calendar className="w-3 h-3" />
                <span>
                  {pkg.noOfNight}N/{pkg.noOfDays}D
                </span>
              </div>
            </div>

            <button
              onClick={handleWishlistClick}
              className={cn(
                "p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm",
                isWishlisted
                  ? "bg-white text-emerald-500"
                  : "bg-black/20 text-white hover:bg-white hover:text-emerald-500"
              )}
            >
              <Heart
                className="w-5 h-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

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
        <div className="p-4 flex flex-col flex-grow gap-4">
          {/* Destinations & Start Point */}
          <div className="flex flex-col gap-2">
            {/* Destinations List */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {pkg.destination
                  ?.filter((d) => d.noOfNight > 0)
                  .slice(0, 3)
                  .map((d, i, arr) => (
                    <span key={d._id}>
                      {d.destinationName} ({d.noOfNight}N)
                      {i < arr.length - 1 && (
                        <span className="text-slate-300 mx-2">•</span>
                      )}
                    </span>
                  ))}
                {pkg.destination &&
                  pkg.destination.filter((d) => d.noOfNight > 0).length > 3 && (
                    <span className="text-slate-400 ml-1 text-xs">
                      +{pkg.destination.length - 3} more
                    </span>
                  )}
              </p>
            </div>

            {/* Starts From Badge */}
            {pkg.startFrom && (
              <div className="ml-6">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold">
                    Starts @ {pkg.startFrom}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 bg-slate-50/50 rounded-xl px-2">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <Building size={16} className="text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Hotels
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {pkg.hotelCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-r border-slate-200">
              <CarFront size={16} className="text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Transfers
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {pkg.vehicleCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <LuDices size={16} className="text-amber-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Activities
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {pkg.activityCount}
                </span>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">
                Starts from
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  ₹{formatIndianNumber(price)}
                </span>
                <span className="text-xs text-slate-400 font-medium line-through">
                  ₹{formatIndianNumber(Math.round(price * 1.25))}
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
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold uppercase tracking-wide rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center gap-2"
            >
              View Details
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
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
