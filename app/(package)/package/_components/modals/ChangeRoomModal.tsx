"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { useAvailableRooms } from "@/app/hooks/useAvailableRooms";
import { HotelMealType, HotelRoom } from "@/app/types/hotel";
import { HotelMeal } from "@/app/types/pack";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  Check,
  Loader2,
  Bed,
  Eye,
  Maximize2,
  Coffee,
  ChevronDown,
  BedDouble,
  X,
  Utensils,
  Wifi,
  Wind,
  Tv,
  Bath,
} from "lucide-react";
import Image from "next/image";
import {
  changeRoomAndCalculatePrice,
  changeHotelAndCalculatePrice,
} from "@/app/store/features/packageSlice";
import { AppDispatch } from "@/app/store/store";
import { HotelChangeDataType } from "@/app/types/hotel";

interface ChangeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelMeal;
  newHotel?: HotelChangeDataType; // When coming from Hotel Change modal, this is the new hotel
}

type MealPlanKey = "cp" | "map" | "ap" | "ep";
type MealType = "breakfast" | "lunch" | "dinner";

const MEAL_PLAN_MAP: Record<MealPlanKey, MealType[]> = {
  cp: ["breakfast"],
  map: ["breakfast", "dinner"],
  ap: ["breakfast", "lunch", "dinner"],
  ep: [],
};

const MEAL_PLANS_CONFIG: Record<
  string,
  {
    label: string;
    shortLabel: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  cp: {
    label: "Continental Plan",
    shortLabel: "Breakfast",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  map: {
    label: "Modified American",
    shortLabel: "Half Board",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  ap: {
    label: "American Plan",
    shortLabel: "Full Board",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  ep: {
    label: "European Plan",
    shortLabel: "Room Only",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

const MealPlanDropdown = ({
  selectedMealPlan,
  mealPlans,
  onSelect,
}: {
  selectedMealPlan: HotelMealType;
  mealPlans: HotelMealType[];
  onSelect: (plan: HotelMealType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mealPlanKey =
    typeof selectedMealPlan?.mealPlan === "string"
      ? selectedMealPlan.mealPlan.toLowerCase()
      : "ep";
  const config = MEAL_PLANS_CONFIG[mealPlanKey] || MEAL_PLANS_CONFIG.ep;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full px-3 py-2 ${config.bg} ${config.border} border rounded-lg hover:shadow-sm transition-all`}
      >
        <div className="flex items-center gap-2">
          <Utensils size={12} className={config.color} />
          <span className={`text-xs font-semibold ${config.color}`}>
            {config.shortLabel}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`transition-transform ${isOpen ? "rotate-180" : ""} ${
            config.color
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden">
            {mealPlans.map((plan, index) => {
              const planMealKey =
                typeof plan.mealPlan === "string"
                  ? plan.mealPlan.toLowerCase()
                  : "ep";
              const planConfig =
                MEAL_PLANS_CONFIG[planMealKey] || MEAL_PLANS_CONFIG.ep;
              const isSelected = selectedMealPlan?.mealPlan === plan.mealPlan;

              return (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(plan);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors ${
                    index < mealPlans.length - 1
                      ? "border-b border-slate-50"
                      : ""
                  } ${isSelected ? "bg-coral-50" : ""}`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-coral-600" : "text-slate-600"
                    }`}
                  >
                    {planConfig.shortLabel}
                  </span>
                  {isSelected && <Check size={12} className="text-coral-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const MealDot = ({
  type,
  isIncluded,
}: {
  type: MealType;
  isIncluded: boolean;
}) => {
  const labels: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
  };

  return (
    <div
      className={`px-2.5 py-1 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
        isIncluded ? "bg-coral-500 text-white" : "bg-slate-100 text-slate-400"
      }`}
    >
      {labels[type]}
    </div>
  );
};

const RoomCard = ({
  room,
  prevHotel,
  onSelect,
}: {
  room: HotelRoom;
  prevHotel: HotelMeal;
  onSelect: (mealPlan: HotelMealType) => void;
}) => {
  const [selectedMealPlan, setSelectedMealPlan] = useState<HotelMealType>(
    {} as HotelMealType,
  );
  const [mealPlanPrice, setMealPlanPrice] = useState(0);

  useEffect(() => {
    const prevHotelMp = room.mealPlan?.find((data) =>
      prevHotel?.mealPlan?.includes(data.mealPlan),
    );
    if (prevHotelMp) {
      setSelectedMealPlan(prevHotelMp);
    } else if (room?.mealPlan?.[0]) {
      setSelectedMealPlan(room.mealPlan[0]);
    }
  }, [room, prevHotel]);

  useEffect(() => {
    if (selectedMealPlan?.mealPlan) {
      const prevPrice =
        (prevHotel?.totalAdultPrice || 0) +
        (prevHotel?.gstAdultPrice || 0) +
        (prevHotel?.totalChildPrice || 0) +
        (prevHotel?.gstChildPrice || 0) +
        (prevHotel?.gstExtraAdultPrice || 0) +
        (prevHotel?.totalExtraAdultPrice || 0);

      const currentPrice =
        (selectedMealPlan?.totalAdultPrice || 0) +
        (selectedMealPlan?.gstAdultPrice || 0) +
        (selectedMealPlan?.totalChildPrice || 0) +
        (selectedMealPlan?.gstChildPrice || 0) +
        (selectedMealPlan?.gstExtraAdultPrice || 0) +
        (selectedMealPlan?.totalExtraAdultPrice || 0);

      setMealPlanPrice(currentPrice - prevPrice);
    }
  }, [selectedMealPlan, prevHotel]);

  const isMealIncluded = (meal: MealType): boolean => {
    const planKey = (
      typeof selectedMealPlan?.mealPlan === "string"
        ? selectedMealPlan.mealPlan.toLowerCase()
        : "ep"
    ) as MealPlanKey;
    return MEAL_PLAN_MAP[planKey]?.includes(meal) || false;
  };

  const isSelected =
    prevHotel.hotelId === room?.hotelId &&
    prevHotel.hotelRoomId === room?.hotelRoomId &&
    prevHotel.mealPlan === selectedMealPlan?.mealPlan;

  return (
    <div
      className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-emerald-400 shadow-lg shadow-emerald-500/10"
          : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
          <Check size={10} />
          Selected
        </div>
      )}

      {/* Room Type Header */}
      <div className="p-4 pb-3">
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 pr-16">
          {room.hotelRoomType}
        </h3>

        {/* Quick Features */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Wifi size={12} />
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Wind size={12} />
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Tv size={12} />
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Bath size={12} />
          </div>
        </div>
      </div>

      {/* Room Specs */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Bed size={14} className="text-slate-400" />
            <span>Double</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} className="text-slate-400" />
            <span>Garden</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 size={14} className="text-slate-400" />
            <span>224 ft²</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-dashed border-slate-200" />

      {/* Meal Plan Section */}
      <div className="p-4 pt-3 space-y-3">
        {/* Meal Plan Selector */}
        <MealPlanDropdown
          selectedMealPlan={selectedMealPlan}
          mealPlans={room.mealPlan || []}
          onSelect={setSelectedMealPlan}
        />

        {/* Meal Indicators */}
        <div className="flex items-center justify-center gap-2">
          <MealDot type="breakfast" isIncluded={isMealIncluded("breakfast")} />
          <MealDot type="lunch" isIncluded={isMealIncluded("lunch")} />
          <MealDot type="dinner" isIncluded={isMealIncluded("dinner")} />
        </div>

        {/* Amenities Preview */}
        {room?.amenitiesDetails && room.amenitiesDetails.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {room.amenitiesDetails.slice(0, 3).map((amenity, index) => (
              <span
                key={amenity.amenitiesId || index}
                className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-full"
              >
                {amenity.name}
              </span>
            ))}
            {room.amenitiesDetails.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-medium rounded-full">
                +{room.amenitiesDetails.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            {mealPlanPrice !== 0 ? (
              <span
                className={`text-lg font-bold ${
                  mealPlanPrice > 0 ? "text-coral-500" : "text-emerald-500"
                }`}
              >
                {mealPlanPrice > 0 ? "+" : "-"}₹
                {Math.abs(Math.ceil(mealPlanPrice))}
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
              onClick={() => onSelect(selectedMealPlan)}
              className="px-4 py-2 bg-gradient-to-r from-coral-500 to-coral-400 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md hover:shadow-coral-500/20 transition-all press-effect"
            >
              Select Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ChangeRoomModal: React.FC<ChangeRoomModalProps> = ({
  isOpen,
  onClose,
  hotel,
  newHotel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((store: any) => store.package.isLoading);
  const { rooms, isLoading } = useAvailableRooms();
  const [filteredRooms, setFilteredRooms] = useState<HotelRoom[]>([]);

  useEffect(() => {
    if (rooms?.length > 0) {
      setFilteredRooms(
        rooms.filter((room: HotelRoom) => room.mealPlan?.length > 0),
      );
    }
  }, [rooms]);

  const handleSelectRoom = (room: HotelRoom, mealPlan: HotelMealType) => {
    // Store current scroll position before state update
    const currentScrollY = window.scrollY;

    if (newHotel) {
      // Coming from Hotel Change modal - change BOTH hotel and room
      dispatch(
        changeHotelAndCalculatePrice({
          mealPlan: mealPlan,
          hotelRoom: room,
          hotel: newHotel,
          prevHotel: hotel,
        }),
      );
    } else {
      // Same hotel - only change room
      dispatch(
        changeRoomAndCalculatePrice({
          mealPlan: mealPlan,
          hotelRoom: room,
          prevHotel: hotel,
        }),
      );
    }

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
                Select Room Type
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="text-coral-500 font-semibold">
                  {newHotel?.hotelName || hotel?.hotelName}
                </span>
                {" · "}
                <span className="font-medium">
                  {filteredRooms.length} options
                </span>
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-coral-100 to-coral-50 flex items-center justify-center mb-4">
                <Loader2 className="h-7 w-7 animate-spin text-coral-500" />
              </div>
              <p className="text-slate-600 font-semibold">Loading Rooms</p>
              <p className="text-slate-400 text-sm mt-1">
                Finding best options for you...
              </p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <BedDouble className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold">No Rooms Available</p>
              <p className="text-slate-400 text-sm mt-1">
                Try selecting a different hotel
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room, index) => (
                <div
                  key={index}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <RoomCard
                    room={room}
                    prevHotel={hotel}
                    onSelect={(mealPlan) => handleSelectRoom(room, mealPlan)}
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

export default ChangeRoomModal;
