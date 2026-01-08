"use client";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import RoomDetail from "./RoomDetail";
const ExploreRoom = () => {
  const router = useRouter();
  function clickBack() {
    router.push("/packageinfo");
  }
  return (
    <>
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
          Change Room
        </h1>
      </div>
      <h1 className=" mt-[140px] mb-[30px] text-[#5D6670] text-center font-Poppins text-[18px] font-semibold not-italic leading-normal tracking-[0.18px]">
        Rooms Available
      </h1>
      <div className=" flex flex-col  items-center justify-center">
        <RoomDetail />
        <RoomDetail />
        <RoomDetail />
      </div>
    </>
  );
};

export default ExploreRoom;
