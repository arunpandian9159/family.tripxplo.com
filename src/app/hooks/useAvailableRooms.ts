import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateDestination, Room } from './usePackageList';
import { apiRequest } from '@/lib/api-client';

interface RoomQuery {
  noOfNight: number;
  startDate: string;
  noOfChild: number;
  noRoomCount: number;
  noExtraAdult: number;
}

export const useAvailableRooms = () => {
  const prevHotel = useSelector((store: any) => store.hotelChange?.replaceHotel);
  const roomCapacityData: Room = useSelector((store: any) => store.roomSelect.room);
  const dateAndDestination: DateDestination = useSelector((store: any) => store.searchPackage);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchData = useCallback(async (payload: RoomQuery, hotelId: string) => {
    if (!hotelId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        noOfNight: payload.noOfNight.toString(),
        startDate: payload.startDate,
        noOfChild: payload.noOfChild.toString(),
        noRoomCount: payload.noRoomCount.toString(),
        noExtraAdult: payload.noExtraAdult.toString(),
      }).toString();

      const response = await apiRequest<unknown[]>(`packages/${hotelId}/hotel?${queryParams}`);

      if (response.success && response.data) {
        setRooms(response.data as any);
      } else {
        setRooms([]);
      }
    } catch (err: any) {
      setErr(err.message || 'An error occurred');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!prevHotel?.hotelId || !roomCapacityData) {
      setLoading(false);
      return;
    }

    // Use fallback of 2 for perRoom when it's 0 (default) - matches usePackageList.ts logic
    const effectivePerRoom = roomCapacityData.perRoom || 2;
    const extraAdult =
      roomCapacityData.totalAdults - roomCapacityData.totalRooms * effectivePerRoom;
    const payload = {
      noOfNight: prevHotel.noOfNight || 1,
      startDate: dateAndDestination.date?.slice(0, 10) || '',
      noOfChild: roomCapacityData.totalChilds || 0,
      noRoomCount: roomCapacityData.totalRooms || 1,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
    };
    fetchData(payload, prevHotel.hotelId);
  }, [fetchData, prevHotel, dateAndDestination.date, roomCapacityData]);

  return { rooms, isLoading, err };
};
