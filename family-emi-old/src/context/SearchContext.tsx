"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Package } from "@/components/PackageCard";

interface Travelers {
  adults: number;
  children: number;
  child: number;
  infants: number;
}

interface FamilyType {
  id: string;
  name: string;
  composition: string;
}

interface SearchParams {
  destination: string;
  travelMonth: string;
  specificDate: string;
  travelers: Travelers;
  familyType: FamilyType;
}

interface SearchContextType {
  // Search state
  searchParams: SearchParams;
  updateSearchParams: (params: Partial<SearchParams>) => void;

  // Travelers
  travelers: Travelers;
  updateTravelers: (travelers: Travelers) => void;

  // Packages
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;

  // Selected package for modal
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;

  // Selected EMI plan
  selectedEMIPlan: {
    months: number;
    monthlyAmount: number;
    totalAmount: number;
    processingFee: number;
  } | null;
  setSelectedEMIPlan: (
    plan: {
      months: number;
      monthlyAmount: number;
      totalAmount: number;
      processingFee: number;
    } | null
  ) => void;

  // Contact details
  contactDetails: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
  } | null;
  setContactDetails: (
    details: {
      firstName: string;
      lastName: string;
      mobileNumber: string;
      email: string;
    } | null
  ) => void;

  // Modal states
  isPackageModalOpen: boolean;
  openPackageModal: (pkg: Package) => void;
  closePackageModal: () => void;

  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;

  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;

  isFamilyTypeInfoOpen: boolean;
  openFamilyTypeInfo: () => void;
  closeFamilyTypeInfo: () => void;
}

const defaultTravelers: Travelers = {
  adults: 2,
  children: 0,
  child: 0,
  infants: 0,
};

const defaultSearchParams: SearchParams = {
  destination: "",
  travelMonth: "",
  specificDate: "",
  travelers: defaultTravelers,
  familyType: { id: "SD", name: "Stellar Duo", composition: "2 Adults" },
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] =
    useState<SearchParams>(defaultSearchParams);
  const [travelers, setTravelers] = useState<Travelers>(defaultTravelers);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedEMIPlan, setSelectedEMIPlan] = useState<{
    months: number;
    monthlyAmount: number;
    totalAmount: number;
    processingFee: number;
  } | null>(null);
  const [contactDetails, setContactDetails] = useState<{
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
  } | null>(null);

  // Modal states
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFamilyTypeInfoOpen, setIsFamilyTypeInfoOpen] = useState(false);

  const updateSearchParams = useCallback((params: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  }, []);

  const updateTravelers = useCallback((newTravelers: Travelers) => {
    setTravelers(newTravelers);
    setSearchParams((prev) => ({ ...prev, travelers: newTravelers }));
  }, []);

  const openPackageModal = useCallback((pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPackageModalOpen(true);
  }, []);

  const closePackageModal = useCallback(() => {
    setIsPackageModalOpen(false);
    setSelectedPackage(null);
  }, []);

  const openContactModal = useCallback(() => {
    setIsPackageModalOpen(false);
    setIsContactModalOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsContactModalOpen(false);
  }, []);

  const openPaymentModal = useCallback(() => {
    setIsContactModalOpen(false);
    setIsPaymentModalOpen(true);
  }, []);

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);

  const openFamilyTypeInfo = useCallback(
    () => setIsFamilyTypeInfoOpen(true),
    []
  );
  const closeFamilyTypeInfo = useCallback(
    () => setIsFamilyTypeInfoOpen(false),
    []
  );

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        travelers,
        updateTravelers,
        packages,
        setPackages,
        isSearching,
        setIsSearching,
        selectedPackage,
        setSelectedPackage,
        selectedEMIPlan,
        setSelectedEMIPlan,
        contactDetails,
        setContactDetails,
        isPackageModalOpen,
        openPackageModal,
        closePackageModal,
        isContactModalOpen,
        openContactModal,
        closeContactModal,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        isFamilyTypeInfoOpen,
        openFamilyTypeInfo,
        closeFamilyTypeInfo,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
