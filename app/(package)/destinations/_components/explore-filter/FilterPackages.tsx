"use client";
import { useAppSelector } from "@/app/store/store";
import React, { useState } from "react";
import { PackageType } from "@/app/types/package";
import { useApplyFilter } from "@/app/hooks/useApplyFilters";
import { FILTER_CATEGORIES } from "@/app/utils/constants/filterCategories";
import { useDispatch } from "react-redux";
import PackageCard from "./PackageCard";

interface FilterPackagesProps {
  packageList: PackageType[];
}

const FilterPackages = ({ packageList }: FilterPackagesProps) => {
  const dispatch = useDispatch();
  const destination = useAppSelector(
    (state) => state.searchPackage.destination,
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filtersToApply, setFiltersToApply] = useState<string[]>([]);

  const filteredPackages = useApplyFilter(packageList, filtersToApply);

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  };

  const applyFilters = () => {
    setFiltersToApply(selectedFilters);
  };

  return (
    <div className="lg:flex sm:hidden items-start mt-4 h-full space-x-5">
      <div className="w-1/5 h-[70vh] rounded-2xl border p-4 bg-white shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold text-app-primary">
            {destination}
          </h1>
          <div className="mt-4 space-y-2">
            {FILTER_CATEGORIES.map((category: any) => (
              <div key={category.label} className="flex items-center">
                <input
                  id={category.label}
                  type="checkbox"
                  value={category.label}
                  checked={selectedFilters.includes(category.label)}
                  onChange={() => handleFilterChange(category.label)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor={category.label}
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 p-2 bg-app-primary text-white rounded-md shadow hover:bg-app-primary-dark transition duration-300"
        >
          Apply Filters
        </button>
      </div>
      <div className="w-4/5 h-full  p-4 overflow-y-auto bg-white ">
        {filteredPackages.map((pkg: PackageType) => (
          <div key={pkg.packageId} className=" p-4 mb-2">
            <PackageCard
              packageName={pkg.packageName}
              imageUrl={pkg.packageImg[0]}
              numberOfNights={pkg.noOfNight}
              numberOfDays={pkg.noOfDays}
              startsFrom={pkg.startFrom}
              costPerPerson={pkg.perPerson}
              hotelCount={pkg.hotelCount}
              cabCount={pkg.vehicleCount}
              activityCount={pkg.activityCount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPackages;
