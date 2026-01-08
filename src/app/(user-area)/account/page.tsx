'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  HelpCircle,
  LogOut,
  Ticket,
  User,
  Shield,
  ChevronRight,
  Settings,
  Heart,
  Gift,
  MapPin,
  Sparkles,
  Mail,
  Phone,
  Plane,
  Camera,
  Star,
  Clock,
  TrendingUp,
  CreditCard,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/hooks/useAuth';
import { ClearToken } from '@/app/utils/constants/accessToken';
import { useDispatch } from 'react-redux';
import { removePackageId } from '@/app/store/features/packageDetailsSlice';
import TermsAndConditions from './components/terms-conditions';
import Help from './components/help';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton, SkeletonProfile } from '@/components/ui/skeleton';

const Account = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const dispatch = useDispatch();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) router.push('/');
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    ClearToken();
    localStorage.clear();
    sessionStorage.clear();
    dispatch(removePackageId());
    toast.success('Logged out successfully');
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white pb-24 lg:pb-8">
        <div className="bg-linear-to-br from-coral-500 via-coral-500 to-coral-600 pt-8 pb-32">
          <Container>
            <Skeleton className="h-8 w-48 bg-white/20 mb-2" />
            <Skeleton className="h-5 w-64 bg-white/10" />
          </Container>
        </div>
        <Container className="-mt-24">
          <Card className="p-8 mb-6">
            <SkeletonProfile />
          </Card>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  const firstName = ((user as any)?.fullName || (user as any)?.name || 'Traveler').split(' ')[0];

  const menuItems = [
    {
      title: 'Personal Information',
      description: 'Manage your profile details',
      icon: User,
      href: `/account/${(user as any)?.userId || (user as any)?.id}`,
      lightColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'My Bookings',
      description: 'View your travel history',
      icon: Ticket,
      href: '/mybookings',
      lightColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Wishlists',
      description: 'Saved destinations & packages',
      icon: Heart,
      href: '/wishlists',
      lightColor: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Rewards',
      description: 'Earn points on every trip',
      icon: Gift,
      href: '/rewards',
      lightColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      badge: 'New',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white pb-24 lg:pb-8">
      {/* Hero Section with Pattern */}
      <div className="relative bg-linear-to-br from-coral-500 via-coral-500 to-coral-600 pt-8 pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Plane
            className="absolute top-16 right-16 w-8 h-8 text-white/20 animate-float"
            style={{ animationDelay: '0s' }}
          />
          <MapPin
            className="absolute top-24 left-1/4 w-6 h-6 text-white/15 animate-float"
            style={{ animationDelay: '0.5s' }}
          />
          <Star
            className="absolute bottom-20 right-1/3 w-5 h-5 text-white/20 animate-float"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <Container className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-coral-200" />
            <span className="text-coral-100 text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {firstName} ✨
          </h1>
          <p className="text-coral-100 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ready for your next adventure?
          </p>
        </Container>
      </div>

      <Container className="-mt-24 relative z-20">
        {/* Profile Card */}
        <Card className="p-0 mb-6 animate-slide-up overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar with ring */}
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-br from-coral-400 to-coral-600 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-coral-400 to-coral-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {(user as any)?.profileImg || (user as any)?.profileImage ? (
                      <Image
                        src={(user as any)?.profileImg || (user as any)?.profileImage || ''}
                        fill
                        alt="Profile"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
                        <User className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                {/* Edit overlay */}
                <Link
                  href={`/account/${(user as any)?.userId || (user as any)?.id}`}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-white" />
                </Link>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                    {(user as any)?.fullName || (user as any)?.name || 'Welcome!'}
                  </h2>
                  <Badge variant="emerald" size="sm" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
                  {((user as any)?.mobileNo || (user as any)?.phone) && (
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {(user as any)?.mobileNo || (user as any)?.phone}
                    </span>
                  )}
                  {user?.email && (
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-300" />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button - Desktop */}
              <div className="hidden sm:block">
                <Link href={`/account/${(user as any)?.userId || (user as any)?.id}`}>
                  <Button variant="outline" size="sm" className="group">
                    <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Edit Button - Mobile */}
            <div className="sm:hidden mt-4">
              <Link
                href={`/account/${(user as any)?.userId || (user as any)?.id}`}
                className="block"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Explore CTA Banner */}
        <Link href="/destinations">
          <Card
            hoverable
            padding="none"
            className="mb-6 overflow-hidden bg-linear-to-r from-coral-500 to-rose-500 border-0 animate-slide-up"
            style={{ animationDelay: '0.1s' } as React.CSSProperties}
          >
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Explore Packages</h3>
                <p className="text-sm text-white/80">Discover amazing destinations</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </Card>
        </Link>

        {/* Menu Section Header */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Account Settings
          </h3>
        </div>

        {/* Menu List */}
        <div className="space-y-3 mb-8">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card
                hoverable
                padding="none"
                className="animate-slide-up group"
                style={{ animationDelay: `${(index + 2) * 0.1}s` } as React.CSSProperties}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
                      item.lightColor
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', item.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                      {item.badge && (
                        <Badge variant="emerald" size="sm" className="text-[10px] px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Support Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-1">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Support & Legal
            </h3>
          </div>
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <TermsAndConditions />
            </div>
            <div className="p-4 hover:bg-slate-50 transition-colors">
              <Help />
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Card
          onClick={handleLogout}
          hoverable
          padding="none"
          className="border-red-100 hover:border-red-200 cursor-pointer group mb-8"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-600">Logout</h3>
              <p className="text-sm text-slate-500">Sign out of your account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Card>

        {/* App Version Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">TripXplo v1.0.0</p>
          <p className="text-xs text-slate-300 mt-1">Made with ❤️ for travelers</p>
        </div>
      </Container>
    </div>
  );
};

export default Account;
