import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import Image from "next/image";
import React from "react";
import { Building2, Car, MapPin, Calendar, IndianRupee } from "lucide-react";

interface PackageCardProps {
  packageName: string;
  imageUrl: string;
  numberOfNights: number;
  costPerPerson: number;
  startsFrom: string;
  hotelCount: number;
  cabCount: number;
  activityCount: number;
  numberOfDays: number;
}

const PackageCard: React.FC<PackageCardProps> = ({
  packageName,
  imageUrl,
  numberOfNights,
  costPerPerson,
  startsFrom,
  hotelCount,
  cabCount,
  activityCount,
  numberOfDays,
}) => {
  return (
    <div
      className="sm:hidden lg:flex bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
      style={{
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(white, white), linear-gradient(135deg, #ff8f78, #ff5f5f)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Image Section */}
      <div className="relative h-40 w-48 flex-shrink-0 overflow-hidden">
        <Image
          src={NEXT_PUBLIC_IMAGE_URL + imageUrl}
          alt={packageName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Duration Badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold"
          style={{ color: "#ff8f78" }}
        >
          <Calendar size={12} />
          {numberOfDays}D / {numberOfNights}N
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Package Name */}
        <div>
          <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-coral-500 transition-colors">
            {packageName}
          </h3>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
            {hotelCount > 0 && (
              <div className="flex items-center gap-1">
                <Building2 size={14} style={{ color: "#ff8f78" }} />
                <span>{hotelCount} Hotels</span>
              </div>
            )}
            {cabCount > 0 && (
              <div className="flex items-center gap-1">
                <Car size={14} style={{ color: "#ff8f78" }} />
                <span>{cabCount} Transfers</span>
              </div>
            )}
            {activityCount > 0 && (
              <div className="flex items-center gap-1">
                <MapPin size={14} style={{ color: "#ff8f78" }} />
                <span>{activityCount} Activities</span>
              </div>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Starting from</p>
            <div className="flex items-center gap-0.5">
              <IndianRupee size={16} style={{ color: "#ff8f78" }} />
              <span className="text-xl font-bold" style={{ color: "#ff8f78" }}>
                {costPerPerson?.toLocaleString() || "0"}
              </span>
              <span className="text-xs text-slate-400 ml-1">/person</span>
            </div>
          </div>

          <button
            className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ff8f78, #ff5f5f)",
              boxShadow: "0 4px 14px -2px rgba(255, 143, 120, 0.4)",
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
