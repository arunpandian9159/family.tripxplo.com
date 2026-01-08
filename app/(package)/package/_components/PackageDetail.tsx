"use client";
import React, { useEffect } from "react";
import Inclusions from "./Inclusions";
import Exclusions from "./Exclusions";
import PackageHighlight from "./PackageHighlight";
import HotelData from "./HotelData";
import IternaryStory from "./IternaryStory";
import Book from "./Book";
import Cab from "./Cab";
import PackageImage from "./PackageImage";
import { PackType } from "@/app/types/pack";
import { useDispatch, useSelector } from "react-redux";
import { setActivity } from "@/app/store/features/activitySlice";
import {
  Building2,
  Map,
  Car,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  Plane,
  Train,
  Utensils,
  Coffee,
  UtensilsCrossed,
} from "lucide-react";

interface PropsType {
  pack: PackType;
}

// Section Header Component
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "from-emerald-500 to-emerald-700",
  action,
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  iconBg?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-start gap-4">
      <div
        className={`p-3 bg-gradient-to-br ${iconBg} rounded-xl text-white shadow-lg`}
      >
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {action}
  </div>
);

// Section Divider Component
const SectionDivider = () => (
  <div className="relative py-8">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-dashed border-slate-200" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-white px-4">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const PackageDetail = ({ pack }: PropsType) => {
  const roomCapacityAdults = useSelector(
    (store: any) => store.roomSelect?.room?.totalAdults || 2
  );
  const roomCapacityChild = useSelector(
    (store: any) => store.roomSelect?.room?.totalChilds || 0
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (pack?.packageId) {
      const data = {
        packageName: pack?.packageName,
        packageId: pack?.packageId,
        activity: pack?.activity,
      };
      dispatch(setActivity(data));
    }
  }, [pack, dispatch]);

  // Handle empty pack data
  if (!pack || !pack.packageId) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
            <Sparkles size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  // Check if package is without flight/train based on exclusions
  const isWithoutFlight = pack?.exclusionDetail?.some(
    (exc) =>
      exc?.name?.toLowerCase().includes("flight") ||
      exc?.name?.toLowerCase().includes("airfare") ||
      exc?.name?.toLowerCase().includes("air ticket")
  );
  const isWithoutTrain = pack?.exclusionDetail?.some((exc) =>
    exc?.name?.toLowerCase().includes("train")
  );

  // Extract meal plan info from hotels
  const getMealPlanInfo = () => {
    const mealPlans =
      pack?.hotelMeal?.map((hotel) => hotel?.mealPlan?.toLowerCase()) || [];
    const hasBreakfast = mealPlans.some(
      (mp) => mp === "cp" || mp === "map" || mp === "ap"
    );
    const hasDinner = mealPlans.some((mp) => mp === "map" || mp === "ap");
    const hasAllMeals = mealPlans.some((mp) => mp === "ap");
    return { hasBreakfast, hasDinner, hasAllMeals };
  };
  const { hasBreakfast, hasDinner, hasAllMeals } = getMealPlanInfo();

  return (
    <div className="bg-slate-50 min-h-screen pb-32 lg:pb-20">
      {/* Hero Image */}
      <PackageImage
        img={pack?.packageImg?.[0]}
        name={pack?.packageName}
        packageId={pack?.packageId}
        slug={pack?.slug}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 space-y-0">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8 animate-slide-up">
              <SectionHeader
                icon={Sparkles}
                title="Package Overview"
                subtitle="Everything you need to know"
                iconBg="from-violet-500 to-purple-500"
              />

              {/* Important Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {/* Without Flight/Train Badge */}
                {(isWithoutFlight || isWithoutTrain) && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    {isWithoutFlight && (
                      <Plane size={16} className="text-amber-600" />
                    )}
                    {isWithoutTrain && (
                      <Train size={16} className="text-amber-600" />
                    )}
                    <span className="text-sm font-medium text-amber-700">
                      {isWithoutFlight && isWithoutTrain
                        ? "Land Package Only"
                        : isWithoutFlight
                        ? "Without Flight"
                        : "Without Train"}
                    </span>
                  </div>
                )}

                {/* Meals Included Badges */}
                {hasAllMeals ? (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <UtensilsCrossed size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      All Meals Included
                    </span>
                  </div>
                ) : (
                  <>
                    {hasBreakfast && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Coffee size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
                          Breakfast Included
                        </span>
                      </div>
                    )}
                    {hasDinner && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Utensils size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
                          Dinner Included
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <PackageHighlight
                plan={pack?.planName}
                destinations={pack?.destination}
                noOfDays={pack?.noOfDays}
                noOfNights={pack?.noOfNight}
                totalAdult={roomCapacityAdults}
                totalChild={roomCapacityChild}
                hotelCount={pack?.hotelCount}
                startsFrom={pack?.startFrom}
              />
            </div>

            <SectionDivider />

            {/* Hotels Section */}
            {pack?.hotelMeal && pack.hotelMeal.length > 0 && (
              <>
                <div className="animate-slide-up stagger-1">
                  <SectionHeader
                    icon={Building2}
                    title="Hotels & Stays"
                    subtitle={`${pack.hotelMeal.length} handpicked ${
                      pack.hotelMeal.length === 1 ? "stay" : "stays"
                    }`}
                    iconBg="from-blue-500 to-indigo-500"
                  />
                  <div className="space-y-5">
                    {pack.hotelMeal.map((hotel, index) => (
                      <HotelData
                        key={hotel?._id || index}
                        hotel={hotel}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
                <SectionDivider />
              </>
            )}

            {/* Itinerary Section */}
            <div className="animate-slide-up stagger-2">
              <SectionHeader
                icon={Map}
                title="Your Itinerary"
                subtitle="Day-by-day planned activities"
                iconBg="from-emerald-500 to-teal-500"
              />
              <IternaryStory
                destinations={pack?.destination}
                activity={pack?.activity}
              />
            </div>

            <SectionDivider />

            {/* Transfers Section */}
            {pack?.vehicleDetail?.length > 0 && (
              <>
                <div className="animate-slide-up stagger-3">
                  <SectionHeader
                    icon={Car}
                    title="Transfers"
                    subtitle="Comfortable transportation included"
                    iconBg="from-amber-500 to-orange-500"
                  />
                  <div className="space-y-5">
                    {pack?.vehicleDetail?.map((vehicle, index) => (
                      <Cab key={index} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
                <SectionDivider />
              </>
            )}

            {/* Inclusions & Exclusions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up stagger-4">
              {/* Inclusions Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <SectionHeader
                  icon={CheckCircle2}
                  title="What's Included"
                  iconBg="from-emerald-500 to-green-500"
                />
                <Inclusions inclusions={pack?.inclusionDetail} />
              </div>

              {/* Exclusions Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <SectionHeader
                  icon={XCircle}
                  title="Not Included"
                  iconBg="from-rose-500 to-red-500"
                />
                <Exclusions exclusions={pack?.exclusionDetail} />
              </div>
            </div>
          </div>

          {/* Sidebar (Booking Card) */}
          <div className="lg:w-[380px] flex-shrink-0">
            <Book
              packageId={pack?.packageId}
              price={pack?.finalPackagePrice}
              adult={roomCapacityAdults}
              child={roomCapacityChild}
              gstPer={pack?.gstPer}
              gstPrice={pack?.gstPrice}
              packagePrice={pack?.totalPackagePrice}
              perPerson={pack?.perPerson}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
