"use client";
import {
  changeDestination,
  changeDestinationId,
} from "@/app/store/features/searchPackageSlice";
import { useAppSelector } from "@/app/store/store";
import { initial_search_url, search_url } from "@/app/utils/serverurls";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ChangeDestination: React.FC = () => {
  const dispatch = useDispatch();
  const destination = useAppSelector(
    (state) => state.searchPackage.destination
  );
  const [inputText, setInputText] = useState("");
  const [allDestinations, setAllDestinations] = useState([]);
  const [inputDestinations, setInputDestinations] = useState([]);
  const [isInputFocused, setInputFocused] = useState(false);

  const fetchData = async () => {
    const data = await fetch(initial_search_url);
    const json = await data.json();
    setAllDestinations(json.result);
    setInputDestinations(json.result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputDestinations = async (input: string) => {
    setInputText(input);
    const filteredData = await fetch(search_url + input);
    const filteredDataJson = await filteredData.json();
    setInputDestinations(filteredDataJson.result);
  };

  const selectedDestination = (input: string, id: string) => {
    dispatch(changeDestination(input));
    dispatch(changeDestinationId(id));
  };

  const handleInputText = (input: string, id: string) => {
    setInputText(input);
    setInputFocused(false);
    if (input && id) {
      selectedDestination(input, id);
    }
  };

  useEffect(() => {
    setInputText(destination);
  }, [destination]);

  return (
    <>
      <div className="relative w-full">
        <div className="w-full border px-3 py-2 whitespace-nowrap rounded-sm">
          <input
            placeholder="Travel destination"
            className="w-full border-none outline-none"
            value={inputText}
            type="text"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 100)}
            onInput={(e: any) => handleInputDestinations(e.target.value)}
          />
        </div>
        {isInputFocused && (
          <div className="absolute top-full left-0 z-10 shadow-lg bg-white w-full max-h-[200px] overflow-y-auto border border-2 border-[#1EC089] rounded-lg">
            {/* Replace with your popup content */}
            <p className="px-4 py-2">Popup Content Here</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeDestination;
