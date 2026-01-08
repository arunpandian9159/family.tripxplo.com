import {
  Building,
  Utensils,
  CarFront,
  IndianRupee,
  CalendarDays,
  Check,
} from "lucide-react";
import React from "react";
import { useAppSelector } from "@/app/store/store";
import { X } from "lucide-react";
import { Loader } from "lucide-react";
import Image from "next/image";
interface Filter {
  name: string;
  filter_category: string;
}
export default function HotelData() {
  const FilterBooking: Filter[] = [
    {
      name: "Zorbing at Solang Valley",
      filter_category: "Trending",
    },
    {
      name: "Paragliding ]]]]]]]]]]]]]]]]]]]Valley",
      filter_category: "Lowest Price",
    },
    {
      name: "Paragliding - Solang Valley",
      filter_category: "Trending",
    },
  ];
  const filterCategory = useAppSelector(
    (state) => state.filterCategory.filterCategory
  );
  const filterData = FilterBooking.filter(
    (pkg) => pkg.filter_category === filterCategory
  );
  return (
    <>
      {filterData.map((pkg, index) => (
        <>
          <div
            className=" flex flex-col items-center  h-[243px] w-[309px] rounded-[14px] border-2 border-addActivityContBorder shadow-addActivityContShadow px-[6px] py-[8px] "
            key={index}
          >
            <div className="h-[112px] w-[293px] rounded-lg bg-addActivityImgContBg shadow-addActivityImgContShadow"></div>

            <p className=" ml-[5px] mr-auto mt-[4px] text-[#6A778B] w-[229px] text-[14px] font-semibold leading-normal tracking-[0.14px]">
              {pkg.name}
            </p>
            <div className=" flex justify-start items-center mt-[9px] ml-[4px] mr-auto">
              <span className="flex items-center">
                <Image src="/Sun.svg" height={14} width={14} alt="sun" />
                <p className="ml-[7px] text-[#6A778B] text-[8px] font-medium leading-normal ">
                  Quarter Day
                </p>
              </span>
              <span className="ml-[21px] flex items-center">
                <Image src="/Clock.svg" height={14} width={14} alt="clock" />
                <p className="ml-[7px] text-[#6A778B] text-[8px] font-medium leading-normal ">
                  30mins
                </p>
              </span>
            </div>

            <div className=" flex  justify-between items-center mt-[18px] h-[49px] w-[278px] border-t border-t-myBookingsLine">
              <p className="inline-flex justify-center items-center h-[14px] w-[65px]  border border-[#1EC089] rounded-[3.5px] shadow-addActivityPrivateActivityShadow text-[#1EC089] text-[7px] font-medium leading-[11px]  ">
                Private Activity
              </p>
              <div className="flex items-center">
                <Image
                  src="/Plus.svg"
                  height={7}
                  width={7}
                  alt="plus"
                  className="mr-[4px] "
                />
                <Image
                  src="/Rupees.svg"
                  height={7}
                  width={7}
                  alt="rupees"
                  className="mr-[3px]"
                />

                <p
                  className="h-[15px] w-[37px] font-montserrat text-[12px] font-semibold leading-[16.2px] tracking-[0.36px] bg-clip-text text-transparent "
                  style={{
                    backgroundImage:
                      " linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
                  }}
                >
                  8,999
                </p>
                <button>
                  <p
                    className="ml-[7px] inline-flex items-center px-[14px] py-[3.5px] rounded-lg border border-[#27B182] shadow-changeHotelSelectShadow text-[10px] font-medium leading-normal tracking-[0.1px] text-transparent bg-clip-text "
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                    }}
                  >
                    Select
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      ))}{" "}
    </>
  );
}
