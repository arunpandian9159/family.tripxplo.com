import { FaIndianRupeeSign } from "react-icons/fa6";
import Book from "./Book";
import { useState } from "react";
interface Fare {
  fare_Name: string;
  fare_Cost: number;
  no_Of_Persons: string;
  person_Cost: number;
}
const FareBreakup = ({
  adults,
  child,
  packagePrice,
  gstPer,
  gstPrice,
}: {
  adults: number;
  child: number;
  packagePrice: number;
  gstPer: number;
  gstPrice: number;
}) => {
  const FareDetails: any[] = [
    {
      fare_Name: "Total Package Price",
      fare_Cost: packagePrice,
      no_Of_Persons: `${adults} Adults + ${child} child`,
    },
    // {
    //   fare_Name:"Coupon Discount",
    //   fare_Cost:2000,
    //   no_Of_Persons:"DIWALI2000  applied",
    //   person_Cost:2000

    // },
    // {
    //   fare_Name:"Coin Discount",
    //   fare_Cost:20000,
    //   no_Of_Persons:"1000 Coins Redeemed",
    //   person_Cost:4000

    // },
    {
      fare_Name: "Fees & Taxes",
      fare_Cost: gstPrice,
      no_Of_Persons: `GST ${gstPer}%`,
    },
  ];
  function open() {}
  return (
    <>
      <div className="">
        <h1
          className="text-center font-Poppins text-[18px] font-semibold leading-normal tracking-[0.18px] bg-clip-text text-transparent"
          style={{
            backgroundImage:
              " linear-gradient(87deg, #FF5F5F -25.84%, #FF5F5F -25.82%, #FF9080 118.31%)",
          }}
        >
          Fare Breakup
        </h1>

        <section className="mt-[35px] px-5 ">
          {FareDetails.map((details, index) => (
            <div key={index}>
              <div>
                <div className="flex items-center">
                  <h1 className="text-[#4A5058] font-Poppins font-semibold not-italic leading-normal tracking-[0.16px]">
                    {details.fare_Name}
                  </h1>
                  <p className="flex  items-center ml-auto mr-[33px] text-[#6A778B] font-montserrat text-[16px] not-italic font-semibold leading-[21.6px] tracking-[0.48px]">
                    <FaIndianRupeeSign /> {details.fare_Cost}
                  </p>
                </div>
              </div>

              <div className="text-[#6A778B]     text-[12px] flex items-center ">
                <p className="font-medium font-Poppinsleading-normal tracking-[0.12px]">
                  {details.no_Of_Persons}
                </p>
              </div>

              {index != FareDetails.length - 1 && (
                <hr
                  className="w-[305px] mt-[35px] mb-[22px] stroke-[1px] mx-auto "
                  style={{ stroke: "rgba(172, 161, 159, 0.32)" }}
                />
              )}
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default FareBreakup;
