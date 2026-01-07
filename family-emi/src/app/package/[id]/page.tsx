'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Hotel,
  Car,
  Utensils,
  Check,
  X,
  Star,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Loader2,
  Phone,
  Mail,
  Share2,
  Heart,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PackageDetail } from '@/lib/types';
import Navbar from '@/app/components/Navbar';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Image Gallery Component
function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images?.length > 0 ? images : ['/placeholder-package.jpg'];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative h-100 md:h-125 rounded-2xl overflow-hidden">
        <img
          src={displayImages[activeIndex]}
          alt="Package"
          className="w-full h-full object-cover"
        />
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
          {activeIndex + 1} / {displayImages.length}
        </div>
      </div>
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.slice(0, 6).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all',
                activeIndex === idx ? 'border-[#15ab8b] ring-2 ring-[#15ab8b]/30' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Price Summary Card
function PriceSummary({ pkg, onBook }: { pkg: PackageDetail; onBook: () => void }) {
  const emiAmount = pkg.finalPackagePrice > 0 ? Math.round(pkg.finalPackagePrice / 6) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sticky top-24">
      {/* Price Header */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Total Package Price</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#15ab8b]">
            ₹{pkg.finalPackagePrice?.toLocaleString('en-IN') || '---'}
          </span>
          {pkg.offer > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ₹{Math.round(pkg.finalPackagePrice * (1 + pkg.offer / 100)).toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          ₹{pkg.perPerson?.toLocaleString('en-IN') || '---'} per person
        </p>
      </div>

      {/* EMI Option */}
      {emiAmount > 0 && (
        <div className="bg-linear-to-r from-[#15ab8b]/10 to-[#1ec9a5]/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-[#15ab8b]" />
            <span className="font-semibold text-slate-900">EMI Available</span>
          </div>
          <p className="text-sm text-slate-600">
            Starting from <span className="font-bold text-[#15ab8b]">₹{emiAmount.toLocaleString('en-IN')}/month</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">No cost EMI on select cards</p>
        </div>
      )}

      {/* Trip Details */}
      <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Travel Date
          </span>
          <span className="font-medium text-slate-900">{pkg.fullStartDate} - {pkg.fullEndDate}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Users className="w-4 h-4" /> Travelers
          </span>
          <span className="font-medium text-slate-900">
            {pkg.totalAdultCount} Adults, {pkg.totalChildCount} Children
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Hotel className="w-4 h-4" /> Rooms
          </span>
          <span className="font-medium text-slate-900">{pkg.roomCount} Room(s)</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Room Charges</span>
          <span className="text-slate-900">₹{pkg.totalRoomPrice?.toLocaleString('en-IN')}</span>
        </div>
        {pkg.totalVehiclePrice > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-500">Transport</span>
            <span className="text-slate-900">₹{pkg.totalVehiclePrice?.toLocaleString('en-IN')}</span>
          </div>
        )}
        {pkg.totalActivityPrice > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-500">Activities</span>
            <span className="text-slate-900">₹{pkg.totalActivityPrice?.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-500">GST ({pkg.gstPer}%)</span>
          <span className="text-slate-900">₹{pkg.gstPrice?.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-100 font-semibold">
          <span className="text-slate-900">Total</span>
          <span className="text-[#15ab8b]">₹{pkg.finalPackagePrice?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={onBook}
        className="w-full py-4 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#15ab8b]/30 hover:shadow-xl hover:shadow-[#15ab8b]/40 transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Book Now
      </button>

      {/* Contact */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
        <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-[#15ab8b]">
          <Phone className="w-4 h-4" /> Call Us
        </a>
        <span>|</span>
        <a href="mailto:info@tripxplo.com" className="flex items-center gap-1 hover:text-[#15ab8b]">
          <Mail className="w-4 h-4" /> Email
        </a>
      </div>
    </div>
  );
}

// Itinerary Section
function ItinerarySection({ activities }: { activities: PackageDetail['activity'] }) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#15ab8b]" />
        Day-wise Itinerary
      </h2>

      <div className="space-y-4">
        {activities.map((day, idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#15ab8b] text-white font-bold flex items-center justify-center">
                  {day.day}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Day {day.day}</p>
                  <p className="text-sm text-slate-500">{day.fullStartDate}</p>
                </div>
              </div>
              {expandedDay === idx ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedDay === idx && (
              <div className="p-4 space-y-3">
                {day.event?.map((evt, evtIdx) => (
                  <div key={evtIdx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#15ab8b]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#15ab8b]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {evt.activityName || `Activity ${evtIdx + 1}`}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {evt.timePeriod?.replace('-', ' ')} • {evt.activityType}
                      </p>
                      {evt.description && (
                        <p className="text-sm text-slate-600 mt-1">{evt.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Hotels Section
function HotelsSection({ hotels }: { hotels: PackageDetail['hotelMeal'] }) {
  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Hotel className="w-5 h-5 text-[#15ab8b]" />
        Hotels & Stays
      </h2>

      <div className="space-y-4">
        {hotels.map((hotel, idx) => (
          <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded-xl">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <img
                src={hotel.image || '/placeholder-hotel.jpg'}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{hotel.hotelName || 'Hotel'}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {hotel.location?.address || 'Location TBD'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-slate-600">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {hotel.noOfNight} Night(s)
                </span>
                <span className="text-slate-600 capitalize">
                  <Utensils className="w-3 h-3 inline mr-1" />
                  {hotel.mealPlan?.toUpperCase()}
                </span>
                {hotel.isAc && (
                  <span className="text-[#15ab8b]">AC Room</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {hotel.fullStartDate} - {hotel.fullEndDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inclusions/Exclusions Section
function InclusionsSection({ inclusions, exclusions }: { inclusions: PackageDetail['inclusionDetail']; exclusions: PackageDetail['exclusionDetail'] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Inclusions */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-500" />
          Inclusions
        </h2>
        <ul className="space-y-2">
          {inclusions?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {item.name}
            </li>
          ))}
          {(!inclusions || inclusions.length === 0) && (
            <li className="text-sm text-slate-400">No inclusions specified</li>
          )}
        </ul>
      </div>

      {/* Exclusions */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <X className="w-5 h-5 text-red-500" />
          Exclusions
        </h2>
        <ul className="space-y-2">
          {exclusions?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              {item.name}
            </li>
          ))}
          {(!exclusions || exclusions.length === 0) && (
            <li className="text-sm text-slate-400">No exclusions specified</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Main Page Component
export default function PackageDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        const startDate = searchParams.get('startDate');
        const noAdult = searchParams.get('noAdult') || '2';
        const noChild = searchParams.get('noChild') || '0';
        const noRoomCount = searchParams.get('noRoomCount') || '1';

        if (startDate) queryParams.set('startDate', startDate);
        queryParams.set('noAdult', noAdult);
        queryParams.set('noChild', noChild);
        queryParams.set('noRoomCount', noRoomCount);

        const response = await fetch(`/api/packages/${id}?${queryParams.toString()}`);
        const data = await response.json();

        if (data.success && data.data?.result?.[0]) {
          setPkg(data.data.result[0]);
        } else {
          setError(data.error || 'Package not found');
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id, searchParams]);

  const handleBook = () => {
    // Navigate to booking page or show booking modal
    alert('Booking functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#15ab8b]" />
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Package Not Found</h1>
          <p className="text-slate-500 mb-6">{error || 'The package you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/destinations')}
            className="px-6 py-3 bg-[#15ab8b] text-white rounded-xl hover:bg-[#0f8a6f] transition-colors"
          >
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-[#d1fbd2]/20">
      <Navbar />

      {/* Header */}
      <div className="bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={pkg.packageImg} />

            {/* Package Title & Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {pkg.packageName}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4 text-[#15ab8b]" />
                    {pkg.destination?.map((d) => d.destinationName).join(' → ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    <Heart className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-[#15ab8b] mx-auto mb-1" />
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-semibold text-slate-900">{pkg.noOfNight}N / {pkg.noOfDays}D</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Hotel className="w-5 h-5 text-[#15ab8b] mx-auto mb-1" />
                  <p className="text-sm text-slate-500">Hotels</p>
                  <p className="font-semibold text-slate-900">{pkg.hotelCount} Properties</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Car className="w-5 h-5 text-[#15ab8b] mx-auto mb-1" />
                  <p className="text-sm text-slate-500">Transport</p>
                  <p className="font-semibold text-slate-900">{pkg.vehicleCount > 0 ? 'Included' : 'Not Included'}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#15ab8b] mx-auto mb-1" />
                  <p className="text-sm text-slate-500">Activities</p>
                  <p className="font-semibold text-slate-900">{pkg.activityCount} Included</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <ItinerarySection activities={pkg.activity} />

            {/* Hotels */}
            <HotelsSection hotels={pkg.hotelMeal} />

            {/* Inclusions & Exclusions */}
            <InclusionsSection inclusions={pkg.inclusionDetail} exclusions={pkg.exclusionDetail} />
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <PriceSummary pkg={pkg} onBook={handleBook} />
          </div>
        </div>
      </div>
    </div>
  );
}

