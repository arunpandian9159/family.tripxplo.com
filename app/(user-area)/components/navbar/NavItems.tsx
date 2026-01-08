"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItemsProps {
  label: string;
  href: string;
  active?: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ label, href, active }) => {
  const pathname = usePathname();
  const isActive = active || pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        isActive
          ? "text-emerald-600 bg-emerald-50"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
      )}
    </Link>
  );
};

export default NavItems;
