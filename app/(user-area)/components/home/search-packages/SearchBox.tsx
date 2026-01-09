"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// PackageThemes removed - this project only shows Family themed packages
import SearchDestination from "./SearchDestination";
import DateBox from "./DateBox";
import OptionsBox from "./OptionsBox";
import { useAppSelector } from "@/app/store/store";
import {
  changeDestination,
  changeDestinationId,
} from "@/app/store/features/searchPackageSlice";

// Popular destinations with their IDs
const popularDestinations = [
  { name: "Andaman", id: "385f0338-9b64-4c06-98e8-251706793f0e" },
  { name: "Bali", id: "4ebe5f1e-99d4-4dbb-a4e5-538a353ba81c" },
  { name: "Goa", id: "1961511a-2d52-4dc4-95f5-9478c3e9a04f" },
  { name: "Ooty", id: "f9b8a4f8-227a-4464-a650-c30b8ec7f914" },
  { name: "Manali", id: "9380c50d-62ee-443b-a5c9-6beb90770e8f" },
];

const SearchBox = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [disable, setDisable] = useState(false);

  // Dropdown state management for sequential flow
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const destinationName = useAppSelector(
    (store: any) => store.searchPackage.destination
  );
  const date = useAppSelector((store: any) => store.searchPackage.date);
  const roomCapacityData = useSelector(
    (store: any) => store.roomSelect.room.totalAdults
  );

  // Family type data from Redux
  const familyTypeName = useSelector(
    (store: any) => store.roomSelect.room.familyTypeName
  );
  const isFamilyTypeSelected = useSelector(
    (store: any) => store.roomSelect.room.isFamilyTypeSelected
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Enable search button - minimal validation
    // Users can search even without all fields filled
    setDisable(false);
  }, [destinationName, date, roomCapacityData]);

  // Derived state to check if all fields are filled for animation
  // Only check if mounted to avoid hydration mismatch
  const isReadyToSearch =
    mounted &&
    Boolean(
      destinationName &&
        destinationName.length > 0 &&
        date &&
        roomCapacityData > 0
    );

  const handleNextPage = useCallback(() => {
    router.push(`/destinations`);
  }, [router]);

  const handleQuickTag = useCallback(
    (destination: { name: string; id: string }) => {
      dispatch(changeDestination(destination.name));
      dispatch(changeDestinationId(destination.id));
      // After quick tag selection, open calendar
      setTimeout(() => setIsCalendarOpen(true), 150);
    },
    [dispatch]
  );

  // Callback when destination is selected - open calendar
  const handleDestinationSelect = useCallback(() => {
    setIsCalendarOpen(true);
  }, []);

  // Callback when date is selected - open guests
  const handleDateSelect = useCallback(() => {
    setIsGuestsOpen(true);
  }, []);

  // Handle calendar open state change
  const handleCalendarOpenChange = useCallback((open: boolean) => {
    setIsCalendarOpen(open);
  }, []);

  // Handle guests open state change
  const handleGuestsOpenChange = useCallback((open: boolean) => {
    setIsGuestsOpen(open);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4">
      {/* Theme selector removed - this project only shows Family themed packages */}

      {/* Family Type Badge - shown when detected/selected */}
      {mounted && familyTypeName && (
        <div className="w-full flex justify-center mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">
              {isFamilyTypeSelected ? "Selected" : "Detected"}:
            </span>
            <span className="text-sm font-semibold text-emerald-800">
              {familyTypeName}
            </span>
          </div>
        </div>
      )}

      {/* Main Search Card - overflow-visible allows dropdowns to show */}
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-3 lg:p-4 relative overflow-visible">
        <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-0 overflow-visible">
          {/* Destination */}
          <div className="flex-1 relative group min-w-0 overflow-visible">
            <div className="flex items-center h-14 lg:h-16 px-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-focus-within:bg-emerald-100 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <SearchDestination
                className="flex-1 ml-3"
                onDestinationSelect={handleDestinationSelect}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:flex items-center px-2">
            <div className="w-px h-10 bg-slate-200" />
          </div>

          {/* Date */}
          <div className="flex-1 relative group min-w-0 overflow-visible">
            <div className="flex items-center h-14 lg:h-16 px-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-focus-within:bg-emerald-100 transition-colors">
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <DateBox
                className="flex-1 ml-3"
                isOpen={isCalendarOpen}
                onDateSelect={handleDateSelect}
                onOpenChange={handleCalendarOpenChange}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:flex items-center px-2">
            <div className="w-px h-10 bg-slate-200" />
          </div>

          {/* Guests */}
          <div className="flex-1 relative group min-w-0 overflow-visible">
            <div className="flex items-center h-14 lg:h-16 px-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-focus-within:bg-blue-100 transition-colors">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <OptionsBox
                className="flex-1 ml-3"
                isOpen={isGuestsOpen}
                onOpenChange={handleGuestsOpenChange}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:ml-3 mt-2 lg:mt-0">
            <Button
              onClick={handleNextPage}
              disabled={disable}
              variant="primary"
              size="lg"
              className={`w-full lg:w-auto h-14 lg:h-16 px-8 rounded-2xl shadow-lg transition-all duration-300 ${
                isReadyToSearch
                  ? "animate-slow-glow ring-2 ring-emerald-200"
                  : "shadow-emerald-500/25"
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-sm">
        <span className="text-slate-500 font-medium">Popular:</span>
        {popularDestinations.map((dest) => (
          <button
            key={dest.id}
            onClick={() => handleQuickTag(dest)}
            className={`px-4 py-2 border rounded-full transition-all font-medium ${
              mounted && destinationName === dest.name
                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-sm"
            }`}
          >
            {dest.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
