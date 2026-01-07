import { useSelector } from 'react-redux';
import { Theme } from '../store/features/selectThemeSlice';
import { RootState } from '../store/store';
import { GetPackageQueryType, getPackages } from '../utils/api/getPackages';
import { useEffect, useState, useRef } from 'react';
import { PackageType } from '../types/package';

export interface DateDestination {
  date: string;
  destination: string;
  destinationId: string;
}

export interface Room {
  perRoom: number;
  totalRooms: number;
  totalAdults: number;
  totalChilds: number;
  roomSchema: InputRoomWithId[];
}

interface InputRoomWithId {
  id: number;
  totalAdults: number;
  totalChilds: number;
}

export const usePackageList = (offset: number) => {
  const roomCapacityData: Room = useSelector((store: any) => store.roomSelect.room);
  const themeSelected: Theme = useSelector((state: RootState) => state.themeSelect);
  const dateAndDestination: DateDestination = useSelector((store: any) => store.searchPackage);

  const [isLoading, setIsLoading] = useState(true);
  const [packageList, setPackageList] = useState<PackageType[]>([]);
  const [err, setErr] = useState<string>('');
  const [packageListHasNext, setPackageListHasNext] = useState(false);

  // Track previous search params to detect changes
  const prevSearchParams = useRef<string>('');
  // Track request ID to handle race conditions
  const requestIdRef = useRef<number>(0);

  useEffect(() => {
    // Use fallback defaults when Redux values are 0 (e.g., direct navigation to /destinations)
    const effectivePerRoom = roomCapacityData.perRoom || 2;
    const effectiveTotalAdults = roomCapacityData.totalAdults || 2;
    const effectiveTotalRooms = roomCapacityData.totalRooms || 1;

    // Calculate extraAdult using effective values
    const extraAdult = effectiveTotalAdults - effectiveTotalRooms * effectivePerRoom;
    const noAdult = extraAdult > 0 ? effectiveTotalAdults - extraAdult : effectiveTotalAdults;

    // Create a search params signature to detect changes
    const currentSearchParams = JSON.stringify({
      destinationId: dateAndDestination.destinationId,
      themeId: themeSelected.themeId,
    });

    // Check if search params changed (new search)
    const isNewSearch = prevSearchParams.current !== currentSearchParams;
    prevSearchParams.current = currentSearchParams;

    // When search params change, always fetch from offset 0
    // Skip fetching if offset is not 0 during a new search (wait for offset to reset)
    const effectiveOffset = isNewSearch ? 0 : offset;

    // If this is a new search but offset is not 0, skip this fetch
    // The parent component will reset offset to 0, triggering another fetch
    if (isNewSearch && offset !== 0) {
      return;
    }

    const payload: GetPackageQueryType = {
      destinationId: dateAndDestination.destinationId,
      interestId: themeSelected.themeId,
      perRoom: effectivePerRoom,
      priceOrder: 1,
      startDate: dateAndDestination.date?.slice(0, 10),
      noAdult: noAdult,
      noChild: roomCapacityData.totalChilds,
      noRoomCount: effectiveTotalRooms,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
      offset: effectiveOffset,
      limit: 10,
    };

    // Increment request ID to track this specific request
    const currentRequestId = ++requestIdRef.current;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resp = await getPackages(payload);

        // Only update state if this is still the latest request
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (effectiveOffset === 0) {
          // Reset list for new search or first page
          setPackageList(resp.result.docs as PackageType[]);
        } else {
          // Append for pagination
          setPackageList(prevPackageList => [
            ...prevPackageList,
            ...(resp.result.docs as PackageType[]),
          ]);
        }
        setPackageListHasNext(resp.result.hasNextPage);
        setErr('');
      } catch (err: any) {
        // Only update state if this is still the latest request
        if (currentRequestId !== requestIdRef.current) {
          return;
        }
        setErr(err.message);
        if (effectiveOffset === 0) {
          setPackageList([]);
        }
      } finally {
        // Only update loading state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [
    offset,
    dateAndDestination.destinationId,
    dateAndDestination.date,
    themeSelected.themeId,
    roomCapacityData.totalAdults,
    roomCapacityData.totalChilds,
    roomCapacityData.totalRooms,
    roomCapacityData.perRoom,
  ]);

  return {
    packageList,
    isLoading,
    packageListHasNext,
    err,
  };
};
