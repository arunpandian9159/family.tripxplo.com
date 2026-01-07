'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Star, PlayCircle, Users } from 'lucide-react';
import { FaGoogle, FaInstagram } from 'react-icons/fa6';

const reviews = [
  {
    id: 1,
    name: 'Happy New Year',
    location: 'Memories for a lifetime!',
    image: '/stories/story-1.jpg',
    platform: 'instagram',
    rating: 5,
    text: 'Memories for a lifetime!',
    link: 'https://www.instagram.com/p/DHLTB7Ey0B5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 2,
    name: 'Shimla & Manali',
    location: 'Honeymoon',
    image: '/stories/story-2.jpg',
    platform: 'instagram',
    rating: 5,
    text: "Can't wait for the next one",
    link: 'https://www.instagram.com/p/DHNplicyl_i/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 3,
    name: 'Manali Trip',
    location: 'Honeymoon',
    image: '/stories/story-3.jpg',
    platform: 'instagram',
    rating: 5,
    text: 'Highly recommended!',
    link: 'https://www.instagram.com/p/DHgRKyiyM5I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 4,
    name: 'Manali Stories',
    location: 'Couples Review Reel',
    image: '/stories/story-4.jpg',
    platform: 'instagram',
    rating: 5,
    text: 'Amazing experience',
    link: 'https://www.instagram.com/reel/DBDQytIS26R/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
];

// Colored Google Icon Component
const GoogleIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    className="text-xl"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#EA4335"
      d="M24 12.276c0-.816-.073-1.641-.213-2.424H12.245V14.39h6.616c-.285 1.543-1.127 2.846-2.406 3.72l-.023.16 3.51 2.766.244.025c2.253-2.115 3.553-5.235 3.553-8.785z"
    ></path>
    <path
      fill="#34A853"
      d="M12.245 24c3.24 0 5.962-1.096 7.946-2.966l-3.754-2.951c-1.066.737-2.441 1.187-4.192 1.187-3.266 0-6.035-2.222-7.018-5.207l-.159.014-3.666 2.883-.053.161C3.415 20.932 7.498 24 12.245 24z"
    ></path>
    <path
      fill="#FBBC05"
      d="M5.227 14.063c-.246-.75-.386-1.554-.386-2.383 0-.829.14-1.633.386-2.383l-.009-.175-3.69-2.887-.123.059C.493 8.356 0 10.126 0 12.32c0 2.193.493 3.963 1.405 5.922l3.822-2.986z"
    ></path>
    <path
      fill="#4285F4"
      d="M12.245 4.434c1.782 0 3.376.626 4.632 1.849l3.414-3.473C18.202.934 15.48 0 12.245 0 7.498 0 3.415 3.068 1.405 7.602l3.822 2.986C6.21 7.578 8.979 5.356 12.245 4.434z"
    ></path>
  </svg>
);

const Testimonials = () => {
  return (
    <div className="bg-black py-20 relative overflow-hidden">
      {/* Background blobs for subtle effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6 drop-shadow-xl">
            TripXplo Diaries <span className="text-[#15ab8b] animate-pulse">♥</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">Real stories from our happy travellers</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
            {/* Google Rating */}
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <GoogleIcon />
              <div className="flex flex-col items-start leading-none gap-1">
                <div className="flex text-yellow-400 text-sm gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-current w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="text-white/90 text-xs font-semibold tracking-wide">
                  4.9/5 • 300+ reviews
                </span>
              </div>
            </div>

            {/* Divider (Hidden on mobile) */}
            <div className="hidden sm:block w-px h-10 bg-white/20"></div>

            {/* Happy Travelers */}
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <Users className="text-2xl text-[#15ab8b]" />
              <div className="flex flex-col items-start leading-none gap-1">
                <div className="flex text-yellow-400 text-sm gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-current w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="text-white/90 text-xs font-semibold tracking-wide">
                  5K+ Happy Travellers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative pb-8 [&_.swiper-wrapper]:z-10">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            centeredSlides={true}
            initialSlide={0}
            breakpoints={{
              640: { slidesPerView: 2.5, centeredSlides: false },
              768: { slidesPerView: 4, centeredSlides: false },
              1024: { slidesPerView: 6, centeredSlides: false },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            className="overflow-visible"
          >
            {[...reviews, ...reviews, ...reviews].map((review, index) => (
              <SwiperSlide key={`${review.id}-${index}`} className="h-auto">
                <a
                  href={review.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full relative aspect-9/16 rounded-4xl overflow-hidden group cursor-pointer border-4 border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl shadow-black/50"
                >
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Play Button Overlay (Instagram style) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 delay-100">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                      <PlayCircle className="w-8 h-8 fill-white/20" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-10">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1 shadow-sm">
                        {review.location}
                      </p>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 drop-shadow-md leading-tight">
                        {review.name}
                      </h3>

                      {/* Tag */}
                      <span className="inline-block px-3 py-1 bg-[#15ab8b] rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-[#15ab8b]/30">
                        @TripXplo
                      </span>
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 group-hover:bg-black/60 transition-colors">
                    <div className="flex items-center gap-1.5">
                      {review.platform === 'google' ? (
                        <FaGoogle className="text-sm text-white" />
                      ) : (
                        <FaInstagram className="text-sm text-pink-500" />
                      )}
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">5.0</span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
