"use client";

import { motion, AnimatePresence } from "framer-motion";
import PackageCard, { Package } from "./PackageCard";
import { formatMonth } from "@/lib/utils";

interface PackageResultsProps {
  packages: Package[];
  searchParams: {
    destination: string;
    travelMonth: string;
    familyType: string;
  };
  isLoading?: boolean;
  onViewDetails: (pkg: Package) => void;
}

export default function PackageResults({
  packages,
  searchParams,
  isLoading,
  onViewDetails,
}: PackageResultsProps) {
  return (
    <AnimatePresence>
      <section className="py-16 bg-gray-50" id="packages">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Results Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Showing packages for{" "}
              <span className="text-teal-600">{searchParams.familyType}</span>
              {searchParams.destination && (
                <>
                  {" "}
                  to{" "}
                  <span className="text-orange-500">
                    {searchParams.destination}
                  </span>
                </>
              )}
              {searchParams.travelMonth && (
                <>
                  {" "}
                  in{" "}
                  <span className="text-indigo-500">
                    {formatMonth(searchParams.travelMonth)}
                  </span>
                </>
              )}
            </h2>
            <p className="text-gray-600">
              {packages.length} package{packages.length !== 1 ? "s" : ""} found
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Searching for packages...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && packages.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-search text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No packages found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn&apos;t find any packages matching your criteria. Try
                adjusting your search or browse our popular destinations.
              </p>
              <button className="px-6 py-3 rounded-xl font-semibold text-teal-600 border-2 border-teal-500 hover:bg-teal-50 transition-colors">
                Browse All Packages
              </button>
            </motion.div>
          )}

          {/* Package Grid */}
          {!isLoading && packages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {packages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onViewDetails={onViewDetails}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!isLoading && packages.length > 0 && packages.length >= 6 && (
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all">
                Load More Packages
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </AnimatePresence>
  );
}
