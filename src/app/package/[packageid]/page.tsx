'use client';
import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import PackageDetail from '../_components/PackageDetail';
import { fetchPackage, initializePackage } from '@/app/store/features/packageSlice';
import PackagesLoading from '@/app/(user-area)/components/loading/PackagesLoading';
import { PackType } from '@/app/types/pack';
import PNF from './(activities)/_components/PNF';
import { useSelector, useDispatch } from 'react-redux';
import { Room } from '@/app/store/features/roomCapacitySlice';
import { selectAdultsChild } from '@/app/store/features/roomCapacitySlice';
import { changeDate } from '@/app/store/features/searchPackageSlice';
import { PackageGetQuery } from '@/app/hooks/usePackage';
import { AppDispatch } from '@/app/store/store';
import { useSearch } from '@/context/SearchContext';
import { changeDestination, changeDestinationId } from '@/app/store/features/searchPackageSlice';

interface DateDestination {
  date?: string;
  destination?: string;
  destinationId?: string;
}

export default function PackageDetails({ params }: { params: Promise<{ packageid: string }> }) {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { searchParams: ctxSearchParams } = useSearch();

  const roomCapacityData = useSelector((store: any) => store.roomSelect?.room);

  const dateAndDestination: DateDestination = useSelector((store: any) => store.searchPackage);
  const pack = useSelector((store: any) => store.package);

  // In Next.js 15+, params is a Promise that must be unwrapped
  const { packageid } = use(params);

  // Read query params from shared URL
  const urlDate = searchParams.get('date');
  const urlAdults = searchParams.get('adults');
  const urlChildren = searchParams.get('children');
  const urlRooms = searchParams.get('rooms');
  const urlHotels = searchParams.get('hotels');

  useEffect(() => {
    // If URL has search params, update Redux state so the user sees the shared search context
    if (urlDate || urlAdults || urlChildren || urlRooms) {
      // Update date in Redux if provided in URL
      if (urlDate) {
        dispatch(changeDate(urlDate));
      }

      // Update room/guest data in Redux if provided in URL
      if (urlAdults || urlChildren || urlRooms) {
        dispatch(
          selectAdultsChild({
            room: {
              adult: urlAdults ? parseInt(urlAdults, 10) : 2,
              child: urlChildren ? parseInt(urlChildren, 10) : 0,
              room: urlRooms ? parseInt(urlRooms, 10) : 1,
            },
          })
        );
      }
    }
  }, [urlDate, urlAdults, urlChildren, urlRooms, dispatch]);

  // Initialize package state when packageid changes to clear old data
  useEffect(() => {
    dispatch(initializePackage());
  }, [packageid, dispatch]);

  useEffect(() => {
    // Prioritize URL params over Redux state for shared links
    const today = new Date().toISOString().slice(0, 10);
    const effectiveDate =
      urlDate || ctxSearchParams?.startDate || dateAndDestination?.date?.slice(0, 10) || today;
    const effectiveAdults = urlAdults
      ? parseInt(urlAdults, 10)
      : ctxSearchParams?.noAdult || roomCapacityData?.totalAdults || 2;
    const effectiveChildren = urlChildren
      ? parseInt(urlChildren, 10)
      : ctxSearchParams?.noChild ?? roomCapacityData?.totalChilds ?? 0;
    const effectiveRooms = urlRooms
      ? parseInt(urlRooms, 10)
      : ctxSearchParams?.noRoomCount || roomCapacityData?.totalRooms || 1;

    const perRoom = ctxSearchParams?.perRoom || roomCapacityData?.perRoom || 2;
    const extraAdult = effectiveAdults - effectiveRooms * perRoom;

    const payload: PackageGetQuery = {
      packageId: packageid,
      startDate: effectiveDate,
      noAdult: extraAdult > 0 ? effectiveAdults - extraAdult : effectiveAdults,
      noChild: effectiveChildren,
      noRoomCount: effectiveRooms,
      noExtraAdult: extraAdult < 0 ? 0 : extraAdult,
      hotels: urlHotels || undefined,
    };

    // Always fetch package data when dependencies change
    dispatch(fetchPackage(payload));
  }, [
    packageid,
    urlDate,
    urlAdults,
    urlChildren,
    urlRooms,
    urlHotels,
    dispatch,
    dateAndDestination?.date,
    roomCapacityData,
    ctxSearchParams, // Add context dependency
  ]);

  // Sync SearchContext to Redux
  useEffect(() => {
    if (ctxSearchParams) {
      // Sync Date & Destination
      if (ctxSearchParams.startDate) {
        dispatch(changeDate(ctxSearchParams.startDate));
      }
      if (ctxSearchParams.destinationId) {
        dispatch(changeDestinationId(ctxSearchParams.destinationId));
      }
      if (ctxSearchParams.destinationName) {
        dispatch(changeDestination(ctxSearchParams.destinationName));
      }

      // Sync Room/Guest Data
      dispatch(
        selectAdultsChild({
          room: {
            adult: ctxSearchParams.noAdult || 2,
            child: ctxSearchParams.noChild || 0,
            room: ctxSearchParams.noRoomCount || 1,
          },
        })
      );
    }
  }, [ctxSearchParams, dispatch]);

  return pack.isLoading ? (
    <div className="w-full min-h-screen flex justify-center items-center">
      <PackagesLoading />
    </div>
  ) : (
    <div>
      <PackageDetail pack={pack.data as PackType} />
    </div>
  );
}
