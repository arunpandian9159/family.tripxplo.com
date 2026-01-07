'use client';
import { Share2, Heart, MapPin, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://tripxplo.com/images/';

interface PackageImageProps {
  img?: string;
  name?: string;
  packageId?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export default function PackageImage({ img, name, packageId, slug, location }: PackageImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const packageName = name || 'Package';
  const packageImage = img || '';
  const hasValidImage = packageImage && !imageError;

  // Share button handler
  const handleShare = async () => {
    const identifier = slug || packageId;
    if (!identifier) return;

    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.tripxplo.com';
    const shareUrl = `${baseUrl}/package/${identifier}`;

    const shareData = {
      title: `Check out ${packageName}!`,
      text: `I found this amazing travel package: ${packageName}. Check it out!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Failed to share');
        }
      }
    }
  };

  // Generate deterministic random rating based on packageId
  const generateRandomRating = (id: string = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const calculatedRating = (4.5 + (seed % 5) / 10).toFixed(1);
    const calculatedReviews = 50 + (seed % 950);

    return { rating: calculatedRating, reviews: calculatedReviews };
  };

  const { rating: dynamicRating, reviews: dynamicReviews } = generateRandomRating(packageId);

  return (
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
              src={
                packageImage.startsWith('http')
                  ? packageImage
                  : `${NEXT_PUBLIC_IMAGE_URL}${packageImage}`
              }
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
          <div className="w-full h-full bg-linear-to-br from-[#15ab8b] via-[#0f8a6f] to-slate-900" />
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
              <MapPin size={16} className="text-[#15ab8b]" />
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
  );
}
