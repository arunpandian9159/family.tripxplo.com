"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IndianRupee } from "lucide-react";

const Payment = () => {
  return (
    <>
      <div className=" flex-shrink-0 ">
        <section className="flex mt-[22px]">
          <h1
            className=" pl-[23px] font-Poppins text-[18px] font-bold not-italic leading-normal tracking-[0.18px] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                " linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
            }}
          >
            Payment Options
          </h1>
          <span className="pl-auto pr-[23px]"></span>
        </section>
        <div className="flex justify-center">
          <section
            className="w-[308px] h-[167px] mt-[23px] flex-shrink-0 rounded-[11px]  border-[2px] border-solid border-[#27B182] bg-[#FFF]"
            style={{ boxShadow: "3px 4px 13.8px 0px rgba(51, 214, 159, 0.15)" }}
          >
            <div className="flex mt-[16px] pl-[12px] items-center ">
              <span className="">
                <input
                  type="radio"
                  className="w-[19px] h-[19px] flex-shrink-0"
                />
              </span>
              <p className="pl-[12px] font-Poppins text-[14px] not-italic font-bold leding-normal tracking-[0.14px] text-[#5D6670] pr-[2px]">
                Reserve For
              </p>
              <IndianRupee className="w-[13px] h-[15px] text-[#5D6670]" />
              <span>1</span>

              <div
                className="flex gap-[8px] p-[1px]  pr-[13px]  pl-auto items-center justify-center  flex-wrap rounded-[8px]"
                style={{
                  background:
                    " linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                  boxShadow: "2px 4px 14.3px 0px rgba(30, 192, 137, 0.17)",
                }}
              >
                <p className="text-white pl-[2px] pr-[2px]">100</p>
                <Image
                  src="/Coins.svg"
                  className="pr-[1px]  "
                  alt="coins"
                  width={12}
                  height={12}
                />
              </div>
            </div>
            <hr
              className=" flex items-center justify-center mt-[15px]  border w-[278px] stroke-[2px]  mx-auto "
              style={{ stroke: " rgba(181, 181, 181, 0.34)" }}
            />
            <div className="mt-[12px]">
              <div className="flex pl-[14px]">
                <span className="bg-[#D0DDEC] text-white w-[15px] h-[15px] font-Poppins not-italic font-bold leading-normal tracking-[0.08px] text-center text-[10px] rounded-[10px] flex-shrink-0">
                  1
                </span>
                <p className="text-[#5D6670] pl-[9px] font-Poppins text-[12px] not-italic font-semibold leading-normal tracking-[0.12px]">
                  Book Your Slot
                </p>
                <span className="pr-[50px] flex pl-auto text-[#5D6670] items-center text-Montserrat text-[14px] not-italic font-bold leading-[18.9px[ tracking-[0.42px]">
                  <IndianRupee className="w-[12px] h-[10px]" />1
                </span>
              </div>
              <p className="pl-[38px] text-[#1EC089] font-Poppins text-[10px] not-italic font-semibold leading-normal tracking-[0.1px]">
                Pay just ₹ 1 and book your travel{" "}
              </p>
              <div className="flex pl-[14px] mt-[16px]">
                <span className="bg-[#D0DDEC] text-white w-[15px] h-[15px] font-Poppins not-italic font-bold leading-normal tracking-[0.08px] text-center text-[10px] rounded-[10px] flex-shrink-0">
                  2
                </span>
                <p className="text-[#5D6670] pl-[9px] font-Poppins text-[12px] not-italic font-semibold leading-normal tracking-[0.12px]">
                  15 Days before Tour
                </p>
                <span className="pr-[28px] flex pl-auto items-center text-Montserrat text-[#5D6670] text-[14px] not-italic font-bold leading-[18.9px] tracking-[0.42px]">
                  <IndianRupee className="w-[12px] h-[10px]" />
                  8999
                </span>
              </div>
              <p className="pl-[38px]  text-[#1EC089] font-Poppins text-[10px] not-italic font-semibold leading-normal tracking-[0.1px]">
                12-8-2024{" "}
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-center">
          <section className=" mt-[23px] w-[308px] h-[117px] rounded-[11px] border-black  border-solid border-[1px]  ">
            <div className="flex pl-[12px] mt-[18px]">
              <span>
                <input type="radio" className="w-[19px] h-[19px]" />
              </span>
              <h1 className="pl-[10px] text-[#5D6670] font-Poppins text-[14px] not-italic font-bold leading-normal tracking-[0.14px] ">
                Pay Full Amount
              </h1>
              <div
                className="flex gap-[8px] p-[1px]  pr-[13px]  pl-auto items-center justify-center  flex-wrap rounded-[8px]"
                style={{
                  background:
                    " linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                  boxShadow: "2px 4px 14.3px 0px rgba(30, 192, 137, 0.17)",
                }}
              >
                <p className="text-white pl-[2px] pr-[2px]">1000</p>
                <Image
                  src="/Coins.svg"
                  className="pr-[1px]  "
                  alt="coins"
                  width={12}
                  height={12}
                />
              </div>
            </div>
            <hr
              className=" flex items-center justify-center mt-[15px]  border w-[278px] stroke-[2px]  mx-auto "
              style={{ stroke: " rgba(181, 181, 181, 0.34)" }}
            />
            <div className="flex pl-[14px] mt-[15px]">
              <span className="bg-[#D0DDEC]  text-white w-[15px] h-[15px] font-Poppins not-italic font-bold leading-normal tracking-[0.08px] text-center text-[10px] rounded-[10px] flex-shrink-0">
                1
              </span>
              <span className="w-[180px] pl-[9px]">
                <p className="font-Montserrat text-[10px] text-[#5D6670] font-bold not-italic leading-[18.9px] tracking-[0.1px]">
                  Book your travel by paying full amount and Get 10X Reward
                  Coins
                </p>
              </span>
              <span className="pr-[28px] flex pl-auto items-center text-Montserrat text-[#5D6670] text-[14px] not-italic font-bold leading-[18.9px] tracking-[0.42px]">
                <IndianRupee className="w-[12px] h-[10px]" />
                8999
              </span>
            </div>
          </section>
        </div>

        <hr
          className=" mt-[26px] flex items-center justify-center   border w-[278px] stroke-[2px]  mx-auto "
          style={{ stroke: " rgba(181, 181, 181, 0.34)" }}
        />
        <section className="mt-[21px] pl-[15px]">
          <h1 className="text-[#4A5058] font-Poppins text-[12px] not-italic font-semibold leading-normal tracking-[0.12px]">
            Have a coupon code ?
          </h1>
          <div
            className="rounded-[8px] flex items-center w-[210px] mt-[10px]"
            style={{ border: " 1px solid rgba(0, 0, 0, 0.23)" }}
          >
            <input
              className="  outline-none w-[170px] text-[8px] h-[24px] font-Poppins not-italic leading-normal tracking-[0.08px] font-normal"
              type="text"
              placeholder="Enter code"
            />
            <button
              className="  outline-none font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  " linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
              }}
            >
              Apply
            </button>
          </div>

          <div className="flex items-center mt-[21px]">
            <h1 className="text-[#4A5058]  font-Poppins text-[12px] not-italic font-semibold leadning-normal tracking-[0.12px] ">
              Redeem Coins
            </h1>
            <p className="text-[#FB7764] pl-[20px] font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px]">
              Available 5,500
            </p>
            <span>
              {" "}
              <Image
                src="/Coins.svg"
                className="pr-[1px]  text-[#FB7764] "
                alt="coins"
                width={12}
                height={12}
              />
            </span>
          </div>
          <div
            className="w-[164px] mt-[9px] flex items-center h-[24px] flex-shrink-0 rounded-[8px] border border-solid border-[#FF5F5F] "
            style={{
              boxShadow: "2px 4px 20.9px 0px rgba(101, 255, 200, 0.22)",
            }}
          >
            <span className="pl-[12px] flex text-[#FF7865] font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px] ">
              1000{" "}
            </span>
            <p className="text-[6A778B] pl-[5px] font-Poppins text-[8px] not-italic font-semibold leading-normal tracking-[0.08px]">
              claimable
            </p>
            <button
              className=" pl-auto pr-[10px] font-Poppins text-[8px] not-italic font-semibold tracking-[0.08px] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
              }}
            >
              Redeem
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Payment;
