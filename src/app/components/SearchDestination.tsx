'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Destination {
  id: string;
  name: string;
  image?: string;
  type?: string;
  isDomestic?: boolean;
  rankNo?: number;
}

interface SearchDestinationProps {
  className?: string;
  selectedDestination?: string;
  onDestinationChange?: (name: string, id: string) => void;
  onDestinationSelect?: () => void;
}

// Featured destinations with tags and colors
const FEATURED_DESTINATIONS = [
  // Domestic Destinations
  { name: 'Andaman', tag: 'IN SEASON', color: 'bg-green-100 text-green-800' },
  { name: 'Manali', tag: 'HONEYMOON', color: 'bg-pink-100 text-pink-800' },
  { name: 'Kashmir', tag: 'TRENDING', color: 'bg-purple-100 text-purple-800' },
  { name: 'Ooty', tag: 'BUDGET', color: 'bg-orange-100 text-orange-800' },
  { name: 'Goa', tag: 'POPULAR', color: 'bg-purple-100 text-purple-800' },
  { name: 'Varkala', tag: 'IN SEASON', color: 'bg-green-100 text-green-800' },
  { name: 'Coorg', tag: 'BUDGET', color: 'bg-orange-100 text-orange-800' },
  { name: 'Kodaikanal', tag: 'IN SEASON', color: 'bg-green-100 text-green-800' },
  { name: 'Alleppey', tag: 'BACKWATERS', color: 'bg-blue-100 text-blue-800' },
  { name: 'Shimla', tag: 'BUDGET', color: 'bg-orange-100 text-orange-800' },
  { name: 'Munnar', tag: 'TRENDING', color: 'bg-teal-100 text-teal-800' },
  // International Destinations
  { name: 'Bali', tag: 'HONEYMOON', color: 'bg-pink-100 text-pink-800' },
  { name: 'Thailand', tag: 'POPULAR', color: 'bg-purple-100 text-purple-800' },
  { name: 'Vietnam', tag: 'TRENDING', color: 'bg-teal-100 text-teal-800' },
  { name: 'Maldives', tag: 'LUXURY', color: 'bg-amber-100 text-amber-800' },
];

const getDestinationTag = (name: string) => {
  const featured = FEATURED_DESTINATIONS.find(
    f =>
      name.toLowerCase().includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(name.toLowerCase())
  );
  return featured || null;
};

const SearchDestination = ({
  className,
  selectedDestination,
  onDestinationChange,
  onDestinationSelect,
}: SearchDestinationProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [inputDestinations, setInputDestinations] = useState<Destination[]>([]);
  const [inputText, setInputText] = useState(selectedDestination || '');
  const [isInputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Check if mobile on mount and resize
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update inputText when selectedDestination prop changes
  useEffect(() => {
    if (selectedDestination !== undefined) {
      setInputText(selectedDestination);
    }
  }, [selectedDestination]);

  // Fetch destinations from API (like tripxplo.com)
  const fetchDestinations = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      const url = query
        ? `/api/v1/destinations/search?q=${encodeURIComponent(query)}&limit=50`
        : `/api/v1/destinations/search?limit=50`;
      const response = await fetch(url);
      const json = await response.json();

      // API returns { success, result: { docs: [...] } }
      if (json.success && json.result?.docs) {
        setInputDestinations(json.result.docs);
      } else {
        setInputDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setInputDestinations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch destinations on mount
  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current && !isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 420),
      });
    }
  }, [isMobile]);

  const handleFocus = useCallback(() => {
    setInputFocused(true);
    updateDropdownPosition();
  }, [updateDropdownPosition]);

  const handleInputChange = useCallback(
    (input: string) => {
      setInputText(input);
      fetchDestinations(input.trim());
    },
    [fetchDestinations]
  );

  const selectDestination = useCallback(
    (name: string, id: string) => {
      setInputText(name);
      setInputFocused(false);

      if (onDestinationChange) {
        onDestinationChange(name, id);
      }

      // Trigger callback to transition to calendar dropdown
      if (onDestinationSelect) {
        setTimeout(() => onDestinationSelect(), 100);
      }
    },
    [onDestinationChange, onDestinationSelect]
  );

  // Update position on scroll/resize
  useEffect(() => {
    if (isInputFocused && !isMobile) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isInputFocused, isMobile, updateDropdownPosition]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setInputFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && isInputFocused) {
      document.body.style.overflow = 'hidden';
      // Focus the mobile input after animation
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isInputFocused]);

  // Separate destinations into domestic and international, and sort by FEATURED_DESTINATIONS order
  const sortByFeaturedOrder = (destinations: Destination[]) => {
    return [...destinations].sort((a, b) => {
      const aIndex = FEATURED_DESTINATIONS.findIndex(
        f =>
          a.name.toLowerCase().includes(f.name.toLowerCase()) ||
          f.name.toLowerCase().includes(a.name.toLowerCase())
      );
      const bIndex = FEATURED_DESTINATIONS.findIndex(
        f =>
          b.name.toLowerCase().includes(f.name.toLowerCase()) ||
          f.name.toLowerCase().includes(b.name.toLowerCase())
      );

      // If both are featured, sort by their index in FEATURED_DESTINATIONS
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // Featured items come first
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // Non-featured items sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  // Filter to only show featured destinations when not searching
  const filterFeaturedOnly = (destinations: Destination[]) => {
    return destinations.filter(dest =>
      FEATURED_DESTINATIONS.some(
        f =>
          dest.name.toLowerCase().includes(f.name.toLowerCase()) ||
          f.name.toLowerCase().includes(dest.name.toLowerCase())
      )
    );
  };

  const domesticDestinations = sortByFeaturedOrder(
    inputText.trim()
      ? inputDestinations.filter(dest => dest.isDomestic !== false && dest.type !== 'International')
      : filterFeaturedOnly(
          inputDestinations.filter(
            dest => dest.isDomestic !== false && dest.type !== 'International'
          )
        )
  );

  const internationalDestinations = sortByFeaturedOrder(
    inputText.trim()
      ? inputDestinations.filter(dest => dest.isDomestic === false || dest.type === 'International')
      : filterFeaturedOnly(
          inputDestinations.filter(
            dest => dest.isDomestic === false || dest.type === 'International'
          )
        )
  );

  const renderDestinationItem = (dest: Destination) => {
    const tag = getDestinationTag(dest.name);
    return (
      <button
        key={dest.id}
        onMouseDown={() => selectDestination(dest.name, dest.id)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#15ab8b] transition-colors" />
          <span className="text-base text-gray-700 group-hover:text-gray-900 font-medium">
            {dest.name}
          </span>
        </div>
        {tag && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tag.color}`}>
            {tag.tag}
          </span>
        )}
      </button>
    );
  };

  const destinationsContent = (
    <>
      {isLoading ? (
        <div className="px-4 py-8 text-center">
          <Loader2 className="w-6 h-6 text-[#15ab8b] animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Searching destinations...</p>
        </div>
      ) : inputDestinations.length > 0 ? (
        <div className="p-4 space-y-4">
          {/* Domestic Destinations Section */}
          {domesticDestinations.length > 0 && (
            <div>
              <div className="mb-2 px-3 py-2 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                  Domestic Destinations
                </h4>
              </div>
              <div className="space-y-1">{domesticDestinations.map(renderDestinationItem)}</div>
            </div>
          )}

          {/* International Destinations Section */}
          {internationalDestinations.length > 0 && (
            <div
              className={domesticDestinations.length > 0 ? 'pt-2 border-t border-slate-100' : ''}
            >
              <div className="mb-2 px-3 py-2 bg-green-50 rounded-lg">
                <h4 className="text-sm font-bold text-green-600 uppercase tracking-wide">
                  International Destinations
                </h4>
              </div>
              <div className="space-y-1">
                {internationalDestinations.map(renderDestinationItem)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 font-medium">No destinations found</p>
          <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
        </div>
      )}
    </>
  );

  const dropdownContent = isInputFocused && (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 animate-in fade-in duration-200"
          onClick={() => setInputFocused(false)}
        />
      )}

      <div
        ref={popoverRef}
        className={cn(
          'bg-white shadow-2xl border border-slate-200 overflow-hidden',
          isMobile
            ? 'fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh] animate-in slide-in-from-bottom duration-300 z-9999'
            : 'fixed rounded-2xl max-h-[360px] overflow-y-auto scrollbar-hide z-9999'
        )}
        style={
          isMobile
            ? {}
            : {
                top: dropdownPosition.top,
                left: dropdownPosition.left - 70,
                width: Math.min(dropdownPosition.width, 380),
                scrollbarWidth: 'none',
              }
        }
      >
        {/* Header */}
        <div
          className={cn(
            'px-5 py-3 border-b border-slate-100 sticky top-0 bg-white z-10',
            isMobile && 'px-5 py-4 flex items-center justify-between'
          )}
        >
          <h3 className="text-base font-semibold text-gray-900">Where to?</h3>
          {isMobile && (
            <button
              onClick={() => setInputFocused(false)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        {/* Mobile search input */}
        {isMobile && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search destinations..."
                value={inputText}
                onChange={e => handleInputChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-base outline-none focus:border-[#15ab8b] focus:ring-2 focus:ring-[#d1fbd2] transition-all"
              />
            </div>
          </div>
        )}

        {/* Destinations list */}
        <div className={cn(isMobile && 'max-h-[60vh] overflow-y-auto')}>{destinationsContent}</div>
      </div>
    </>
  );

  return (
    <div
      ref={triggerRef}
      className={cn('relative cursor-default h-full flex items-center', className)}
    >
      {isMobile ? (
        // Mobile: Show a display trigger that opens the popup
        <div onClick={handleFocus} className="w-full h-full flex items-center cursor-pointer">
          {inputText ? (
            <span className="text-sm lg:text-base font-medium text-slate-800">{inputText}</span>
          ) : (
            <span className="text-sm lg:text-base text-slate-400">Where do you want to go?</span>
          )}
        </div>
      ) : (
        // Desktop: Show the input field directly
        <input
          ref={inputRef}
          placeholder="Where do you want to go?"
          className="w-full h-full text-sm lg:text-base border-none outline-none bg-transparent placeholder:text-slate-400 text-slate-800 font-medium"
          value={inputText}
          type="text"
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          onChange={e => handleInputChange(e.target.value)}
        />
      )}

      {/* Portal dropdown to body for proper z-index */}
      {mounted && typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default SearchDestination;
