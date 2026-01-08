"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
} from "date-fns";
import { cn } from "@/lib/utils";
import { indianHolidays, type Holiday } from "@/lib/models/indian-holidays";

interface HolidayCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: { before?: Date };
  className?: string;
}

export function HolidayCalendar({
  selected,
  onSelect,
  disabled,
  className,
}: HolidayCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected || new Date()
  );

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getHolidayForDate = (date: Date): Holiday | null => {
    const dateKey = format(date, "yyyy-MM-dd");
    return indianHolidays[dateKey] || null;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (disabled?.before) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return isBefore(date, today);
    }
    return false;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onSelect?.(date);
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows: React.ReactNode[] = [];
    let day = startDate;

    while (day <= endDate) {
      const week: React.ReactNode[] = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const holiday = getHolidayForDate(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSelected = selected && isSameDay(currentDay, selected);
        const isDisabled = isDateDisabled(currentDay);
        const isTodayDate = isToday(currentDay);

        week.push(
          <button
            key={currentDay.toISOString()}
            type="button"
            onClick={() => handleDateClick(currentDay)}
            disabled={isDisabled}
            className={cn(
              "relative flex flex-col w-[56px] h-[56px] p-1 rounded-lg transition-all duration-200",
              // Alignment - centered for regular days, start for holidays
              holiday && isCurrentMonth
                ? "items-start justify-start"
                : "items-center justify-center",
              // Base states
              !isCurrentMonth && "text-slate-300",
              isCurrentMonth && !holiday && "text-slate-700 hover:bg-slate-50",
              // Holiday styling
              holiday && isCurrentMonth && "bg-emerald-50 hover:bg-emerald-100",
              // Selected state
              isSelected &&
                !holiday &&
                "bg-emerald-500 text-white hover:bg-emerald-600",
              isSelected && holiday && "ring-2 ring-emerald-500 ring-offset-1",
              // Today indicator
              isTodayDate && !isSelected && !holiday && "bg-slate-100",
              // Disabled state
              isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
            )}
          >
            {/* Day number */}
            <span
              className={cn(
                "text-sm font-semibold leading-none",
                holiday && isCurrentMonth && "text-emerald-600",
                isSelected && !holiday && "text-white"
              )}
            >
              {format(currentDay, "d")}
            </span>

            {/* Holiday name */}
            {holiday && isCurrentMonth && (
              <span
                className={cn(
                  "text-[9px] leading-[1.2] text-emerald-700 font-medium mt-0.5 line-clamp-3 w-full break-words hyphens-auto",
                  isSelected && "text-emerald-800"
                )}
              >
                {holiday.name}
              </span>
            )}
          </button>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="flex justify-between gap-0.5">
          {week}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className={cn("w-auto select-none", className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h2 className="text-base font-semibold text-slate-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week days header */}
      <div className="flex justify-between gap-0.5 mb-2 px-0.5">
        {weekDays.map((day) => (
          <div
            key={day}
            className="w-[56px] text-center text-xs font-semibold text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col gap-0.5">{renderCalendarDays()}</div>
    </div>
  );
}
