"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  changeDestination,
  changeDestinationId,
  changeDate,
} from "@/app/store/features/searchPackageSlice";
import { initialLoad } from "@/app/store/features/roomCapacitySlice";

const destinations = [
  {
    name: "Kashmir",
    tagline: "Paradise on Earth",
    image: "/kashmir.jpg",
    destinationId: "009b592f-9b73-4990-8068-1c299d1f15e5",
    emiFrom: 4999,
    featured: true,
  },
  {
    name: "Bali",
    tagline: "Island of Gods",
    image: "/bali.jpg",
    destinationId: "4ebe5f1e-99d4-4dbb-a4e5-538a353ba81c",
    emiFrom: 8999,
    featured: false,
  },
  {
    name: "Manali",
    tagline: "Adventure Awaits",
    image: "/manali.jpg",
    destinationId: "9380c50d-62ee-443b-a5c9-6beb90770e8f",
    emiFrom: 3999,
    featured: false,
  },
  {
    name: "Goa",
    tagline: "Beach Paradise",
    image: "/goa.jpg",
    destinationId: "1961511a-2d52-4dc4-95f5-9478c3e9a04f",
    emiFrom: 2999,
    featured: false,
  },
  {
    name: "Meghalaya",
    tagline: "Abode of Clouds",
    image: "/meghalaya.jpg",
    destinationId: "e431c796-3946-4d73-a9b9-99a7b138680d",
    emiFrom: 5999,
    featured: false,
  },
];

const DestinationCard = ({
  destination,
  index,
  isFeatured = false,
  onClick,
}: {
  destination: (typeof destinations)[0];
  index: number;
  isFeatured?: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
        isFeatured ? "lg:row-span-2 h-full" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative ${
          isFeatured ? "h-full min-h-[400px]" : "h-[200px] lg:h-[190px]"
        } overflow-hidden`}
      >
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes={isFeatured ? "50vw" : "25vw"}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          {/* Location badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-gold-300 font-medium uppercase tracking-wider">
              {destination.tagline}
            </span>
          </div>

          {/* Name */}
          <h3
            className={`font-bold text-white mb-2 ${
              isFeatured ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"
            }`}
          >
            {destination.name}
          </h3>

          {/* EMI Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300">EMI from</span>
              <p className="text-lg font-bold text-white">
                ₹{destination.emiFrom.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-slate-300">/mo</span>
              </p>
            </div>

            {/* Arrow */}
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 gold-gradient text-black text-xs font-bold rounded-full">
              Most Popular
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DestinationShowcase = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDestinationClick = (name: string, destinationId: string) => {
    dispatch(changeDestination(name));
    dispatch(changeDestinationId(destinationId));

    // Calculate date 10 days from now
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 10);
    const localDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000
    );
    dispatch(changeDate(localDate.toISOString()));
    dispatch(initialLoad());
    router.push(`/destinations`);
  };

  const featured = destinations.find((d) => d.featured);
  const others = destinations.filter((d) => !d.featured);

  return (
    <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-gold-100 text-gold-700 text-sm font-semibold rounded-full mb-4"
          >
            Dream Destinations
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Explore <span className="text-gold-600">Family-Friendly</span>{" "}
            Destinations
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Handpicked destinations perfect for creating unforgettable family
            memories
          </motion.p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Featured destination - takes up left column on lg */}
          <div className="lg:col-span-1">
          {featured && (
            <DestinationCard
              destination={featured}
              index={0}
              isFeatured={true}
              onClick={() =>
                handleDestinationClick(featured.name, featured.destinationId)
              }
            />
          )}
          </div>
          {/* Other destinations - 2x2 grid on the right */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {others.map((destination, index) => (
              <DestinationCard
                key={destination.destinationId}
                destination={destination}
                index={index + 1}
                onClick={() =>
                  handleDestinationClick(
                    destination.name,
                    destination.destinationId
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/packages">
            <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gold-500 text-gold-600 font-bold rounded-xl hover:gold-gradient hover:border-transparent hover:text-black transition-all duration-300">
              View All Destinations
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationShowcase;
