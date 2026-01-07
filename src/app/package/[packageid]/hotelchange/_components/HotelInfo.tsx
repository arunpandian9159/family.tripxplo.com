"use client";
import React, { useMemo } from "react";
import HotelInfoList from "./HotelInfoList";
import { HotelMeal } from "@/app/types/pack";
import { useSelector } from "react-redux";
import { HotelChangeDataType } from "@/app/types/hotel";
import { SortType } from "./HotelDetail";

interface HotelInfoProps {
  hotelData: HotelChangeDataType[];
  searchQuery: string;
  sortBy: SortType;
}

const FilterCards = ({ hotelData, searchQuery, sortBy }: HotelInfoProps) => {
  const prevHotel = useSelector(
    (store: any) => store.hotelChange?.replaceHotel
  );

  // Filter and sort hotels
  const processedHotels = useMemo(() => {
    // First filter hotels that have valid rooms with meal plans
    let hotels = hotelData.filter((hotel) => {
      const selectedRoom = hotel.hotelRoom?.find(
        (data) => data?.mealPlan?.length > 0
      );
      return !!selectedRoom;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      hotels = hotels.filter((hotel) =>
        hotel.hotelName?.toLowerCase().includes(query) ||
        hotel.location?.state?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy) {
      hotels = [...hotels].sort((a, b) => {
        if (sortBy === "rating") {
          // Rating is stored in contract.additionalEmail (as seen in HotelInfoList.tsx line 167)
          const ratingA = parseFloat(a.contract?.additionalEmail || "0") || 0;
          const ratingB = parseFloat(b.contract?.additionalEmail || "0") || 0;
          return ratingB - ratingA; // High to low
        }

        if (sortBy === "price_low" || sortBy === "price_high") {
          // Get room price from first available room's meal plan
          const getPriceForHotel = (hotel: HotelChangeDataType) => {
            const room = hotel.hotelRoom?.find((r) => r?.mealPlan?.length > 0);
            if (!room) return 0;

            // Find matching meal plan or first available
            let mealPlan = room.mealPlan.find(
              (mp) => mp.mealPlan?.toLowerCase() === prevHotel?.mealPlan?.toLowerCase()
            );
            if (!mealPlan && room.mealPlan.length > 0) {
              mealPlan = room.mealPlan[0];
            }

            if (!mealPlan) return 0;

            // Calculate total price similar to HotelInfoList
            return (
              (mealPlan.totalAdultPrice || 0) +
              (mealPlan.gstAdultPrice || 0) +
              (mealPlan.totalChildPrice || 0) +
              (mealPlan.gstChildPrice || 0) +
              (mealPlan.totalExtraAdultPrice || 0) +
              (mealPlan.gstExtraAdultPrice || 0)
            );
          };

          const priceA = getPriceForHotel(a);
          const priceB = getPriceForHotel(b);

          return sortBy === "price_low" ? priceA - priceB : priceB - priceA;
        }

        return 0;
      });
    }

    return hotels;
  }, [hotelData, searchQuery, sortBy, prevHotel?.mealPlan]);

  if (processedHotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">🏨</span>
        </div>
        <h3 className="text-slate-600 font-semibold mb-1">No hotels found</h3>
        <p className="text-slate-400 text-sm text-center">
          {searchQuery ? "Try a different search term" : "No hotels available for this selection"}
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {processedHotels.map((hotel, index) => (
        <div key={hotel.hotelId || index}>
          <HotelInfoList
            hotel={hotel}
            startEndDate={`${prevHotel?.fullStartDate} - ${prevHotel?.fullEndDate}`}
            prevHotel={prevHotel}
          />
        </div>
      ))}
    </div>
  );
};

export default FilterCards;
