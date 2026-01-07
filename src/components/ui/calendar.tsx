"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        month_caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "text-sm font-semibold text-slate-800",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white p-0 opacity-70 hover:opacity-100 hover:bg-slate-100 absolute left-0 border-slate-200 rounded-lg transition-all"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white p-0 opacity-70 hover:opacity-100 hover:bg-slate-100 absolute right-0 border-slate-200 rounded-lg transition-all"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex justify-between",
        weekday:
          "text-slate-500 rounded-md w-10 font-medium text-[0.75rem] uppercase tracking-wide",
        week: "flex w-full mt-2 justify-between",
        day: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-10 w-10 rounded-lg p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 transition-colors"
        ),
        range_end: "day-range-end",
        selected:
          "bg-coral-500 text-white hover:bg-coral-600 hover:text-white focus:bg-coral-500 focus:text-white rounded-lg",
        today: "bg-slate-100 text-slate-900 font-semibold",
        outside:
          "day-outside text-slate-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-slate-300 opacity-50 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4 text-slate-600" />
          }
          return <ChevronRight className="h-4 w-4 text-slate-600" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
