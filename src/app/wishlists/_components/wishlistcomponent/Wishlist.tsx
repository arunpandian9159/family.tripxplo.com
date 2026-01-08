"use client";
import React, { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Loader2,
  Building,
  CarFront,
} from "lucide-react";
import { LuDices } from "react-icons/lu";
import { formatIndianNumber } from "@/lib/utils";
import Image from "next/image";
import { useWishlist } from "@/app/hooks/useWishlist";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { useRouter } from "next/navigation";
import { PlanBadge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { initializePackage } from "@/app/store/features/packageSlice";
import AuthModal from "@/app/(user-area)/components/home/AuthModal";

const Wishlist = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const {
    items,
    isLoading,
    isLoggedIn,
    fetchWishlist,
    removePackageFromWishlist,
  } = useWishlist();

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, [isLoggedIn, fetchWishlist]);

  // Refresh wishlist when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoggedIn) {
        fetchWishlist();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoggedIn, fetchWishlist]);

  const handleRemoveFromWishlist = async (
    e: React.MouseEvent,
    packageId: string
  ) => {
    e.stopPropagation();
    await removePackageFromWishlist(packageId);
  };

  const handleViewPackage = (packageId: string) => {
    // Reset package state before navigating to ensure fresh data is fetched
    dispatch(initializePackage());
    router.push(`/package/${packageId}`);
  };

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-6 bg-emerald-50 rounded-full mb-6">
            <Heart className="w-12 h-12 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Login to view your wishlist
          </h3>
          <p className="text-slate-500 text-center max-w-sm mb-6">
            Sign in to save your favorite packages and access them anytime
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-primary"
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView="signin"
          onSuccess={() => {
            setIsAuthModalOpen(false);
            fetchWishlist();
          }}
        />
      </>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500">Loading your wishlist...</p>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-6 bg-emerald-50 rounded-full mb-6">
          <Heart className="w-12 h-12 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          No saved packages yet
        </h3>
        <p className="text-slate-500 text-center max-w-sm">
          Start exploring and save your favorite packages to see them here
        </p>
        <button
          onClick={() => router.push("/destinations")}
          className="mt-6 btn-primary"
        >
          Explore Packages
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((data, index) => {
        const imageUrl = data.images?.[0]
          ? NEXT_PUBLIC_IMAGE_URL + data.images[0]
          : "/home.png";

        return (
          <div
            key={data.packageId}
            onClick={() => handleViewPackage(data.packageId)}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Section */}
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={imageUrl}
                fill
                alt={data.name}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Top Badges - Plan & Offer */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {data.planName && (
                  <PlanBadge plan={data.planName} />
                )}
              </div>

              {/* Wishlist Button (Remove) */}
              <button
                onClick={(e) => handleRemoveFromWishlist(e, data.packageId)}
                className="absolute top-4 right-4 p-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-lg"
              >
                <Heart className="w-4 h-4" fill="currentColor" />
              </button>

              {/* Location & Duration on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {data.destinations?.length || 0} Destinations
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">
                    {data.noOfNights}N / {data.noOfDays}D
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col grow">
              {/* Title */}
              <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-emerald-500 transition-colors mb-3">
                {data.name}
              </h3>

              {/* Features */}
              <div className="flex items-center justify-between py-3 border-t border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building size={16} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-medium">{data.hotelCount || 0} Hotels</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CarFront size={16} className="text-emerald-500" />
                  </div>
                  <span className="text-xs font-medium">{data.vehicleCount || 0} Cabs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <LuDices size={16} className="text-amber-500" />
                  </div>
                  <span className="text-xs font-medium">{data.activityCount || 0} Activities</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Starting from</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 leading-tight">
                      ₹{formatIndianNumber(data.perPerson || 0)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/person</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPackage(data.packageId);
                  }}
                  className="px-4 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-400 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Wishlist;
