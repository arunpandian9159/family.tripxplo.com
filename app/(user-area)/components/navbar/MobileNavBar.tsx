"use client";

import {
  Home,
  HandCoins,
  LogIn,
  Heart,
  UserCircleIcon,
  Package,
  CalendarDays,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/hooks/useAuth";
import AuthModal from "../home/AuthModal";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  segment: string | null;
  isAuthButton?: boolean;
}

const MobileNavBar = () => {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: "Home",
        icon: Home,
        href: "/",
        segment: null,
      },
      {
        label: "Packages",
        icon: Package,
        href: "/packages",
        segment: "packages",
      },
      {
        label: "Wishlists",
        icon: Heart,
        href: "/wishlists",
        segment: "wishlists",
      },
      {
        label: "Holidays",
        icon: CalendarDays,
        href: "/holiday-hack",
        segment: "holiday-hack",
      },
      isAuthenticated
        ? {
            label: "Account",
            icon: UserCircleIcon,
            href: "/account",
            segment: "account",
          }
        : {
            label: "Login",
            icon: LogIn,
            href: "#",
            segment: "sign-in",
            isAuthButton: true,
          },
    ],
    [isAuthenticated],
  );

  const checkActive = (item: NavItem): boolean => {
    if (item.segment === null) {
      return segment === null && pathname === "/";
    }
    return segment === item.segment;
  };

  // Find the active index for the indicator position
  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) => checkActive(item));
  }, [segment, pathname, navItems]);

  // Calculate indicator position (percentage based on 5 items)
  const indicatorPosition = activeIndex >= 0 ? activeIndex * 20 + 10 : 10; // 20% per item, +10% to center

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.isAuthButton) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Animated indicator line */}
        <div
          className="absolute top-0 h-0.5 w-12 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-700 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
          style={{
            left: `${indicatorPosition}%`,
            transform: "translateX(-50%)",
          }}
        />

        <div className="px-2 py-1.5">
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => {
              const isActive = checkActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200 touch-manipulation min-w-[56px]",
                    "active:scale-95 active:bg-slate-50",
                    isActive && "bg-emerald-50/50",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/30"
                        : "bg-transparent",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive
                          ? "text-white scale-105"
                          : "text-slate-400 group-hover:text-slate-500",
                      )}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold transition-colors leading-tight",
                      isActive ? "text-emerald-600" : "text-slate-400",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="signin"
      />
    </>
  );
};

export default MobileNavBar;
