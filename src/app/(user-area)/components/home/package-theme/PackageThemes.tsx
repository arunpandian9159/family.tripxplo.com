"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getInterest } from "@/app/actions/get-interest";
import { cn } from "@/lib/utils";
import { selectTheme, selectThemeId } from "@/app/store/features/selectThemeSlice";
import { RootState } from "@/app/store/store";
import { selectPerRooom, selectAdultsChild } from "@/app/store/features/roomCapacitySlice";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Interest {
  image: string;
  id: string;
  name: string;
  isFirst: boolean;
  sort: number;
  perRoom?: number;
}

interface PackageThemeProps {
  scrollRef?: React.RefObject<HTMLDivElement> | null;
}

const PackageThemes = ({ scrollRef }: PackageThemeProps) => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const themeSelected = useSelector(
    (state: RootState) => state.themeSelect.theme
  );
  const [focused, setFocused] = useState(themeSelected);
  const [selectedTheme, setSelectedTheme] = useState(themeSelected);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const { data: themes, isLoading } = useQuery<Interest[]>({
    queryKey: ["fetch Interest"],
    queryFn: getInterest,
  });

  // Check mobile and scroll buttons visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkMobile();
    checkScroll();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', checkScroll);
    };
  }, [themes]);

  // Update scroll indicators on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check after themes load
    setTimeout(handleScroll, 100);
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [themes]);

  // Ensure default selected theme id when themes load
  useEffect(() => {
    if (!selectedThemeId && themes && selectedTheme) {
      const found = themes.find(t => t.name.toLowerCase() === selectedTheme.toLowerCase());
      if (found) setSelectedThemeId(found.id);
    }
  }, [themes, selectedTheme, selectedThemeId]);

  const handleThemeFocus = (theme: Interest) => {
    setFocused(theme.name);
    setSelectedTheme(theme.name);
    setSelectedThemeId(theme.id);

    dispatch(selectTheme({ selectedTheme: theme.name }));
    dispatch(selectThemeId({ selectedThemeId: theme.id }));

    if (theme.name === 'Honeymoon' || theme.name === 'Couple') {
      setAdults(2);
      setChildren(0);
      setRooms(1);
      dispatch(selectAdultsChild({
        room: {
          adult: 2,
          child: 0,
          room: 1,
        },
      }));
      if (theme.perRoom) {
        dispatch(selectPerRooom(theme.perRoom));
      }
    } else if (theme.name === 'Family') {
      setAdults(2);
      setChildren(2);
      setRooms(1);
      dispatch(selectAdultsChild({
        room: {
          adult: 2,
          child: 2,
          room: 1,
        },
      }));
    } else if (theme.name === 'Friends') {
      setAdults(4);
      setChildren(0);
      setRooms(2);
      dispatch(selectAdultsChild({
        room: {
          adult: 4,
          child: 0,
          room: 2,
        },
      }));
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  async function fetchData() {
    const data = await getInterest();
    const filtered = data.find((k: Interest) => k.name === themeSelected);

    if (filtered) {
      dispatch(selectThemeId({ selectedThemeId: filtered.id }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Loading skeleton for mobile
  const LoadingSkeleton = () => (
    <div className="flex items-center gap-2 md:gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "rounded-full flex-shrink-0",
            isMobile ? "w-24 h-11" : "w-28 h-10"
          )} 
        />
      ))}
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Left scroll indicator - desktop only */}
      {!isMobile && showLeftArrow && (
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
      )}

      {/* Themes container */}
      <div 
        ref={containerRef}
        className={cn(
          "flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-1",
          isMobile ? "px-1 snap-x snap-mandatory" : "justify-center px-8"
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          (themes || [])
            .slice()
            .sort((a, b) => {
              const order: Record<string, number> = { 'Honeymoon': 1, 'Couple': 2, 'Family': 3, 'Friends': 4 };
              return (order[a.name] || 99) - (order[b.name] || 99);
            })
            .map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeFocus(theme)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 md:gap-2.5 transition-all duration-300 border snap-start",
                // Mobile: Larger touch targets
                isMobile 
                  ? "px-4 py-3 rounded-2xl min-w-[90px]"
                  : "px-4 py-2.5 rounded-full",
                // Selected state
                focused === theme.name
                  ? "bg-gradient-to-r from-coral-500 to-coral-400 text-white border-transparent shadow-lg shadow-coral-500/30 scale-[1.02]"
                  : "bg-white border-slate-200 text-slate-600 hover:border-coral-200 hover:bg-coral-50 active:scale-95"
              )}
            >
              <div className={cn(
                "relative flex-shrink-0",
                isMobile ? "h-5 w-5" : "h-4 w-4"
              )}>
                {theme.image !== undefined && (
                  <Image
                    loading="eager"
                    fill
                    className={cn(
                      "object-contain transition-all",
                      focused === theme.name
                        ? "brightness-0 invert"
                        : "opacity-60"
                    )}
                    alt={theme.name}
                    src={`https://tripemilestone.in-maa-1.linodeobjects.com/${theme.image}`}
                  />
                )}
              </div>
              <span className={cn(
                "font-semibold whitespace-nowrap",
                isMobile ? "text-sm" : "text-sm"
              )}>
                {theme.name}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Right scroll indicator - desktop only */}
      {!isMobile && showRightArrow && (
        <button
          onClick={() => scrollTo('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      )}

      {/* Mobile scroll hint - subtle gradient fades */}
      {isMobile && (
        <>
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-[5]" />
          )}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-[5]" />
          )}
        </>
      )}
    </div>
  );
};

export default PackageThemes;
