import { Baby, Bed, UserRound } from "lucide-react";

interface ChangePersonsProps {
  roomCount: number;
  adultCount: number;
  childCount: number;
}
export default function ChangePersons({
  roomCount,
  adultCount,
  childCount,
}: ChangePersonsProps) {
  return (
    <div className="w-full border px-3 py-2  whitespace-nowrap rounded">
      <div className="flex gap-5 items-center">
        <h1 className="flex items-center gap-1">
          {roomCount} <Bed size={15} className="text-[#1EC089]" />
        </h1>
        <div>
          {adultCount > 0 && (
            <h1 className="flex items-center gap-1">
              {adultCount} <UserRound size={15} className="text-[#1EC089]" />
            </h1>
          )}
        </div>
        <div>
          {childCount > 0 && (
            <h1 className="flex items-center gap-1">
              {childCount} <Baby size={15} className="text-[#1EC089]" />
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
