"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Hero,
  Features,
  Footer,
  PackageResults,
  AuthModal,
  PackageDetailsModal,
  ContactDetailsModal,
  PaymentModal,
} from "@/components";
import { Package } from "@/components/PackageCard";
import { useSearch } from "@/context/SearchContext";
import { detectFamilyType, toTitleCase } from "@/lib/utils";

interface Destination {
  destination: string;
}

export default function Home() {
  const {
    packages,
    setPackages,
    isSearching,
    setIsSearching,
    openPackageModal,
  } = useSearch();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState({
    destination: "",
    travelMonth: "",
    familyType: "Stellar Duo (2 Adults)",
  });

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/destinations");
        const data = await res.json();
        if (data.success && data.data) {
          setDestinations(data.data);
        } else {
          // Fallback destinations
          setDestinations([
            { destination: "Goa" },
            { destination: "Kashmir" },
            { destination: "Manali" },
            { destination: "Kerala" },
            { destination: "Andaman" },
            { destination: "Rajasthan" },
            { destination: "Shimla" },
            { destination: "Munnar" },
            { destination: "Alleppey" },
            { destination: "Agra" },
          ]);
        }
      } catch (error) {
        console.error("Error loading destinations:", error);
        // Fallback destinations
        setDestinations([
          { destination: "Goa" },
          { destination: "Kashmir" },
          { destination: "Manali" },
          { destination: "Kerala" },
          { destination: "Andaman" },
        ]);
      }
    }

    loadData();
  }, []);

  // Handle search
  const handleSearch = useCallback(
    async (params: {
      destination: string;
      travelMonth: string;
      travelers: {
        adults: number;
        children: number;
        child: number;
        infants: number;
      };
    }) => {
      setIsSearching(true);
      setShowResults(true);

      const familyType = detectFamilyType(params.travelers);

      setSearchParams({
        destination: params.destination
          ? toTitleCase(params.destination)
          : "All Destinations",
        travelMonth: params.travelMonth,
        familyType: `${familyType.name} (${familyType.composition})`,
      });

      try {
        const queryParams = new URLSearchParams();
        if (params.destination) {
          queryParams.set("destination", params.destination);
        }
        if (familyType.id) {
          queryParams.set("familyType", familyType.id);
        }
        if (params.travelMonth) {
          queryParams.set("travelDate", params.travelMonth);
        }

        const res = await fetch(`/api/packages?${queryParams.toString()}`);
        const data = await res.json();

        if (data.success && data.packages && data.packages.length > 0) {
          setPackages(data.packages);
        } else {
          // No packages found - show empty state
          setPackages([]);
        }
      } catch (error) {
        console.error("Error searching packages:", error);
        setPackages([]);
      } finally {
        setIsSearching(false);
      }

      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("packages")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [setIsSearching, setPackages]
  );

  // Handle view package details
  const handleViewDetails = (pkg: Package) => {
    openPackageModal(pkg);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Hero destinations={destinations} onSearch={handleSearch} />

      {showResults && (
        <PackageResults
          packages={packages}
          searchParams={searchParams}
          isLoading={isSearching}
          onViewDetails={handleViewDetails}
        />
      )}

      <Features />

      <Footer />

      {/* Modals */}
      <AuthModal />
      <PackageDetailsModal />
      <ContactDetailsModal />
      <PaymentModal />
    </main>
  );
}
