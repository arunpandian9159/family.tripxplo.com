import Link from "next/link";     
import { FaWhatsapp } from "react-icons/fa6";   

export default function WhatsappIcon() {      
    return (
      <div className="fixed bottom-24 lg:bottom-8 right-6 z-40">
        <Link
          href="https://wa.me/917695993808?text=Hello%2C%20I%27m%20interested%20in%20TripXplo%20Travel%20package"
          target="_blank"
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-wave"
        >
          <FaWhatsapp className="text-white w-7 h-7" />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help?
          </span>
        </Link>
      </div>
    );
};