import { useEffect, useState } from "react";
import { PackageType } from "../types/package";

export const useApplyFilter = (
  packageList: PackageType[],
  selectedFilters: string[],
) => {
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);

  useEffect(() => {
    let filter: PackageType[] = packageList;
    let sortOption: "Low to High" | "High to Low" | null = null;

    selectedFilters.forEach((filterCategory) => {
      switch (filterCategory) {
        case "Gold":
        case "Platinum":
        case "Silver": {
          filter = filter.filter(
            (pkg: PackageType) => pkg.planName === filterCategory,
          );
          break;
        }
        case "2N to 4N": {
          filter = filter.filter(
            (pkg: PackageType) => pkg.noOfNight >= 2 && pkg.noOfNight <= 4,
          );
          break;
        }
        case "5N to 7N": {
          filter = filter.filter(
            (pkg: PackageType) => pkg.noOfNight >= 5 && pkg.noOfNight <= 7,
          );
          break;
        }
        case "Low to High":
        case "High to Low": {
          sortOption = filterCategory;
          break;
        }
        default: {
          break;
        }
      }
    });

    if (sortOption) {
      filter =
        sortOption === "Low to High"
          ? filter.sort(
              (a: PackageType, b: PackageType) =>
                a.totalPackagePrice - b.totalPackagePrice,
            )
          : filter.sort(
              (a: PackageType, b: PackageType) =>
                b.totalPackagePrice - a.totalPackagePrice,
            );
    }

    setFilteredPackages(filter);
  }, [selectedFilters, packageList]);

  return filteredPackages;
};
