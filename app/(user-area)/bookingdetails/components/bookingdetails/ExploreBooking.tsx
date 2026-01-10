"use client";
import { ArrowLeft, Receipt, Loader2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import BookingDetails from "./BookingDetails";
import { useState, useEffect, useRef } from "react";
import { bookingStatus } from "@/app/utils/api/bookingStatus";
import { formatIndianCurrency } from "@/lib/utils";

const Booking = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 10;

  function clickBack() {
    router.push("/mybookings");
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const getBookingDetails = async () => {
      try {
        const urlSpilt = window.location.pathname.split("/");
        const id = urlSpilt.pop();

        if (!id) {
          setError(true);
          return;
        }

        const response = await bookingStatus(id);

        if (response?.data?.result) {
          setData(response.data.result);
          setVerified(true);
        } else if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          timer = setTimeout(getBookingDetails, 1000);
        } else {
          setError(true);
        }
      } catch (err) {
        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          timer = setTimeout(getBookingDetails, 1000);
        } else {
          setError(true);
        }
      }
    };

    getBookingDetails();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="p-6 bg-red-50 rounded-full mb-6 mx-auto w-fit">
            <Receipt className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            We couldn&apos;t fetch your booking details. Please try again later.
          </p>
          <button
            onClick={clickBack}
            className="px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-gold-500/20 hover:shadow-lg hover:shadow-gold-500/30 active:scale-[0.98]"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading booking details...
          </p>
          <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Check if this is an EMI booking
  const hasEmi =
    data?.isEmiBooking ||
    (data?.emiMonths && data.emiMonths > 0) ||
    (data?.emiDetails && data.emiDetails.totalTenure > 0);
  const emiMonths = data?.emiMonths || data?.emiDetails?.totalTenure || 6;
  const emiAmount = data?.emiAmount || data?.emiDetails?.monthlyAmount || 0;
  const paidEmis =
    data?.paidEmis ||
    data?.emiDetails?.paidCount ||
    data?.currentEmiNumber ||
    0;
  const remainingEmis = Math.max(0, emiMonths - paidEmis);

  // Build events based on booking status
  const getEvents = () => {
    const events = [
      {
        heading:
          "Booking " +
          (data?.status === "confirmed"
            ? "Confirmed"
            : data?.status === "pending"
            ? "Pending"
            : data?.status === "failed"
            ? "Failed"
            : "Processing"),
        subHeading: data?.planName
          ? `${data.planName} Package`
          : hasEmi
          ? "Prepaid EMI Package"
          : "Package Booked",
        status:
          data?.status === "confirmed"
            ? "completed"
            : data?.status === "failed"
            ? "failed"
            : "active",
      },
    ];

    if (data?.status === "failed") {
      events.push({
        heading: "Payment Failed",
        subHeading: "Please try booking again",
        status: "failed",
      });
    } else if (hasEmi) {
      // EMI-specific timeline
      if (paidEmis >= 1) {
        events.push({
          heading: `EMI ${paidEmis} Paid`,
          subHeading: `${formatIndianCurrency(emiAmount)} received`,
          status: "completed",
        });
      }

      if (remainingEmis > 0) {
        events.push({
          heading: `Next EMI Due`,
          subHeading: `${formatIndianCurrency(emiAmount)} - EMI ${
            paidEmis + 1
          } of ${emiMonths}`,
          status: "active",
        });

        if (remainingEmis > 1) {
          events.push({
            heading: `${remainingEmis} EMIs Remaining`,
            subHeading: `Total remaining: ${formatIndianCurrency(
              emiAmount * remainingEmis
            )}`,
            status: "pending",
          });
        }
      } else {
        events.push({
          heading: "All EMIs Paid",
          subHeading: "Full payment completed",
          status: "completed",
        });
      }

      events.push({
        heading: "Ready to Travel",
        subHeading: data?.fullStartDate
          ? `Travel on ${data.fullStartDate}`
          : "Enjoy your trip!",
        status:
          data?.status === "confirmed" && remainingEmis === 0
            ? "completed"
            : "pending",
      });
    } else if (data?.balanceAmount > 0) {
      events.push({
        heading: "Partially Paid",
        subHeading:
          "Next payment before " + (data?.fullStartDate || "travel date"),
        status: "active",
      });
      events.push({
        heading: "Balance Payment",
        subHeading: `${formatIndianCurrency(
          data.balanceAmount
        )} due before travel`,
        status: "pending",
      });
    } else {
      events.push({
        heading: "Payment Complete",
        subHeading: "Full payment received",
        status: "completed",
      });
      events.push({
        heading: "Ready to Travel",
        subHeading: data?.fullStartDate
          ? `Travel on ${data.fullStartDate}`
          : "Enjoy your trip!",
        status: data?.status === "confirmed" ? "completed" : "pending",
      });
    }

    return events;
  };

  const events = getEvents();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="section-container">
          <div className="flex items-center gap-4 py-4 md:py-5">
            <button
              onClick={clickBack}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gold-500" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gold-500 to-amber-500 bg-clip-text text-transparent">
                Booking Details
              </h1>
              <p className="text-slate-500 text-sm hidden sm:block">
                {hasEmi
                  ? "Track your EMI payments and booking status"
                  : "Track your payment and booking status"}
              </p>
            </div>
            {hasEmi && (
              <div className="px-3 py-1.5 bg-gold-100 rounded-full flex items-center gap-1.5">
                <Wallet size={14} className="text-gold-600" />
                <span className="text-xs font-bold text-gold-700">
                  {paidEmis}/{emiMonths} EMIs
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-600 rounded-full text-sm font-medium mb-4">
              {hasEmi ? (
                <>
                  <Wallet className="w-4 h-4" />
                  Prepaid EMI Booking
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  Your Package Booking
                </>
              )}
            </div>
            <p className="text-slate-500">
              {hasEmi
                ? "Review your EMI schedule and booking details below"
                : "Review your booking timeline and details below"}
            </p>
          </div>

          <BookingDetails pack={data} events={events} />
        </div>
      </div>
    </div>
  );
};

export default Booking;
