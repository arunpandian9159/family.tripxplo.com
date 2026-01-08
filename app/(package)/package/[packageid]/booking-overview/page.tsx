"use client";
import Image from "next/image";
import {
  IndianRupee,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Hotel,
  Car,
  UserRound,
  Tag,
  Coins,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Gift,
  Shield,
  Zap,
  X,
  ChevronDown,
  Percent,
  Ticket,
  ChevronRight,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "../../../../utils/api/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PackType } from "@/app/types/pack";
import toast from "react-hot-toast";
import { BookingPayloadType } from "@/app/types/BookingPayload";
import { DateDestination, Room } from "@/app/hooks/usePackageList";
import { createBooking } from "@/app/utils/api/createBooking";
import { formatIndianNumber, formatIndianCurrency } from "@/lib/utils";
import { Coupon } from "@/app/types";
import { useAppSelector } from "@/app/store/store";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { getCoupon } from "@/app/utils/api/getCoupon";

// Section Header Component (consistent with other pages)
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "from-emerald-500 to-emerald-700",
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  iconBg?: string;
}) => (
  <div className="flex items-start gap-4 mb-6">
    <div
      className={`p-3 bg-gradient-to-br ${iconBg} rounded-xl text-white shadow-lg`}
    >
      <Icon size={22} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// Section Divider Component
const SectionDivider = () => (
  <div className="relative py-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-dashed border-slate-200" />
    </div>
    <div className="relative flex justify-center">
      <div className="bg-slate-50 px-4">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function PackageBooking() {
  const router = useRouter();
  const [packageCoupons, setPackageCoupons] = useState<Coupon[]>([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      const coupons = await api.get("package/coupon");
      if (coupons.data && "result" in coupons.data) {
        setPackageCoupons((coupons.data as { result: Coupon[] }).result);
      }
    };
    fetchCoupons();
  }, []);

  const availableRedeemCoins = useSelector(
    (store: any) => store.userSlice.redeemCoins
  );

  const [packageId, setPackageId] = useState<string>("");
  const pack: PackType = useSelector((store: any) => store.package.data);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<
    "advance" | "full" | null
  >(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isRedeemApplied, setIsRedeemApplied] = useState(false);
  const [couponValue, setCouponValue] = useState(0);
  const [coupon, setCoupon] = useState<string>("");
  const [redeem, setRedeem] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { currentPackageId } = useAppSelector((store) => store.packageDetails);
  const roomCapacityData: Room = useSelector(
    (store: any) => store.roomSelect.room
  );
  const dateAndDestination: DateDestination = useSelector(
    (store: any) => store.searchPackage
  );

  useEffect(() => {
    const url = window.location.pathname;
    const splitUrl = url.split("/");
    if (splitUrl.length > 2) {
      setPackageId(splitUrl[2]);
    }
  }, []);

  async function handleBooking() {
    if (!selectedPaymentOption) {
      toast.error("Please select a payment option");
      return;
    }

    // Validate required data
    if (!pack?.packageId) {
      toast.error(
        "Package information not found. Please go back and try again."
      );
      return;
    }

    if (!dateAndDestination?.date) {
      toast.error("Please select a travel date");
      return;
    }

    if (!roomCapacityData?.totalAdults || roomCapacityData.totalAdults < 1) {
      toast.error("Please select at least 1 adult");
      return;
    }

    setIsProcessing(true);
    const extraAdult =
      roomCapacityData.totalAdults -
      roomCapacityData.totalRooms * roomCapacityData.perRoom;
    const noAdult =
      extraAdult > 0
        ? roomCapacityData?.totalAdults - extraAdult
        : roomCapacityData?.totalAdults;

    // Calculate the actual amount to pay (after discounts)
    const actualPayAmount =
      selectedPaymentOption === "advance"
        ? 1
        : pack?.finalPackagePrice -
          couponValue -
          (isRedeemApplied ? redeem : 0);

    const payload: BookingPayloadType = {
      startDate: dateAndDestination.date?.slice(0, 10),
      paymentType: selectedPaymentOption,
      redeemCoin: isRedeemApplied ? redeem : 0,
      noAdult: noAdult || 1,
      noChild: roomCapacityData.totalChilds || 0,
      noRoomCount: roomCapacityData.totalRooms || 1,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
      couponCode: selectedPaymentOption === "full" ? coupon || null : null,
      packageId: pack.packageId,
      activity: pack?.activity || [],
      hotelMeal: pack?.hotelMeal || [],
      fullStartDate: pack?.fullStartDate || "",
      fullEndDate: pack?.fullEndDate || "",
      checkStartDate: pack?.checkStartDate || "",
      checkEndDate: pack?.checkEndDate || "",
      vehicleDetail: pack?.vehicleDetail || [],
      // Price fields - pass the actual calculated prices
      finalPackagePrice: actualPayAmount,
      totalPackagePrice: pack?.totalPackagePrice || 0,
      gstPrice: pack?.gstPrice || 0,
      gstPer: pack?.gstPer || 0,
      couponDiscount: isCouponApplied ? couponValue : 0,
    };

    console.log("Creating booking with payload:", payload);

    try {
      const response = await createBooking(payload);
      const result = response?.data?.result as any;

      if (result?.paymentLink?.data?.instrumentResponse?.redirectInfo?.url) {
        // Redirect to payment page
        router.push(
          result.paymentLink.data.instrumentResponse.redirectInfo.url
        );
      } else if (result?.booking?.id) {
        // Booking created but no payment link - show success and redirect to booking
        toast.success("Booking created! Redirecting to payment...");
        router.push(`/payment/${result.booking.id}`);
      } else {
        toast.error("Unable to process payment. Please try again.");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage =
        error?.message || "Failed to create booking. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCouponApply() {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const couponResponse = await getCoupon(coupon.trim());
      const couponData = couponResponse?.result as Coupon | undefined;
      if (couponData?.valueType === "percentage") {
        setCouponValue((couponData?.value * pack?.finalPackagePrice) / 100);
      } else {
        setCouponValue(couponData?.value || 0);
      }
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully!");
    } catch (e) {
      toast.error("Invalid coupon code");
    }
  }

  const removeCoupon = () => {
    setCoupon("");
    setIsCouponApplied(false);
    setCouponValue(0);
    toast.success("Coupon removed");
  };

  const applyRedeem = () => {
    if (redeem > availableRedeemCoins) {
      toast.error("Insufficient coins");
      return;
    }
    if (redeem <= 0) {
      toast.error("Please enter coins to redeem");
      return;
    }
    setIsRedeemApplied(true);
    toast.success("Coins applied successfully!");
  };

  const removeRedeem = () => {
    setRedeem(0);
    setIsRedeemApplied(false);
    toast.success("Coins removed");
  };

  const finalPrice =
    selectedPaymentOption === "advance"
      ? 1
      : pack?.finalPackagePrice - couponValue - (isRedeemApplied ? redeem : 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Hero Section */}
      <div className="relative w-full h-[240px] sm:h-[280px] md:h-[320px] bg-slate-900">
        <div className="absolute inset-0">
          {pack?.packageImg?.[0] && (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 animate-pulse" />
              )}
              <Image
                src={`${NEXT_PUBLIC_IMAGE_URL}${pack.packageImg[0]}`}
                fill
                alt={pack?.packageName}
                className={`object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 md:p-6 md:pt-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push(`/package/${currentPackageId}`)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">
                Back to Package
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 sm:pb-14 pt-10 px-4 md:px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg mb-3">
              <CreditCard size={14} className="text-emerald-400" />
              <span className="text-white text-sm font-medium">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Complete Your Booking
            </h1>
            <p className="text-white/70 text-sm sm:text-base mt-2">
              Review your trip details and proceed to payment
            </p>
          </div>
        </div>

        {/* Wave Divider */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="lg:flex lg:gap-8">
          {/* Left Column - Package Details & Payment Options */}
          <div className="lg:flex-1 space-y-6">
            {/* Package Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
              <SectionHeader
                icon={Sparkles}
                title="Trip Summary"
                subtitle="Review your booking details"
                iconBg="from-violet-500 to-purple-500"
              />

              <div className="flex gap-4 sm:gap-6">
                {/* Package Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={`${NEXT_PUBLIC_IMAGE_URL}${
                      pack?.packageImg?.[0] || ""
                    }`}
                    fill
                    className="object-cover"
                    alt={pack?.packageName}
                  />
                </div>

                {/* Package Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">
                    {pack?.packageName}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} className="text-emerald-500" />
                      <span>
                        {pack?.noOfNight}N / {pack?.noOfDays}D
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound size={14} className="text-emerald-500" />
                      <span>
                        {roomCapacityData?.totalAdults} Adults
                        {roomCapacityData?.totalChilds > 0 &&
                          `, ${roomCapacityData?.totalChilds} Child`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Hotel size={14} className="text-blue-500" />
                      <span>
                        {pack?.hotelCount} Hotel
                        {pack?.hotelCount > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Car size={14} className="text-emerald-500" />
                      <span>
                        {pack?.vehicleCount} Cab
                        {pack?.vehicleCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Dates & Destinations */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <Calendar size={14} className="text-emerald-500" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {pack?.fullStartDate} - {pack?.fullEndDate}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg mt-0.5">
                    <MapPin size={14} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pack?.destination
                      ?.filter((dest) => dest.noOfNight > 0)
                      ?.map((dest, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700"
                        >
                          {dest?.noOfNight}N {dest?.destinationName}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
              <SectionHeader
                icon={CreditCard}
                title="Payment Options"
                subtitle="Choose how you want to pay"
                iconBg="from-emerald-500 to-teal-500"
              />

              <div className="space-y-4">
                {/* Reserve Option */}
                <div
                  onClick={() => setSelectedPaymentOption("advance")}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedPaymentOption === "advance"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {selectedPaymentOption === "advance" && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg">
                      <Zap size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Reserve for ₹1
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium">
                        Book now, pay later
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-11">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-5 h-5 bg-slate-200 rounded-full text-xs font-bold text-slate-600">
                        1
                      </span>
                      <div>
                        <p className="text-sm text-slate-700">
                          Pay ₹1 to reserve your slot
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-5 h-5 bg-slate-200 rounded-full text-xs font-bold text-slate-600">
                        2
                      </span>
                      <div>
                        <p className="text-sm text-slate-700">
                          Pay {formatIndianCurrency(pack?.finalPackagePrice)}{" "}
                          before {pack?.fullStartDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Payment Option */}
                <div
                  onClick={() => setSelectedPaymentOption("full")}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedPaymentOption === "full"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {selectedPaymentOption === "full" && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  )}

                  <div className="absolute top-0 right-16 -translate-y-1/2">
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full">
                      RECOMMENDED
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                      <CreditCard size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Pay Full Amount
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <Gift size={12} /> Get 10X Reward Coins
                      </p>
                    </div>
                  </div>

                  <div className="ml-11">
                    <p className="text-sm text-slate-700">
                      Pay {formatIndianCurrency(pack?.finalPackagePrice)} now
                      and earn reward coins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupons & Rewards (Only show for full payment) */}
            {selectedPaymentOption === "full" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
                <SectionHeader
                  icon={Tag}
                  title="Discounts & Rewards"
                  subtitle="Apply coupons or redeem coins"
                  iconBg="from-emerald-500 to-emerald-700"
                />

                {/* Coupon Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          disabled={isCouponApplied}
                          placeholder="Enter coupon code"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
                        />
                      </div>
                      {!isCouponApplied ? (
                        <button
                          onClick={handleCouponApply}
                          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={removeCoupon}
                          className="px-4 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-all"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Applied Coupon Display */}
                  {isCouponApplied && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="font-semibold text-emerald-700">
                            {coupon}
                          </span>
                        </div>
                        <span className="text-emerald-700 font-bold">
                          -{formatIndianCurrency(couponValue)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Available Coupons */}
                  {packageCoupons.length > 0 && !isCouponApplied && (
                    <button
                      onClick={() => setShowCouponsModal(true)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Percent size={18} className="text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-800">
                            {packageCoupons.length} Coupons Available
                          </p>
                          <p className="text-xs text-slate-500">
                            View and apply special offers
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-500" />
                    </button>
                  )}

                  <SectionDivider />

                  {/* Redeem Coins Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Redeem Coins
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          value={redeem || ""}
                          onChange={(e) => setRedeem(Number(e.target.value))}
                          disabled={isRedeemApplied}
                          placeholder="Enter coins to redeem"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
                        />
                      </div>
                      {!isRedeemApplied ? (
                        <button
                          onClick={applyRedeem}
                          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-600 transition-all shadow-md"
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={removeRedeem}
                          className="px-4 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-all"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    {/* Coins Info */}
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-700">Available Coins</span>
                        <span className="font-bold text-amber-700">
                          {availableRedeemCoins || 0}
                        </span>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        1 coin = ₹1 discount
                      </p>
                    </div>

                    {/* Applied Redeem Display */}
                    {isRedeemApplied && (
                      <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-amber-500" />
                            <span className="font-semibold text-amber-700">
                              {redeem} Coins Applied
                            </span>
                          </div>
                          <span className="text-amber-700 font-bold">
                            -{formatIndianCurrency(redeem)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price Summary (Desktop) */}
          <div className="hidden lg:block lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift size={16} className="text-emerald-200" />
                      <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                        Price Summary
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {formatIndianCurrency(finalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100 mt-1">
                      {selectedPaymentOption === "advance"
                        ? "Reservation amount"
                        : "Total payable"}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Base Price</span>
                    <span className="text-sm font-medium text-slate-800">
                      {formatIndianCurrency(pack?.totalPackagePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Taxes & Fees ({pack?.gstPer}%)
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {formatIndianCurrency(pack?.gstPrice)}
                    </span>
                  </div>

                  {isCouponApplied && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="text-sm">Coupon Discount</span>
                      <span className="text-sm font-medium">
                        -{formatIndianCurrency(couponValue)}
                      </span>
                    </div>
                  )}

                  {isRedeemApplied && (
                    <div className="flex items-center justify-between text-amber-600">
                      <span className="text-sm">Coins Redeemed</span>
                      <span className="text-sm font-medium">
                        -{formatIndianCurrency(redeem)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="font-bold text-slate-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatIndianCurrency(finalPrice)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleBooking}
                    disabled={!selectedPaymentOption || isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Pay {formatIndianCurrency(finalPrice)}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Shield size={14} />
                      <span className="text-xs">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
        <div className="p-4 flex items-center justify-between gap-4">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianCurrency(finalPrice)}
                  </span>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
                <span className="text-xs text-slate-500">View breakdown</span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-slate-100">
                <DrawerTitle className="text-lg font-bold text-slate-900">
                  Price Breakdown
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Base Price</span>
                  <span className="font-medium text-slate-800">
                    {formatIndianCurrency(pack?.totalPackagePrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Taxes & Fees</span>
                  <span className="font-medium text-slate-800">
                    {formatIndianCurrency(pack?.gstPrice)}
                  </span>
                </div>
                {isCouponApplied && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">
                      -{formatIndianCurrency(couponValue)}
                    </span>
                  </div>
                )}
                {isRedeemApplied && (
                  <div className="flex items-center justify-between text-amber-600">
                    <span>Coins Redeemed</span>
                    <span className="font-medium">
                      -{formatIndianCurrency(redeem)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianCurrency(finalPrice)}
                  </span>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <button
            onClick={handleBooking}
            disabled={!selectedPaymentOption || isProcessing}
            className="flex-1 max-w-[180px] py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>

      {/* Coupons Modal */}
      <Dialog open={showCouponsModal} onOpenChange={setShowCouponsModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 bg-white [&>button]:hidden">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl text-white">
                  <Percent size={20} />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Available Coupons
                </DialogTitle>
              </div>
              <button
                onClick={() => setShowCouponsModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </DialogHeader>

          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
            {packageCoupons.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-600 text-lg">
                    {c.couponName}
                  </span>
                  <button
                    onClick={() => {
                      setCoupon(c.code);
                      handleCouponApply();
                      setShowCouponsModal(false);
                    }}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-sm font-semibold rounded-lg"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  {c.description ||
                    `Use code ${c.code} for ${
                      c.valueType === "percentage"
                        ? `${c.value}%`
                        : `₹${c.value}`
                    } off`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    Valid till {c.validDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
