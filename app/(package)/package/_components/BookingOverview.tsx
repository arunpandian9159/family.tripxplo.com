import React from "react";
import { Baby, BedSingle, Sofa, UserRound, Utensils } from "lucide-react";
import { HotelMeal, Vehicle } from "@/app/types/pack";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";

interface PropsType {
  startsFrom: string;
  theme: string;
  endsOn: string;
  adults: number;
  child: number;
  room: number;
  packageName: string;
  hotel: HotelMeal[];
  vehicle: Vehicle[];
}

const mealPlans = {
  CP: "BreakFast ",
  MAP: "Breakfast & Dinner",
  AP: "All Meals",
  EP: "Room Only",
  cp: "BreakFast ",
  map: "Breakfast & Dinner",
  ap: "All Meals",
  ep: "Room Only",
} as { [key: string]: string };

function getMealPlan(mealPlan: string) {
  return mealPlans[mealPlan] || "Room Only";
}

export const BookingOverview = ({
  startsFrom,
  endsOn,
  adults,
  child,
  theme,
  packageName,
  hotel,
  vehicle,
}: PropsType) => {
  return (
    <div className="lg:px-5">
      <div className="mt-[30px] mb-[130px] lg:mb-[220px]">
        <h1 className="font-Poppins text-[20px] lg:text-[30px] not-italic font-semibold leading-normal tracking-[0.18px] bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent lg:my-6 drop-shadow-sm">
          Booking Overview
        </h1>
        <div className="lg:flex ">
          <div className="mt-8 w-full lg:w-[550px] lg:flex lg:flex-col  rounded-[20px] border-[2px] border-coral-500 border-solid bg-[#FFF] shadow-bookingOverviewShadow p-3 lg:px-5">
            <div className="flex items-center justify-center my-[25px] px-5">
              <span></span>
              <div className="  flex flex-col items-center lg:text-left text-[#5D6670] font-Poppins text-[16px] lg:text-[22px] fr  leading-normal tracking-[0.13px]">
                <h1 className="text-coral-500 font-semibold text-center">
                  {" "}
                  {packageName}
                </h1>
                <h1 className="text-[14px] mt-4 font-medium   text-neutral-600">
                  {startsFrom + " - " + endsOn}
                </h1>

                <div className="rounded-md mt-2  flex whitespace-nowrap flex-wrap justify-between space-x-4 items-center p-2">
                  <h1 className="text-[12px] font-medium ">{theme}</h1>

                  <h1 className="flex   items-center text-[12px] font-medium">
                    <span className="flex items-center gap-2">
                      {adults > 0 ? (
                        <span className="flex items-center gap-1 text-[12px]">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            <UserRound
                              size={12}
                              className="align-middle text-coral-500"
                            />
                          </span>
                          {adults} Adults
                        </span>
                      ) : (
                        <span>{""}</span>
                      )}
                    </span>

                    <span className="flex items-center gap-1">
                      {child === 0 ? (
                        " "
                      ) : child === 1 ? (
                        <span className="flex items-center gap-1 text-[12px]">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            +
                            <Baby
                              size={12}
                              className="align-middle text-coral-500"
                            />{" "}
                          </span>
                          {child} Child
                        </span>
                      ) : child > 1 ? (
                        <span className="flex items-center gap-1 text-[12px]">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            +
                            <Baby
                              size={12}
                              className="align-middle text-coral-500"
                            />
                          </span>
                          {child} Children
                        </span>
                      ) : null}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-neutral-600 font-semibold pl-4 text-[16px] lg:text-[18px] flex items-center gap-2">
                Hotels
              </h1>
              <div className="flex flex-col space-y-8 p-3 flex-wrap">
                {hotel.map((h, i) => (
                  <div className="flex space-x-3 items-center " key={i}>
                    <div
                      className=" relative h-24 w-24  flex-shrink-0 "
                      key={i}
                    >
                      <Image
                        unoptimized={true}
                        src={NEXT_PUBLIC_IMAGE_URL + h.image}
                        fill
                        alt={h.hotelName}
                        className="rounded-lg absolute object-cover "
                      />
                      <div className="absolute rounded-tl-lg top-0 left-0 text-[10px] lg:text-[16px] p-1 py-1 leading-none rounded-br-md flex-shrink-0   text-white bg-emerald-400">
                        {h.noOfNight}N
                      </div>
                    </div>

                    <div className="flex flex-col  ">
                      <h1 className="text-neutral-600 font-medium text-[14px] lg:text-[16px]">
                        {h.hotelName}
                      </h1>
                      <div className="flex flex-col items-start gap-1 mt-2">
                        <h1 className="text-[12px] lg:text-[14px] text-neutral-500 flex items-center gap-2 font-medium">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            <Utensils size={10} className=" text-coral-500  " />
                          </span>
                          {getMealPlan(h.mealPlan)}
                        </h1>

                        <h1 className="text-[12px] lg:text-[14px]  text-neutral-500  gap-2  rounded-lg font-medium    flex items-center  ">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            <BedSingle size={10} className=" text-coral-500" />
                          </span>

                          <span className="truncate-1">{h.hotelRoomType}</span>
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-neutral-600 font-semibold mt-3 pl-4 text-[16px] lg:text-[18px] flex items-center gap-2">
                Transport
              </h1>

              <div className=" p-3">
                {vehicle.map((v, i) => (
                  <div className="flex space-x-3 items-center " key={i}>
                    <div
                      className=" relative h-24 w-24  flex-shrink-0 rounded-md shadow-sm"
                      key={i}
                    >
                      <Image
                        unoptimized={true}
                        src={NEXT_PUBLIC_IMAGE_URL + v.image}
                        fill
                        alt={v.vehicleName}
                        className="rounded object-center "
                      />
                    </div>

                    <div className="flex flex-col">
                      <h1 className=" text-neutral-600 font-medium text-[14px] lg:text-[16px]">
                        {v.vehicleName}
                      </h1>
                      <div className="flex flex-col  ">
                        <h1 className="text-[12px] lg:text-[14px]  text-neutral-500 flex items-center gap-2 flex items-center gap-1  rounded-lg w-fit  font-medium mt-1 ">
                          <span className="p-1 rounded-md border-neural-100 shadow-sm border">
                            <Sofa size={10} className=" text-coral-500" />
                          </span>{" "}
                          {v.seater} seater
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
