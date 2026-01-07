'use client';

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Grid, List, Package, ArrowLeft, Loader2 } from 'lucide-react';
import type { FeaturedPackage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SkeletonPackageCard } from '@/components/ui/skeleton';
import ExploreFilter from './_components/ExploreFilter';
import FilterCardList from './_components/FilterCardList';
import Navbar from '@/app/components/Navbar';
import { useSearch } from '@/context/SearchContext';

// Destination image mapping
const destinationImages: Record<string, string> = {
  bali: '/bali.jpg',
  goa: '/goa.jpg',
  manali: '/manali.jpg',
  ooty: '/ooty.jpg',
  meghalaya: '/meghalaya.jpg',
  kashmir: '/kashmir.jpg',
};

const ITEMS_PER_PAGE = 10;

function DestinationsContent() {
  const router = useRouter();
  const { searchParams } = useSearch();

  // State
  const [packages, setPackages] = useState<FeaturedPackage[]>([]);
  const [allPackages, setAllPackages] = useState<FeaturedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [offset, setOffset] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);

  // Calculate pages
  const totalPages = Math.ceil(totalDocs / ITEMS_PER_PAGE);
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  // Get destination cover image
  const coverImage = searchParams.destinationName
    ? destinationImages[searchParams.destinationName.toLowerCase()] || null
    : null;

  // Build tripxplo.com compatible API URL
  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Tripxplo.com compatible params
    if (searchParams.destinationId) {
      params.set('destinationId', searchParams.destinationId);
    }
    if (searchParams.interestId) {
      params.set('interestId', searchParams.interestId);
    }
    params.set('perRoom', String(searchParams.perRoom || 2));
    if (searchParams.startDate) {
      params.set('startDate', searchParams.startDate);
    }
    params.set('noAdult', String(searchParams.noAdult || 2));
    params.set('noChild', String(searchParams.noChild || 0));
    params.set('noRoomCount', String(searchParams.noRoomCount || 1));
    params.set('noExtraAdult', String(searchParams.noExtraAdult || 0));
    params.set('limit', String(ITEMS_PER_PAGE));
    params.set('offset', String(offset));
    params.set('priceOrder', String(searchParams.priceOrder || 1));

    return `/api/v1/packages?${params.toString()}`;
  }, [searchParams, offset]);

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = buildApiUrl();
      console.log('Fetching packages with URL:', apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const fetchedPackages = data.result.docs || [];
        setPackages(fetchedPackages);
        setAllPackages(fetchedPackages);
        setTotalDocs(data.result.totalDocs || 0);
      } else {
        setPackages([]);
        setAllPackages([]);
        setError(data.error || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again.');
      setPackages([]);
      setAllPackages([]);
    } finally {
      setLoading(false);
    }
  }, [buildApiUrl]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Filter packages based on active filter
  const filteredPackages = useMemo(() => {
    let result = [...allPackages];

    switch (activeFilter) {
      case '2-4':
        result = result.filter(pkg => pkg.noOfNights >= 2 && pkg.noOfNights <= 4);
        break;
      case '5-7':
        result = result.filter(pkg => pkg.noOfNights >= 5 && pkg.noOfNights <= 7);
        break;
      case 'platinum':
        result = result.filter(pkg => pkg.planName?.toLowerCase() === 'platinum');
        break;
      case 'gold':
        result = result.filter(pkg => pkg.planName?.toLowerCase() === 'gold');
        break;
      case 'silver':
        result = result.filter(pkg => pkg.planName?.toLowerCase() === 'silver');
        break;
      case 'price-asc':
        result = result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result = result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allPackages, activeFilter]);

  // Handle package click - navigate to /package/PACKAGE_ID (like tripxplo.com)
  const handlePackageClick = (packageId: string) => {
    // Navigate to package detail page like tripxplo.com: /package/PACKAGE_ID
    router.push(`/package/${packageId}`);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Handle pagination
  const handlePrevPage = () => {
    setOffset(prev => Math.max(0, prev - ITEMS_PER_PAGE));
  };

  const handleNextPage = () => {
    setOffset(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <Navbar staticMode />

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
              alt={searchParams.destinationName || 'Destination'}
              fill
              sizes="100vw"
              className="object-cover animate-ken-burns"
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
        )}

        {/* Fallback gradient if no image */}
        {!coverImage && (
          <div className="absolute inset-0 bg-linear-to-br from-[#15ab8b] via-[#0f8a6f] to-slate-900" />
        )}

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                {searchParams.destinationName && (
                  <Badge variant="emerald" size="lg">
                    <MapPin className="w-3 h-3 mr-1" />
                    {searchParams.destinationName}
                  </Badge>
                )}
                {searchParams.interestName && (
                  <Badge variant="outline" size="lg">
                    {searchParams.interestName}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {searchParams.destinationName
                  ? `Explore ${searchParams.destinationName}`
                  : 'All Packages'}
              </h1>
              <p className="text-slate-200 text-lg drop-shadow-md">
                {filteredPackages?.length || 0} handcrafted packages available
              </p>
              {searchParams.startDate && (
                <p className="text-slate-300 text-sm mt-1">
                  Starting from{' '}
                  {new Date(searchParams.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  • {searchParams.noAdult} Adults, {searchParams.noChild} Children
                </p>
              )}
            </div>

            {/* View Toggle (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode !== 'grid' ? 'text-white hover:bg-white/10' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode !== 'list' ? 'text-white hover:bg-white/10' : ''}
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
            <ExploreFilter
              allPackages={allPackages}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Package Grid */}
        {filteredPackages?.length > 0 ? (
          <div
            className={`
            grid gap-6 animate-fade-in
            ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }
          `}
          >
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="h-full cursor-pointer animate-slide-up"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                <FilterCardList
                  package={pkg}
                  viewMode={viewMode}
                  onClick={() => handlePackageClick(pkg.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-[#15ab8b]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                We&apos;ll update the package details shortly ✈️
              </h3>
              <p className="text-slate-600 max-w-md mb-6 text-lg">
                Please fill out the form below, and we&apos;ll send a quote.
              </p>
              <a
                href="https://crm.tripxplo.com/travel-inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-semibold rounded-xl hover:from-[#0f8a6f] hover:to-[#15ab8b] transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
              >
                Fill Travel Inquiry Form
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
              <p className="text-slate-500 text-sm mt-6">~ Team, Family TripXplo ✅</p>
            </div>
          )
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <SkeletonPackageCard key={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={offset + ITEMS_PER_PAGE >= totalDocs}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#15ab8b]" />
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
