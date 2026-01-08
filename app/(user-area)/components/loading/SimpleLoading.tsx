import React from "react";

export default function SimpleLoading() {
  return (
    <>
      {/* Mobile view */}
      <div className=" lg:w-fit  lg:hidden  relative flex flex-col w-full h-72 mt-4 border-[2.5px] rounded-2xl shadow-md border-[#1EC089]">
        <div className="flex w-full h-72  justify-center items-center">
          <div className="w-[20px] h-[20px] border-4 border-[#1EC089] rounded-full animate-bounce"></div>
          <div className="w-[30px] h-[30px] border-4 border-[#1EC089] rounded-full animate-bounce"></div>
          <div className="w-[20px] h-[20px] border-4 border-[#1EC089] rounded-full animate-bounce"></div>
          <div className="w-[30px] h-[30px] border-4 border-[#1EC089] rounded-full animate-bounce"></div>
          <div className="w-[20px] h-[20px] border-4 border-[#1EC089] rounded-full animate-bounce"></div>
        </div>
      </div>
    </>
  );
}
