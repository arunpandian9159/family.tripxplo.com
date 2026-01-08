"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Wifi } from "lucide-react";
import Image from "next/image";
const RoomDetail = () => {
  const [expand, setExpand] = useState(false);
  const [select, setSelect] = useState(false);
  const facilities = [
    {
      label: "Swiming",
    },
    {
      label: "CCTV",
    },
    {
      label: "House Keeping",
    },
    {
      label: "Refrigerator",
    },
    {
      label: "Power Backup",
    },
    {
      label: "Dining Area",
    },
    {
      label: "Air Conditioning",
    },
    {
      label: "TV",
    },
    {
      label: "24/7 Security",
    },
  ];
  return (
    <>
      <div
        className={`w-[312px] h-[${expand ? "370px" : "120px"}]  mb-[30px] rounded-[14px] bg-[#FFF] border-[2px] border-solid border-[#4BCDA1]`}
        style={{ boxShadow: " 4px 8px 25.8px 0px rgba(51, 214, 159, 0.11)" }}
      >
        <div className="flex flex-col justify-center items-center ">
          <div className="flex">
            <section className="mt-[13px] ml-[17.5px]">
              <h1 className="text-[#6A778B] font-Poppins text-[14px] not-italic font-semibold leading-normal tracking-[0.14px] w-[97.942px] h-[21px]">
                Deluxe - AC
              </h1>
              <div className="flex items-center content-center ">
                <Check className="w-[6px] h-[10px] flex-shrink-0 stroke-[#4BCDA1] stroke-[1.5px]" />
                <span
                  className=" ml-[2px] font-Poppins text-[8px] not-italic font-normal tracking-[0.08px] bg-clip-text text-transparent "
                  style={{
                    backgroundImage:
                      " linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                  }}
                >
                  BreakFast
                </span>
                <Check className="ml-[5px] w-[6px] h-[20px] flex-shrink-0 stroke-[#4BCDA1] stroke-[1.5px]" />
                <span
                  className="ml-[2px] font-Poppins text-[8px] not-italic font-normal leading-normal tracking-[0.08px] bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      " linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                  }}
                >
                  Dinner
                </span>
              </div>
            </section>
            <section className="flex mt-[18px] ml-[20px] ">
              <div className="flex flex-col w-[56px] items-center content-center gap-[4px]">
                <span>
                  <Image
                    src="/Room_Service.svg"
                    alt="clean"
                    width={15}
                    height={15}
                  />
                </span>
                <span className="text-[#6A778B] font-Poppins text-[5px] font-normal not-italic leading-normal tracking-[0.05px]">
                  Room Service
                </span>
              </div>
              <div className="mt-[2px] flex flex-col w-[56px] items-center content-center gap-[4px]">
                <span>
                  <Image src="/Wifi.svg" alt="Wifi" width={14} height={13} />
                </span>
                <span className="text-[#6A778B] font-Poppins text-[5px] font-normal not-italic leading-normal tracking-[0.05px]">
                  Wifi Facility
                </span>
              </div>
              <div className="mt-[4px] flex flex-col w-[56px] items-center content-center gap-[4px]">
                <span>
                  <Image
                    src="/Laundry.svg"
                    alt="Laundry"
                    width={14}
                    height={13}
                  />
                </span>
                <span className="text-[#6A778B] font-Poppins text-[5px] font-normal not-italic leading-normal tracking-[0.05px]">
                  Laundry
                </span>
              </div>
            </section>
          </div>
          <hr
            className=" mt-[12px] w-[278px] stroke"
            style={{ stroke: "rgba(0, 0, 0, 0.08)" }}
          />
        </div>
        <section className="mt-[13px] flex mb-[10px] ">
          <div className="ml-[16px]">
            <button
              onClick={() => setExpand(!expand)}
              className="flex items-center justify-center  w-[111px] h-[21px] flex-shrink-0 rounded-[52px] "
              style={{ background: "rgba(217, 217, 217, 0.31)" }}
            >
              <span className="font-Poppins text-[8px] not-italic font-bold leading-normal tracking-[0.08px] text-[#667386] px-[5px]">
                View all Inclusions
              </span>
              <span>
                {" "}
                <Image
                  src="/Arrow_Down.svg"
                  alt="Down_Arrow"
                  width={7}
                  height={5}
                />
              </span>
            </button>
          </div>
          <div className=" ml-auto flex items-center justify-center pl-[20px]">
            <span className="p-[2px]">
              <Image
                src="/Plus.svg"
                alt="PlusIcon"
                width={7}
                height={15}
              />{" "}
            </span>
            <span className="p-[2px]">
              <Image src="/Rupees.svg" alt="rupees" width={6} height={7} />
            </span>
            <span
              className="font-Montserrat text-[10px] font-semibold not-italic leading-[13.5px] tracking-[0.3px] bg-clip-text text-transparent "
              style={{
                backgroundImage:
                  " linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              }}
            >
              {" "}
              8,999
            </span>
            <span className=" pt-[13px]  text-[#6A778B] text-[4px] font-Poppins not-italic font-normal  tracking-[0.04px] ">
              Per person
            </span>
          </div>
          <div className="ml-auto mr-[18px] ">
            <button
              onClick={() => setSelect(!select)}
              className=" w-[61px] h-[22px] gap-[6px] flex-shrink-0 flex items-center justify-center content-center rounded-[8px] border border-solid border-[#27B182] font-Poppins text-center text-[10px] not-italic font-medium leading-normal tracking-[0.1px] bg-clip-text text-transparent"
              style={{
                boxShadow: "2px 4px 15.1px 0px rgba(101, 255, 181, 0.49)",
                backgroundImage:
                  "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
              }}
            >
              Select
            </button>
          </div>
        </section>
        {expand && (
          <div
            className={` mt-[20px] overflow-hidden transition-all duration-300 ease-in-out  `}
          >
            <div className="flex items-center justify-center">
              <div
                className="w-[278px] h-[54px] flex  flex-shrink-0  border stroke  justify-center "
                style={{
                  fill: "rgba(172, 161, 159, 0.06)",
                  stroke: "rgba(172, 161, 159, 0.34",
                }}
              >
                <section className="flex items-center justify-between">
                  <div className="flex flex-col items-center justify-center  ">
                    <span className="flex ">
                      <Image
                        src="/Bed.svg"
                        alt="BedIcon"
                        width={18}
                        height={12}
                      />
                    </span>
                    <span className="text-[#667386]  font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px] pt-[3px]">
                      Double Bed
                    </span>
                  </div>
                  <hr
                    className="w-[34px] stroke stroke-[#DEDAD9]"
                    style={{ transform: " rotate(90deg)" }}
                  />
                  <div className="flex flex-col items-center justify-center ">
                    <span>
                      <Image
                        src="/Garden_View.svg"
                        alt="BedIcon"
                        width={15}
                        height={15}
                      />
                    </span>
                    <span className="text-[#667386] font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px] pt-[3px]">
                      Garden View
                    </span>
                  </div>
                  <hr
                    className="w-[34px] stroke stroke-[#DEDAD9]"
                    style={{ transform: " rotate(90deg)" }}
                  />
                  <div className="flex flex-col items-center justify-center ">
                    <span>
                      <Image
                        src="/Sqr_Feet.svg"
                        alt="BedIcon"
                        width={17}
                        height={17}
                      />
                    </span>
                    <span className="text-[#667386] font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px] pt-[3px]">
                      224 sq.ft
                    </span>
                  </div>
                </section>
              </div>
            </div>
            <h1
              className="mt-[18px] ml-[19px] font-Poppins text-[10px] font-semibold not-italic leading-normal tracking-[0.1px] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              }}
            >
              2 Meals - Breakfast & Dinner
            </h1>
            <div className="flex items-center ml-[23px] mt-[5px] ">
              <span className="pr-[2px]">
                <Check className="w-[9px] h-[8px] stroke-[5px] stroke-[#1EC089]" />
              </span>
              <span className="text-[#6A778B] font-Poppins text-[9px] font-normal not-italic leading-normal tracking-[0.09px]">
                Complimentary Breakfast is Available
              </span>
            </div>
            <h1
              className=" mt-[18px] ml-[19px] font-Poppins text-[10px] font-semibold not-italic leading-normal tracking-[0.1px] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              }}
            >
              Facilities
            </h1>
            <section className="grid grid-cols-3 gap-[17px] ml-[24px] mt-[5px] mb-[10px]">
              {facilities.map((data, index) => (
                <div className="flex items-center" key={index}>
                  <span>
                    <Check className="w-[9px] h-[8px] stroke-[5px] stroke-[#1EC089] pr-[2px]" />
                  </span>
                  <span className="text-[#6A778B] font-Poppins text-[9px] font-normal not-italic leading-normal tracking-[0.09px]">
                    {data.label}
                  </span>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default RoomDetail;
