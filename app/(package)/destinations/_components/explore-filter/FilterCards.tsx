"use client";
import React from "react";
import FilterCardList from "./FilterCardList";
import { PackageType } from "@/app/types/package";
const FilterCards = (props: { packages: PackageType[] }) => {
  return (
    <div className="carousel-container gap-2 flex-col items-center mt-4">
      {props.packages?.map((pkg, index) => (
        <FilterCardList key={index} package={pkg} />
      ))}
    </div>
  );
};

export default FilterCards;
