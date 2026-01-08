'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/hooks/useAuth';
import { useSearch } from '@/context/SearchContext';
import { LogIn, UserCircleIcon, Home, Package, Heart, HandCoins, MapPin } from 'lucide-react';
import AuthModal from '@/app/(user-area)/components/home/AuthModal';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Packages', href: '/packages', icon: Package },
  { label: 'Wishlists', href: '/wishlists', icon: Heart },
  { label: 'Rewards', href: '/rewards', icon: HandCoins },
];

const GlobalHeader = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { resetSearchParams } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'register'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLoginClick = () => {
    setAuthModalView('signin');
    setIsAuthModalOpen(true);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Check if we're on a package detail page (hide mobile nav to show price bar)
  const isPackageDetailPage = pathname.startsWith('/package/') && pathname !== '/packages';

  // Find active nav index for mobile indicator
  const activeNavIndex = navItems.findIndex(item => isActive(item.href));
  const isAccountActive = pathname.startsWith('/account');
  // 6 items total (5 nav + account/login), each takes ~16.67% width
  const activeIndex = isAccountActive ? 5 : activeNavIndex;
  const indicatorPosition = activeIndex >= 0 ? activeIndex * 16.67 + 8.33 : 8.33;

  if (!isMounted) {
    return (
      <>
        {/* Desktop placeholder */}
        <div className="hidden lg:block h-16" />
        {/* Mobile placeholder */}
        <div className="lg:hidden h-16" />
      </>
    );
  }

  return (
    <>
      {/* ===== DESKTOP HEADER ===== */}
      <header
        className={cn(
          'hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-100'
            : 'bg-white border-b border-slate-200'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Family Tripxplo Logo"
                width={140}
                height={45}
                priority
                className="w-auto h-9 object-contain"
              />
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              <div className="flex items-center gap-1 mr-4">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const isPackages = item.href === '/packages';

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        if (isPackages) {
                          resetSearchParams();
                        }
                      }}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        active
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <Icon
                        className={cn('w-4 h-4', active ? 'text-emerald-500' : 'text-slate-400')}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      <span>{item.label}</span>
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-slate-200 mx-2" />

              {/* Login / Account */}
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      pathname.startsWith('/account')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span className="hidden xl:inline">Account</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      'bg-linear-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-100'
                    )}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Desktop Spacer */}
      <div className="hidden lg:block h-16" />

      {/* ===== MOBILE HEADER ===== */}
      <header
        className={cn(
          'lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100'
            : 'bg-white border-b border-slate-100'
        )}
      >
        <div className="px-4 h-16 flex justify-center items-center relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Family Tripxplo Logo"
              width={120}
              height={40}
              priority
              className="w-auto h-8 object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16" />

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      {/* Hide on package detail pages to show price/booking bar */}
      {!isPackageDetailPage && (
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Animated indicator line */}
          <div
            className="absolute top-0 h-0.5 w-12 bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
            style={{
              left: `${indicatorPosition}%`,
              transform: 'translateX(-50%)',
            }}
          />

          <div className="px-2 py-1.5">
            <div className="flex items-center justify-around">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const isPackages = item.href === '/packages';

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (isPackages) {
                        resetSearchParams();
                      }
                    }}
                    className={cn(
                      'flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl transition-all duration-200 touch-manipulation min-w-[56px]',
                      'active:scale-95 active:bg-slate-50',
                      active && 'bg-emerald-50/50'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-xl transition-all duration-200',
                        active
                          ? 'bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30'
                          : 'bg-transparent'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5 transition-all duration-200',
                          active
                            ? 'text-white scale-105'
                            : 'text-slate-400 group-hover:text-slate-500'
                        )}
                        strokeWidth={active ? 2.5 : 1.8}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-semibold transition-colors leading-tight',
                        active ? 'text-emerald-600' : 'text-slate-400'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {/* Account / Login Item */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl transition-all duration-200 touch-manipulation min-w-[56px]',
                    'active:scale-95 active:bg-slate-50',
                    pathname.startsWith('/account') && 'bg-emerald-50/50'
                  )}
                  aria-current={pathname.startsWith('/account') ? 'page' : undefined}
                >
                  <div
                    className={cn(
                      'p-2 rounded-xl transition-all duration-200',
                      pathname.startsWith('/account')
                        ? 'bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30'
                        : 'bg-transparent'
                    )}
                  >
                    <UserCircleIcon
                      className={cn(
                        'w-5 h-5 transition-all duration-200',
                        pathname.startsWith('/account')
                          ? 'text-white scale-105'
                          : 'text-slate-400 group-hover:text-slate-500'
                      )}
                      strokeWidth={pathname.startsWith('/account') ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold transition-colors leading-tight',
                      pathname.startsWith('/account') ? 'text-emerald-600' : 'text-slate-400'
                    )}
                  >
                    Account
                  </span>
                </Link>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl transition-all duration-200 touch-manipulation min-w-[56px] active:scale-95 active:bg-slate-50"
                >
                  <div className="p-2 rounded-xl bg-transparent transition-all duration-200">
                    <LogIn className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                    Login
                  </span>
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </>
  );
};

export default GlobalHeader;
