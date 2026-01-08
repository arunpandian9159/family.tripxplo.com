"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
      sticky top-0 z-50 lg:hidden
      transition-all duration-300
      ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100"
          : "bg-white border-b border-slate-100"
      }
    `}
    >
      <div className="px-4 h-16 flex justify-center items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="TripXplo Logo"
            width={120}
            height={40}
            priority
            className="w-auto h-8 object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
