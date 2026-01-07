'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tripxplo.com compatible search parameters
export interface SearchParams {
  destinationId: string;
  destinationName: string;
  interestId: string;
  interestName: string;
  perRoom: number;
  startDate: string;
  noAdult: number;
  noChild: number;
  noRoomCount: number;
  noExtraAdult: number;
  limit: number;
  offset: number;
  priceOrder: number;
}

interface SearchContextType {
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;
  resetSearchParams: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultSearchParams: SearchParams = {
  destinationId: '',
  destinationName: 'Manali',
  interestId: '',
  interestName: 'Couple',
  perRoom: 2,
  startDate: new Date().toISOString().split('T')[0],
  noAdult: 2,
  noChild: 0,
  noRoomCount: 1,
  noExtraAdult: 0,
  limit: 10,
  offset: 0,
  priceOrder: 1,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const STORAGE_KEY = 'tripxplo_search_params';

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParamsState] = useState<SearchParams>(defaultSearchParams);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSearchParamsState({ ...defaultSearchParams, ...parsed });
      }
    } catch (e) {
      console.error('Error loading search params from storage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to sessionStorage whenever params change
  useEffect(() => {
    if (isHydrated) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchParams));
      } catch (e) {
        console.error('Error saving search params to storage:', e);
      }
    }
  }, [searchParams, isHydrated]);

  const setSearchParams = (params: Partial<SearchParams>) => {
    setSearchParamsState(prev => ({ ...prev, ...params }));
  };

  const resetSearchParams = () => {
    setSearchParamsState(defaultSearchParams);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error removing search params from storage:', e);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        setSearchParams,
        resetSearchParams,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export { defaultSearchParams };
