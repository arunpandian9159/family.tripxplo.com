"use client";
import React from "react";
import ExploreRoom from "./_components/ExploreRoom";
import RoomDetail from "./_components/RoomDetail";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const RoomChange = () => {
  const router = useRouter();
  function clickBack() {
    router.back();
  }
  return (
    <>
      {/* <div
        className="fixed top-0 text-center flex items-center  w-full h-[80px] bg-white z-10"
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
          Change Room
        </h1>
      </div> */}
      <section className="">
        <div
          className="fixed top-0 text-center flex items-center   w-full h-auto py-5 lg:py-10 bg-white z-10"
          style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
        >
          <span className="pl-4 lg:pl-6 flex items-center">
            <button onClick={clickBack}>
              <ArrowLeft className="h-[30px] w-[30px] text-[#1EC089]" />
            </button>
          </span>
          <h1
            className="text-center flex flex-wrap px-2 h-auto font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
            style={{
              textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
              backgroundImage:
                "linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Change Room
          </h1>
        </div>
      </section>
      <ExploreRoom />
    </>
  );
};

export default RoomChange;
