"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavMenuProps {
  label: string;
  icon: LucideIcon;
  href: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ label, icon: Icon, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-amber-50 text-amber-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5",
          isActive ? "text-amber-500" : "text-slate-500"
        )}
      />
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
};

export default NavMenu;
