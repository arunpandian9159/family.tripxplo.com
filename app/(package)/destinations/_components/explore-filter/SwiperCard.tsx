import { IndianRupee } from "lucide-react";
import Image from "next/image";

interface SlideCard {
  url: string;
  title: string;
  cost: string;
  packageCategory: string;
}
export default function SwiperCard({
  title,
  url,
  cost,
  packageCategory,
}: SlideCard) {
  return (
    <div className="sm:h-48 lg:h-72 sm:w-full lg:w-fullrelative rounded-md">
      <Image
        unoptimized={true}
        fill
        alt={title}
        src={url}
        className="object-cover rounded-md"
      />

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#151617] to-transparent rounded-b-md"></div>
      <div
        className="absolute top-0 left-0 px-2 py-1 text-white rounded-tl-md rounded-br-md text-[12px] font-Poppins text-[10px] not-italic font-semibold leading-normal tracking-[0.09px]"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.33)",
          background: "rgba(249, 249, 249, 0.38)",
          backdropFilter: "blur(7.599999904632568px)",
        }}
      >
        {packageCategory}
      </div>
      <div className="absolute bottom-5 left-5 text-2xl font-semibold text-white shadow-white drop-shadow-lg">
        {title}
      </div>
      <div className="absolute bottom-5 right-5 text-white flex items-center text-xl leading-none font-medium flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <IndianRupee className="text-white" strokeWidth={3} size={16} />
          <h1 className="drop-shadow-white drop-shadow-lg">{cost}</h1>
        </div>
        <h1 className="text-xs ml-2">per person</h1>
      </div>
    </div>
  );
}
