import React from "react";
import Image from "next/image";
import { NEXT_PUBLIC_IMAGE_URL } from "@/app/utils/constants/apiUrls";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { changeActivity, changeActivityAndCalculatePrice } from "@/app/store/features/packageSlice";
import { AppDispatch } from "@/app/store/store";
export default function ActivityDetails({
  activities,
  slot,
  day,
}: {
  activities: any[];
  slot: number;
  day: number;
}) {
  const router = useRouter();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch()
  function handleSelect(activity:any){
    const payload = {
      slot,day,activity
    }
    dispatch(changeActivityAndCalculatePrice(payload));
    router.back();
  }
  return (
    <div className=" flex flex-col gap-2">
      {activities.map((activity, index) => (
        <div key={activity.activityId}>
          <div
            className=" flex flex-col items-center  h-[243px] w-[309px] rounded-[14px] border-2 border-addActivityContBorder shadow-addActivityContShadow px-[6px] py-[8px] "
            key={index}
          >
            <div className="h-[112px] relative w-[293px] rounded-lg bg-addActivityImgContBg shadow-addActivityImgContShadow">
              <Image
                src={NEXT_PUBLIC_IMAGE_URL + activity?.image}
                className="w-full rounded-lg h-full absolute"
                alt="sun"
              />
            </div>
            <p className=" ml-[5px] mr-auto mt-[4px] text-[#6A778B] w-[229px] text-[14px] font-semibold leading-normal tracking-[0.14px]">
              {activity.name}
            </p>
            <div className=" flex justify-start items-center mt-[9px] ml-[4px] mr-auto">
              <span className="flex items-center">
                <p className="ml-[7px] text-[#6A778B] text-[8px] font-medium leading-normal ">
                  {activity?.dayType} Day
                </p>
              </span>
              <span className="ml-[21px] flex items-center">
                <Image src="/Clock.svg" height={14} width={14} alt="clock" />
                <p className="ml-[7px] text-[#6A778B] text-[8px] font-medium leading-normal ">
                  {activity?.duration}{" "}
                  {activity?.duration > 1 ? "Hours" : "Hour"}
                </p>
              </span>
            </div>

            <div className=" flex  justify-between items-center mt-[18px] h-[49px] w-[278px] border-t border-t-myBookingsLine">
              <p className="inline-flex justify-center items-center h-[14px] w-[65px]  border border-[#FF7865] rounded-[3.5px] shadow-addActivityPrivateActivityShadow text-[#FF7865] text-[7px] font-medium leading-[11px]  ">
                {activity?.isPrivate ? "Private" : "Public"} Activity
              </p>
              <div className="flex items-center">
                <Image
                  src="/Plus.svg"
                  height={7}
                  width={7}
                  alt="plus"
                  className="mr-[4px] "
                />
                <Image
                  src="/Rupees.svg"
                  height={7}
                  width={7}
                  alt="rupees"
                  className="mr-[3px]"
                />

                <p
                  className="h-[15px] w-[37px] font-montserrat text-[12px] font-semibold leading-[16.2px] tracking-[0.36px] bg-clip-text text-transparent "
                  style={{
                    backgroundImage:
                      " linear-gradient(87deg, #FF5F5F -25.84%, #FF9080 118.31%)",
                  }}
                >
                  {activity?.price ? activity?.price : 0}
                </p>
                <button onClick={()=>handleSelect(activity)}>
                  <p
                    className="ml-[7px] inline-flex items-center px-[14px] py-[3.5px] rounded-lg border border-[#27B182] shadow-changeHotelSelectShadow text-[10px] font-medium leading-normal tracking-[0.1px] text-transparent bg-clip-text "
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #27B182 -5.26%, #41D6A3 99.73%)",
                    }}
                  >
                    Select
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}{" "}
    </div>
  );
}
