"use client";

import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="flex flex-col items-center justify-center  min-h-screen">
      <div className="border h-auto shadow-lg p-6 w-4/5 md:w-1/3 rounded-lg gap-3 bg-white flex flex-col">
        <h1 className="text-xl text-[#FF7865]">
          Cancellations & Refund Policy
        </h1>
        <h1 className="text-sm mt-2">
          Our cancellation policy varies depending on the type of tour package
          and the booking date. Generally: Cancellations made more than 30 days
          before the tour date are eligible for a full refund. Cancellations
          made between 15-30 days before the tour date are eligible for a 50%
          refund. Cancellations made within 15 days before the tour date are not
          eligible for a refund.
        </h1>
        <h1 className="text-xl text-[#FF7865]">Refund Duration:</h1>
        <h1 className="text-sm ">
          All refunds are credited to original mode of payment within 21 working
          days from the day of cancellation of the trip.
        </h1>
        <div className="border ml-auto p-2 rounded-lg">
          <Link className="" href="/">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
