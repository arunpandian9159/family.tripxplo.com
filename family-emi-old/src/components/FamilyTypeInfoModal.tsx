"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FamilyTypeData {
  family_type_name: string;
  no_of_adults: number;
  no_of_children: number;
  no_of_child: number;
  no_of_infants: number;
  family_count: number;
}

interface FamilyTypeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FamilyTypeInfoModal({
  isOpen,
  onClose,
}: FamilyTypeInfoModalProps) {
  const [familyTypes, setFamilyTypes] = useState<FamilyTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load family type data from API
  const loadFamilyTypeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Loading family type pricing data from database...");

      const response = await fetch("/api/family-types");
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Group data by family type to remove duplicates
        const familyTypeGroups: Record<string, FamilyTypeData> = {};

        data.data.forEach(
          (item: {
            family_type?: string;
            name?: string;
            no_of_adults?: number;
            no_of_children?: number;
            no_of_child?: number;
            no_of_infants?: number;
          }) => {
            const key = item.family_type || item.name || "Unknown";
            if (!familyTypeGroups[key]) {
              familyTypeGroups[key] = {
                family_type_name: key,
                no_of_adults: item.no_of_adults || 0,
                no_of_children: item.no_of_children || 0,
                no_of_child: item.no_of_child || 0,
                no_of_infants: item.no_of_infants || 0,
                family_count:
                  (item.no_of_adults || 0) +
                  (item.no_of_children || 0) +
                  (item.no_of_child || 0) +
                  (item.no_of_infants || 0),
              };
            }
          }
        );

        setFamilyTypes(Object.values(familyTypeGroups));
        console.log(
          "✅ Loaded family types:",
          Object.keys(familyTypeGroups).length
        );
      } else {
        throw new Error(data.error || "No family type data found");
      }
    } catch (err) {
      console.error("❌ Error loading family type data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFamilyTypeData();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, loadFamilyTypeData]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowUp" && e.ctrlKey && contentRef.current) {
        e.preventDefault();
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "ArrowDown" && e.ctrlKey && contentRef.current) {
        e.preventDefault();
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  // Handle scroll position tracking
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;
      setScrollPosition(maxScroll > 0 ? scrollTop / maxScroll : 0);
    }
  };

  // Generate PDF - placeholder for now
  const handlePrintPDF = async () => {
    console.log("🖨️ PDF generation requested");
    alert("PDF generation feature coming soon!");
  };

  if (!isOpen) return null;

  const scrollDots = [0, 1, 2, 3, 4];
  const activeScrollDot = Math.round(scrollPosition * (scrollDots.length - 1));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-teal-500 to-emerald-500">
            <div className="flex items-center gap-3">
              <i className="fas fa-users text-white text-xl"></i>
              <h3 className="text-lg font-bold text-white">
                Family Type Information
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPDF}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Print PDF"
              >
                <i className="fas fa-print"></i>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 relative"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading family types...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                <p className="text-red-600 font-medium mb-2">
                  Failed to load data
                </p>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <button
                  onClick={loadFamilyTypeData}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>Retry
                </button>
              </div>
            )}

            {/* Table Content */}
            {!isLoading && !error && familyTypes.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-500 text-white">
                      <th className="px-4 py-3 text-left font-semibold">
                        Family Type Name
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        Adults
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <div>Children</div>
                        <div className="text-xs font-normal">(6-11 yrs)</div>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <div>Child</div>
                        <div className="text-xs font-normal">(2-5 yrs)</div>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <div>Infants</div>
                        <div className="text-xs font-normal">(0-2 yrs)</div>
                      </th>
                      <th className="px-3 py-3 text-center font-semibold">
                        <div>Total</div>
                        <div className="text-xs font-normal">Count</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyTypes.map((ft, index) => (
                      <tr
                        key={ft.family_type_name}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-slate-50" : "bg-white"
                        } hover:bg-teal-50 transition-colors`}
                      >
                        <td className="px-4 py-3 font-medium text-teal-600">
                          {ft.family_type_name}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-700">
                          {ft.no_of_adults}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-700">
                          {ft.no_of_children}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-700">
                          {ft.no_of_child}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-700">
                          {ft.no_of_infants}
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-gray-800">
                          {ft.family_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && familyTypes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <i className="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500">No family types found</p>
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          {!isLoading && familyTypes.length > 5 && (
            <div className="flex justify-center gap-1.5 py-3 border-t border-gray-200 bg-gray-50">
              {scrollDots.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeScrollDot
                      ? "bg-teal-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2"></i>
                Press ESC to close • Ctrl+↑/↓ to scroll
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

