"use client";
import Image from "next/image";
import {
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
  Shield,
  Zap,
  X,
  ChevronDown,
  Percent,
  Ticket,
  ChevronRight,
  Wallet,
  Check,
  Users,
  Receipt,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { PackType } from "@/app/types/pack";
import toast from "react-hot-toast";
import { BookingPayloadType } from "@/app/types/BookingPayload";
import { DateDestination, Room } from "@/app/hooks/usePackageList";
import { createBooking } from "@/app/utils/api/createBooking";
import { formatIndianCurrency } from "@/lib/utils";
import { Coupon } from "@/app/types";
import { useAppSelector } from "@/app/store/store";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { getCoupon } from "@/app/utils/api/getCoupon";
import EMISlider from "../../_components/EMISlider";

// EMI Quick Select Options
const EMI_QUICK_OPTIONS = [
  { months: 3, label: "3 mo" },
  { months: 6, label: "6 mo", popular: true },
  { months: 12, label: "12 mo" },
];

// Section Header Component
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "from-gold-500 to-amber-500",
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
          <span className="w-1.5 h-1.5 bg-gold-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gold-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function PackageBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emiMonthsParam = searchParams.get("emiMonths");
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
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isRedeemApplied, setIsRedeemApplied] = useState(false);
  const [couponValue, setCouponValue] = useState(0);
  const [coupon, setCoupon] = useState<string>("");
  const [redeem, setRedeem] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // EMI State
  const [selectedEMIMonths, setSelectedEMIMonths] = useState(6);

  useEffect(() => {
    if (emiMonthsParam) {
      setSelectedEMIMonths(parseInt(emiMonthsParam));
    }
  }, [emiMonthsParam]);

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

  // Calculate prices
  const totalPrice = pack?.finalPackagePrice || 0;
  const priceAfterDiscounts =
    totalPrice - couponValue - (isRedeemApplied ? redeem : 0);

  // Calculate EMI based on selected months
  const emiAmount = useMemo(() => {
    return Math.ceil(priceAfterDiscounts / selectedEMIMonths);
  }, [priceAfterDiscounts, selectedEMIMonths]);

  const handleQuickEMISelect = (months: number) => {
    setSelectedEMIMonths(months);
  };

  const handleCustomEMIChange = (value: number) => {
    setSelectedEMIMonths(value);
  };

  async function handleBooking() {
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

    // For prepaid EMI, first payment is the EMI amount
    const actualPayAmount = emiAmount;

    const payload: BookingPayloadType = {
      startDate: dateAndDestination.date?.slice(0, 10),
      paymentType: "emi",
      redeemCoin: isRedeemApplied ? redeem : 0,
      noAdult: noAdult || 1,
      noChild: roomCapacityData.totalChilds || 0,
      noRoomCount: roomCapacityData.totalRooms || 1,
      noExtraAdult: extraAdult > 0 ? extraAdult : 0,
      couponCode: coupon || null,
      packageId: pack.packageId,
      activity: pack?.activity || [],
      hotelMeal: pack?.hotelMeal || [],
      fullStartDate: pack?.fullStartDate || "",
      fullEndDate: pack?.fullEndDate || "",
      checkStartDate: pack?.checkStartDate || "",
      checkEndDate: pack?.checkEndDate || "",
      vehicleDetail: pack?.vehicleDetail || [],
      // Price fields
      finalPackagePrice: actualPayAmount,
      totalPackagePrice: pack?.totalPackagePrice || 0,
      gstPrice: pack?.gstPrice || 0,
      gstPer: pack?.gstPer || 0,
      couponDiscount: isCouponApplied ? couponValue : 0,
      // EMI specific fields
      emiMonths: selectedEMIMonths,
      emiAmount: emiAmount,
      totalEmiAmount: priceAfterDiscounts,
    };

    console.log("Creating booking with payload:", payload);

    try {
      const response = await createBooking(payload);
      const result = response?.data?.result as any;

      if (result?.paymentLink?.data?.instrumentResponse?.redirectInfo?.url) {
        router.push(
          result.paymentLink.data.instrumentResponse.redirectInfo.url
        );
      } else if (result?.booking?.id) {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 backdrop-blur-md rounded-lg mb-3">
              <Wallet size={14} className="text-gold-400" />
              <span className="text-gold-300 text-sm font-medium">
                Prepaid EMI Checkout
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Complete Your Booking
            </h1>
            <p className="text-white/70 text-sm sm:text-base mt-2">
              Choose your EMI plan and proceed to payment
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
          {/* Left Column - Package Details & EMI Options */}
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
                      <Clock size={14} className="text-gold-500" />
                      <span>
                        {pack?.noOfNight}N / {pack?.noOfDays}D
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound size={14} className="text-gold-500" />
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
                      <Car size={14} className="text-gold-500" />
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
                  <div className="p-1.5 bg-gold-50 rounded-lg">
                    <Calendar size={14} className="text-gold-500" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {pack?.fullStartDate} - {pack?.fullEndDate}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-gold-50 rounded-lg mt-0.5">
                    <MapPin size={14} className="text-gold-500" />
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

            {/* EMI Selection Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
              <SectionHeader
                icon={Wallet}
                title="Choose EMI Duration"
                subtitle="Select how many months you want to pay"
                iconBg="from-gold-500 to-amber-500"
              />

              {/* EMI Price Display */}
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white mb-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                <div className="absolute top-3 right-3">
                  <Sparkles size={18} className="text-gold-400 animate-pulse" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 rounded-full border border-gold-500/30 mb-4">
                    <Wallet size={14} className="text-gold-400" />
                    <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                      Your Monthly EMI
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                          {formatIndianCurrency(emiAmount)}
                        </span>
                        <span className="text-lg font-medium text-slate-400">
                          /month
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        for {selectedEMIMonths} months
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="px-3 py-1.5 bg-gold-500/20 backdrop-blur rounded-lg border border-gold-500/30">
                        <span className="text-xs font-bold text-gold-300">
                          {selectedEMIMonths} MONTHS
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Total: {formatIndianCurrency(priceAfterDiscounts)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick EMI Options */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Calendar size={12} />
                  Quick Select
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {EMI_QUICK_OPTIONS.map((option) => (
                    <button
                      key={option.months}
                      onClick={() => handleQuickEMISelect(option.months)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedEMIMonths === option.months
                          ? "border-gold-400 bg-gold-50 shadow-md shadow-gold-200/50"
                          : "border-slate-200 bg-white hover:border-gold-200"
                      }`}
                    >
                      {option.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold-500 text-white text-[9px] font-bold rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-xl font-bold ${
                            selectedEMIMonths === option.months
                              ? "text-gold-600"
                              : "text-slate-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatIndianCurrency(
                            Math.ceil(priceAfterDiscounts / option.months)
                          )}
                          /mo
                        </span>
                      </div>
                      {selectedEMIMonths === option.months && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">3 months</span>
                  <div className="px-3 py-1 bg-gold-100 rounded-full">
                    <span className="text-sm font-bold text-gold-700">
                      {selectedEMIMonths} months
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">16 months</span>
                </div>
                <EMISlider
                  value={selectedEMIMonths}
                  onChange={handleCustomEMIChange}
                  min={3}
                  max={16}
                />
              </div>

              {/* EMI Schedule Info */}
              <div className="mt-6 p-4 bg-gold-50 rounded-xl border border-gold-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold-100 rounded-lg">
                    <CreditCard size={16} className="text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      EMI Payment Schedule
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Pay {formatIndianCurrency(emiAmount)} every month for{" "}
                      {selectedEMIMonths} months. First EMI due today.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupons & Rewards Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-slide-up">
              <SectionHeader
                icon={Tag}
                title="Discounts & Rewards"
                subtitle="Apply coupons or redeem coins"
                iconBg="from-gold-500 to-amber-600"
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white transition-all disabled:opacity-60"
                      />
                    </div>
                    {!isCouponApplied ? (
                      <button
                        onClick={handleCouponApply}
                        className="px-5 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
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
                  <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-gold-500" />
                        <span className="font-semibold text-gold-700">
                          {coupon}
                        </span>
                      </div>
                      <span className="text-gold-700 font-bold">
                        -{formatIndianCurrency(couponValue)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Available Coupons */}
                {packageCoupons.length > 0 && !isCouponApplied && (
                  <button
                    onClick={() => setShowCouponsModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-100 hover:border-gold-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gold-100 rounded-lg">
                        <Percent size={18} className="text-gold-600" />
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
                    <ChevronRight className="w-5 h-5 text-gold-500" />
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 focus:bg-white transition-all disabled:opacity-60"
                      />
                    </div>
                    {!isRedeemApplied ? (
                      <button
                        onClick={applyRedeem}
                        className="px-5 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
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
          </div>

          {/* Right Column - Price Summary (Desktop) */}
          <div className="hidden lg:block lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header - EMI Price */}
                <div className="relative px-6 py-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                  <div className="absolute top-3 right-3">
                    <Sparkles
                      size={16}
                      className="text-gold-400 animate-pulse"
                    />
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet size={14} className="text-gold-400" />
                      <span className="text-xs font-medium text-gold-300 uppercase tracking-wider">
                        Monthly EMI
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400 bg-clip-text text-transparent">
                        {formatIndianCurrency(emiAmount)}
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      for {selectedEMIMonths} months
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 space-y-3">
                  {/* Travelers */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">Travelers</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {roomCapacityData?.totalAdults || 0} Adult
                      {(roomCapacityData?.totalAdults || 0) > 1 ? "s" : ""}
                      {roomCapacityData?.totalChilds > 0 &&
                        `, ${roomCapacityData?.totalChilds} Child${
                          roomCapacityData?.totalChilds > 1 ? "ren" : ""
                        }`}
                    </span>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Base Price</span>
                      <span className="text-sm font-medium text-slate-700">
                        {formatIndianCurrency(pack?.totalPackagePrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Taxes & Fees ({pack?.gstPer}%)
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {formatIndianCurrency(pack?.gstPrice)}
                      </span>
                    </div>

                    {isCouponApplied && (
                      <div className="flex items-center justify-between text-gold-600">
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
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-slate-200">
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-slate-400" />
                      <span className="font-bold text-slate-900">
                        Total Package
                      </span>
                    </div>
                    <span className="text-xl font-black text-slate-900">
                      {formatIndianCurrency(priceAfterDiscounts)}
                    </span>
                  </div>

                  {/* EMI Breakdown */}
                  <div className="p-3 bg-gold-50 rounded-xl border border-gold-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gold-700">
                        {selectedEMIMonths} EMIs of
                      </span>
                      <span className="text-lg font-bold text-gold-700">
                        {formatIndianCurrency(emiAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="relative w-full py-4 overflow-hidden gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Pay First EMI - {formatIndianCurrency(emiAmount)}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Shield size={14} className="text-green-500" />
                      <span className="text-xs">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Sparkles size={14} className="text-gold-500" />
                      <span className="text-xs">No Hidden Charges</span>
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
                    {formatIndianCurrency(emiAmount)}
                  </span>
                  <span className="text-xs text-gold-600 font-medium">
                    /mo EMI
                  </span>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">
                  {selectedEMIMonths} months • Total{" "}
                  {formatIndianCurrency(priceAfterDiscounts)}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="border-b border-slate-100">
                <DrawerTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wallet size={20} className="text-gold-500" />
                  EMI Breakdown
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-4">
                {/* EMI Display */}
                <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white">
                  <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">
                    Your Monthly EMI
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gold-400">
                      {formatIndianCurrency(emiAmount)}
                    </span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    for {selectedEMIMonths} months
                  </p>
                </div>

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
                  <div className="flex items-center justify-between text-gold-600">
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
                    Total Package
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    {formatIndianCurrency(priceAfterDiscounts)}
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
            disabled={isProcessing}
            className="flex-1 max-w-[180px] py-3.5 gold-gradient text-white font-bold rounded-xl shadow-lg shadow-gold-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={16} />
                Pay EMI
              </>
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
                <div className="p-2 bg-gradient-to-br from-gold-500 to-amber-500 rounded-xl text-white">
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
                className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-gold-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gold-600 text-lg">
                    {c.couponName}
                  </span>
                  <button
                    onClick={() => {
                      setCoupon(c.code);
                      handleCouponApply();
                      setShowCouponsModal(false);
                    }}
                    className="px-4 py-1.5 gold-gradient text-white text-sm font-semibold rounded-lg"
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
                  <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs font-semibold rounded">
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
