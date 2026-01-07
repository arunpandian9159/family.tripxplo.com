import React from 'react';

export default function PackagesLoading() {
  return (
    <>
      {/* Mobile view */}

      <div className="flex w-full h-[40px]  justify-center items-center">
        <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
        <div className="w-[30px] h-[30px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
        <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
        <div className="w-[30px] h-[30px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
        <div className="w-[20px] h-[20px] border-4 border-[#FF7865] rounded-full animate-bounce"></div>
      </div>
    </>
  );
}
