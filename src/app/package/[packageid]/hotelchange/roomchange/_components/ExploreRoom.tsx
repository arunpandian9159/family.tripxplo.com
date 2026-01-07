'use client';
import { ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomDetail from './RoomDetail';
import { HotelChangeDataType } from '@/app/types/hotel';
import PackagesLoadingFull from '@/app/(user-area)/components/loading/PackagesLoadingFull';
const ExploreRoom = () => {
  const [loading, setLoading] = useState(true);
  const hotel: HotelChangeDataType = useSelector((store: any) => store.hotelChange.hotelData);
  const isLoading = useSelector((store: any) => store.package.isLoading);
  useEffect(() => {
    setLoading(false);
  }, []);
  return loading || isLoading ? (
    <PackagesLoadingFull />
  ) : (
    <>
      <h1 className=" pt-28 mb-[30px] text-[#FF5F5F] text-center font-Poppins text-[18px] font-semibold not-italic leading-normal tracking-[0.18px]">
        {hotel?.hotelName}
      </h1>
      <h1 className=" mb-[30px] text-[#5D6670] text-center font-Poppins text-[18px] font-semibold not-italic leading-normal tracking-[0.18px]">
        {hotel?.hotelRoom?.length} Rooms sAvailable
      </h1>
      <div className=" flex flex-col lg:grid lg:grid-cols-3  lg:gap-4  px-2 lg:px-10">
        {hotel?.hotelRoom?.map((room, i) => (
          <RoomDetail key={i} room={room} />
        ))}
      </div>
    </>
  );
};

export default ExploreRoom;
