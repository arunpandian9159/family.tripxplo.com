"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  SlidersHorizontal,
  Grid,
  List,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/store/store";
import { usePackageList } from "@/app/hooks/usePackageList";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { useFilterPackages } from "@/app/hooks/useFilterPackages";
import { initializePackage } from "@/app/store/features/packageSlice";
import ExploreFilter from "./_components/explore-filter/ExploreFilter";
import FilterCardList from "./_components/explore-filter/FilterCardList";
import { setPackageId } from "@/app/store/features/packageDetailsSlice";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonPackageCard } from "@/components/ui/skeleton";

// Destination image mapping
const destinationImages: Record<string, string> = {
  "4ebe5f1e-99d4-4dbb-a4e5-538a353ba81c": "/bali.jpg", // Bali
  "1961511a-2d52-4dc4-95f5-9478c3e9a04f": "/goa.jpg", // Goa
  "9380c50d-62ee-443b-a5c9-6beb90770e8f": "/manali.jpg", // Manali
  "f9b8a4f8-227a-4464-a650-c30b8ec7f914": "/ooty.jpg", // Ooty
  "e431c796-3946-4d73-a9b9-99a7b138680d": "/meghalaya.jpg", // Meghalaya
  "009b592f-9b73-4990-8068-1c299d1f15e5": "/kashmir.jpg", // Kashmir
};

const PackagesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [offset, setOffset] = useState<number>(0);
  const destination = useAppSelector(
    (state) => state.searchPackage.destination
  );
  const destinationId = useAppSelector(
    (state) => state.searchPackage.destinationId
  );
  const themeId = useAppSelector((state) => state.themeSelect.themeId);

  // Get destination cover image
  const coverImage = destinationId ? destinationImages[destinationId] : null;

  // Track previous search params to reset pagination on search change
  const prevSearchRef = useRef<string>(`${destinationId}-${themeId}`);

  // Reset offset when search params change
  useEffect(() => {
    const currentSearch = `${destinationId}-${themeId}`;
    if (prevSearchRef.current !== currentSearch) {
      // Search params changed, reset pagination immediately
      setOffset(0);
      prevSearchRef.current = currentSearch;
    }
  }, [destinationId, themeId]);

  const { packageList, isLoading, packageListHasNext } = usePackageList(offset);
  const filteredPackages = useFilterPackages(packageList);

  const fetchMoreItems = () => {
    if (packageListHasNext) {
      setOffset(offset + 10);
    }
  };

  const lastElementRef = useInfiniteScroll({
    hasMore: packageListHasNext,
    onLoadMore: fetchMoreItems,
  });

  const handleNextPage = (packageId: string) => {
    setLoading(true);
    dispatch(initializePackage());
    dispatch(setPackageId(packageId));
    setLoading(false);
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      {/* Hero Header with Cover Image */}
      <div className="relative pt-20 lg:pt-28 pb-12 lg:pb-16 overflow-hidden">
        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Background Image with Ken Burns Effect */}
        {coverImage && (
          <div className="absolute inset-0">
            <Image
              src={coverImage}
              alt={destination || "Destination"}
              fill
              className="object-cover animate-ken-burns"
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
        )}

        {/* Fallback gradient if no image */}
        {!coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        )}

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                {destination && (
                  <Badge variant="emerald" size="lg">
                    <MapPin className="w-3 h-3 mr-1" />
                    {destination}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {destination ? `Explore ${destination}` : "All Packages"}
              </h1>
              <p className="text-slate-200 text-lg drop-shadow-md">
                {filteredPackages?.length || 0} handcrafted packages available
              </p>
            </div>

            {/* View Toggle (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode !== "grid" ? "text-white hover:bg-white/10" : ""
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode !== "list" ? "text-white hover:bg-white/10" : ""
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto">
            <ExploreFilter allPackages={packageList} />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <SlidersHorizontal className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </div>

        {/* Package Grid */}
        {filteredPackages?.length > 0 ? (
          <div
            className={`
            grid gap-6 animate-fade-in
            ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto"
            }
          `}
          >
            {filteredPackages.map((pkg, index) => (
              <div
                key={index}
                onClick={() => handleNextPage(pkg.packageId)}
                ref={index === packageList.length - 1 ? lastElementRef : null}
                className="h-full cursor-pointer animate-slide-up"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                <FilterCardList package={pkg} viewMode={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-50 flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                We'll update the package details shortly ✈️
              </h3>
              <p className="text-slate-600 max-w-md mb-6 text-lg">
                Please fill out the form below, and we'll send a quote.
              </p>
              <a
                href="https://crm.tripxplo.com/travel-inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
              >
                Fill Travel Inquiry Form
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
              <p className="text-slate-500 text-sm mt-6">~ Team, TripXplo ✅</p>
            </div>
          )
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonPackageCard key={i} />
            ))}
          </div>
        )}

        {/* Load More Indicator */}
        {packageListHasNext && !isLoading && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm">Loading more packages...</span>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PackagesPage;
