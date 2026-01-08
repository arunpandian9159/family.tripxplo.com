"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInitiallyLoaded,
  selectPerRooom,
  selectRoom,
} from "@/app/store/features/roomCapacitySlice";
import Link from "next/link";
export default function SelectRoom() {
  const router = useRouter();
  const dispatch = useDispatch();
  const roomCapacityData = useSelector(
    (store: any) => store.roomSelect.room.roomSchema
  );
  const perRoomData = useSelector(
    (store: any) => store.roomSelect.room.perRoom
  );
  const [isLoading, setLoading] = useState(true);
  const [room, setRoom] = useState<
    { id: number; totalAdults: number; totalChilds: number }[]
  >([{ id: 1, totalAdults: 0, totalChilds: 0 }]);
  // Theme is always "Family" in this project
  const themeSelected = "Family";
  const [selectedRoom, setSelectedRoom] = useState(
    perRoomData === 3 || perRoomData === 4 || perRoomData === 6
      ? perRoomData
      : 3
  );
  // Family theme: room size is always 3
  const roomSize = [{ size: 3 }];

  const deleteRoom = (id: number) => {
    const updatedRooms = room.filter((roomData) => roomData.id !== id);
    setRoom(updatedRooms);
    dispatch(selectRoom({ room: updatedRooms }));
  };

  const addAdult = (index: number) => {
    if (selectedRoom !== 3) {
      if (room[index].totalAdults < selectedRoom + 1) {
        const updatedRooms = room.map((roomItem, i) =>
          i === index
            ? { ...roomItem, totalAdults: roomItem.totalAdults + 1 }
            : roomItem
        );
        setRoom(updatedRooms);
        dispatch(selectRoom({ room: updatedRooms }));
        if (
          room[index].totalAdults + room[index].totalChilds >=
          selectedRoom + 3
        ) {
          if (room[index].totalChilds > 0) {
            const updatedRooms = room.map((roomItem, i) =>
              i === index
                ? { ...roomItem, totalChilds: roomItem.totalChilds - 1 }
                : roomItem
            );
            setRoom(updatedRooms);
            dispatch(selectRoom({ room: updatedRooms }));
          }
        }
      }
    } else {
      if (room[index].totalAdults < selectedRoom) {
        const updatedRooms = room.map((roomItem, i) =>
          i === index
            ? { ...roomItem, totalAdults: roomItem.totalAdults + 1 }
            : roomItem
        );
        setRoom(updatedRooms);
        dispatch(selectRoom({ room: updatedRooms }));
        if (
          room[index].totalAdults + room[index].totalChilds >=
          selectedRoom + 1
        ) {
          if (room[index].totalChilds > 0) {
            const updatedRooms = room.map((roomItem, i) =>
              i === index
                ? { ...roomItem, totalChilds: roomItem.totalChilds - 1 }
                : roomItem
            );
            setRoom(updatedRooms);
            dispatch(selectRoom({ room: updatedRooms }));
          }
        }
      }
    }
  };

  const addChild = (index: number) => {
    if (selectedRoom != 3) {
      if (
        room[index].totalChilds < 2 ||
        room[index].totalAdults + room[index].totalChilds < selectedRoom + 3
      ) {
        const updatedRooms = room.map((roomItem, i) =>
          i === index
            ? { ...roomItem, totalChilds: roomItem.totalChilds + 1 }
            : roomItem
        );
        setRoom(updatedRooms);
        dispatch(selectRoom({ room: updatedRooms }));
      }
    } else {
      if (
        room[index].totalChilds < 1 ||
        room[index].totalAdults + room[index].totalChilds < selectedRoom + 1
      ) {
        const updatedRooms = room.map((roomItem, i) =>
          i === index
            ? { ...roomItem, totalChilds: roomItem.totalChilds + 1 }
            : roomItem
        );
        setRoom(updatedRooms);
        dispatch(selectRoom({ room: updatedRooms }));
      }
    }
  };

  const addRoom = () => {
    const newRoomId = room.length + 1;
    const newRoom = { id: newRoomId, totalAdults: 0, totalChilds: 0 };
    const updatedRooms = [...room, newRoom];
    setRoom(updatedRooms);
    dispatch(selectRoom({ room: updatedRooms }));
  };

  const subAdult = (index: number) => {
    if (room[index].totalAdults > 0) {
      const updatedRooms = room.map((roomItem, i) =>
        i === index
          ? { ...roomItem, totalAdults: roomItem.totalAdults - 1 }
          : roomItem
      );
      setRoom(updatedRooms);
      dispatch(selectRoom({ room: updatedRooms }));
    }
  };

  const subChild = (index: number) => {
    if (room[index].totalChilds > 0) {
      const updatedRooms = room.map((roomItem, i) =>
        i === index
          ? { ...roomItem, totalChilds: roomItem.totalChilds - 1 }
          : roomItem
      );
      setRoom(updatedRooms);
      dispatch(selectRoom({ room: updatedRooms }));
    }
  };

  function applyRooms() {
    router.back();
  }

  function isAdultValid(index: number) {
    if (selectedRoom !== 3) {
      return room[index].totalAdults < selectedRoom + 1;
    } else {
      return room[index].totalAdults < selectedRoom;
    }
  }

  function isChildValid(index: number) {
    if (selectedRoom !== 3) {
      return (
        room[index].totalChilds < 2 ||
        room[index].totalAdults + room[index].totalChilds < selectedRoom + 3
      );
    } else {
      return (
        room[index].totalChilds < 1 ||
        room[index].totalAdults + room[index].totalChilds < selectedRoom + 1
      );
    }
  }

  useEffect(() => {
    setRoom(roomCapacityData);
    setLoading(false);
  }, [roomCapacityData]);

  useEffect(() => {
    if (selectedRoom === 3) {
      dispatch(selectPerRooom(selectedRoom - 1));
    } else {
      dispatch(selectPerRooom(selectedRoom));
    }
  }, [selectedRoom, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      const updates = room?.map((roomItem) =>
        roomItem.totalAdults + roomItem.totalChilds >= selectedRoom + 3
          ? {
              ...roomItem,
              totalAdults: selectedRoom !== 3 ? selectedRoom + 1 : selectedRoom,
              totalChilds: selectedRoom !== 3 ? 2 : 1,
            }
          : roomItem
      );
      setRoom(updates);
    }
  }, [dispatch, selectedRoom, isLoading]);

  const clickBack = () => {
    router.back();
  };
  return (
    <div>
      <section className="">
        <div
          className="fixed top-0 text-center gap-3 flex items-center  w-full h-auto py-5 lg:py-10 bg-white z-10 "
          style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
        >
          <span className="pl-4 lg:pl-6 flex items-center">
            <button
              onClick={clickBack}
              className="border border-neutral-100 shadow-sm rounded-md p-1 cursor-pointer"
            >
              <ChevronLeft size={24} className="text-[#1EC089]" />
            </button>
          </span>
          <h1
            className="text-center flex flex-wrap px-2 h-auto font-Poppins text-[18px] not-italic font-semibold drop-shadow-black drop-shadow-sm"
            style={{
              textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
              backgroundImage:
                "linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Select Roomsize & Guests
          </h1>
        </div>
      </section>
      {/* <div
        className="fixed top-0 left-0 text-center flex items-center w-full py-5 whitespace-nowrap bg-white z-10"
        style={{ boxShadow: "0px 4px 36.1px 0px rgba(190, 190, 190, 0.22)" }}
      >
        <span className="ml-[20px] flex items-center gap-2">
          <Link href={"/"}>
            <button>
              <ArrowLeft className="h-[33px] w-[33px] text-[#1EC089]" />
            </button>
          </Link>
          <h1
            className="text-center pl-[16px] font-Poppins text-[18px] not-italic font-semibold leading-normal tracking-[0.18px]"
            style={{
              textShadow: "2px 4px 14.3px rgba(255, 120, 101, 0.20)",
              backgroundImage:
                "linear-gradient(87deg, #1EC089 -25.84%, #1EC089 118.31%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Select roomSize & Guests
          </h1>
        </span>
      </div> */}
      <div className="mt-24  lg:mt-40">
        <section className="flex my-2 mx-5 font-Poppins gap-4 items-center">
          <p className="text-[#6A778B] text-[14px] sm:text-[17px] lg:text-[20px] font-semibold">
            Room Size
          </p>
          <p
            className="text-[12px] sm:text-[14px] lg:text-[17px] font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #27B182 -5.26%, #31DAA1 99.73%)",
            }}
          >
            Max Guest per Room
          </p>
        </section>

        <section className="mx-5 flex items-center gap-6">
          {roomSize?.map((data) => (
            <button
              key={data.size}
              onClick={(e) => setSelectedRoom(data.size)}
              className={`w-[40px] h-[40px] text-white rounded-lg p-3 justify-center flex items-center ${
                selectedRoom === data.size ? "bg-[#1EC089]" : "bg-gray-400"
              }`}
            >
              {data.size}
            </button>
          ))}
        </section>

        <div className="">
          {!isLoading &&
            room?.map((roomData, index) => (
              <section
                key={index}
                className="w-[320px] flex flex-col mx-auto my-10 rounded-lg p-3"
                style={{
                  border: "var(--adult,2px) solid rgba(172, 161, 159, 0.34)",
                  boxShadow: " 4px 8px 26.3px 0px rgba(172, 161, 159, 0.18);",
                }}
              >
                <div className="flex items-center font--Poppins">
                  <h1 className="px-5 my-2 text-[#1EC089] text-[14px] font-semibold">
                    Room {index + 1}
                  </h1>
                  {roomData.id !== 1 && (
                    <button
                      onClick={(e) => {
                        deleteRoom(roomData.id);
                      }}
                      className="ml-auto px-2 text-[#1EC089] text-xs font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <hr />
                <div className="flex my-4 items-center font-Poppins font-medium gap-4">
                  <span className="text-[14px] text-[#5D6670]">Adults</span>
                  <p className="text-[12px] text-[#1EC089]">Above 12 Yrs</p>
                  <div className="ml-auto flex items-center gap-4 pr-3">
                    <button
                      onClick={() => subAdult(index)}
                      className={
                        room[index].totalAdults !== 0
                          ? "bg-gray-500 w-[30px] h-[30px] text-white rounded-md"
                          : "bg-[#C4CBD2] w-[30px] h-[30px] text-white rounded-md cursor-not-allowed"
                      }
                      style={{
                        boxShadow:
                          "0px 4px 14.2px 0px rgba(255, 120, 101, 0.09)",
                      }}
                    >
                      -
                    </button>
                    <p className="w-3">{roomData.totalAdults}</p>
                    <button
                      onClick={() => addAdult(index)}
                      className={
                        isAdultValid(index)
                          ? "bg-gray-500 w-[30px] h-[30px] text-white rounded-md"
                          : "bg-[#C4CBD2] w-[30px] h-[30px] text-white rounded-md cursor-not-allowed"
                      }
                      style={{
                        boxShadow:
                          "0px 4px 14.2px 0px rgba(255, 120, 101, 0.09)",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-[#5D6670] pr-2 text-[14px] font-Poppins font-medium">
                    Children
                  </span>
                  <p className="text-[12px] text-[#1EC089]">5 to 11 Yrs</p>
                  <div className="ml-auto pr-3 flex items-center gap-4">
                    <button
                      onClick={() => subChild(index)}
                      className={
                        room[index].totalChilds !== 0
                          ? "bg-gray-500 w-[30px] h-[30px] text-white rounded-md"
                          : "bg-[#C4CBD2] w-[30px] h-[30px] text-white rounded-md cursor-not-allowed"
                      }
                      style={{
                        boxShadow:
                          "0px 4px 14.2px 0px rgba(255, 120, 101, 0.09)",
                      }}
                    >
                      -
                    </button>
                    <p className="w-3">{roomData.totalChilds}</p>
                    <button
                      onClick={() => addChild(index)}
                      className={
                        isChildValid(index)
                          ? "bg-gray-500 w-[30px] h-[30px] text-white rounded-md"
                          : "bg-[#C4CBD2] w-[30px] h-[30px] text-white rounded-md cursor-not-allowed"
                      }
                      style={{
                        boxShadow:
                          "0px 4px 14.2px 0px rgba(255, 120, 101, 0.09)",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </section>
            ))}
        </div>

        <button
          onClick={() => addRoom()}
          className="py-2 flex items-center gap-2 mb-20 mx-auto justify-center rounded-lg text-[#6A778B] font-Poppins font-medium"
        >
          <PlusCircle size={18} />
          Add Another Room
        </button>

        <button
          onClick={applyRooms}
          className="fixed bottom-0 left-5 right-5 flex items-center justify-center rounded-xl p-3 bg-[#1EC089]"
        >
          <h1 className="text-white text-center">Apply</h1>
        </button>
      </div>
    </div>
  );
}
