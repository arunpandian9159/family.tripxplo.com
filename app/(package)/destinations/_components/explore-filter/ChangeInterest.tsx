import { useState } from "react";
import { getInterest } from "@/app/actions/get-interest";
import { Interest } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

interface ChangeInterestProps {
  interestName: string;
}

const ChangeInterest: React.FC<ChangeInterestProps> = ({ interestName }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: themes, isLoading } = useQuery<Interest[]>({
    queryKey: ["fetch Interest"],
    queryFn: getInterest,
  });

  const handleInterestChange = () => {
    setOpen(!open);
  };

  return (
    <div className="relative w-full">
      <div
        onMouseDown={handleInterestChange}
        className="w-full border px-3 py-2 whitespace-nowrap cursor-pointer"
      >
        {interestName}
      </div>
      {open && (
        <div className="absolute top-full left-0 z-10 shadow-lg bg-white w-full max-h-[200px] overflow-y-auto border border-2 border-[#1EC089] rounded-lg">
          {isLoading ? (
            <p className="px-4 py-2">Loading...</p>
          ) : (
            themes?.map((theme) => (
              <div key={theme._id} className="px-4 py-2 cursor-pointer">
                <h1>{theme.interestName}</h1>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeInterest;
