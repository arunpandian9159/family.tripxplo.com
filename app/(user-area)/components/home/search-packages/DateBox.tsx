"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeDate } from "@/app/store/features/searchPackageSlice";
import { HolidayCalendar } from "./HolidayCalendar";

interface DateBoxProps {
  className?: string;
  isOpen?: boolean;
  onDateSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function DateBox({
  className,
  isOpen,
  onDateSelect,
  onOpenChange,
}: DateBoxProps) {
  const defaultDate = useSelector((store: any) => store.searchPackage.date);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Use external isOpen if provided, otherwise use internal state
  const dateOpen = isOpen !== undefined ? isOpen : internalOpen;

  const dispatch = useDispatch();
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (defaultDate) {
      setDate(new Date(defaultDate));
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [defaultDate]);

  const setDateOpen = useCallback(
    (open: boolean) => {
      setInternalOpen(open);
      if (onOpenChange) {
        onOpenChange(open);
      }
    },
    [onOpenChange]
  );

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current && !isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.left - 100, 16), // Center it better, but don't go off screen
      });
    }
  }, [isMobile]);

  function handleDateChange(newDate: Date | undefined) {
    if (!newDate) return;

    const localDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000
    );

    setDate(localDate);
    dispatch(changeDate(localDate.toISOString()));

    // Close the popover after selection
    setTimeout(() => {
      setDateOpen(false);
      // Trigger callback to transition to guest dropdown
      if (onDateSelect) {
        setTimeout(() => onDateSelect(), 100);
      }
    }, 200);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setDateOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDateOpen]);

  // Update position on scroll/resize
  useEffect(() => {
    if (dateOpen && !isMobile) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [dateOpen, isMobile, updateDropdownPosition]);

  const handleToggle = useCallback(() => {
    if (!dateOpen) {
      updateDropdownPosition();
    }
    setDateOpen(!dateOpen);
  }, [dateOpen, updateDropdownPosition, setDateOpen]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && dateOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobile, dateOpen]);

  const dropdownContent = dateOpen && (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
          onClick={() => setDateOpen(false)}
        />
      )}

      <div
        ref={popoverRef}
        className={cn(
          "bg-white shadow-2xl border border-slate-200 overflow-hidden",
          isMobile
            ? "fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 z-[9999]"
            : "fixed rounded-2xl z-[9999]"
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
            "px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 flex items-center justify-between sticky top-0 z-10",
            isMobile && "px-6 py-5"
          )}
        >
          <div>
            <h3 className="font-semibold text-slate-800">Select Date</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When do you want to travel?
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => setDateOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        {/* Calendar */}
        <div className={cn("p-4", isMobile && "p-5 pb-8")}>
          <HolidayCalendar
            selected={date}
            onSelect={handleDateChange}
            disabled={{ before: new Date() }}
          />
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
        {mounted && date ? (
          <span
            className="text-sm lg:text-base font-medium text-slate-800"
            suppressHydrationWarning
          >
            {format(date, "EEE, d MMM yyyy")}
          </span>
        ) : (
          <span className="text-sm lg:text-base text-slate-400">
            Select travel date
          </span>
        )}
      </div>

      {/* Portal dropdown to body for proper z-index */}
      {typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
