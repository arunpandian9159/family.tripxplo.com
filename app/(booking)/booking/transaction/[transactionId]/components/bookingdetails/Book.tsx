"use client";
import React, { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function Book() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="mt-[66px] flex flex-col items-center">
        <hr className="w-[244px] h-[4px] rounded-[22px] bg-bookLineBg" />
        <div className="w-[360px] h-[98px] flex py-[29px] px-[27px]">
          <div className="w-[88px] h-[36px] relative">
            <p className="flex items-center w-[80px] h-[27px] text-[#5D6670] text-[22px] font-semibold leading-[29.7px] tracking-[0.66px] font-[Montserrat]">
              <FaIndianRupeeSign size={14} className="pr-[5px]" /> 8,999
            </p>
            <p className="absolute bottom-[6px] right-[18px] ml-auto w-[52px] h-[9px] text-[#1EC089] text-[9px] font-medium leading-normal tracking-[0.09px]">
              per person
            </p>
          </div>

          <button className="ml-[97px] w-[120px] h-[40px] bg-bookNowBg shadow-bookNowShadow rounded-[30px] text-white text-[14px] font-semibold leading-normal tracking-[0.14px]">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
