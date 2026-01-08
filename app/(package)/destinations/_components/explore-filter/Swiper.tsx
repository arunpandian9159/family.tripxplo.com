"use client";
import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Pagination, Autoplay } from "swiper/modules";
import SwiperCard from "./SwiperCard";

const slideImage = [
  {
    // url:"https://images.pexels.com/photos/2528431/pexels-photo-2528431.jpeg?auto=compress&cs=tinysrgb&w=600__",
    url: "https://tripemilestone.in-maa-1.linodeobjects.com/slider/slider-manali.jpg",
    title: "Manali",
    cost: "7,799",
    packageCategory: "Silver",
  },
  {
    // url: "https://images.pexels.com/photos/758742/pexels-photo-758742.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://tripemilestone.in-maa-1.linodeobjects.com/slider/slider-bali.jpg",
    title: "Bali",
    cost: " 22,000",
    packageCategory: "Platinum",
  },
  {
    // url: "https://images.pexels.com/photos/968625/pexels-photo-968625.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://tripemilestone.in-maa-1.linodeobjects.com/slider/slider-goa.jpg",
    title: "Goa",
    cost: "6,999",
    packageCategory: "Silver",
  },
  //   {
  //     url: "https://images.pexels.com/photos/7086906/pexels-photo-7086906.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     title: "Manali",
  //     cost: "5000",
  //     packageCategory: "Gold",
  //   },
  //   {
  //     url: "https://images.pexels.com/photos/12614389/pexels-photo-12614389.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     title: "Manali",
  //     cost: "5000",
  //     packageCategory: "Platinum",
  //   },
  //   {
  //     url: "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     title: "Indonesia",
  //     cost: " 5000",
  //     packageCategory: "Gold",
  //   },
];
export default function SwiperComponent() {
  return (
    <>
      <Swiper
        pagination={false}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {slideImage.map((s) => (
          <SwiperSlide key={s.title} className="sm:w-full lg:w-full shadow-sm ">
            <SwiperCard
              title={s.title}
              cost={s.cost}
              url={s.url}
              packageCategory={s.packageCategory}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
