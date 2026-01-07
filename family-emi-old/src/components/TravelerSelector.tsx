"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  detectFamilyType,
  detectFamilyTypeAsync,
  FamilyType,
} from "@/lib/utils";

interface Travelers {
  adults: number;
  children: number;
  child: number;
  infants: number;
}

interface TravelerSelectorProps {
  travelers: Travelers;
  onUpdate: (travelers: Travelers) => void;
  onClose: () => void;
}

export default function TravelerSelector({
  travelers: initialTravelers,
  onUpdate,
  onClose,
}: TravelerSelectorProps) {
  const [travelers, setTravelers] = useState<Travelers>(initialTravelers);
  const [familyType, setFamilyType] = useState<FamilyType>(() =>
    detectFamilyType(initialTravelers)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Debounced async family type detection
  const detectFamilyTypeFromDB = useCallback(async (t: Travelers) => {
    setIsLoading(true);
    try {
      const result = await detectFamilyTypeAsync(t);
      setFamilyType(result);
    } catch (error) {
      console.error("Error detecting family type:", error);
      // Fallback to sync version
      setFamilyType(detectFamilyType(t));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch family type from database when travelers change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectFamilyTypeFromDB(travelers);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [travelers, detectFamilyTypeFromDB]);

  const updateCounter = (key: keyof Travelers, delta: number) => {
    setTravelers((prev) => {
      const newValue = Math.max(0, prev[key] + delta);
      // Ensure at least 1 adult
      if (key === "adults" && newValue < 1) return prev;
      return { ...prev, [key]: newValue };
    });
  };

  const handleApply = () => {
    onUpdate(travelers);
    onClose();
  };

  const travelerTypes = [
    { key: "adults" as const, label: "Adults", sublabel: "(12+ years)" },
    { key: "child" as const, label: "Child below 5", sublabel: "(2-5 years)" },
    { key: "children" as const, label: "Children", sublabel: "(6-11 years)" },
    { key: "infants" as const, label: "Infants", sublabel: "(Under 2 years)" },
  ];

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
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Select Travelers
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <i className="fas fa-times text-gray-500"></i>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="space-y-4">
              {travelerTypes.map((type) => (
                <div
                  key={type.key}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50"
                >
                  <div>
                    <span className="font-semibold text-gray-800 block">
                      {type.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {type.sublabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCounter(type.key, -1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        type.key === "adults"
                          ? travelers[type.key] <= 1
                          : travelers[type.key] <= 0
                      }
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg text-gray-800">
                      {travelers[type.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCounter(type.key, 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Detected Family Type */}
            <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-teal-50 to-emerald-50 border border-teal-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Detected Family Type:
                </span>
                {isLoading ? (
                  <span className="font-bold text-teal-700 flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                    Detecting...
                  </span>
                ) : (
                  <span className="font-bold text-teal-700">
                    {familyType.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isLoading ? "Loading from database..." : familyType.composition}
              </p>
              {familyType.family_id && (
                <p className="text-xs text-teal-600 mt-1">
                  Family ID: {familyType.family_id}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleApply}
              className="w-full py-3 px-6 rounded-xl font-bold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all"
            >
              Apply Selection
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
