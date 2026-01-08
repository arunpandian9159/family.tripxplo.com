import { useCallback, useEffect, useState } from "react";
import { PackType } from "../types/pack";
import { DateDestination, Room } from "./usePackageList";
import { useSelector } from "react-redux";
import { packagesApi } from "@/lib/api-client";

export interface PackageGetQuery {
  packageId: string;
  startDate: string;
  noAdult: number;
  noChild: number;
  noRoomCount: number;
  noExtraAdult: number;
  hotels?: string;
}

export const usePackage = (packageId: string) => {
  const [isLoading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [pack, setPack] = useState<PackType>();

  const roomCapacityData: Room = useSelector(
    (store: any) => store.roomSelect.room,
  );

  const dateAndDestination: DateDestination = useSelector(
    (store: any) => store.searchPackage,
  );

  const fetchData = useCallback(
    async (payload: PackageGetQuery) => {
      setLoading(true);
      try {
        const response = await packagesApi.getById(packageId);

        if (response.success && response.data) {
          // Handle the response data format - API returns { result: [...] }
          const data = response.data as
            | { result?: PackType[] }
            | PackType
            | PackType[];
          if (
            data &&
            typeof data === "object" &&
            "result" in data &&
            Array.isArray(data.result)
          ) {
            setPack(data.result[0]);
          } else if (Array.isArray(data)) {
            setPack(data[0]);
          } else {
            setPack(data as PackType);
          }
        } else {
          setErr("Failed to fetch package");
        }
      } catch (err: any) {
        setErr(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [packageId],
  );

  useEffect(() => {
    const extraAdult =
      roomCapacityData.totalAdults -
      roomCapacityData.totalRooms * roomCapacityData.perRoom;
    const noAdult =
      extraAdult > 0
        ? roomCapacityData?.totalAdults - extraAdult
        : roomCapacityData?.totalAdults;

    const payload = {
      packageId: packageId,
      startDate: dateAndDestination?.date?.slice(0, 10),
      noAdult: noAdult,
      noChild: roomCapacityData?.totalChilds,
      noRoomCount: roomCapacityData?.totalRooms,
      noExtraAdult: extraAdult < 0 ? 0 : extraAdult,
    };
    fetchData(payload);
  }, [fetchData]);

  return {
    pack,
    isLoading,
    err,
  };
};
