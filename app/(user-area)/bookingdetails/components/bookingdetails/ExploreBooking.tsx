"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import BookingDetails from "./BookingDetails";
import Book from "./Book";
import { bookingStatus } from "@/app/utils/api/bookingStatus";
import { Receipt, Loader2 } from "lucide-react";

const BookingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const getBookingDetails = async () => {
      const bookingId = searchParams.get("id");

      if (!bookingId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await bookingStatus(bookingId);

        if (response?.data?.result) {
          setData(response.data.result);
          setLoading(false);
        } else if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          timer = setTimeout(getBookingDetails, 1000);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          timer = setTimeout(getBookingDetails, 1000);
        } else {
          setError(true);
          setLoading(false);
        }
      }
    };

    getBookingDetails();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchParams]);

  // Build events based on booking status
  const getEvents = () => {
    if (!data) return [];

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
    } else if (data?.balanceAmount > 0) {
      events.push({
        heading: "Partially Paid",
        subHeading:
          "Next payment before " + (data?.fullStartDate || "travel date"),
        status: "active",
      });
      events.push({
        heading: "Balance Payment",
        subHeading: `₹${data.balanceAmount.toLocaleString(
          "en-IN",
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading booking details...
          </p>
          <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
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
            onClick={() => router.push("/mybookings")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const events = getEvents();

  return (
    <div className="min-h-screen bg-slate-50 pb-32 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="section-container py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Booking Details
              </h1>
              <p className="text-slate-500 text-sm md:text-base mt-0.5">
                Track your payment and booking status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium mb-4">
              <Receipt className="w-4 h-4" />
              Your Package Booking
            </div>
            <p className="text-slate-500">
              Review your booking timeline and details below
            </p>
          </div>

          <BookingDetails events={events} booking={data} />
        </div>
      </div>

      {/* Footer Action */}
      <Book booking={data} />
    </div>
  );
};

const Booking = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
};

export default Booking;
