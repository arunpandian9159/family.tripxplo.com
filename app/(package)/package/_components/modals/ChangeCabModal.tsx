"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { useAvailableCab } from "@/app/hooks/useAvailableCab";
import { VehicleDetail } from "@/app/types/vehicle";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  Check,
  Loader2,
  Users,
  Briefcase,
  Snowflake,
  X,
  Car,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { changeVehicleAndCalculatePrice } from "@/app/store/features/packageSlice";
import { AppDispatch } from "@/app/store/store";

interface ChangeCabModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleDetail;
}

const CabCard = ({
  cab,
  prevVehicle,
  onSelect,
}: {
  cab: VehicleDetail;
  prevVehicle: VehicleDetail;
  onSelect: () => void;
}) => {
  const [priceDiff, setPriceDiff] = useState(0);

  useEffect(() => {
    // Vehicles use simple 'price' field, not the calculated hotel-style fields
    const prevPrice = prevVehicle?.price || 0;
    const currentPrice = cab?.price || 0;

    setPriceDiff(currentPrice - prevPrice);
  }, [cab, prevVehicle]);

  const isSelected = prevVehicle?.vehicleId === cab?.vehicleId;

  const getVehicleTypeColor = (company: string) => {
    const c = company?.toLowerCase() || "";
    if (c.includes("suv") || c.includes("innova") || c.includes("ertiga"))
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    if (c.includes("sedan") || c.includes("dzire") || c.includes("etios"))
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
      };
    if (c.includes("hatchback") || c.includes("swift") || c.includes("i20"))
      return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
      };
    if (c.includes("luxury") || c.includes("fortuner") || c.includes("crysta"))
      return {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      };
    if (c.includes("tempo") || c.includes("traveller") || c.includes("bus"))
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
      };
    return {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    };
  };

  const typeColor = getVehicleTypeColor(
    cab?.vehicleName || cab?.vehicleCompany || ""
  );

  // Get AC type label
  const getAcTypeLabel = () => {
    if (!cab?.isAc) return "Non-AC";
    if (cab?.acType) return cab.acType;
    return "AC";
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-amber-400 shadow-lg shadow-amber-500/10"
          : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 gold-gradient text-white text-[10px] font-bold rounded-full">
          <Check size={10} />
          Selected
        </div>
      )}

      {/* Vehicle Image */}
      <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        {cab?.image ? (
          <Image
            src={`${NEXT_PUBLIC_IMAGE_URL}${cab.image}`}
            alt={cab.vehicleName || "Vehicle"}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-16 h-16 text-slate-200" />
          </div>
        )}

        {/* Vehicle Company/Type Badge */}
        <div
          className={`absolute top-3 left-3 px-2 py-1 ${typeColor.bg} ${typeColor.border} border rounded-full`}
        >
          <span
            className={`text-[10px] font-bold ${typeColor.text} uppercase tracking-wide`}
          >
            {cab?.acType || (cab?.isAc ? "AC" : "Non-AC")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vehicle Name */}
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1 mb-1">
          {cab?.vehicleName}
        </h3>

        {/* Vehicle Company */}
        {cab?.vehicleCompany && (
          <p className="text-xs text-slate-400 mb-2">{cab.vehicleCompany}</p>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <Users size={14} className="text-blue-500 mb-1" />
            <span className="text-xs font-bold text-slate-700">
              {cab?.seater || cab?.maxPax || "-"}
            </span>
            <span className="text-[10px] text-slate-400">Seats</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <Briefcase size={14} className="text-amber-500 mb-1" />
            <span className="text-xs font-bold text-slate-700">
              {cab?.luggage || "-"}
            </span>
            <span className="text-[10px] text-slate-400">Bags</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <Snowflake
              size={14}
              className={`mb-1 ${
                cab?.isAc ? "text-cyan-500" : "text-slate-300"
              }`}
            />
            <span className="text-xs font-bold text-slate-700">
              {cab?.isAc ? "Yes" : "No"}
            </span>
            <span className="text-[10px] text-slate-400">AC</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cab?.acType && (
            <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 rounded-full">
              <Snowflake size={10} className="text-cyan-500" />
              <span className="text-[10px] text-cyan-600 font-medium">
                {cab.acType}
              </span>
            </div>
          )}
          {cab?.maxPax && cab.maxPax > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
              <Users size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-500 font-medium">
                Max {cab.maxPax} pax
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
            <Shield size={10} className="text-amber-500" />
            <span className="text-[10px] text-amber-600 font-medium">
              Insured
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-dashed border-slate-200" />

      {/* Footer */}
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            {priceDiff !== 0 ? (
              <span
                className={`text-lg font-bold ${
                  priceDiff > 0 ? "text-amber-500" : "text-amber-500"
                }`}
              >
                {priceDiff > 0 ? "+" : "-"}₹{Math.abs(Math.ceil(priceDiff))}
              </span>
            ) : (
              <span className="text-sm text-slate-400 font-medium">
                No change
              </span>
            )}
          </div>

          {/* Select Button */}
          {!isSelected && (
            <button
              onClick={onSelect}
              className="px-4 py-2 gold-gradient text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md hover:shadow-amber-500/20 transition-all press-effect"
            >
              Select Cab
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ChangeCabModal: React.FC<ChangeCabModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((store: any) => store.package.isLoading);
  const packageData = useSelector((store: any) => store.package.data);
  const packageId = packageData?.packageId || "";

  // Only fetch when modal is open
  const { cab: cabs, isLoading } = useAvailableCab(packageId, "", isOpen);

  const handleSelectCab = (cab: VehicleDetail) => {
    // Store current scroll position before state update
    const currentScrollY = window.scrollY;

    dispatch(
      changeVehicleAndCalculatePrice({
        newVehicle: cab,
        prevVehicle: vehicle,
      })
    );

    // Restore scroll position after modal closes and state updates
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: "instant" });
      // Double RAF to ensure the scroll is applied after React re-render
      requestAnimationFrame(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" });
      });
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-slate-50 rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Select Vehicle
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                Current:{" "}
                <span className="text-amber-600 font-semibold">
                  {vehicle?.vehicleName}
                </span>
                {" · "}
                <span className="font-medium">{cabs?.length || 0} options</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
          {isLoading || loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-4">
                <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
              </div>
              <p className="text-slate-600 font-semibold">Loading Vehicles</p>
              <p className="text-slate-400 text-sm mt-1">
                Finding best options for you...
              </p>
            </div>
          ) : !cabs || cabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold">
                No Vehicles Available
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Please try again later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cabs.map((cab: VehicleDetail, index: number) => (
                <div
                  key={cab.vehicleId || index}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CabCard
                    cab={cab}
                    prevVehicle={vehicle}
                    onSelect={() => handleSelectCab(cab)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeCabModal;
