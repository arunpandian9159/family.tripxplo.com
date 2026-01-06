'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, AlertCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FamilyType, defaultFamilyType, detectFamilyType } from '@/lib/familyTypes';

interface GuestOptions {
  adults: number;
  children611: number;
  children25: number;
  infants: number;
  rooms: number;
  familyType?: string;
}

interface OptionsBoxProps {
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOptionsChange?: (options: GuestOptions) => void;
}

export default function OptionsBox({
  className,
  isOpen,
  onOpenChange,
  onOptionsChange,
}: OptionsBoxProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external isOpen if provided, otherwise use internal state
  const specFocused = isOpen !== undefined ? isOpen : internalOpen;

  const setSpecFocused = (open: boolean) => {
    setInternalOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const [warningTxt, setWarningTxt] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children611, setChildren611] = useState(0); // Children 6-11 years
  const [children25, setChildren25] = useState(0); // Children 2-5 years
  const [infants, setInfants] = useState(0); // Infants under 2 years
  const [minRooms, setMinRooms] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [detectedFamilyType, setDetectedFamilyType] = useState<FamilyType>(defaultFamilyType);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Detect family type whenever guest counts change
  useEffect(() => {
    const familyType = detectFamilyType(adults, children611, children25, infants);
    setDetectedFamilyType(familyType);
  }, [adults, children611, children25, infants]);

  // Set mounted flag and initialize values on client
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function handleIncrementorDecrementor(i: boolean, value: string) {
    switch (value) {
      case 'adult': {
        if (i) {
          setAdults(adults + 1);
        } else {
          if (adults - 1 > 0) {
            setAdults(adults - 1);
          }
        }
        break;
      }
      case 'children611': {
        if (i) {
          setChildren611(children611 + 1);
        } else {
          if (children611 - 1 >= 0) {
            setChildren611(children611 - 1);
          }
        }
        break;
      }
      case 'children25': {
        if (i) {
          setChildren25(children25 + 1);
        } else {
          if (children25 - 1 >= 0) {
            setChildren25(children25 - 1);
          }
        }
        break;
      }
      case 'infant': {
        if (i) {
          setInfants(infants + 1);
        } else {
          if (infants - 1 >= 0) {
            setInfants(infants - 1);
          }
        }
        break;
      }
      case 'room': {
        if (i) {
          if (rooms < adults) {
            setRooms(rooms + 1);
          }
        } else {
          if (!(rooms - 1 < minRooms)) {
            setRooms(rooms - 1);
          }
        }
        break;
      }
    }
  }

  function handleApply() {
    if (adults >= rooms) {
      setSpecFocused(false);
      setWarningTxt('');

      if (onOptionsChange) {
        onOptionsChange({
          adults,
          children611,
          children25,
          infants,
          rooms,
          familyType: detectedFamilyType?.name,
        });
      }
    } else {
      setWarningTxt('Invalid number of rooms');
    }
  }

  // Room calculation logic - updated to include all child categories
  useEffect(() => {
    const totalChildren = children611 + children25 + infants;
    let r = 0;
    if (totalChildren === 0) {
      r = Math.ceil(adults / 3);
    } else {
      let x = adults;
      let y = totalChildren;
      r = 0;
      while (x >= 3 && y >= 1) {
        x = x - 3;
        y = y - 1;
        r++;
      }
      while (x > 0 || y > 0) {
        x = x - 3;
        y = y - 3;
        r++;
      }
    }
    setRooms(r);
    setMinRooms(r);
  }, [children611, children25, infants, adults]);

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current && !isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.right - 360, 16), // Increased width for more content
      });
    }
  }, [isMobile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setSpecFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update position on scroll/resize
  useEffect(() => {
    if (specFocused && !isMobile) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [specFocused, isMobile, updateDropdownPosition]);

  const handleToggle = useCallback(() => {
    if (!specFocused) {
      updateDropdownPosition();
    }
    setSpecFocused(!specFocused);
  }, [specFocused, updateDropdownPosition]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && specFocused) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, specFocused]);

  const CounterButton = ({
    onClick,
    disabled,
    children: buttonChildren,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-10 h-10 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all',
        disabled
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
          : 'bg-[#e8f8f5] text-[#15ab8b] hover:bg-[#d1fbd2] active:scale-95'
      )}
    >
      {buttonChildren}
    </button>
  );

  const totalGuests = adults + children611 + children25 + infants;

  const GuestDisplay = () => {
    // Show placeholder during SSR and initial render to avoid hydration mismatch
    if (!mounted) {
      return <span className="text-sm lg:text-base text-slate-400">Select guests</span>;
    }

    return rooms > 0 ? (
      <div className="flex flex-col">
        <span className="text-sm lg:text-base font-medium text-slate-800">
          {rooms} {rooms === 1 ? 'Room' : 'Rooms'}, {totalGuests}{' '}
          {totalGuests === 1 ? 'Guest' : 'Guests'}
        </span>
        {detectedFamilyType && (
          <span className="text-xs text-[#15ab8b] font-medium flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" />
            {detectedFamilyType.name}
          </span>
        )}
      </div>
    ) : (
      <span className="text-sm lg:text-base text-slate-400">Select guests</span>
    );
  };

  const dropdownContent = specFocused && (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 animate-in fade-in duration-200"
          onClick={() => setSpecFocused(false)}
        />
      )}

      <div
        ref={popoverRef}
        className={cn(
          'bg-white shadow-2xl border border-slate-200 overflow-hidden',
          isMobile
            ? 'fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 z-9999'
            : 'fixed w-[360px] rounded-2xl z-9999'
        )}
        style={
          isMobile
            ? {}
            : {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }
        }
      >
        {/* Header */}
        <div
          className={cn(
            'px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10',
            isMobile && 'px-6 py-5'
          )}
        >
          <div>
            <h3 className="font-semibold text-slate-800">Guests & Rooms</h3>
            <p className="text-xs text-slate-500">Max 4 guests per room</p>
          </div>
          {isMobile && (
            <button
              onClick={() => setSpecFocused(false)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        <div className={cn('p-5 space-y-4', isMobile && 'p-6 pb-8 space-y-5')}>
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Adults</p>
              <p className="text-xs text-slate-400">12+ years</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, 'adult')}
                disabled={adults <= 1}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">{adults}</span>
              <CounterButton
                onClick={() => handleIncrementorDecrementor(true, 'adult')}
                disabled={false}
              >
                <Plus className="w-4 h-4" />
              </CounterButton>
            </div>
          </div>

          {/* Children 6-11 */}
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Children</p>
              <p className="text-xs text-slate-400">6-11 years</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, 'children611')}
                disabled={children611 <= 0}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">
                {children611}
              </span>
              <CounterButton
                onClick={() => handleIncrementorDecrementor(true, 'children611')}
                disabled={false}
              >
                <Plus className="w-4 h-4" />
              </CounterButton>
            </div>
          </div>

          {/* Child below 5 (2-5 years) */}
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Child below 5</p>
              <p className="text-xs text-slate-400">2-5 years</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, 'children25')}
                disabled={children25 <= 0}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">
                {children25}
              </span>
              <CounterButton
                onClick={() => handleIncrementorDecrementor(true, 'children25')}
                disabled={false}
              >
                <Plus className="w-4 h-4" />
              </CounterButton>
            </div>
          </div>

          {/* Infants */}
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Infants</p>
              <p className="text-xs text-slate-400">Under 2 years</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, 'infant')}
                disabled={infants <= 0}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">
                {infants}
              </span>
              <CounterButton
                onClick={() => handleIncrementorDecrementor(true, 'infant')}
                disabled={false}
              >
                <Plus className="w-4 h-4" />
              </CounterButton>
            </div>
          </div>

          {/* Rooms */}
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => handleIncrementorDecrementor(false, 'room')}
                disabled={rooms <= minRooms}
              >
                <Minus className="w-4 h-4" />
              </CounterButton>
              <span className="w-8 text-center font-semibold text-slate-800 text-lg">{rooms}</span>
              <CounterButton
                onClick={() => handleIncrementorDecrementor(true, 'room')}
                disabled={rooms >= adults}
              >
                <Plus className="w-4 h-4" />
              </CounterButton>
            </div>
          </div>

          {/* Detected Family Type Badge */}
          {detectedFamilyType && (
            <>
              <div className="h-px bg-slate-100" />
              <div className="bg-linear-to-r from-[#e8f8f5] to-[#d1fbd2] rounded-xl p-4 border border-[#15ab8b]/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#15ab8b]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#15ab8b]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0f8a6f] uppercase tracking-wider mb-1">
                      Family Type Detected
                    </p>
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {detectedFamilyType.name}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Warning */}
          {warningTxt && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              {warningTxt}
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={() => handleApply()}
            className="w-full py-3 bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white font-semibold rounded-xl shadow-lg shadow-[#15ab8b]/30 hover:shadow-xl hover:shadow-[#15ab8b]/40 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className={cn('h-full relative', className)}>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="w-full h-full flex items-center cursor-pointer"
      >
        <GuestDisplay />
      </div>

      {/* Portal dropdown to body for proper z-index */}
      {mounted && typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
