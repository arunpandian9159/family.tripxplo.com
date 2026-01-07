'use client';
import React, { useMemo } from 'react';
import FilterCategoryList from './FilterCategoryList';
import type { FeaturedPackage } from '@/lib/types';

const FILTER_CATEGORIES = [
  { label: 'All Packages', value: 'all' },
  { label: '2N to 4N', value: '2-4' },
  { label: '5N to 7N', value: '5-7' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Low to High', value: 'price-asc' },
  { label: 'High to Low', value: 'price-desc' },
];

interface ExploreFilterProps {
  allPackages: FeaturedPackage[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ExploreFilter = ({ allPackages, activeFilter, onFilterChange }: ExploreFilterProps) => {
  // Determine which filters should be shown based on available packages
  const availableFilters = useMemo(() => {
    const filters: string[] = ['All Packages']; // Always show "All Packages"

    // Check for night range availability
    const has2to4N = allPackages.some(pkg => pkg.noOfNight >= 2 && pkg.noOfNight <= 4);
    const has5to7N = allPackages.some(pkg => pkg.noOfNight >= 5 && pkg.noOfNight <= 7);

    if (has2to4N) filters.push('2N to 4N');
    if (has5to7N) filters.push('5N to 7N');

    // Check for plan availability
    const hasPlatinum = allPackages.some(pkg => pkg.planName?.toLowerCase() === 'platinum');
    const hasGold = allPackages.some(pkg => pkg.planName?.toLowerCase() === 'gold');
    const hasSilver = allPackages.some(pkg => pkg.planName?.toLowerCase() === 'silver');

    if (hasPlatinum) filters.push('Platinum');
    if (hasGold) filters.push('Gold');
    if (hasSilver) filters.push('Silver');

    // Always show sorting options if there are packages
    if (allPackages.length > 0) {
      filters.push('Low to High');
      filters.push('High to Low');
    }

    return filters;
  }, [allPackages]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div className="flex gap-3">
        {FILTER_CATEGORIES.filter(category => availableFilters.includes(category.label)).map(
          (category, index) => (
            <FilterCategoryList
              key={index}
              label={category.label}
              value={category.value}
              isActive={activeFilter === category.value}
              onClick={() => onFilterChange(category.value)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ExploreFilter;
