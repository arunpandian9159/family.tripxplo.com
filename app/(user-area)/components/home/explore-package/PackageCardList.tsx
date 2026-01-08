"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import React from "react";
interface CardProps {
  name: string;
  days: number;
  nights: number;
  price: number;
  description: string;
  image_url: string;
  pkg_category: string;
}

const PackageCardList = ({
  name,
  days,
  nights,
  price,
  description,
  image_url,
  pkg_category,
}: CardProps) => {
  return (
    <>
      <div className="lg:hidden block ml-[10px] flex flex-col relative w-[208px] h-[239px] mr-3 border-zinc-200  border-2 rounded-lg grey-shadow mb-6">
        <div className="flex-grow p-1 ">
          <div className="relative ">
            <div>
              {image_url === "" ? (
                <>
                  <div className="bg-slate-200 rounded-lg  w-[196px] h-[97px]"></div>
                </>
              ) : (
                <></>
              )}
            </div>

            <div
              className="absolute left-0 top-0 ml-[11px] mt-[10px] p-1 text-white rounded-[4px]  font-Poppins text-[10px] not-italic font-semibold leading-normal tracking-[0.09px] "
              style={{
                border: " 1px solid rgba(255, 255, 255, 0.33)",
                background: " rgba(249, 249, 249, 0.38)",
                backdropFilter: "blur(7.599999904632568px)",
              }}
            >
              Family
            </div>
          </div>

          <div className="p-2">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="text-[14px] truncate pr-5 font-semibold text-[#FF7865]">
                  {name}
                </h1>
              </div>
              <div className="mt-0">
                <h1 className="text-[8px] text-[#909BA8] font-semibold">
                  {" "}
                  {nights}N - {days}D
                </h1>
              </div>
              <div className="mt-2">
                <h1 className="text-[#8391A1] text-[8px] truncate-2">
                  {description}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none">
          <Button variant={"explore"} className="w-full h-[42px]">
            Explore now
          </Button>
        </div>
      </div>

      <div className="sm:hidden lg:block relative flex flex-col w-72 h-96 rounded-lg border-neutral-100 shadow-sm border mr-8 p-2">
        <div className="relative overflow-hidden w-full h-1/2 rounded-md">
          <Image
            unoptimized={true}
            src={
              "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600"
            }
            layout="fill"
            alt="Image"
            className="object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
          <div
            className="absolute right-0 bottom-0 px-3 py-2 text-white rounded-tl-lg text-sm font-Poppins text-[10px] not-italic font-semibold leading-normal tracking-[0.09px]"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.33)",
              background: "rgba(249, 249, 249, 0.38)",
              backdropFilter: "blur(7.599999904632568px)",
            }}
          >
            Family
          </div>
          <div className="absolute top-0 left-0">
            <h1 className="text-sm bg-[#27B182] bg-gradient-to-r from-[#31DAA1] to-[#27B182] text-white font-medium px-3 py-2 rounded-br-2xl">
              {nights}N - {days}D
            </h1>
          </div>
        </div>

        <div className="mt-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-[#FF7865] font-medium text-xl">{name}</h1>
              <h1 className="text-neutral-700 font-medium whitespace-nowrap text-lg p-0 flex items-center flex-col">
                &#8377;{price}{" "}
                <span className="text-xs text-[#27B182]">per person</span>
              </h1>
            </div>
            <h1 className="pt-5 text-xs text-neutral-600">{description}</h1>
          </div>
          <div className="mt-10">
            <Button variant={"exploreButton"} className="w-full py-2">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageCardList;
