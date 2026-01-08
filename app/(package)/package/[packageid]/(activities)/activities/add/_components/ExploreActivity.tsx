"use client";
import ActivityDetails from "./ActivityDetails";
import React, { useEffect, useState } from "react";
import ActivityFilter from "./ActivityFilter";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useAvailableActivity } from "@/app/hooks/useAvailableActivity";
import PackagesLoadingFull from "@/app/(user-area)/components/loading/PackagesLoadingFull";
const ExploreFilter = () => {
  const activityData = useSelector((store: any) => store.activity);
  const searchParams = useSearchParams();
  const day = searchParams.get("day");
  const slot = searchParams.get("slot");
  const destination = searchParams.get("destination");
  const availableActivity = useAvailableActivity(
    activityData.packageId,
    destination as string,
  );
  return availableActivity.isLoading ? (
    <PackagesLoadingFull />
  ) : (
    <div>
      <h1
        className="text-center ml-[16px] mt-[140px]  font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
        style={{
          textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
          backgroundImage:
            "linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {availableActivity?.activity.length}{" "}
        {availableActivity?.activity.length > 1 ? "Activities" : "Activity"}
      </h1>
      <div>
        <ActivityFilter />
      </div>
      <div className="mt-[31px] flex justify-center">
        <ActivityDetails
          activities={availableActivity?.activity}
          slot={Number(slot) >= 0 ? Number(slot) : 0}
          day={Number(day) >= 0 ? Number(day) : 0}
        />
      </div>
    </div>
  );
};

export default ExploreFilter;
