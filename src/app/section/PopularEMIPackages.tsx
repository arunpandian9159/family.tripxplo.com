'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ChevronLeft, ChevronRight, Sparkles, CreditCard } from 'lucide-react';
import { formatIndianNumber } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { initializePackage } from '@/app/store/features/packageSlice';

interface FeaturedPackage {
  packageId: string;
  packageName: string;
  packageImg?: string;
  noOfDays: number;
  noOfNight: number;
  perPerson?: number;
  startFrom?: number;
  finalPackagePrice?: number;
  totalPackagePrice?: number;
  destination?: {
    destinationId: string;
    destinationName?: string;
    noOfNight?: number;
  }[];
  offer?: {
    offerPer?: number;
  };
  status: boolean;
}

const PopularEMIPackages = () => {
  const [packages, setPackages] = useState<FeaturedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `/api/v1/packages?limit=10&noAdult=2&noChild=2&noRoomCount=1&startDate=${today}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (data.success && data.result?.docs) {
            console.log('Packages data:', data.result.docs);
            console.log('Packages count:', data.result.docs.length);
            setPackages(data.result.docs || []);
          }
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [packages]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getImageUrl = (img?: string) => {
    if (!img) return '/home.png';
    return img.startsWith('http') ? img : `https://tripxplo.com${img}`;
  };

  // Calculate EMI (12 months, 0% interest for display)
  const calculateEMI = (price: number) => Math.round(price / 12);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="shrink-0 w-[280px] h-[360px] bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No packages available. Check console for API response.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>

      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {packages.map(pkg => {
          // Calculate correct display price
          const displayPrice = pkg.perPerson || pkg.startFrom || pkg.finalPackagePrice || 0;
          const emiPrice = calculateEMI(displayPrice);

          return (
            <Link
              key={pkg.packageId}
              href={`/package/${pkg.packageId}`}
              onClick={() => dispatch(initializePackage())}
              className="shrink-0 group"
            >
              <div className="w-[280px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                {/* Image */}
                <div className="relative h-[180px] overflow-hidden">
                  <Image
                    src={getImageUrl(pkg.packageImg)}
                    alt={pkg.packageName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 280px, 320px"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {pkg.noOfNight}N / {pkg.noOfDays}D
                    </div>
                  </div>

                  {/* Offer Badge */}
                  {pkg.offer?.offerPer && pkg.offer.offerPer > 0 && (
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 rounded-full text-white text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        {pkg.offer.offerPer}% OFF
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Package Name */}
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2 min-h-10 transition-colors">
                    {pkg.packageName}
                  </h3>

                  {/* Destinations */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin className="w-4 h-4 text-[#15ab8b] shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {pkg.destination?.slice(0, 2).map((dest, i) => (
                        <span
                          key={dest.destinationId || i}
                          className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-full"
                        >
                          {dest.destinationName}
                        </span>
                      ))}
                      {pkg.destination && pkg.destination.length > 2 && (
                        <span className="text-xs text-slate-400">
                          +{pkg.destination.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & EMI */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        {displayPrice > 0 ? (
                          <>
                            <span className="text-xl font-bold text-slate-900">
                              ₹{formatIndianNumber(displayPrice)}
                            </span>
                            <span className="text-xs text-slate-500">/person</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-[#15ab8b]">View Details</span>
                        )}
                      </div>
                      {/* EMI Display */}
                      {displayPrice > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <CreditCard className="w-3 h-3 text-[#15ab8b]" />
                          <span className="text-xs font-semibold text-[#15ab8b]">
                            EMI ₹{formatIndianNumber(emiPrice)}/mo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-3 py-1.5 bg-[#d1fbd2] text-[#15ab8b] text-xs font-semibold rounded-lg group-hover:bg-[#15ab8b] group-hover:text-white transition-colors">
                      View
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularEMIPackages;
