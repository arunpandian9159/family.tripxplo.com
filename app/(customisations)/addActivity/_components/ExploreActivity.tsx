"use client";
import ActivityDetails from "./ActivityDetails";
import React, { useEffect, useState } from "react";
import ActivityFilter from "./ActivityFilter";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
interface PackageData {
  id: string;
  PackageName: string;
  PackageCategory: string;
  cost: number;
  days: number;
  nights: number;
}
const ExploreFilter = () => {
  const router = useRouter();

  function clickBack() {
    router.push("/");
  }

  return (
    <div>
      <div
        className="fixed top-0 text-center flex items-center  w-full h-[100px] bg-white z-10"
        style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
      >
        <span className="ml-[40px]">
          <button onClick={clickBack}>
            <ArrowLeft className="h-[33px] w-[33px] text-[#1EC089]" />
          </button>
        </span>
        <h1
          className="text-center ml-[16px]  font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
          style={{
            textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
            backgroundImage:
              "linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Add Acitivity
        </h1>
      </div>
      <h1
        className="text-center ml-[16px] mt-[140px]  font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
        style={{
          textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
          backgroundImage:
            "linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        45 Activites
      </h1>
      <div>
        <ActivityFilter />
      </div>
      <div className="mt-[31px] flex justify-center">
        <ActivityDetails />
      </div>
    </div>
  );
};

export default ExploreFilter;
