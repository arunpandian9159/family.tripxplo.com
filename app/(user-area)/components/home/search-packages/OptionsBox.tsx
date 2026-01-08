"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, AlertCircle, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  initialLoad,
  selectAdultsChild,
  selectInitiallyLoaded,
} from "@/app/store/features/roomCapacitySlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const themeSelected = useSelector(
    (state: RootState) => state.themeSelect.theme
  );

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
  const [rooms, setRooms] = useState(0);
  const [adults, setAdults] = useState(0);
  const [child, setChild] = useState(0);
  const [minRooms, setMinRooms] = useState(1);
  const [showChild, setShowChild] = useState(true);
  const [guests, setGuests] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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

    // Initialize with default values after mount
    if (themeSelected === "Honeymoon" || themeSelected === "Couple") {
      setAdults(2);
      setRooms(1);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleIncrementorDecrementor(i: boolean, value: string) {
    switch (value) {
      case "adult": {
        if (i) {
          setAdults(adults + 1);
        } else {
          if (themeSelected === "Honeymoon" && adults - 2 > 0) {
            setAdults(adults - 1);
            break;
          }
          if (themeSelected !== "Honeymoon" && adults - 1 > 0) {
            setAdults(adults - 1);
            break;
          }
        }
        break;
      }
      case "child": {
        if (i) {
          setChild(child + 1);
        } else {
          if (child - 1 >= 0) {
            setChild(child - 1);
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
    } else {
      setWarningTxt("Invalid number of rooms");
    }
  }

  useEffect(() => {
    if (!roomInitiallyLoaded) dispatch(initialLoad());
  }, [themeSelected, dispatch, roomInitiallyLoaded]);

  // Room calculation logic
  useEffect(() => {
    let r = 0;
    if (child == 0) {
      if (themeSelected !== "Honeymoon") r = Math.ceil(adults / 3);
      else r = Math.ceil(adults / 2);
    } else {
      let x = adults;
      let y = child;
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
          child: child,
          room: r,
        },
      })
    );
  }, [child, adults, themeSelected, dispatch]);

  function validateAdults() {
    if (themeSelected === "Honeymoon") {
      if (adults <= 2) return false;
      else return true;
    }
    if (themeSelected === "Couple") {
      if (adults <= 1) return false;
      else return true;
    }
    // For Friends and Family themes, allow decrement if adults > 1
    if (themeSelected === "Friends") {
      return adults > 1;
    }
    if (themeSelected === "Family") {
      return adults > 1;
    }
    // Default case - allow decrement if adults > 1
    return adults > 1;
  }

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current && !isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.right - 320, 16), // Align to right, but don't go off screen
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

  useEffect(() => {
    switch (themeSelected) {
      case "Couple": {
        setAdults(2);
        setChild(0);
        setShowChild(true);
        break;
      }
      case "Honeymoon": {
        setAdults(2);
        setChild(0);
        setShowChild(false);
        break;
      }
      case "Friends": {
        setAdults(4);
        setChild(0);
        setShowChild(false);
        break;
      }
      case "Family": {
        setAdults(2);
        setChild(2);
        setShowChild(true);
        break;
      }
      default: {
        setShowChild(true);
      }
    }
  }, [themeSelected]);

  const handleAdultsChange = (newAdults: number) => {
    setAdults(newAdults);
    dispatch(
      selectAdultsChild({
        room: {
          adult: newAdults,
          child: child,
          room: rooms,
        },
      })
    );
  };

  const handleChildrenChange = (newChildren: number) => {
    if (!showChild) {
      setChild(0);
      return;
    }
    setChild(newChildren);
    dispatch(
      selectAdultsChild({
        room: {
          adult: adults,
          child: newChildren,
          room: rooms,
        },
      })
    );
  };

  useEffect(() => {
    // Dispatch room data to Redux for all themes
    const room = { adult: adults, child: child, room: rooms };
    dispatch(selectAdultsChild({ room }));
    dispatch(selectInitiallyLoaded(true));
  }, [adults, child, rooms, dispatch]);

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
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95"
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

    // Use local state for all themes
    return rooms > 0 ? (
      <span className="text-sm lg:text-base font-medium text-slate-800">
        {rooms} {rooms == 1 ? "Room" : "Rooms"}, {adults}{" "}
        {adults == 1 ? "Adult" : "Adults"}
        {showChild &&
          child > 0 &&
          `, ${child} ${child == 1 ? "Child" : "Children"}`}
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
            : "fixed w-[320px] rounded-2xl z-[9999]"
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
            "px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10",
            isMobile && "px-6 py-5"
          )}
        >
          <div>
            <h3 className="font-semibold text-slate-800">Guests & Rooms</h3>
            <p className="text-xs text-slate-500">
              Max {guests} guests per room
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => setSpecFocused(false)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        <div className={cn("p-5 space-y-5", isMobile && "p-6 pb-8 space-y-6")}>
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Adults</p>
              {themeSelected !== "Honeymoon" && (
                <p className="text-xs text-slate-400">Above 12 years</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, "adult")}
                disabled={!validateAdults()}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">
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

          {/* Children */}
          {showChild && (
            <>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Children</p>
                  <p className="text-xs text-slate-400">5 to 11 years</p>
                </div>
                <div className="flex items-center gap-3">
                  <CounterButton
                    onClick={() => handleIncrementorDecrementor(false, "child")}
                    disabled={child <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </CounterButton>
                  <span className="w-8 text-center font-semibold text-slate-800 text-lg">
                    {child}
                  </span>
                  <CounterButton
                    onClick={() => handleIncrementorDecrementor(true, "child")}
                    disabled={false}
                  >
                    <Plus className="w-4 h-4" />
                  </CounterButton>
                </div>
              </div>
            </>
          )}

          {/* Rooms */}
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, "room")}
                disabled={rooms <= minRooms}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">
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

          {/* Warning */}
          {warningTxt && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              {warningTxt}
            </div>
          )}

          {/* Apply Button */}
          <Button
            onClick={() => handleApply()}
            variant="primary"
            className="w-full"
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
