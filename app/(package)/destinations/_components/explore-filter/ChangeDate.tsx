import { format } from "date-fns";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { changeDate } from "@/app/store/features/searchPackageSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChangeDateSchema {
  date: string;
}

const ChangeDate: React.FC<ChangeDateSchema> = ({ date }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(date),
  );
  const [dateOpen, setDateOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      dispatch(changeDate(newDate.toISOString()));
      func();
    }
  };

  const func = () => {
    setTimeout(() => {
      setDateOpen(false);
    }, 200);
  };

  return (
    <div onClick={() => setDateOpen(true)}>
      <Popover open={dateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#ff7865]" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span className="text-gray-400 hover:text-black">
                Travel date
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-2 border-solid rounded-[14px] border-[#FF5F5F] scale-x-100 justify-center flex w-full px-10"
          style={{
            boxShadow: "8px 3px 22px 10px rgba(150, 150, 150, 0.11)",
          }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            disabled={{ before: new Date() }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChangeDate;
