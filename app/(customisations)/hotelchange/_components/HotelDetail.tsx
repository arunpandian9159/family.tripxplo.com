"use client";
import React from "react";
import FilterHotel from "./FilterHotel";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const HotelDetail = () => {
  const router = useRouter();
  function clickBack() {
    router.push("/packageinfo");
  }
  return (
    <div className="">
      <div
        className="fixed top-0 text-center flex items-center  w-full h-[100px] bg-white z-10"
        style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
      >
        <span className="ml-[40px]">
          <button onClick={clickBack}>
            <ArrowLeft className="h-[33px] w-[33px] text-[#FF5F5F]" />
          </button>
        </span>
        <h1
          className="text-center ml-[16px]  font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
          style={{
            textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
            backgroundImage:
              "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Change Hotel
        </h1>
      </div>
      <div className="mt-[120px]">
        <FilterHotel />
      </div>
    </div>
  );
};

export default HotelDetail;
