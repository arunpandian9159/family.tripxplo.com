"use client";

import { useAppSelector } from "@/app/store/store";
import { format } from "date-fns";
import ChangeDate from "./ChangeDate";
import ChangeDestination from "./ChangeDestination";
import ChangeInterest from "./ChangeInterest";
import ChangePersons from "./ChangePersons";

export default function SelectedData() {
  const searchPackageState = useAppSelector((state) => state.searchPackage);
  const interestState = useAppSelector((state) => state.themeSelect);
  const peopleSelectedState = useAppSelector((state) => state.roomSelect);

  return (
    <div className="mt-4 sm:hidden lg:flex lg:fixed lg:bg-white lg:top-4 lg:z-100 lg:left-0 lg:right-0 lg:mx-auto gap-2  justify-evenly border w-fit mx-auto p-1 items-center rounded-md border-neutral-100 shadow-sm">
      <ChangeDate date={searchPackageState.date} />
      <ChangeDestination />
      <ChangeInterest interestName={interestState.theme} />
      <ChangePersons
        roomCount={peopleSelectedState.room.totalRooms}
        childCount={peopleSelectedState.room.totalChilds}
        adultCount={peopleSelectedState.room.totalAdults}
      />
    </div>
  );
}
