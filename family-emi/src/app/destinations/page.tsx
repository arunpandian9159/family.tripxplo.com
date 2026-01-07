'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Grid,
  List,
  SlidersHorizontal,
  Search,
  X,
  MapPin,
  Calendar,
  Star,
  Clock,
  Users,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeaturedPackage } from '@/lib/types';
import Navbar from '@/app/components/Navbar';

// Filter categories
const FILTER_CATEGORIES = [
  { label: 'All Packages', value: 'all' },
  { label: '2N to 4N', value: '2-4' },
  { label: '5N to 7N', value: '5-7' },
  { label: '8N+', value: '8+' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
];

// Sort options
const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Duration: Short to Long', value: 'duration-asc' },
  { label: 'Duration: Long to Short', value: 'duration-desc' },
];

const ITEMS_PER_PAGE = 20;

// Package Card Component with green theme
function PackageCard({ pkg, onClick }: { pkg: FeaturedPackage; onClick: () => void }) {
  const emiAmount = pkg.price > 0 ? Math.round(pkg.price / 6) : 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.images?.[0] || '/placeholder-package.jpg'}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {pkg.offer > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {pkg.offer}% OFF
            </span>
          )}
          {pkg.planName && (
            <span className="px-2 py-1 bg-[#15ab8b] text-white text-xs font-bold rounded-full">
              {pkg.planName}
            </span>
          )}
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
          <Clock className="w-3 h-3" />
          {pkg.noOfNights}N / {pkg.noOfDays}D
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#15ab8b] transition-colors">
          {pkg.name}
        </h3>

        {/* Destinations */}
        <div className="flex items-start gap-1.5 text-slate-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-[#15ab8b] shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {pkg.destinations?.map((d) => d.name).join(' → ') || 'Multiple Destinations'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
          {pkg.hotelCount && pkg.hotelCount > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#15ab8b]" />
              {pkg.hotelCount} Hotels
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Starting from</p>
            <p className="text-xl font-bold text-[#15ab8b]">
              ₹{pkg.price?.toLocaleString('en-IN') || '---'}
            </p>
            <p className="text-xs text-slate-500">per person</p>
          </div>
          {emiAmount > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> EMI from
              </p>
              <p className="text-sm font-bold text-[#0f8a6f]">
                ₹{emiAmount.toLocaleString('en-IN')}/mo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function PackageCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="flex justify-between pt-3 border-t border-slate-100">
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-6 bg-slate-200 rounded w-20" />
          </div>
          <div className="space-y-1 text-right">
            <div className="h-3 bg-slate-200 rounded w-12 ml-auto" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DestinationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search params from URL
  const destinationQuery = searchParams.get('destination') || '';
  const startDateParam = searchParams.get('startDate') || '';
  const adultsParam = searchParams.get('adults') || '2';
  const childrenParam = searchParams.get('children') || '0';
  const roomsParam = searchParams.get('rooms') || '1';

  // State
  const [packages, setPackages] = useState<FeaturedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(destinationQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(ITEMS_PER_PAGE));

      if (searchQuery) {
        params.set('q', searchQuery);
      }

      // Apply duration filter
      if (activeFilter === '2-4') {
        params.set('minDays', '2');
        params.set('maxDays', '4');
      } else if (activeFilter === '5-7') {
        params.set('minDays', '5');
        params.set('maxDays', '7');
      } else if (activeFilter === '8+') {
        params.set('minDays', '8');
      }

      // Apply sorting
      if (sortBy === 'price-low') {
        params.set('sort', 'price_asc');
      } else if (sortBy === 'price-high') {
        params.set('sort', 'price_desc');
      } else if (sortBy === 'duration-asc') {
        params.set('sort', 'days_asc');
      } else if (sortBy === 'duration-desc') {
        params.set('sort', 'days_desc');
      }

      const response = await fetch(`/api/packages/search?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.result) {
        setPackages(data.result.docs || []);
        setTotalPages(data.result.totalPages || 1);
        setTotalDocs(data.result.totalDocs || 0);
      } else {
        setPackages([]);
        setError(data.error || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeFilter, sortBy]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Handle package click
  const handlePackageClick = (packageId: string) => {
    const params = new URLSearchParams();
    if (startDateParam) params.set('startDate', startDateParam);
    params.set('noAdult', adultsParam);
    params.set('noChild', childrenParam);
    params.set('noRoomCount', roomsParam);

    router.push(`/package/${packageId}?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
      <Navbar />

      {/* Header */}
      <div className="bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {destinationQuery ? `Packages for ${destinationQuery}` : 'All Packages'}
              </h1>
              <p className="text-white/80">
                {totalDocs} packages found
                {startDateParam && ` • Starting ${new Date(startDateParam).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packages..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {FILTER_CATEGORIES.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => { setActiveFilter(filter.value); setPage(1); }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    activeFilter === filter.value
                      ? 'bg-[#15ab8b] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#15ab8b]/50"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-white shadow-sm text-[#15ab8b]' : 'text-slate-400'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' ? 'bg-white shadow-sm text-[#15ab8b]' : 'text-slate-400'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={fetchPackages}
              className="px-6 py-2 bg-[#15ab8b] text-white rounded-lg hover:bg-[#0f8a6f] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No packages found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); setPage(1); }}
              className="px-6 py-2 bg-[#15ab8b] text-white rounded-lg hover:bg-[#0f8a6f] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Package Grid */}
        {!loading && !error && packages.length > 0 && (
          <>
            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
            )}>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onClick={() => handlePackageClick(pkg.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
        <Loader2 className="w-8 h-8 animate-spin text-[#15ab8b]" />
      </div>
    }>
      <DestinationsContent />
    </Suspense>
  );
}

