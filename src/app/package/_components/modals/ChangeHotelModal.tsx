'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSelector, useDispatch } from 'react-redux';
import { useAvailableHotels } from '@/app/hooks/useAvailableHotels';
import { HotelChangeDataType, HotelMealType, HotelRoom } from '@/app/types/hotel';
import { HotelMeal } from '@/app/types/pack';
import { NEXT_PUBLIC_IMAGE_URL } from '@/app/utils/constants/apiUrls';
import {
  CalendarDays,
  Utensils,
  ArrowRight,
  Check,
  Loader2,
  Building2,
  Star,
  BedDouble,
  X,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import Image from 'next/image';
import { changeHotelAndCalculatePrice } from '@/app/store/features/packageSlice';
import { setReplaceHotel } from '@/app/store/features/hotelChangeSlice';
import { AppDispatch } from '@/app/store/store';

interface ChangeHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelMeal;
  onRoomChangeClick: (hotel: HotelChangeDataType) => void;
}

const mealPlansConfig: Record<string, { label: string; color: string; bg: string }> = {
  cp: { label: 'Breakfast', color: 'text-amber-600', bg: 'bg-amber-50' },
  map: {
    label: 'Breakfast & Dinner',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  ap: { label: 'All Meals', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ep: { label: 'Room Only', color: 'text-slate-600', bg: 'bg-slate-100' },
};

type SortOption = 'popularity' | 'rating_high' | 'price_low' | 'price_high';

const HotelCard = ({
  hotel,
  prevHotel,
  onSelect,
  onRoomChange,
}: {
  hotel: HotelChangeDataType;
  prevHotel: HotelMeal;
  onSelect: () => void;
  onRoomChange: () => void;
}) => {
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>();
  const [selectedMealPlan, setSelectedMealPlan] = useState<HotelMealType>();
  const [mealPlanPrice, setMealPlanPrice] = useState(0);
  const [reject, setReject] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const room = hotel.hotelRoom?.find(data => data?.mealPlan?.length > 0);
    setSelectedRoom(room);
    if (!room) {
      setReject(true);
      return;
    }
    const mp = room?.mealPlan.find(data => prevHotel?.mealPlan?.includes(data.mealPlan));
    setSelectedMealPlan(mp);
    if (!mp) {
      setReject(true);
      return;
    }

    const prevPrice =
      (prevHotel?.totalAdultPrice || 0) +
      (prevHotel?.gstAdultPrice || 0) +
      (prevHotel?.totalChildPrice || 0) +
      (prevHotel?.gstChildPrice || 0) +
      (prevHotel?.gstExtraAdultPrice || 0) +
      (prevHotel?.totalExtraAdultPrice || 0);

    const currentPrice =
      (mp?.totalAdultPrice || 0) +
      (mp?.gstAdultPrice || 0) +
      (mp?.totalChildPrice || 0) +
      (mp?.gstChildPrice || 0) +
      (mp?.gstExtraAdultPrice || 0) +
      (mp?.totalExtraAdultPrice || 0);

    setMealPlanPrice(currentPrice - prevPrice);
  }, [hotel, prevHotel]);

  const isSelected =
    prevHotel.hotelId === hotel?.hotelId &&
    prevHotel.hotelRoomId === selectedRoom?.hotelRoomId &&
    prevHotel.mealPlan === selectedMealPlan?.mealPlan;

  const mealPlanKey =
    typeof selectedMealPlan?.mealPlan === 'string' ? selectedMealPlan.mealPlan.toLowerCase() : 'ep';
  const mealInfo = mealPlansConfig[mealPlanKey] || mealPlansConfig.ep;

  if (reject) return null;

  return (
    <div
      className={`group card-base hover:shadow-card-hover transition-all duration-300 ${
        isSelected ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
      }`}
    >
      {/* Image Section */}
      <div className="relative h-36 overflow-hidden">
        {hotel?.image && !imageError ? (
          <Image
            src={NEXT_PUBLIC_IMAGE_URL + hotel.image}
            fill
            alt={hotel?.hotelName || 'Hotel'}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Building2 size={32} className="text-slate-300" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating Badge - Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-700">
            {hotel?.contract?.additionalEmail || '4.5'}
          </span>
        </div>

        {/* Hotel Name */}
        <div className="absolute bottom-3 right-3 left-3">
          <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-md">
            {hotel?.hotelName}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Room & Meal Info */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md">
            <BedDouble size={12} className="text-slate-500" />
            <span className="text-xs text-slate-600 font-medium line-clamp-1">
              {selectedRoom?.hotelRoomType || 'Standard'}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 ${mealInfo.bg} rounded-md`}>
            <Utensils size={12} className={mealInfo.color} />
            <span className={`text-xs font-medium ${mealInfo.color}`}>{mealInfo.label}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <CalendarDays size={12} />
          <span className="text-xs">
            {prevHotel?.fullStartDate} - {prevHotel?.fullEndDate}
          </span>
        </div>

        {/* View Points */}
        {hotel?.viewPoint && hotel.viewPoint.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hotel.viewPoint.slice(0, 2).map((vp, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-full border border-emerald-100"
              >
                {vp}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={onRoomChange}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Change Room
            <ArrowRight size={12} />
          </button>

          <div className="flex items-center gap-2">
            {mealPlanPrice !== 0 ? (
              <span
                className={`text-sm font-bold ${
                  mealPlanPrice > 0 ? 'text-emerald-500' : 'text-emerald-500'
                }`}
              >
                {mealPlanPrice > 0 ? '+' : '-'} ₹{Math.abs(Math.ceil(mealPlanPrice))}
              </span>
            ) : (
              <span className="text-sm text-slate-400 font-medium">No Change</span>
            )}
            {isSelected ? (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 rounded-lg text-white text-xs font-semibold">
                <Check size={12} />
                Selected
              </div>
            ) : (
              <button
                onClick={onSelect}
                className="px-3 py-1.5 bg-linear-to-r from-emerald-500 to-emerald-400 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-button-emerald transition-all press-effect"
              >
                Select
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangeHotelModal: React.FC<ChangeHotelModalProps> = ({
  isOpen,
  onClose,
  hotel,
  onRoomChangeClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const packageId = useSelector((store: any) => store.package.data?.packageId);
  const destinationId = hotel?.location?.destinationId;
  const loading = useSelector((store: any) => store.package.isLoading);
  const { hotel: availableHotels, isLoading } = useAvailableHotels(packageId, destinationId);

  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [starRating, setStarRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setStarRating(null);
      setUserRating(null);
      setSortBy('popularity');
    }
  }, [isOpen]);

  // Apply filtering and sorting
  const processedHotels = useMemo(() => {
    let hotels = (availableHotels as HotelChangeDataType[]).filter(h => {
      const selectedRoom = h.hotelRoom?.find(data => data?.mealPlan?.length > 0);
      if (!selectedRoom) return false;
      const selectedMealPlan = selectedRoom.mealPlan.find(data =>
        hotel?.mealPlan?.includes(data.mealPlan)
      );
      return !!selectedMealPlan;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      hotels = hotels.filter(
        h =>
          h.hotelName?.toLowerCase().includes(query) ||
          h.location?.state?.toLowerCase().includes(query)
      );
    }

    // Apply star rating filter (simulated - using rating from contract.additionalEmail)
    if (starRating) {
      hotels = hotels.filter(h => {
        const rating = parseFloat(h.contract?.additionalEmail || '0');
        return rating >= starRating;
      });
    }

    // Apply user rating filter
    if (userRating) {
      hotels = hotels.filter(h => {
        const rating = parseFloat(h.contract?.additionalEmail || '0');
        return rating >= userRating;
      });
    }

    // Calculate price for sorting
    const getHotelPrice = (h: HotelChangeDataType): number => {
      const room = h.hotelRoom?.find(d => d?.mealPlan?.length > 0);
      if (!room) return 0;
      const mp = room.mealPlan.find(d => hotel?.mealPlan?.includes(d.mealPlan));
      if (!mp) return 0;
      return (
        (mp.totalAdultPrice || 0) +
        (mp.gstAdultPrice || 0) +
        (mp.totalChildPrice || 0) +
        (mp.gstChildPrice || 0) +
        (mp.totalExtraAdultPrice || 0) +
        (mp.gstExtraAdultPrice || 0)
      );
    };

    // Apply sorting
    hotels.sort((a, b) => {
      switch (sortBy) {
        case 'rating_high': {
          const rA = parseFloat(a.contract?.additionalEmail || '0');
          const rB = parseFloat(b.contract?.additionalEmail || '0');
          return rB - rA;
        }
        case 'price_low':
          return getHotelPrice(a) - getHotelPrice(b);
        case 'price_high':
          return getHotelPrice(b) - getHotelPrice(a);
        default:
          return 0;
      }
    });

    return hotels;
  }, [availableHotels, hotel?.mealPlan, searchQuery, starRating, userRating, sortBy]);

  const handleSelectHotel = (selectedHotel: HotelChangeDataType) => {
    const selectedRoom = selectedHotel.hotelRoom?.find(data => data?.mealPlan?.length > 0);
    if (!selectedRoom) return;
    const selectedMealPlan = selectedRoom.mealPlan.find(data =>
      hotel?.mealPlan?.includes(data.mealPlan)
    );
    if (!selectedMealPlan) return;

    const currentScrollY = window.scrollY;

    dispatch(
      changeHotelAndCalculatePrice({
        mealPlan: selectedMealPlan,
        hotelRoom: selectedRoom,
        hotel: selectedHotel,
        prevHotel: hotel,
      })
    );

    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      });
    });

    onClose();
  };

  const handleRoomChange = (selectedHotel: HotelChangeDataType) => {
    const hotelForRoomChange = {
      ...hotel,
      hotelId: selectedHotel.hotelId,
      hotelName: selectedHotel.hotelName,
      image: selectedHotel.image,
      location: selectedHotel.location,
      hotelRoom: selectedHotel.hotelRoom,
      viewPoint: selectedHotel.viewPoint,
      contract: selectedHotel.contract,
    };
    dispatch(setReplaceHotel(hotelForRoomChange));
    onRoomChangeClick(selectedHotel);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-slate-50 rounded-2xl border-0 shadow-2xl">
        {/* Header with Search */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">Change Hotel</DialogTitle>
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by Hotel Name or Location"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-4">
            {/* Star Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Star Rating</span>
              <div className="flex gap-1">
                {[3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setStarRating(starRating === rating ? null : rating)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                      starRating === rating
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200" />

            {/* User Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">User Rating</span>
              <div className="flex gap-1">
                {[
                  { value: 3, label: '3 & above' },
                  { value: 4, label: '4 & above' },
                  { value: 4.5, label: '4.5 & above' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setUserRating(userRating === opt.value ? null : opt.value)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                      userRating === opt.value
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200" />

            {/* Sort By */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="rating_high">Rating: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="px-6 py-2 text-xs text-slate-500 bg-white border-t border-slate-100">
            Showing {processedHotels.length} hotels
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
          {isLoading || loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
              <p className="text-slate-500 font-medium">Loading hotels...</p>
            </div>
          ) : processedHotels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold">No Hotels Found</p>
              <p className="text-slate-400 text-sm mt-1">
                {searchQuery || starRating || userRating
                  ? 'Try adjusting your filters'
                  : 'No hotels available for this selection'}
              </p>
              {(searchQuery || starRating || userRating) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStarRating(null);
                    setUserRating(null);
                  }}
                  className="mt-4 px-4 py-2 text-sm text-emerald-500 hover:text-emerald-600 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedHotels.map((h, index) => (
                <div
                  key={h.hotelId || index}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <HotelCard
                    hotel={h}
                    prevHotel={hotel}
                    onSelect={() => handleSelectHotel(h)}
                    onRoomChange={() => handleRoomChange(h)}
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

export default ChangeHotelModal;
