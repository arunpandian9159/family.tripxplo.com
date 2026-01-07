import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateDestination, Room } from './usePackageList';
import { apiRequest } from '@/lib/api-client';

export interface ActivityQuery {
  noOfNight: number;
  startDate: string;
  noOfChild: number;
  noRoomCount: number;
  noExtraAdult: number;
}

interface ActivityResponse {
  activityDetails: Array<{
    destinationId: string;
    [key: string]: unknown;
  }>;
}

export const useAvailableActivity = (packageId: string, destinationId: string) => {
  const roomCapacityData: Room = useSelector((store: any) => store.roomSelect.room);

  const dateAndDestination: DateDestination = useSelector((store: any) => store.searchPackage);
  const [activity, setActivity] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchData = useCallback(
    async (payload: ActivityQuery) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          noOfNight: payload.noOfNight.toString(),
          startDate: payload.startDate,
          noOfChild: payload.noOfChild.toString(),
          noRoomCount: payload.noRoomCount.toString(),
          noExtraAdult: payload.noExtraAdult.toString(),
        }).toString();

        const response = await apiRequest<ActivityResponse[]>(
          `packages/${packageId}/activities?${queryParams}`
        );

        if (response.success && response.data) {
          const filteredActivities =
            response.data[0]?.activityDetails?.filter(
              (item: any) => item?.destinationId === destinationId
            ) || [];
          setActivity(filteredActivities as any);
        }
      } catch (err: any) {
        setErr(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [packageId, destinationId]
  );

  useEffect(() => {
    // Use fallback of 2 for perRoom when it's 0 (default) - matches usePackageList.ts logic
    const effectivePerRoom = roomCapacityData.perRoom || 2;
    const extraAdult =
      roomCapacityData.totalAdults - roomCapacityData.totalRooms * effectivePerRoom;
    const payload = {
      noOfNight: 1,
      startDate: dateAndDestination.date?.slice(0, 10) || '',
      noOfChild: roomCapacityData.totalChilds || 0,
      noRoomCount: roomCapacityData.totalRooms || 1,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
    };
    fetchData(payload);
  }, [fetchData, dateAndDestination.date, roomCapacityData]);

  return { activity, isLoading, err };
};
