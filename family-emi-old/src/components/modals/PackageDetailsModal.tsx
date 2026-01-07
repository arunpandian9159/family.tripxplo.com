"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearch } from "@/context/SearchContext";
import { formatCurrency } from "@/lib/utils";

interface PackageDetails {
  id: string;
  title: string;
  destination: string;
  duration: string;
  nights: number;
  days: number;
  image: string;
  totalPrice: number;
  familyType: string;
  description: string;
  hotel: {
    name: string;
    category: string;
    roomType: string;
  };
  mealPlan: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  emiOptions: {
    months: number;
    monthlyAmount: number;
    totalAmount: number;
    processingFee: number;
    label: string;
    isFeatured: boolean;
  }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string[];
  }[];
  offerBadge?: string;
}

type TabType = "overview" | "emi" | "itinerary";

export default function PackageDetailsModal() {
  const {
    selectedPackage,
    isPackageModalOpen,
    closePackageModal,
    openContactModal,
    setSelectedEMIPlan,
  } = useSearch();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmiIndex, setSelectedEmiIndex] = useState(1); // Default to 6 months

  // Fetch package details when modal opens
  useEffect(() => {
    if (isPackageModalOpen && selectedPackage?.id) {
      fetchPackageDetails(selectedPackage.id);
    }
  }, [isPackageModalOpen, selectedPackage?.id]);

  const fetchPackageDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/packages/${id}`);
      const data = await res.json();
      if (data.success) {
        setPackageDetails(data.package);
        // Set default EMI to featured one
        const featuredIndex = data.package.emiOptions.findIndex(
          (e: { isFeatured: boolean }) => e.isFeatured
        );
        setSelectedEmiIndex(featuredIndex >= 0 ? featuredIndex : 1);
      }
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToBook = () => {
    if (packageDetails && packageDetails.emiOptions[selectedEmiIndex]) {
      const emi = packageDetails.emiOptions[selectedEmiIndex];
      setSelectedEMIPlan({
        months: emi.months,
        monthlyAmount: emi.monthlyAmount,
        totalAmount: emi.totalAmount,
        processingFee: emi.processingFee,
      });
      openContactModal();
    }
  };

  if (!isPackageModalOpen) return null;

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "fa-info-circle" },
    { id: "emi" as TabType, label: "EMI Plans", icon: "fa-credit-card" },
    { id: "itinerary" as TabType, label: "Itinerary", icon: "fa-route" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePackageModal}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-48 md:h-56 shrink-0">
            <Image
              src={
                packageDetails?.image ||
                selectedPackage?.image ||
                "/rectangle-14.png"
              }
              alt={packageDetails?.title || "Package"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* Close Button */}
            <button
              onClick={closePackageModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Package Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                {packageDetails?.title || selectedPackage?.title}
              </h2>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  {packageDetails?.destination || selectedPackage?.destination}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-calendar"></i>
                  {packageDetails?.duration || selectedPackage?.duration}
                </span>
              </div>
            </div>

            {/* Offer Badge */}
            {(packageDetails?.offerBadge || selectedPackage?.offerBadge) && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-semibold">
                <i className="fas fa-gift mr-1"></i>
                {packageDetails?.offerBadge || selectedPackage?.offerBadge}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "text-teal-600 border-b-2 border-teal-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading package details...</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && packageDetails && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        About This Package
                      </h3>
                      <p className="text-gray-600">
                        {packageDetails.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">
                        Highlights
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {packageDetails.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <i className="fas fa-check-circle text-teal-500"></i>
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hotel Info */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-hotel text-teal-500"></i>
                        Accommodation
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Hotel</span>
                          <span className="font-medium">
                            {packageDetails.hotel.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Category</span>
                          <span className="font-medium">
                            {packageDetails.hotel.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Room Type</span>
                          <span className="font-medium">
                            {packageDetails.hotel.roomType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inclusions & Exclusions */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                          <i className="fas fa-check-circle"></i>
                          Inclusions
                        </h4>
                        <ul className="space-y-1.5 text-sm text-green-700">
                          {packageDetails.inclusions.map((inc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <i className="fas fa-check text-xs mt-1"></i>
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          <i className="fas fa-times-circle"></i>
                          Exclusions
                        </h4>
                        <ul className="space-y-1.5 text-sm text-red-700">
                          {packageDetails.exclusions.map((exc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <i className="fas fa-times text-xs mt-1"></i>
                              {exc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* EMI Tab */}
                {activeTab === "emi" && packageDetails && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">
                      Choose Your EMI Plan
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Select a payment plan that suits you best. All plans are
                      0% interest prepaid EMI.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {packageDetails.emiOptions.map((emi, idx) => (
                        <button
                          key={emi.months}
                          onClick={() => setSelectedEmiIndex(idx)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedEmiIndex === idx
                              ? "border-teal-500 bg-teal-50"
                              : "border-gray-200 hover:border-teal-300"
                          }`}
                        >
                          {emi.isFeatured && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-teal-500 text-white rounded-full mb-2 inline-block">
                              {emi.label}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-teal-600">
                              {formatCurrency(emi.monthlyAmount)}
                            </span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            for {emi.months} months
                          </p>
                          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <div className="flex justify-between">
                              <span>Total Amount:</span>
                              <span className="font-medium">
                                {formatCurrency(emi.totalAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Processing Fee:</span>
                              <span className="font-medium">
                                {formatCurrency(emi.processingFee)}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Selected Plan Summary */}
                    <div className="p-4 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white">
                      <h4 className="font-semibold mb-2">Your Selected Plan</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold">
                            {formatCurrency(
                              packageDetails.emiOptions[selectedEmiIndex]
                                ?.monthlyAmount || 0
                            )}
                          </span>
                          <span className="opacity-80">
                            /month ×{" "}
                            {
                              packageDetails.emiOptions[selectedEmiIndex]
                                ?.months
                            }{" "}
                            months
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block opacity-80 text-sm">
                            Total
                          </span>
                          <span className="font-bold">
                            {formatCurrency(
                              (packageDetails.emiOptions[selectedEmiIndex]
                                ?.totalAmount || 0) +
                                (packageDetails.emiOptions[selectedEmiIndex]
                                  ?.processingFee || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === "itinerary" && packageDetails && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">
                      Day-by-Day Itinerary
                    </h3>

                    <div className="space-y-4">
                      {packageDetails.itinerary.map((day, idx) => (
                        <div
                          key={day.day}
                          className="relative pl-8 pb-4 border-l-2 border-teal-200 last:border-l-transparent"
                        >
                          {/* Day Marker */}
                          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">
                            {day.day}
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {day.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {day.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Meals:
                              </span>
                              {day.meals.map((meal) => (
                                <span
                                  key={meal}
                                  className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full"
                                >
                                  {meal}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with CTA */}
          <div className="shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-gray-500 text-sm">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-teal-600">
                    {formatCurrency(
                      packageDetails?.emiOptions[selectedEmiIndex]
                        ?.monthlyAmount ||
                        selectedPackage?.emiAmount ||
                        0
                    )}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <button
                onClick={handleProceedToBook}
                className="px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                Proceed to Book
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
