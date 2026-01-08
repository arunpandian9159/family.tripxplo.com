"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import {
  ArrowDown,
  Bed,
  Check,
  ChevronDown,
  ChevronUp,
  Coffee,
  Drumstick,
  Eye,
  Grid2x2,
  Pencil,
  Sandwich,
  Utensils,
  Sparkles,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { Wifi } from "lucide-react";
import Image from "next/image";
import {
  HotelChangeDataType,
  HotelMealType,
  HotelRoom,
} from "@/app/types/hotel";
import {
  changeRoom,
  changeRoomAndCalculatePrice,
} from "@/app/store/features/packageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/store/store";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import MealPlanSelector from "./MeanPlanDropdown";
import toast from "react-hot-toast";

// Price change notification component
const PriceChangeNotification = ({
  priceDiff,
  isVisible,
}: {
  priceDiff: number;
  isVisible: boolean;
}) => {
  if (!isVisible || priceDiff === 0) return null;

  const isSaving = priceDiff < 0;
  const amount = Math.abs(priceDiff);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
          isSaving
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
        }`}
      >
        {isSaving ? (
          <>
            <TrendingDown className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-bold text-lg">
                You saved ₹{amount.toLocaleString()}!
              </p>
              <p className="text-sm opacity-90">Great choice on this room</p>
            </div>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-bold text-lg">
                Upgraded! +₹{amount.toLocaleString()}
              </p>
              <p className="text-sm opacity-90">Enjoy the premium experience</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export type MealPlanKey = "cp" | "map" | "ap" | "ep";
export type MealType = "breakfast" | "lunch" | "dinner";

// Constants
const MEAL_PLANS: Record<MealPlanKey, string> = {
  cp: "Continental Plan (Breakfast)",
  map: "Modified American Plan (Breakfast + Dinner)",
  ap: "American Plan (All Meals)",
  ep: "European Plan (No Meals)",
};

const MEAL_PLAN_MAP: Record<MealPlanKey, MealType[]> = {
  cp: ["breakfast"],
  map: ["breakfast", "dinner"],
  ap: ["breakfast", "lunch", "dinner"],
  ep: [],
};

interface RoomDetailProps {
  room: HotelRoom;
}
const RoomDetail = ({ room }: { room: HotelRoom }) => {
  const [expand, setExpand] = useState(false);
  const [mealPlanPrice, setMealPlanPrice] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const packageId = useSelector((store: any) => store.package.data?.packageId);
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const prevHotel = useSelector(
    (store: any) => store.hotelChange?.replaceHotel
  );
  const router = useRouter();

  const selectRoom = async () => {
    setIsSelecting(true);
    setShowNotification(true);

    // Show notification for a moment before navigating
    await new Promise((resolve) => setTimeout(resolve, 1500));

    dispatch(
      changeRoomAndCalculatePrice({
        mealPlan: selectedMealPlan,
        hotelRoom: room,
        prevHotel: prevHotel,
      })
    );

    // Show toast and navigate without scrolling to top
    if (mealPlanPrice < 0) {
      toast.success(
        `Room changed! You saved ₹${Math.abs(mealPlanPrice).toLocaleString()}`
      );
    } else if (mealPlanPrice > 0) {
      toast.success(`Room upgraded! +₹${mealPlanPrice.toLocaleString()}`);
    } else {
      toast.success("Room changed successfully!");
    }

    router.push("/package/" + packageId, { scroll: false });
  };

  const [selectedMealPlan, setSelectedMealPlan] = useState<HotelMealType>(
    {} as HotelMealType
  );
  useEffect(() => {
    // const selectedmp = room?.mealPlan.find((data)=> prevHotel?.mealPlan?.includes(data.mealPlan));
    // console.log("selectedmp", selectedmp);
    const prevHotelMp = room.mealPlan?.find((data) =>
      prevHotel?.mealPlan?.includes(data.mealPlan)
    );

    if (prevHotelMp !== undefined) {
      setSelectedMealPlan(prevHotelMp);
    } else {
      setSelectedMealPlan(room?.mealPlan[0] as HotelMealType);
    }
    // if(selectedmp === undefined) {
    //   setSelectedMealPlan(room?.mealPlan[0] as HotelMealType);
    //   return;
    // }
  }, []);

  const isMealIncluded = (mealPlan: MealPlanKey, meal: MealType): boolean => {
    return MEAL_PLAN_MAP[mealPlan]?.includes(meal) || false;
  };

  const getMealStyle = (meal: "breakfast" | "lunch" | "dinner") => {
    const isIncluded = selectedMealPlan?.mealPlan
      ? isMealIncluded(selectedMealPlan.mealPlan, meal)
      : false;

    return {
      container: {
        borderColor: isIncluded ? "#FF9080" : "#e5e7eb",
      },
      icon: {
        color: isIncluded ? "#FF9080" : "#6b7280",
      },
      text: {
        color: isIncluded ? "#FF9080" : "#6b7280",
      },
    };
  };

  useEffect(() => {
    if (selectedMealPlan.mealPlan) {
      // Use null-safe operators to prevent NaN from undefined values
      const prevPrice =
        (prevHotel?.totalAdultPrice || 0) +
        (prevHotel?.gstAdultPrice || 0) +
        (prevHotel?.totalChildPrice || 0) +
        (prevHotel?.gstChildPrice || 0) +
        (prevHotel?.gstExtraAdultPrice || 0) +
        (prevHotel?.totalExtraAdultPrice || 0);

      const currentMeal = selectedMealPlan;
      const currentPrice =
        (currentMeal?.totalAdultPrice || 0) +
        (currentMeal?.gstAdultPrice || 0) +
        (currentMeal?.totalChildPrice || 0) +
        (currentMeal?.gstChildPrice || 0) +
        (currentMeal?.gstExtraAdultPrice || 0) +
        (currentMeal?.totalExtraAdultPrice || 0);

      // console.log('[RoomDetail] Price calculation:', { selectedMealPlan, currentPrice, prevPrice, diff: currentPrice - prevPrice });
      setMealPlanPrice(currentPrice - prevPrice);
    }
  }, [selectedMealPlan, prevHotel]);

  return (
    <>
      {/* Price Change Notification */}
      <PriceChangeNotification
        priceDiff={mealPlanPrice}
        isVisible={showNotification}
      />

      <div
        className={`w-full lg:w-[420px] flex-shrink-0 h-[${
          expand ? "370px" : "h-[120px"
        }] mb-[30px] rounded-[14px] bg-[#FFF] border-[2px] border-solid border-[#4BCDA1]`}
        style={{ boxShadow: "4px 8px 25.8px 0px rgba(51, 214, 159, 0.11)" }}
      >
        <div className="flex flex-col  relative p-2 ">
          <div className="flex px-2 ">
            <section className=" flex flex-col w-full gap-2">
              <p
                className="text-[11px] sm:text-[18px] flex-wrap w-full lg:text-[18px] text-[#6A778B] flex font-medium my-4"
                // style={{ whiteSpace: "nowrap" }}
              >
                {room.hotelRoomType}
              </p>

              {/* wifi */}
              <div className="flex w-full items-center mb-3 justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex flex-nowrap text-[#27B182] items-center  sm:gap-2">
                    <Check size={12} className="stroke-2" />
                    <span
                      style={{ whiteSpace: "nowrap" }}
                      className="text-[8px] flex flex-nowrap sm:text-xs"
                    >
                      Wifi Facility
                    </span>
                  </div>
                  <div className="flex flex-nowrap text-[#27B182] items-center sm:gap-2">
                    <Check size={12} className="stroke-2" />
                    <span
                      style={{ whiteSpace: "nowrap" }}
                      className="text-[8px] sm:text-xs"
                    >
                      Pool
                    </span>
                  </div>
                </div>
                <div className="flex ml-auto  items-center ">
                  <div className="flex items-center ml-2">
                    {mealPlanPrice !== 0 && (
                      <>
                        {mealPlanPrice > 0 && (
                          <Image
                            src="/Plus.svg"
                            height={7}
                            width={7}
                            alt="plus"
                            className="mx-1"
                          />
                        )}
                        <p
                          className={`font-montserrat text-[9px] sm:text-[12px] lg:text-[15px] sm:font-semibold ${
                            mealPlanPrice < 0
                              ? "text-emerald-600"
                              : "bg-clip-text text-transparent"
                          }`}
                          style={
                            mealPlanPrice >= 0
                              ? {
                                  backgroundImage:
                                    "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
                                }
                              : undefined
                          }
                        >
                          {mealPlanPrice < 0
                            ? `−₹${Math.abs(mealPlanPrice).toLocaleString()}`
                            : `+₹${mealPlanPrice.toLocaleString()}`}
                        </p>
                      </>
                    )}
                    {mealPlanPrice === 0 && (
                      <p className="font-montserrat text-[9px] sm:text-[12px] lg:text-[15px] sm:font-semibold text-slate-500">
                        No change
                      </p>
                    )}
                  </div>
                  {prevHotel.hotelId === room?.hotelId &&
                  prevHotel.hotelRoomId === room?.hotelRoomId &&
                  prevHotel.mealPlan === selectedMealPlan?.mealPlan ? (
                    <div
                      style={{
                        boxShadow:
                          " 2.713px 5.425px 20.479px 0px rgba(101, 255, 181, 0.49)",
                        backgroundColor:
                          " linear-gradient(90deg, #27B182 -5.26%, #31DAA1 99.73%)",
                      }}
                      className=" bg-[#4BCDA1] ml-[10px] md:ml-[20px] flex items-center md:px-4 px-2 gap-1 cursor-pointer py-2 rounded-[11px]  leading-normal tracking-[0.1px] text-white  "
                    >
                      {" "}
                      <Check size={14} className="stroke-2" />
                      <p className="text-[9px] lg:text-[13px]">Selected</p>
                    </div>
                  ) : (
                    <>
                      {!(
                        prevHotel.hotelId === room?.hotelId &&
                        prevHotel.hotelRoomId === room?.hotelRoomId &&
                        prevHotel.mealPlan === selectedMealPlan?.mealPlan
                      ) && (
                        <button
                          onClick={selectRoom}
                          className=" ml-[5x] sm:ml-[20px] flex items-center sm:px-4  cursor-pointer sm:py-2  rounded-[11px]   text-[#27B182] text-[9px] sm:text-[11px] font-medium leading-normal tracking-[0.1px] "
                          style={{
                            border:
                              " 1.356px solid var(--green-gradient, #27B182)",
                            // boxShadow:
                            // " 2.713px 5.425px 20.479px 0px rgba(101, 255, 181, 0.49)",

                            // box-shadow: 2.713px 5.425px 20.479px 0px rgba(101, 255, 181, 0.49);
                            // backgroundImage:
                            //   "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                          }}
                        >
                          Select
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
            {/* <section className="flex mt-[18px] ml-[20px] ">
              <div className="mt-[2px] flex flex-col w-[56px] items-center content-center gap-[4px]">
                <span>
                  <Image src="/Wifi.svg" alt="Wifi" width={14} height={13} />
                </span>
                <span className="text-[#6A778B] font-Poppins text-[5px] font-normal not-italic leading-normal tracking-[0.05px]">
                  Wifi Facility
                </span>
              </div>
              <div className="mt-[4px] flex flex-col w-[56px] items-center content-center gap-[4px]">
                <span>
                  <Image
                    src="/Laundry.svg"
                    alt="Laundry"
                    width={14}
                    height={13}
                  />
                </span>
                <span className="text-[#6A778B] font-Poppins text-[5px] font-normal not-italic leading-normal tracking-[0.05px]">
                  Laundry
                </span>
              </div>
            </section> */}
          </div>
          <hr
            className=" w-full my-2 stroke"
            style={{ stroke: "rgba(0, 0, 0, 0.08)" }}
          />
          {/* Room Features */}
          <div className="bg-gray-50 rounded-xl p-4 border mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 text-gray-500">
                  {" "}
                  <Bed />
                </div>
                <span className="text-[11px] md:text-sm text-gray-600">
                  Double Bed
                </span>
              </div>
              <div className="flex flex-col items-center justify-center  gap-2 border-l border-r ">
                <div className="w-6 h-6 text-gray-500">
                  <Eye />
                </div>
                <span className="text-[11px] md:text-sm flex flex-nowrap text-gray-600">
                  Garden View
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 text-gray-500">
                  <Grid2x2 />
                </div>
                <span className="text-[11px] md:text-xs  text-gray-600">
                  224 Sq.ft
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-[10px] overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {/* Meal Plan Section - Increased size for large screens */}
          <div className="flex items-center pb-2">
            <h1
              className="my-[15px] ml-[19px] font-Poppins text-[16px] lg:text-[16px] font-semibold tracking-[0.1px] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              }}
            >
              Meal Plan:
            </h1>

            <MealPlanSelector
              selectedMealPlan={selectedMealPlan}
              mealPlans={room.mealPlan}
              onSelect={setSelectedMealPlan}
            />
          </div>
          <div className="flex items-center ml-[23px] mt-[5px]">
            <div className="grid grid-cols-3 gap-4">
              {/* Breakfast */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors duration-200"
                  style={getMealStyle("breakfast").container}
                >
                  <Coffee style={getMealStyle("breakfast").icon} />
                </div>
                <span
                  className="text-[10px] sm:text-sm transition-colors duration-200"
                  style={getMealStyle("breakfast").text}
                >
                  Breakfast
                </span>
              </div>

              {/* Lunch */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors duration-200"
                  style={getMealStyle("lunch").container}
                >
                  {/* <Utensils style={getMealStyle("lunch").icon} /> */}
                  {/* <Sandwich style={getMealStyle("lunch").icon} /> */}
                  <Image
                    src="/LunchMeal.svg"
                    alt="lunch_image"
                    width={20}
                    height={20}
                    style={getMealStyle("lunch").icon}
                  />
                </div>
                <span
                  className="text-[10px] sm:text-sm transition-colors duration-200"
                  style={getMealStyle("lunch").text}
                >
                  Lunch
                </span>
              </div>

              {/* Dinner */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors duration-200"
                  style={getMealStyle("dinner").container}
                >
                  {/* <Drumstick style={getMealStyle("dinner").icon} /> */}
                  <Image
                    src="/Dinner.svg"
                    alt="dinner_image"
                    height={40}
                    width={30}
                    style={getMealStyle("dinner").icon}
                  />
                </div>
                <span
                  className="text-[10px] sm:text-sm transition-colors duration-200"
                  style={getMealStyle("dinner").text}
                >
                  Dinner
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Section - Increased size for large screens */}
          <h1
            className="mt-[18px] ml-[19px] font-Poppins text-[13px] lg:text-[16px] font-semibold tracking-[0.1px] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
            }}
          >
            Amenities
          </h1>
          <section className="grid grid-cols-3 gap-[17px] lg:gap-[20px] ml-[24px] mt-[5px] mb-[10px]">
            {room?.amenitiesDetails?.map((data, index) => (
              <div className="flex items-center gap-2" key={data.amenitiesId}>
                <Image
                  src={NEXT_PUBLIC_IMAGE_URL + data.image}
                  alt={data.name}
                  width={10}
                  height={10}
                  className="w-[10px] h-[10px] lg:w-[14px] lg:h-[14px] stroke-[5px] stroke-[#1EC089]"
                />
                <span className="text-[#6A778B] flex flex-nowrap font-Poppins text-[9px] lg:text-[14px] font-normal tracking-[0.09px]">
                  {data.name}
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default RoomDetail;
