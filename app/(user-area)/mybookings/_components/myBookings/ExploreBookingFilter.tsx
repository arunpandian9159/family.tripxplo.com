"use client";
import BookingDetails from "./BookingDetails";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketX, ArrowRight, Compass } from "lucide-react";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { useBookingList } from "@/app/hooks/useBookingList";
import PackagesLoading from "@/app/(user-area)/components/loading/PackagesLoading";

const ExploreFilter = () => {
  const router = useRouter();
  const [offset, setOffset] = useState<number>(0);
  const { bookingList, isLoading, bookingListHasNext } = useBookingList(offset);

  const fetchMoreItems = () => {
    if (bookingListHasNext) {
      setOffset(offset + 10);
    }
  };

  const lastElementRef = useInfiniteScroll({
    hasMore: bookingListHasNext,
    onLoadMore: fetchMoreItems,
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="section-container py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-coral-500 to-coral-400 rounded-2xl shadow-lg shadow-coral-500/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                My Bookings
              </h1>
              <p className="text-slate-500 text-sm md:text-base mt-0.5">
                Manage your upcoming and past trips
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        <div className="space-y-6">
          {bookingList.length > 0
            ? bookingList.map((booking: any, index: number) => (
                <div
                  key={booking?.bookingId}
                  ref={index === bookingList.length - 1 ? lastElementRef : null}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BookingDetails pkg={booking} />
                </div>
              ))
            : !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                  <div className="p-6 bg-coral-50 rounded-full mb-6">
                    <TicketX size={48} className="text-coral-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-slate-500 max-w-sm mb-8">
                    Looks like you haven&apos;t booked any trips yet. Start
                    exploring amazing holiday packages!
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl hover:from-coral-600 hover:to-coral-500 transition-all shadow-md shadow-coral-500/20 hover:shadow-lg hover:shadow-coral-500/30 active:scale-[0.98] flex items-center gap-2"
                  >
                    Explore Packages
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

          {isLoading && <PackagesLoading />}
        </div>
      </div>
    </div>
  );
};

export default ExploreFilter;
