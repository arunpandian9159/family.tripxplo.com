"use client";
import React from "react";
import "../../../globals.css";

import {
  School,
  CalendarDays,
  Soup,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { FaIndianRupeeSign, FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
interface filterCardProps {
  name: string;
  days: number;
  nights: number;
  place1: string;
  place2?: string;
  price: number;
  filter_category: string;
  room_type: string;
  cost: string;
}
const FilterCardList = ({
  name,
  days,
  nights,
  price,
  place1,
  place2,
  filter_category,
  room_type,
  cost,
}: filterCardProps) => {
  return (
    <div className=" flex flex-col items-center h-[266px] w-[309px] rounded-[14px] bg-white shadow-changeHotelBoxShadow border-[#4BCDA1] border-[2px] p-[8px] ">
      <div className="h-[112px] w-[293px] rounded-[8px] relative bg-gray-700 shadow-changeHotelImgShadow bg-changeRoomImgBg ">
        <p
          className="inline-flex items-center ml-[11px] mt-[11px] text-white text-[9px] font-normal leading-normal tracking-[0.09px] "
          style={{ textShadow: "1px 1px 1.6px rgba(0, 0, 0, 0.11)" }}
        >
          <FaLocationDot size={9} className="text-white mr-[4px]" />
          Manali
        </p>
        <p
          className="absolute bottom-[9px] right-[14px] flex items-center text-white text-[8px] font-semibold leading-[11.667px] tracking-[1px] "
          style={{ textShadow: "2px 1px 4px rgba(0, 0, 0, 0.34)" }}
        >
          <Star size={10} className="text-[#FFD230] mr-[4px]" />
          4.5 / 5
        </p>
      </div>
      <div>
        <div className="flex items-center mt-[11px] ">
          <p className="w-[218px] text-[#6A778B] text-[14px] font-semibold leading-normal tracking-[0.14px] ">
            {nights}N - {name}
          </p>
          <p
            className=" inline-flex  items-center h-[14px] px-[5.833px] rounded-[3.5px] border-[#1EC089] border-[0.817px] text-[#1EC089] text-[7px] font-normal leading-[11.667px]  "
            style={{
              boxShadow:
                "1.167px 2.333px 8.342px 0px rgba(255, 120, 101, 0.20)",
            }}
          >
            Snow View
          </p>
        </div>
        <div className="flex justify-between mt-[10px] pb-[14px] border-b-[1px] border-changeHotelLine w-[278px]">
          <div className="flex  flex-col ">
            <div className="flex ">
              <Image src="/Room.svg" width={13} height={13} alt="room" />
              <p
                className=" flex ml-[9px] h-[12px] w-[50px] text-[#6A778B] text-[8px] font-normal leading-normal bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                }}
              >
                Room Type :
              </p>
            </div>
            <p className=" h-[24px] w-[74px] ml-[22px] text-[8px] text-[#6A778B] font-normal leading-normal ">
              {room_type}
            </p>
          </div>
          <div className="flex flex-col h-[42px] justify-between">
            <p className=" flex items-center text-[#6A778B] text-[8px] font-normal leading-normal">
              <CalendarDays
                className="text-[#1EC089] mr-[4px] drop-shadow-pkgdoneShadow"
                size={15}
              />{" "}
              Wed, 12 Jun - Fri, 14 Jun
            </p>
            <p className=" flex items-center text-[#6A778B] text-[8px] font-normal leading-normal">
              <Soup
                className="text-[#1EC089] mr-[4px] drop-shadow-pkgdoneShadow"
                size={15}
              />{" "}
              Breakfast + Dinner
            </p>
          </div>
        </div>
        <div className="flex items-center h-[49px] w-[278px] justify-between">
          <button>
            <p
              className="  inline-flex items-center h-[22px] w-[85px] px-[5px] py-[5px] rounded-[5px] border text-[#6A778B] text-[8px] font-normal leading-normal tracking-[0.08px] "
              style={{ borderColor: " rgba(106, 119, 139, 0.27)" }}
            >
              Change Room{" "}
              <ArrowRight size={8} className="text-[#6A778B] ml-[4px]" />{" "}
            </p>
          </button>

          <div className="flex items-center">
            <Image
              src="/Plus.svg"
              height={7}
              width={7}
              alt="plus"
              className="mr-[3px] "
            />
            <Image
              src="/Rupees.svg"
              height={7}
              width={7}
              alt="rupees"
              className="mr-[3px]"
            />
            <p
              className="h-[15px] w-[37px] font-montserrat text-[12px] font-semibold leading-[16.2px] tracking-[0.36px] bg-clip-text text-transparent "
              style={{
                backgroundImage:
                  " linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
              }}
            >
              {cost}
            </p>
            <button>
              <p
                className="ml-[20px] inline-flex items-center px-[14px] py-[3.5px] rounded-lg border border-[#27B182] shadow-changeHotelSelectShadow text-[10px] font-medium leading-normal tracking-[0.1px] text-transparent bg-clip-text "
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                }}
              >
                Select
              </p>
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCardList;
