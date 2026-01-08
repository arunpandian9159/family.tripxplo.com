"use client";
import React, { useEffect, useState } from "react";
import "../../../../../globals.css";

import {
  School,
  CalendarDays,
  Soup,
  ArrowRight,
  Check,
  Star,
  RockingChair,
  Luggage,
} from "lucide-react";
import { FaIndianRupeeSign, FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { HotelMeal } from "@/app/types/pack";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  HotelChangeDataType,
  HotelMealType,
  HotelRoom,
} from "@/app/types/hotel";
import { useDispatch } from "react-redux";
import {
  changeHotel,
  changeHotelAndCalculatePrice,
  changeVehicleAndCalculatePrice,
} from "@/app/store/features/packageSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setHotelData } from "@/app/store/features/hotelChangeSlice";
import { AppDispatch } from "@/app/store/store";
import { GiRoundStar } from "react-icons/gi";
import { VehicleDetail, VehicleDetails } from "@/app/types/vehicle";

const CabInfoList = ({
  cab,
  prevCab,
}: {
  cab: VehicleDetail;
  prevCab: VehicleDetail;
}) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>();
  const [selected, setSelected] = useState(true);
  const [selectedMealPlan, setSelectedMealPlan] = useState<HotelMealType>();
  const [cabPlanPrice, setCabPlanPrice] = useState(0);
  const mealPlans = {
    cp: "Breakfast Included",
    map: "Breakfast & Dinner",
    ap: "All Meals Included",
    ep: "Rooms Only",
    CP: "Breakfast Included",
    MAP: "Breakfast & Dinner",
    AP: "All Meals Included",
    EP: "Rooms Only",
  };
  function onSelect() {}
  const router = useRouter();
  function selectCab() {
    /**
        mealPlan: HotelMealType;
        hotelRoom: HotelRoom;
        hotel: HotelChangeDataType;
        prevHotel: HotelMeal;
    */
    dispatch(
      changeVehicleAndCalculatePrice({
        prevVehicle: prevCab,
        newVehicle: cab,
      })
    );
    router.back();
  }

  const [reject, setReject] = useState(false);
  useEffect(() => {
    // Use price field from vehicle - ensure we have valid numbers
    const cabPrice = cab?.price || 0;
    const prevCabPrice = prevCab?.price || 0;
    setCabPlanPrice(cabPrice - prevCabPrice);
  }, [cab, prevCab]);

  if (reject) return;
  return (
    <div className=" rounded-3xl border-2 border-emerald-100 bg-white p-4 max-w-[457px] min-h-[280px] sm:min-h-[315px]  my-2">
      <div className="h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-[1px] border-changeHotelLine p-2 sm:p-4 flex-1">
          <div className="lg:flex-1 lg:w-1/2">
            <img
              src={NEXT_PUBLIC_IMAGE_URL + cab?.image}
              alt={cab?.vehicleName}
              className="w-[140px] lg:w-[160px] h-[54px]"
            />
          </div>
          {/* Details Container */}
          <div className="w-full sm:w-1/2 space-y-4">
            <div>
              <h2 className="text-gray-600 text-base sm:text-lg font-semibold mb-1">
                {cab?.vehicleName}
              </h2>
              <p className="text-emerald-500 text-sm sm:text-base">
                {cab.vehicleCompany}
              </p>
            </div>

            <div>
              <p className="text-[#1EC089] mb-2 sm:mb-4 text-[11px] sm:text-[12px] line-clamp-2">
                {cab?.transferInfo
                  ?.join("")
                  ?.replace("Sightseeing", "Sightseeing, ")}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <RockingChair className="text-[#1EC089] text-xs" />
                  <span className="text-gray-600 text-xs">
                    {cab.seater} Seater
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Luggage className="text-[#1EC089] text-xs" />
                  <span className="text-gray-600 text-xs">
                    {cab.luggage} Luggage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Price and Select button */}
        <div className="flex justify-end items-center gap-2 mt-4">
          {/* {price && ( */}
          <p className="text-emerald-500 text-lg font-semibold">
            {cabPlanPrice >= 0
              ? `+ ₹${cabPlanPrice}`
              : `- ₹${Math.abs(cabPlanPrice)}`}
          </p>
          {/* )} */}
          {prevCab.vehicleId === cab?.vehicleId ? (
            <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2 rounded-full">
              <Check size={16} />
              <span>Selected</span>
            </div>
          ) : (
            <button
              onClick={selectCab}
              className="px-8 py-2 rounded-full border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabInfoList;
