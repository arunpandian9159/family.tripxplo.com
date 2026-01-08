import React from "react";
import SearchBox from "./SearchBox";
import Image from "next/image";

const SearchPackage = () => {
  return (
    <div className="w-full relative flex flex-col items-center justify-center pt-10 pb-16 lg:pt-20 lg:pb-24">
      {/* Optional: Hero Background Image - Subtle or removed for cleaner look */}
      {/* <div className="absolute inset-0 z-0 opacity-10">
         <Image src="/home.png" alt="Background" fill className="object-cover" />
      </div> */}

      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        <div className="flex flex-col items-center justify-center">
          {/* 3D Illustration / Animation Placeholder */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 animate-[float_6s_ease-in-out_infinite]">
            <Image
              src="/airplane_3d.png"
              alt="3D Travel Airplane"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          <style jsx global>{`
            @keyframes float {
              0% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
              100% {
                transform: translateY(0px);
              }
            }
          `}</style>

          <div className="text-center space-y-2">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 tracking-tight">
              Where to next?
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl">
              Explore top destinations and packages
            </p>
          </div>
        </div>

        <div className="w-full">
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default SearchPackage;
