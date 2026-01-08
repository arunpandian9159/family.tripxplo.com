import { useEffect, useState, useCallback } from "react";
import { PackageType } from "../types/package";
import { getAllBookings } from "../utils/api/getAllBookings";
import { GetPackageQueryType } from "../utils/api/getPackages";

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

export const useBookingList = (offset: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingList, setBookingList] = useState<PackageType[]>([]);
  const [err, setErr] = useState<string>("");
  const [bookingListHasNext, setBookingListHasNext] = useState(false);

  const fetchData = useCallback(
    async (payload: GetPackageQueryType) => {
      setIsLoading(true);
      try {
        const resp = await getAllBookings(offset, 10);
        if (offset === 0) {
          setBookingList(resp.result.docs as PackageType[]);
        } else {
          setBookingList((prevPackageList) => [
            ...prevPackageList,
            ...(resp.result.docs as PackageType[]),
          ]);
        }
        setBookingListHasNext(resp.result.hasNextPage);
      } catch (err: any) {
        setErr(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [offset]
  );

  useEffect(() => {
    const payload = {};
    fetchData(payload);
  }, [offset]);

  return {
    bookingList,
    isLoading,
    bookingListHasNext,
    err,
  };
};
