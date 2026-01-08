import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateDestination, Room } from "./usePackageList";
import { apiRequest } from "@/lib/api-client";

export interface HotelQuery {
  noOfNight: number;
  startDate: string;
  noOfChild: number;
  noRoomCount: number;
  noExtraAdult: number;
}

interface HotelResponse {
  hotelDetail: Array<{
    destinationId: string;
    [key: string]: unknown;
  }>;
}

export const useAvailableHotels = (
  packageId: string,
  destinationId: string,
) => {
  const roomCapacityData: Room = useSelector(
    (store: any) => store.roomSelect.room,
  );
  const dateAndDestination: DateDestination = useSelector(
    (store: any) => store.searchPackage,
  );
  const prevHotel = useSelector(
    (store: any) => store.hotelChange?.replaceHotel,
  );
  const [hotel, setHotel] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchData = useCallback(
    async (payload: HotelQuery) => {
      if (!packageId) {
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

        const response = await apiRequest<HotelResponse[]>(
          `packages/${packageId}/available?${queryParams}`,
        );

        if (response.success && response.data) {
          const data = response.data;
          const filteredHotels = data[0]?.hotelDetail || [];
          setHotel(filteredHotels as any);
        } else {
          setHotel([]);
        }
      } catch (err: any) {
        setErr(err.message || "An error occurred");
        setHotel([]);
      } finally {
        setLoading(false);
      }
    },
    [packageId, destinationId],
  );

  useEffect(() => {
    if (!packageId || !roomCapacityData) {
      setLoading(false);
      return;
    }

    const extraAdult =
      roomCapacityData.totalAdults -
      roomCapacityData.totalRooms * roomCapacityData.perRoom;
    const payload = {
      noOfNight: prevHotel?.noOfNight || 1,
      startDate: dateAndDestination.date?.slice(0, 10) || "",
      noOfChild: roomCapacityData.totalChilds || 0,
      noRoomCount: roomCapacityData.totalRooms || 1,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
    };
    fetchData(payload);
  }, [
    fetchData,
    prevHotel?.noOfNight,
    dateAndDestination.date,
    roomCapacityData,
    packageId,
  ]);

  return { hotel, isLoading, err };
};
