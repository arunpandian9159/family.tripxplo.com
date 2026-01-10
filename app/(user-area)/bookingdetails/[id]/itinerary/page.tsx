"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingStatus } from "@/app/utils/api/bookingStatus";
import FullItinerary from "../../components/bookingdetails/FullItinerary";
import { Loader2, Receipt, ArrowLeft } from "lucide-react";

const ItineraryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const retryCount = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const getBookingDetails = async () => {
      try {
        if (!id) {
          setError(true);
          return;
        }

        const response = await bookingStatus(id);

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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">
            Loading your itinerary...
          </p>
          <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="p-6 bg-red-50 rounded-full mb-6 mx-auto w-fit">
            <Receipt className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Itinerary Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            We couldn't fetch the itinerary for this booking. It might be
            unavailable or missing.
          </p>
          <button
            onClick={() => router.push(`/bookingdetails/${id}`)}
            className="w-full px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  const activity = data?.activity || [];
  const packageName = data?.packageName || "Your Trip";
  const packageImage = data?.packageImg?.[0] || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <FullItinerary
        activity={activity}
        packageName={packageName}
        packageImage={packageImage}
        onBack={() => router.push(`/bookingdetails/${id}`)}
      />
    </div>
  );
};

export default ItineraryPage;
