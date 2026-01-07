'use client';
import { NEXT_PUBLIC_IMAGE_URL } from '@/app/utils/constants/apiUrls';
import { Share2, Heart, MapPin, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useWishlist } from '@/app/hooks/useWishlist';
import { addToWishlist } from '@/app/store/features/wishlistSlice';
import { userApi } from '@/lib/api-client';
import toast from 'react-hot-toast';
import LoginModal from './LoginModal';
import { DateDestination, Room } from '@/app/hooks/usePackageList';
import { generateShareMessage, generateShareTitle } from '@/lib/generateShareMessage';

export default function PackageImage({
  img,
  name,
  packageId,
  slug,
  rating = 4.8,
  reviewCount = 128,
  location,
}: {
  img?: string;
  name?: string;
  packageId?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Get current search parameters from Redux
  const roomCapacityData: Room = useSelector((store: any) => store.roomSelect?.room);
  const dateAndDestination: DateDestination = useSelector((store: any) => store.searchPackage);
  const pack = useSelector((store: any) => store.package);

  const { isInWishlist, toggleWishlist, isLoggedIn } = useWishlist();
  const isWishlisted = packageId ? isInWishlist(packageId) : false;

  const packageName = name || 'Package';
  const packageImage = img || '';
  const hasValidImage = packageImage && !imageError;

  // Share button handler - generates shareable URL with date and search params
  const handleShare = async () => {
    const identifier = slug || packageId;
    if (!identifier) return;

    // Build query params from current search state
    const queryParams = new URLSearchParams();

    // Add date if available
    if (dateAndDestination?.date) {
      queryParams.set('date', dateAndDestination.date.slice(0, 10));
    }

    // Add guest counts if available
    if (roomCapacityData) {
      if (roomCapacityData.totalAdults) {
        queryParams.set('adults', roomCapacityData.totalAdults.toString());
      }
      if (roomCapacityData.totalChilds) {
        queryParams.set('children', roomCapacityData.totalChilds.toString());
      }
      if (roomCapacityData.totalRooms) {
        queryParams.set('rooms', roomCapacityData.totalRooms.toString());
      }
    }

    // Only include hotel and vehicle details if user has made changes
    const isHotelUpdated = pack?.isHotelUpdated || false;
    const isVehicleUpdated = pack?.isVehicleUpdated || false;

    // Add selected hotels with room IDs - only if hotels were changed
    if (isHotelUpdated) {
      const hotelMeal = pack?.data?.hotelMeal;
      if (hotelMeal && Array.isArray(hotelMeal)) {
        const selectedHotels = hotelMeal
          .map((hm: any, index: number) => {
            if (hm.hotelId && hm.hotelRoomId) {
              // Format: index:hotelId:roomId
              return `${index}:${hm.hotelId}:${hm.hotelRoomId}`;
            } else if (hm.hotelId) {
              // Fallback to just hotel ID
              return `${index}:${hm.hotelId}`;
            }
            return null;
          })
          .filter(Boolean);

        if (selectedHotels.length > 0) {
          queryParams.set('hotels', selectedHotels.join(','));
        }
      }
    }

    // Add selected vehicle - only if vehicle was changed
    if (isVehicleUpdated) {
      const vehicleDetail = pack?.data?.vehicleDetail;
      if (vehicleDetail && Array.isArray(vehicleDetail) && vehicleDetail.length > 0) {
        const firstVehicle = vehicleDetail[0];
        if (firstVehicle?.vehicleId) {
          queryParams.set('vehicle', firstVehicle.vehicleId);
        }
      }
    }

    // Build final URL with query params
    const queryString = queryParams.toString();
    // Use current domain dynamically so it works on any deployment (tripxplo.com, vercel.app, localhost, etc.)
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.tripxplo.com';
    const shareUrl = `${baseUrl}/package/${identifier}${queryString ? `?${queryString}` : ''}`;

    const shareData = {
      title: generateShareTitle(packageName),
      text: generateShareMessage({
        packageName,
        location,
        url: shareUrl,
      }),
    };

    try {
      // Try native Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Failed to share');
        }
      }
    }
  };

  const handleWishlistClick = async () => {
    if (!packageId) return;

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    await toggleWishlist(packageId);
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);

    if (!packageId) return;

    // Directly call API since we just logged in (Redux state may not be updated yet)
    try {
      dispatch(addToWishlist(packageId)); // Optimistic update
      const response = await userApi.addToWishlist(packageId);
      if (response.success) {
        toast.success('Added to wishlist!');
      } else {
        toast.error(response.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toast.error('Failed to add to wishlist');
    }
  };

  // Generate deterministic random rating and review count based on packageId
  const generateRandomRating = (id: string = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // Rating between 4.5 and 4.9
    const calculatedRating = (4.5 + (seed % 5) / 10).toFixed(1);
    // Reviews between 50 and 999
    const calculatedReviews = 50 + (seed % 950);

    return { rating: calculatedRating, reviews: calculatedReviews };
  };

  const { rating: dynamicRating, reviews: dynamicReviews } = generateRandomRating(packageId);

  return (
    <>
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[480px] bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          {hasValidImage ? (
            <>
              {/* Placeholder while loading */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-linear-to-br from-slate-700 via-slate-800 to-slate-900 animate-pulse" />
              )}
              <Image
                src={`${NEXT_PUBLIC_IMAGE_URL}${packageImage}`}
                fill
                alt={packageName}
                priority
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            // Fallback gradient when no image
            <div className="w-full h-full bg-linear-to-br from-emerald-600 via-rose-600 to-purple-700" />
          )}

          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleWishlistClick}
                className={`p-3 min-w-[44px] min-h-[44px] rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 ${
                  isWishlisted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 min-w-[44px] min-h-[44px] bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-20 pt-10 px-4 md:px-6 bg-linear-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg mb-3">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-semibold">{dynamicRating}</span>
              <span className="text-white/60 text-xs">({dynamicReviews} reviews)</span>
            </div>

            {/* Package Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              {packageName}
            </h1>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 mt-3 text-white/80">
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-sm md:text-base">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Curved Edge */}
        <div className="absolute -bottom-1 left-0 right-0 z-30">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V20C240 0 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
