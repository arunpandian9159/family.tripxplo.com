'use client';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import RoomDetail from './RoomDetail';
import PackagesLoadingFull from '@/app/(user-area)/components/loading/PackagesLoadingFull';
import { useAvailableRooms } from '@/app/hooks/useAvailableRooms';
const ExploreRoom = () => {
  const prevHotel = useSelector((store: any) => store.hotelChange?.replaceHotel);
  const loading = useSelector((store: any) => store.package.isLoading);
  const { rooms, isLoading, err } = useAvailableRooms();
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [filteredRooms, setFilteredRooms] = useState([]);
  useEffect(() => {
    if (rooms?.length > 0) {
      setFilteredRooms(rooms.filter((room: any) => room.mealPlan.length > 0));
      setLoadingRooms(false);
    }
  }, [rooms]);

  return isLoading || loading || loadingRooms ? (
    <PackagesLoadingFull />
  ) : (
    <>
      <h1 className=" pt-28 lg:my-5 pb-4 text-[#FF5F5F] text-center font-Poppins text-[18px] font-semibold not-italic leading-normal tracking-[0.18px]">
        {prevHotel.hotelName}
      </h1>
      {filteredRooms?.length > 0 && (
        <h1 className=" mb-[30px] text-[#5D6670] text-center font-Poppins text-[16px] font-semibold not-italic leading-normal tracking-[0.18px]">
          {filteredRooms?.length} {filteredRooms?.length === 1 ? 'Room' : 'Rooms'} Available
        </h1>
      )}
      <div className=" flex flex-col lg:grid lg:grid-cols-3 lg:gap-4  px-2 lg:px-10">
        {filteredRooms?.length > 0 ? (
          filteredRooms.map((room, i) => <RoomDetail key={i} room={room} />)
        ) : (
          <p>No rooms available</p>
        )}
      </div>
    </>
  );
};

export default ExploreRoom;
