import React from "react";

const OtpForm = () => {
  return (
    <div className="px-5 mt-3 ">
      <div
        className="border
      border-[#B5B5B5] border-opacity-[13%]  w-full outline-none h-12 rounded-lg flex"
      >
        <div className="flex justify-beteen items-center px-3">
          <input type="text" className="text-xs " placeholder="Enter OTP" />
          <div>
            <h1 className="text-sm text-[#1EC089] whitespace-nowrap">
              Send OTP
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
