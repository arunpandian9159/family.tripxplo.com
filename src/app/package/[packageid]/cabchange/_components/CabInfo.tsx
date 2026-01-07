'use client';
import React from 'react';
import { HotelMeal } from '@/app/types/pack';
import { useSelector } from 'react-redux';
import { HotelChangeDataType } from '@/app/types/hotel';
import CabInfoList from './CabInfoList';
import { VehicleDetail } from '@/app/types/vehicle';

const FilterCards = ({ cabData }: { cabData: VehicleDetail[] }) => {
  // const prevHotel = useSelector(
  //   (store: any) => store.hotelChange?.replaceHotel
  // );
  const prevCab = useSelector((store: any) => store.cabChange?.replaceCab);
  return (
    // <div className="carousel-container gap-5 flex-col items-center mt-4">
    <div className="px-5 flex-col lg:grid lg:grid-cols-3 lg:gap-4 items-center my-3 ">
      {cabData.map((cab, index) => (
        <div key={index} className="">
          <CabInfoList cab={cab} prevCab={prevCab} />
        </div>
      ))}
    </div>
  );
};

export default FilterCards;
