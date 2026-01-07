import { useEffect, useState } from "react";
import { useAppSelector } from "../store/store";
import { PackageType } from "../types/package";

export const useFilterPackages = (packageList: PackageType[]) => {
  const filterCategory = useAppSelector((state) => state.filterCategory.filterCategory);
  
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);

  useEffect(() => {
    let filter: PackageType[] = [];

    switch (filterCategory) {
      case "Gold":
      case "Platinum":
      case "Silver": {
        filter = packageList.filter((pkg: PackageType) => pkg.planName === filterCategory);
        break;
      }
      case "Low to High": {
        filter = [...packageList].sort((a: PackageType, b: PackageType) => a.totalPackagePrice - b.totalPackagePrice);
        break;
      }
      case "High to Low": {
        filter = [...packageList].sort((a: PackageType, b: PackageType) => b.totalPackagePrice - a.totalPackagePrice);
        break;
      }
      case "2N to 4N": {
        filter = packageList.filter((pkg: PackageType) => pkg.noOfNight >= 2 && pkg.noOfNight <= 4);
        break;
      }
      case "5N to 7N": {
        filter = packageList.filter((pkg: PackageType) => pkg.noOfNight >= 5 && pkg.noOfNight <= 7);
        break;
      }
      default: {
        filter = packageList;
        break;
      }
    }

    setFilteredPackages(filter);
  }, [filterCategory, packageList]);

  return filteredPackages;
};