'use client';
import React, { useEffect, useState } from 'react';

import {
  School,
  CalendarDays,
  Soup,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { FaIndianRupeeSign, FaLocationDot } from 'react-icons/fa6';
import Image from 'next/image';
import { HotelMeal } from '@/app/types/pack';
import { NEXT_PUBLIC_IMAGE_URL } from '@/app/utils/constants/apiUrls';
import { HotelChangeDataType, HotelMealType, HotelRoom } from '@/app/types/hotel';
import { useDispatch } from 'react-redux';
import { changeHotel, changeHotelAndCalculatePrice } from '@/app/store/features/packageSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setHotelData } from '@/app/store/features/hotelChangeSlice';
import { AppDispatch } from '@/app/store/store';
import { GiRoundStar } from 'react-icons/gi';
import toast from 'react-hot-toast';

const FilterCardList = ({
  hotel,
  startEndDate,
  prevHotel,
}: {
  hotel: HotelChangeDataType;
  startEndDate: string;
  prevHotel: HotelMeal;
}) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>();
  const [selectedMealPlan, setSelectedMealPlan] = useState<HotelMealType>();
  const [mealPlanPrice, setMealPlanPrice] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const mealPlans = {
    cp: 'Breakfast Included',
    map: 'Breakfast & Dinner',
    ap: 'All Meals Included',
    ep: 'Rooms Only',
    CP: 'Breakfast Included',
    MAP: 'Breakfast & Dinner',
    AP: 'All Meals Included',
    EP: 'Rooms Only',
  };
  const router = useRouter();

  async function selectHotel() {
    setIsSelecting(true);

    dispatch(
      changeHotelAndCalculatePrice({
        mealPlan: selectedMealPlan as HotelMealType,
        hotelRoom: selectedRoom as HotelRoom,
        hotel: hotel,
        prevHotel: prevHotel,
      })
    );

    // Show toast with price difference
    if (mealPlanPrice < 0) {
      toast.success(`Hotel changed! You saved ₹${Math.abs(mealPlanPrice).toLocaleString()}`);
    } else if (mealPlanPrice > 0) {
      toast.success(`Hotel upgraded! +₹${mealPlanPrice.toLocaleString()}`);
    } else {
      toast.success('Hotel changed successfully!');
    }

    // Small delay to show toast before navigating
    await new Promise(resolve => setTimeout(resolve, 300));
    router.back();
  }

  function changeRoom() {
    dispatch(setHotelData(hotel));
    router.push('hotelchange/roomchange', { scroll: false });
  }
  const [reject, setReject] = useState(false);
  useEffect(() => {
    const foundRoom = hotel.hotelRoom?.find(data => data?.mealPlan?.length > 0);
    setSelectedRoom(foundRoom);
    if (foundRoom === undefined) {
      setReject(true);
      return;
    }
    let selectedmp = foundRoom?.mealPlan.find(
      data => prevHotel?.mealPlan?.toLowerCase() === data.mealPlan.toLowerCase()
    );

    if (!selectedmp && foundRoom?.mealPlan && foundRoom.mealPlan.length > 0) {
      selectedmp = foundRoom.mealPlan[0];
    }

    setSelectedMealPlan(selectedmp);
    if (selectedmp === undefined) {
      setReject(true);
      return;
    }
    /**
     *   "totalAdultPrice": 10500,
          "gstAdultPrice": 0,
          "totalChildPrice": 100,
          "gstChildPrice": 0,
          "totalExtraAdultPrice": 0,
          "gstExtraAdultPrice": 0
     */
    const prevPrice =
      prevHotel?.totalAdultPrice +
      prevHotel?.gstAdultPrice +
      prevHotel?.totalChildPrice +
      prevHotel?.gstChildPrice +
      prevHotel?.gstExtraAdultPrice +
      prevHotel?.totalExtraAdultPrice;

    const currentMeal = selectedmp;
    let currentPrice =
      currentMeal?.totalAdultPrice +
      currentMeal?.gstAdultPrice +
      currentMeal?.totalChildPrice +
      currentMeal?.gstChildPrice +
      currentMeal?.gstExtraAdultPrice +
      currentMeal?.totalExtraAdultPrice;

    // currentPrice = prevHotel.noOfNight * currentPrice;
    setMealPlanPrice(currentPrice - prevPrice);
  }, [hotel]);

  if (reject) return null;

  // Check if this is the currently selected hotel
  const isCurrentlySelected =
    prevHotel.hotelId === hotel?.hotelId &&
    prevHotel.hotelRoomId === selectedRoom?.hotelRoomId &&
    prevHotel.mealPlan === selectedMealPlan?.mealPlan;

  return (
    <div
      className={`flex flex-col h-auto w-full lg:w-[320px] xl:w-[350px] rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isCurrentlySelected
          ? 'border-2 border-emerald-400 ring-2 ring-emerald-100'
          : 'border border-slate-100'
      }`}
    >
      {/* Image Section */}
      <div className="h-[160px] w-full relative bg-slate-200">
        <img
          src={NEXT_PUBLIC_IMAGE_URL + hotel?.image}
          alt={hotel?.hotelName}
          className="absolute z-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Location badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-slate-700">
          <FaLocationDot size={10} className="text-emerald-500" />
          {hotel?.location?.state}
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-700">
            {hotel?.contract?.additionalEmail}
          </span>
        </div>

        {/* Selected badge */}
        {isCurrentlySelected && (
          <div className="absolute bottom-3 left-3 bg-emerald-500 flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg">
            <Check size={12} />
            Selected
          </div>
        )}

        {/* Hotel name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-base leading-tight drop-shadow-lg line-clamp-2">
            {hotel?.hotelName}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Room Type */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <School size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 mb-0.5">
              {selectedRoom?.hotelRoomType && selectedRoom.hotelRoomType}
            </p>
          </div>
        </div>

        {/* Meal Plan */}
        <div className="flex items-center gap-2 mb-3">
          <Soup size={14} className="text-emerald-500" />
          <span className="text-sm font-medium text-emerald-600">
            {selectedMealPlan?.mealPlan && mealPlans[selectedMealPlan.mealPlan]}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500">{startEndDate}</span>
        </div>

        {/* View Points */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel?.viewPoint?.slice(0, 2).map((view, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md border border-emerald-100"
            >
              {view}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-2" />

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Change Room Link - smaller on desktop */}
          <button
            onClick={changeRoom}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-[11px] lg:text-xs font-medium transition-colors hover:underline"
          >
            Change Room
            <ArrowRight size={10} />
          </button>

          {/* Price - Shows "No Change" when price difference is 0 */}
          <div className="flex items-center gap-0.5">
            {mealPlanPrice !== 0 ? (
              <>
                <span
                  className={`text-xs font-medium ${
                    mealPlanPrice > 0 ? 'text-emerald-500' : 'text-emerald-500'
                  }`}
                >
                  {mealPlanPrice > 0 ? '+' : '-'}
                </span>
                <FaIndianRupeeSign
                  size={11}
                  className={mealPlanPrice > 0 ? 'text-emerald-500' : 'text-emerald-500'}
                />
                <span
                  className={`text-sm font-bold ${
                    mealPlanPrice > 0 ? 'text-emerald-500' : 'text-emerald-500'
                  }`}
                >
                  {Math.abs(Math.ceil(mealPlanPrice))}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400 font-medium">No Change</span>
            )}
          </div>

          {/* Select Button - Shows "Selected" with checkmark for current selection */}
          {isCurrentlySelected ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-md">
              <Check size={12} />
              Selected
            </div>
          ) : (
            <button
              onClick={selectHotel}
              disabled={isSelecting}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCardList;
