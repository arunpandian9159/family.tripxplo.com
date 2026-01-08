import React from "react";

export default function SimpleLoading() {
  return (
    <>
      {/* Mobile view */}
      <div className=" lg:w-fit  lg:hidden  relative flex flex-col w-full h-72 mt-4 border-[2.5px] rounded-2xl shadow-md border-[#FF7865]">
        <div className="flex w-full h-72  justify-center items-center">
          <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
          <div className="w-[30px] h-[30px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
          <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
          <div className="w-[30px] h-[30px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
          <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
        </div>
      </div>
    </>
  );
}
