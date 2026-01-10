"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Minus,
  Plus,
  AlertCircle,
  X,
  Users,
  Baby,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  initialLoad,
  selectAdultsChild,
  selectInitiallyLoaded,
  setFamilyType,
} from "@/app/store/features/roomCapacitySlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { detectFamilyType } from "@/lib/models/familytype";

interface OptionsBoxProps {
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function OptionsBox({
  className,
  isOpen,
  onOpenChange,
}: OptionsBoxProps) {
  const roomCapacityData = useSelector((store: any) => store.roomSelect.room);
  const roomInitiallyLoaded = useSelector(
    (store: any) => store.roomSelect.room.initiallyLoaded
  );
  // Theme is always "Family" in this project
  const themeSelected = "Family";

  const [internalOpen, setInternalOpen] = useState(false);

  // Use external isOpen if provided, otherwise use internal state
  const specFocused = isOpen !== undefined ? isOpen : internalOpen;

  const setSpecFocused = (open: boolean) => {
    setInternalOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const [warningTxt, setWarningTxt] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  // New age category states
  const [children611, setChildren611] = useState(2); // Children 6-11 years
  const [children25, setChildren25] = useState(0); // Child below 5 (2-5 years)
  const [infants, setInfants] = useState(0); // Infants under 2 years

  const [minRooms, setMinRooms] = useState(1);
  const [guests, setGuests] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Family type detection state
  const [detectedFamilyType, setDetectedFamilyType] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const dispatch = useDispatch();
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Set mounted flag and initialize values on client
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Initialize with Family theme defaults
    setAdults(2);
    setChildren611(2);
    setChildren25(0);
    setInfants(0);
    setRooms(1);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect family type whenever guest counts change and sync to Redux
  useEffect(() => {
    if (mounted) {
      const familyType = detectFamilyType(
        adults,
        children611,
        children25,
        infants
      );
      const name = familyType.name;
      setDetectedFamilyType(name);

      // Update Redux so SearchBox can show detected/selected type
      dispatch(
        setFamilyType({
          name,
          isSelected: isApplied,
        })
      );
    }
  }, [adults, children611, children25, infants, mounted, isApplied, dispatch]);

  function handleIncrementorDecrementor(i: boolean, value: string) {
    // When any guest count changes, reset applied state to show "detected"
    setIsApplied(false);

    switch (value) {
      case "adult": {
        if (i) {
          setAdults(adults + 1);
        } else {
          // Family theme: allow decrement if adults > 1
          if (adults > 1) {
            setAdults(adults - 1);
          }
        }
        break;
      }
      case "children611": {
        if (i) {
          setChildren611(children611 + 1);
        } else {
          if (children611 > 0) {
            setChildren611(children611 - 1);
          }
        }
        break;
      }
      case "children25": {
        if (i) {
          setChildren25(children25 + 1);
        } else {
          if (children25 > 0) {
            setChildren25(children25 - 1);
          }
        }
        break;
      }
      case "infants": {
        if (i) {
          setInfants(infants + 1);
        } else {
          if (infants > 0) {
            setInfants(infants - 1);
          }
        }
        break;
      }
      case "room": {
        if (i) {
          if (rooms < adults) {
            setRooms(rooms + 1);
          }
        } else {
          if (!(rooms - 1 < minRooms)) {
            setRooms(rooms - 1);
          }
        }
        break;
      }
    }
  }

  function handleApply() {
    if (adults >= rooms) {
      setSpecFocused(false);
      setWarningTxt("");
      setIsApplied(true);
      // Dispatch family type as selected
      dispatch(setFamilyType({ name: detectedFamilyType, isSelected: true }));
    } else {
      setWarningTxt("Invalid number of rooms");
    }
  }

  useEffect(() => {
    if (!roomInitiallyLoaded) dispatch(initialLoad());
  }, [themeSelected, dispatch, roomInitiallyLoaded]);

  // Room calculation logic - using all child categories
  useEffect(() => {
    const totalChildren = children611 + children25 + infants;
    let r = 0;
    // Family theme: calculate rooms based on adults and total children
    if (totalChildren == 0) {
      r = Math.ceil(adults / 3);
    } else {
      let x = adults;
      let y = totalChildren;
      r = 0;
      while (x >= 3 && y >= 1) {
        x = x - 3;
        y = y - 1;
        r++;
      }
      while (x > 0 || y > 0) {
        x = x - 3;
        y = y - 3;
        r++;
      }
    }
    setRooms(r);
    setMinRooms(r);
    dispatch(
      selectAdultsChild({
        room: {
          adult: adults,
          child: totalChildren,
          room: r,
          children611: children611,
          children25: children25,
          infants: infants,
        },
      })
    );
  }, [children611, children25, infants, adults, themeSelected, dispatch]);

  function validateAdults() {
    // Family theme: allow decrement if adults > 1
    return adults > 1;
  }

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current && !isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.right - 380, 16), // Wider dropdown, align to right
      });
    }
  }, [isMobile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setSpecFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update position on scroll/resize
  useEffect(() => {
    if (specFocused && !isMobile) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [specFocused, isMobile, updateDropdownPosition]);

  const handleToggle = useCallback(() => {
    if (!specFocused) {
      updateDropdownPosition();
    }
    setSpecFocused(!specFocused);
  }, [specFocused, updateDropdownPosition]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && specFocused) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobile, specFocused]);

  // Always use Family theme defaults
  useEffect(() => {
    if (!roomInitiallyLoaded) {
      setAdults(2);
      setChildren611(2);
      setChildren25(0);
      setInfants(0);
    }
  }, [roomInitiallyLoaded]);

  useEffect(() => {
    // Dispatch room data to Redux for all themes
    const totalChildren = children611 + children25 + infants;
    const room = {
      adult: adults,
      child: totalChildren,
      room: rooms,
      children611: children611,
      children25: children25,
      infants: infants,
    };
    dispatch(selectAdultsChild({ room }));
    dispatch(selectInitiallyLoaded(true));
  }, [adults, children611, children25, infants, rooms, dispatch]);

  const CounterButton = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-10 h-10 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all",
        disabled
          ? "bg-slate-100 text-slate-300 cursor-not-allowed"
          : "bg-amber-50 text-amber-600 hover:bg-amber-100 active:scale-95"
      )}
    >
      {children}
    </button>
  );

  const GuestDisplay = () => {
    // Show placeholder during SSR and initial render to avoid hydration mismatch
    if (!mounted) {
      return (
        <span className="text-sm lg:text-base text-slate-400">
          Select guests
        </span>
      );
    }

    const totalChildren = children611 + children25 + infants;

    // Use local state for all themes
    return rooms > 0 ? (
      <span className="text-sm lg:text-base font-medium text-slate-800">
        {rooms} {rooms == 1 ? "Room" : "Rooms"}, {adults}{" "}
        {adults == 1 ? "Adult" : "Adults"}
        {totalChildren > 0 &&
          `, ${totalChildren} ${totalChildren == 1 ? "Child" : "Children"}`}
      </span>
    ) : (
      <span className="text-sm lg:text-base text-slate-400">Select guests</span>
    );
  };

  const dropdownContent = specFocused && (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
          onClick={() => setSpecFocused(false)}
        />
      )}

      <div
        ref={popoverRef}
        className={cn(
          "bg-white shadow-2xl border border-slate-200 overflow-hidden",
          isMobile
            ? "fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 z-[9999]"
            : "fixed w-[520px] rounded-2xl z-[9999]"
        )}
        style={
          isMobile
            ? {}
            : {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }
        }
      >
        {/* Header */}
        <div
          className={cn(
            "px-5 py-4 bg-slate-50 border-b border-slate-100 sticky top-0 z-10",
            isMobile && "px-6 py-5"
          )}
        >
          {/* Show detected/selected family type */}
          {mounted && detectedFamilyType && (
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-medium text-amber-600">
                {isApplied ? "Selected" : "Detected"}: {detectedFamilyType}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Guests & Rooms</h3>
            {isMobile && (
              <button
                onClick={() => setSpecFocused(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>
        </div>

        <div className={cn("p-5", isMobile && "p-6 pb-8")}>
          {/* Two Column Grid Layout */}
          <div
            className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1 space-y-4" : "grid-cols-2 gap-x-6 gap-y-4"
            )}
          >
            {/* Left Column - Guest Types */}
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Adults</p>
                  <p className="text-xs text-slate-400">(12+ years)</p>
                </div>
                <div className="flex items-center gap-2">
                  <CounterButton
                    onClick={() => handleIncrementorDecrementor(false, "adult")}
                    disabled={!validateAdults()}
                  >
                    <Minus className="w-4 h-4" />
                  </CounterButton>
                  <span className="w-6 text-center font-semibold text-slate-800">
                    {adults}
                  </span>
                  <CounterButton
                    onClick={() => handleIncrementorDecrementor(true, "adult")}
                    disabled={false}
                  >
                    <Plus className="w-4 h-4" />
                  </CounterButton>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Children 6-11 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Children</p>
                  <p className="text-xs text-slate-400">(6-11 years)</p>
                </div>
                <div className="flex items-center gap-2">
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(false, "children611")
                    }
                    disabled={children611 <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </CounterButton>
                  <span className="w-6 text-center font-semibold text-slate-800">
                    {children611}
                  </span>
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(true, "children611")
                    }
                    disabled={false}
                  >
                    <Plus className="w-4 h-4" />
                  </CounterButton>
                </div>
              </div>
            </div>

            {/* Right Column - Child Age Categories & Rooms */}
            <div className="space-y-4">
              {/* Child below 5 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Child below 5</p>
                  <p className="text-xs text-slate-400">(2-5 years)</p>
                </div>
                <div className="flex items-center gap-2">
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(false, "children25")
                    }
                    disabled={children25 <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </CounterButton>
                  <span className="w-6 text-center font-semibold text-slate-800">
                    {children25}
                  </span>
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(true, "children25")
                    }
                    disabled={false}
                  >
                    <Plus className="w-4 h-4" />
                  </CounterButton>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Infants</p>
                  <p className="text-xs text-slate-400">(Under 2 years)</p>
                </div>
                <div className="flex items-center gap-2">
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(false, "infants")
                    }
                    disabled={infants <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </CounterButton>
                  <span className="w-6 text-center font-semibold text-slate-800">
                    {infants}
                  </span>
                  <CounterButton
                    onClick={() =>
                      handleIncrementorDecrementor(true, "infants")
                    }
                    disabled={false}
                  >
                    <Plus className="w-4 h-4" />
                  </CounterButton>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms - Centered below columns */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="font-medium text-slate-800">Rooms</p>
                <p className="text-xs text-slate-400">
                  Max {guests} guests per room
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CounterButton
                  onClick={() => handleIncrementorDecrementor(false, "room")}
                  disabled={rooms <= minRooms}
                >
                  <Minus className="w-4 h-4" />
                </CounterButton>
                <span className="w-6 text-center font-semibold text-slate-800">
                  {rooms}
                </span>
                <CounterButton
                  onClick={() => handleIncrementorDecrementor(true, "room")}
                  disabled={rooms >= adults}
                >
                  <Plus className="w-4 h-4" />
                </CounterButton>
              </div>
            </div>
          </div>

          {/* Warning */}
          {warningTxt && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl mt-4">
              <AlertCircle className="w-4 h-4" />
              {warningTxt}
            </div>
          )}

          {/* Apply Button */}
          <Button
            onClick={() => handleApply()}
            variant="goldGradient"
            className="w-full mt-4"
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className={cn("h-full relative", className)}>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="w-full h-full flex items-center cursor-pointer"
      >
        <GuestDisplay />
      </div>

      {/* Portal dropdown to body for proper z-index */}
      {typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
