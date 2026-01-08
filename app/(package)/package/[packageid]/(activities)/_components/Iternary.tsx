"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Plus,
  Sparkles,
  X,
  ExternalLink,
  Clock,
  MapPin,
  Calendar,
  Search,
  Loader2,
  IndianRupee,
  Check,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ActivityEvent } from "@/app/types/pack";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { changeActivityAndCalculatePrice } from "@/app/store/features/packageSlice";
import { AppDispatch } from "@/app/store/store";
import { apiRequest } from "@/lib/api-client";
import { DateDestination, Room } from "@/app/hooks/usePackageList";

interface IternaryProps {
  events: ActivityEvent[];
  day: number;
}

// Time period configuration with icons and colors
const timeConfig: Record<
  string,
  {
    icon: React.ComponentType<any>;
    gradient: string;
    bgLight: string;
    textColor: string;
    label: string;
    borderColor: string;
  }
> = {
  morning: {
    icon: Sunrise,
    gradient: "from-amber-400 to-orange-400",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    label: "Morning",
    borderColor: "border-amber-200",
  },
  noon: {
    icon: Sun,
    gradient: "from-orange-400 to-rose-400",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    label: "Afternoon",
    borderColor: "border-orange-200",
  },
  evening: {
    icon: Sunset,
    gradient: "from-rose-400 to-purple-400",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
    label: "Evening",
    borderColor: "border-rose-200",
  },
  night: {
    icon: Moon,
    gradient: "from-indigo-400 to-purple-400",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
    label: "Night",
    borderColor: "border-indigo-200",
  },
};

const getTimeConfig = (timePeriod: string) => {
  const key = timePeriod?.toLowerCase() || "morning";
  return timeConfig[key] || timeConfig.morning;
};

const Iternary = ({ events, day }: IternaryProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
            <Calendar className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">No activities for this day</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Horizontal scrollable container for activity cards */}
      <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 no-scrollbar">
        {events.map((event, index) =>
          event?.activityType === "allocated" ? (
            <AllocatedActivityCard
              key={event?.activityId || index}
              event={event}
            />
          ) : (
            <FreeSlotCard
              key={event?.activityId || index}
              event={event}
              day={day}
            />
          ),
        )}
      </div>
    </div>
  );
};

// Beautiful Allocated Activity Card
const AllocatedActivityCard = ({ event }: { event: ActivityEvent }) => {
  const config = getTimeConfig(event?.timePeriod);
  const IconComponent = config.icon;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="group flex-shrink-0 w-[200px] lg:w-[280px] cursor-pointer">
          <div className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-[120px] lg:h-[160px] overflow-hidden">
              <img
                src={NEXT_PUBLIC_IMAGE_URL + event?.image}
                alt={event?.name || "Activity"}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Time Badge */}
              <div
                className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 ${config.bgLight} rounded-lg border ${config.borderColor} backdrop-blur-sm`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${config.textColor}`} />
                <span className={`text-xs font-semibold ${config.textColor}`}>
                  {config.label}
                </span>
              </div>

              {/* View Details Hint */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-3 h-3 text-slate-600" />
                <span className="text-xs font-medium text-slate-600">View</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-5">
              {/* Activity Name */}
              <h4 className="font-bold text-slate-800 text-sm lg:text-base line-clamp-1 mb-2 group-hover:text-coral-600 transition-colors">
                {event?.name}
              </h4>

              {/* Description */}
              <p className="text-slate-500 text-xs lg:text-sm line-clamp-2 leading-relaxed">
                {event?.description ||
                  "Discover amazing experiences during your trip."}
              </p>

              {/* Activity Info */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">
                    {event?.timePeriod}
                  </span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
                />
              </div>
            </div>
          </div>
        </div>
      </AlertDialogTrigger>

      {/* Modal Dialog */}
      <AlertDialogContent className="max-w-lg lg:max-w-2xl p-0 overflow-hidden rounded-3xl border-0">
        <div className="relative">
          {/* Image */}
          <div className="relative h-[200px] lg:h-[300px]">
            <img
              src={NEXT_PUBLIC_IMAGE_URL + event?.image}
              alt={event?.name || "Activity"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Time Badge */}
            <div
              className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-2 ${config.bgLight} rounded-xl border ${config.borderColor}`}
            >
              <IconComponent className={`w-4 h-4 ${config.textColor}`} />
              <span className={`text-sm font-semibold ${config.textColor}`}>
                {config.label}
              </span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                {event?.name}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 bg-white">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgLight}`}
              >
                <Clock className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  {event?.timePeriod}
                </span>
              </div>
              {event?.price > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50">
                  <span className="text-sm font-semibold text-emerald-600">
                    ₹{event?.price}
                  </span>
                </div>
              )}
            </div>

            <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
              {event?.description ||
                "Discover amazing experiences during your trip. This activity promises unforgettable memories."}
            </p>
          </div>

          {/* Footer */}
          <AlertDialogFooter className="p-4 lg:p-6 pt-0 bg-white">
            <AlertDialogCancel className="w-full py-4 rounded-xl bg-gradient-to-r from-coral-500 to-rose-500 text-white font-semibold border-0 hover:from-coral-600 hover:to-rose-600 shadow-lg shadow-coral-500/25 transition-all hover:shadow-xl">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Free Slot Card with Add Activity Modal
const FreeSlotCard = ({
  event,
  day,
}: {
  event: ActivityEvent;
  day: number;
}) => {
  const config = getTimeConfig(event?.timePeriod);
  const IconComponent = config.icon;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group flex-shrink-0 w-[200px] lg:w-[280px] cursor-pointer"
      >
        <div
          className={`relative h-[200px] lg:h-[280px] bg-gradient-to-br ${config.gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl transform -translate-x-10 translate-y-10" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-6">
            {/* Time Period Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <IconComponent className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">
                {config.label} Slot
              </span>
            </div>

            {/* Main Message */}
            <div className="text-center mb-6">
              <h4 className="text-lg lg:text-xl font-bold text-white mb-2">
                Free Slot Available
              </h4>
              <p className="text-white/80 text-sm lg:text-base">
                Add an exciting activity!
              </p>
            </div>

            {/* Add Button */}
            <div className="flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Plus
                className={`w-7 h-7 lg:w-8 lg:h-8 ${config.textColor} group-hover:rotate-90 transition-transform duration-300`}
              />
            </div>

            {/* Sparkle Icons */}
            <div className="absolute top-6 left-6">
              <Sparkles className="w-5 h-5 text-white/50 animate-pulse" />
            </div>
            <div className="absolute bottom-8 right-6">
              <Sparkles
                className="w-4 h-4 text-white/40 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        destinationId={event?.destinationId}
        day={day}
        slot={event?.slot}
        timePeriod={event?.timePeriod}
      />
    </>
  );
};

// Add Activity Modal Component
const AddActivityModal = ({
  isOpen,
  onClose,
  destinationId,
  day,
  slot,
  timePeriod,
}: {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  day: number;
  slot: number;
  timePeriod: string;
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const activityData = useSelector((store: any) => store.activity);
  const roomCapacityData: Room = useSelector(
    (store: any) => store.roomSelect.room,
  );
  const dateAndDestination: DateDestination = useSelector(
    (store: any) => store.searchPackage,
  );

  const config = getTimeConfig(timePeriod);
  const IconComponent = config.icon;

  // Fetch available activities
  const fetchActivities = useCallback(async () => {
    if (!isOpen || !activityData.packageId) return;

    setIsLoading(true);
    try {
      const extraAdult =
        roomCapacityData.totalAdults -
        roomCapacityData.totalRooms * roomCapacityData.perRoom;
      const queryParams = new URLSearchParams({
        noOfNight: "1",
        startDate: dateAndDestination.date?.slice(0, 10) || "",
        noOfChild: (roomCapacityData.totalChilds || 0).toString(),
        noRoomCount: (roomCapacityData.totalRooms || 1).toString(),
        noExtraAdult: (extraAdult > 0 ? extraAdult : 0).toString(),
      }).toString();

      const response = await apiRequest<any[]>(
        `packages/${activityData.packageId}/activities?${queryParams}`,
      );

      if (response.success && response.data) {
        const filteredActivities =
          response.data[0]?.activityDetails?.filter(
            (item: any) => item?.destinationId === destinationId,
          ) || [];
        setActivities(filteredActivities);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    isOpen,
    activityData.packageId,
    destinationId,
    roomCapacityData,
    dateAndDestination,
  ]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSelectActivity = (activity: any) => {
    const payload = { slot, day, activity };
    dispatch(changeActivityAndCalculatePrice(payload));
    onClose();
  };

  const filteredActivities = activities.filter((activity) =>
    activity.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0 bg-slate-50 [&>button]:hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 bg-gradient-to-br ${config.gradient} rounded-xl text-white shadow-lg`}
                >
                  <IconComponent size={22} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Add {config.label} Activity
                  </DialogTitle>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Day {day} • Choose an exciting activity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </DialogHeader>

          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-coral-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">
                Loading activities...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-700 font-semibold mb-1">
                No activities found
              </p>
              <p className="text-slate-500 text-sm">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.activityId}
                  activity={activity}
                  isSelected={
                    selectedActivity?.activityId === activity.activityId
                  }
                  onSelect={() => handleSelectActivity(activity)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredActivities.length}{" "}
              {filteredActivities.length === 1 ? "activity" : "activities"}{" "}
              available
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Activity Card for Modal
const ActivityCard = ({
  activity,
  isSelected,
  onSelect,
}: {
  activity: any;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : "border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        <Image
          src={NEXT_PUBLIC_IMAGE_URL + activity?.image}
          alt={activity?.name}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-md ${
              activity?.isPrivate
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {activity?.isPrivate ? "Private" : "Public"}
          </span>
        </div>

        {/* Selected Check */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-coral-600 transition-colors">
          {activity?.name}
        </h4>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
          {activity?.dayType && (
            <div className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              <span>{activity.dayType}</span>
            </div>
          )}
          {activity?.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activity.duration}h</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {activity?.price > 0 ? (
              <>
                <span className="text-xs text-slate-400">+</span>
                <IndianRupee className="w-3.5 h-3.5 text-coral-500" />
                <span className="font-bold text-coral-600">
                  {activity.price}
                </span>
              </>
            ) : (
              <span className="text-sm text-emerald-600 font-medium">
                Included
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default Iternary;
