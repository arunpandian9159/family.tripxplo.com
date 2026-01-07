"use client";
import React, { useState } from "react";
import FilterHotel from "./FilterHotel";
import HotelInfo from "./HotelInfo";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAvailableHotels } from "@/app/hooks/useAvailableHotels";
import { useSelector } from "react-redux";
import PackagesLoadingFull from "@/app/(user-area)/components/loading/PackagesLoadingFull";

export type SortType = "rating" | "price_low" | "price_high" | null;

const HotelDetail = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>(null);

  function clickBack() {
    router.back();
  }

  const packageId = useSelector((store: any) => store.package.data?.packageId);
  const destinationId = useSelector(
    (store: any) => store.changeHotel?.replaceHotel?.location?.destinationId
  );
  const loading = useSelector((store: any) => store.package.isLoading);
  const hotelChange = useAvailableHotels(packageId, destinationId);

  return (
    <div className="">
      <section className="">
        <div
          className="fixed top-0 text-center flex items-center justify-between w-full h-auto py-4 lg:py-6 bg-white z-10 px-4 lg:px-6"
          style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
        >
          <button
            onClick={clickBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <h1
            className="text-lg lg:text-xl font-bold"
            style={{
              backgroundImage:
                "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Change Hotel
          </h1>

          <button
            onClick={clickBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </section>

      {hotelChange?.isLoading || loading ? (
        <PackagesLoadingFull />
      ) : (
        <div className="pt-24 lg:pt-28 pb-6">
          <FilterHotel
            hotelCount={hotelChange?.hotel?.length || 0}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <HotelInfo
            hotelData={hotelChange?.hotel || []}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
