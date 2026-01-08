"use client";

import { setReplaceCab } from "@/app/store/features/cabChangeSlice";
import { VehicleDetail } from "@/app/types/vehicle";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  ArrowRightLeft,
  Users,
  Briefcase,
  Snowflake,
  Check,
  Car,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ChangeCabModal from "./modals/ChangeCabModal";

export default function Cab({ vehicle }: { vehicle: VehicleDetail }) {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);

  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

  function openCabModal() {
    dispatch(setReplaceCab(vehicle));
    setIsCabModalOpen(true);
  }

  const vehicleName = vehicle?.vehicleName || "Vehicle";
  const vehicleImage = vehicle?.image || "";
  const vehicleInclusions = Array.isArray(vehicle?.inclusion)
    ? vehicle.inclusion
    : [];

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white shadow-md">
              <Car size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Transfer</h3>
              <p className="text-xs text-slate-400">Cab included in package</p>
            </div>
          </div>
          <button
            onClick={openCabModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowRightLeft size={14} />
            Change Cab
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Image */}
            <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-50">
              {vehicleImage && !imageError ? (
                <Image
                  src={NEXT_PUBLIC_IMAGE_URL + vehicleImage}
                  fill
                  alt={vehicleName}
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car size={48} className="text-slate-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Vehicle Name & Company */}
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  {vehicleName}
                </h4>
                <p className="text-sm text-slate-500">
                  {vehicle?.vehicleCompany || "Vehicle Company"}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Seater */}
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <Users size={14} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700">
                    {vehicle?.seater || 0} Seater
                  </span>
                </div>

                {/* Luggage */}
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-50 rounded-lg border border-violet-100">
                  <Briefcase size={14} className="text-violet-500" />
                  <span className="text-xs font-medium text-violet-700">
                    {vehicle?.luggage || 0} Luggage
                  </span>
                </div>

                {/* AC Type */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    vehicle?.acType
                      ? "bg-cyan-50 border-cyan-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <Snowflake
                    size={14}
                    className={
                      vehicle?.acType ? "text-cyan-500" : "text-slate-400"
                    }
                  />
                  <span
                    className={`text-xs font-medium ${
                      vehicle?.acType ? "text-cyan-700" : "text-slate-500"
                    }`}
                  >
                    {vehicle?.acType ? "AC" : "Non-AC"}
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              {vehicleInclusions.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                    Included
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {vehicleInclusions.map((inclusion, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100"
                      >
                        <Check size={10} />
                        {inclusion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ChangeCabModal
        isOpen={isCabModalOpen}
        onClose={() => setIsCabModalOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
}
