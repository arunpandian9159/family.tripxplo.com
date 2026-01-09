"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  Grid,
  List,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { packagesApi } from "@/lib/api-client";
import { initializePackage } from "@/app/store/features/packageSlice";
import { setPackageId } from "@/app/store/features/packageDetailsSlice";
import FilterCardList from "@/app/(package)/destinations/_components/explore-filter/FilterCardList";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonPackageCard } from "@/components/ui/skeleton";
import { PackageType } from "@/app/types/package";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";

// Filter categories
const FILTER_CATEGORIES = [
  { label: "All Packages", value: "all" },
  { label: "2N to 4N", value: "2-4" },
  { label: "5N to 7N", value: "5-7" },
  { label: "8N+", value: "8+" },
  { label: "Platinum", value: "platinum" },
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
];

// Sort options
const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Duration: Short to Long", value: "duration-asc" },
  { label: "Duration: Long to Short", value: "duration-desc" },
];

const ITEMS_PER_PAGE = 20;
const MAX_ITEMS = 250;

// Transform featured package to PackageType format
interface FeaturedPackage {
  id: string;
  name: string;
  images: string[];
  noOfDays: number;
  noOfNights: number;
  price: number;
  destinations: {
    id: string;
    name: string;
    noOfNights: number;
  }[];
  offer: number;
  status: boolean;
  planName?: string;
  hotelCount?: number;
  vehicleCount?: number;
  activityCount?: number;
}

const transformToPackageType = (pkg: FeaturedPackage): PackageType => ({
  packageId: pkg.id,
  packageName: pkg.name,
  packageImg: pkg.images,
  noOfDays: pkg.noOfDays,
  noOfNight: pkg.noOfNights,
  perPerson: pkg.price,
  destination:
    pkg.destinations?.map((d, i) => ({
      _id: d.id || String(i),
      destinationId: d.id,
      destinationName: d.name,
      destinationType: "",
      noOfNight: d.noOfNights,
      rankNo: i,
      __v: 0,
    })) || [],
  planName: pkg.planName || "",
  hotelCount: pkg.hotelCount || 0,
  vehicleCount: pkg.vehicleCount || 0,
  activityCount: pkg.activityCount || 0,
  AgentAmount: 0,
  activity: [],
  agentCommissionPer: 0,
  finalPackagePrice: 0,
  gstPer: 0,
  gstPrice: 0,
  hotelMeal: [],
  isMark: false,
  marketingPer: 0,
  startFrom: "",
  totalActivityPrice: 0,
  totalAdditionalFee: 0,
  totalCalculationPrice: 0,
  totalPackagePrice: 0,
  totalRoomPrice: 0,
  totalTransportFee: 0,
  totalVehiclePrice: 0,
});

const PackagesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [allPackages, setAllPackages] = useState<FeaturedPackage[]>([]);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch all packages once
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packagesApi.featured(MAX_ITEMS);
        if (response.success && response.data) {
          setAllPackages(
            (response.data as { packages: FeaturedPackage[] }).packages || []
          );
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on search query and active filter
  const filteredPackages = allPackages.filter((pkg) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destinations?.some((d) =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Category filter
    let matchesFilter = true;
    const planNameLower = pkg.planName?.toLowerCase().trim() || "";
    switch (activeFilter) {
      case "2-4":
        matchesFilter = pkg.noOfNights >= 2 && pkg.noOfNights <= 4;
        break;
      case "5-7":
        matchesFilter = pkg.noOfNights >= 5 && pkg.noOfNights <= 7;
        break;
      case "8+":
        matchesFilter = pkg.noOfNights >= 8;
        break;
      case "platinum":
        matchesFilter = planNameLower.includes("platinum");
        break;
      case "gold":
        matchesFilter = planNameLower.includes("gold");
        break;
      case "silver":
        matchesFilter = planNameLower.includes("silver");
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration-asc":
        return a.noOfNights - b.noOfNights;
      case "duration-desc":
        return b.noOfNights - a.noOfNights;
      default:
        return 0;
    }
  });

  // Get packages to display (paginated)
  const displayedPackages = sortedPackages.slice(0, displayedCount);
  const hasMore = displayedCount < sortedPackages.length;

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeFilter, sortBy]);

  // Load more packages
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    // Simulate loading delay for smoother UX
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, sortedPackages.length)
      );
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore, sortedPackages.length]);

  // Infinite scroll hook
  const lastElementRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
  });

  const handleNextPage = (packageId: string) => {
    dispatch(initializePackage());
    dispatch(setPackageId(packageId));
    router.push(`/package/${packageId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      {/* Hero Header */}
      <div className="relative pt-20 lg:pt-28 pb-12 lg:pb-16 overflow-hidden">
        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="max-w-[88rem] mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 gold-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-gold-400/20 rounded-full blur-2xl" />

        <Container size="2xl" className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="glass" size="lg">
                  <Package className="w-3 h-3 mr-1" />
                  {sortedPackages.length} Packages
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                All Packages
              </h1>
              <p className="text-white/80 text-lg drop-shadow-md">
                Explore our handcrafted travel experiences
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

      <Container size="2xl" className="py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search packages or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          {/* Filter Categories */}
          <div className="w-full overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2">
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveFilter(category.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap",
                    activeFilter === category.value
                      ? "bg-gold-50 border-gold-200 text-gold-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ||
                    "Sort"}
                </span>
              </Button>

              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors",
                          sortBy === option.value
                            ? "text-gold-600 font-medium bg-gold-50"
                            : "text-slate-700"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "gold-gradient text-white"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "gold-gradient text-white"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || activeFilter !== "all") && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-slate-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-slate-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-50 text-gold-700 rounded-full text-sm">
                {FILTER_CATEGORIES.find((c) => c.value === activeFilter)?.label}
                <button
                  onClick={() => setActiveFilter("all")}
                  className="ml-1 hover:text-gold-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setSortBy("default");
              }}
              className="text-sm text-gold-600 hover:text-gold-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Package Grid */}
        {!loading && displayedPackages.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-6 animate-fade-in",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 max-w-4xl mx-auto"
              )}
            >
              {displayedPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  ref={
                    index === displayedPackages.length - 1
                      ? lastElementRef
                      : null
                  }
                  onClick={() => handleNextPage(pkg.id)}
                  className="h-full cursor-pointer animate-slide-up"
                  style={{
                    animationDelay: `${Math.min(
                      (index % ITEMS_PER_PAGE) * 0.05,
                      0.3
                    )}s`,
                  }}
                >
                  <FilterCardList
                    package={transformToPackageType(pkg)}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonPackageCard key={i} />
                ))}
              </div>
            )}

            {/* Load More Indicator */}
            {hasMore && !loadingMore && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-sm">Scroll for more packages...</span>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && displayedPackages.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-12">
                <div className="text-sm text-slate-400">
                  Showing all {displayedPackages.length} packages
                </div>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No packages found
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                {searchQuery || activeFilter !== "all"
                  ? "No packages match your filters. Try adjusting your search or filters."
                  : "No packages available at the moment."}
              </p>
              {(searchQuery || activeFilter !== "all") && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )
        )}

        {/* Initial Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonPackageCard key={i} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default PackagesPage;
