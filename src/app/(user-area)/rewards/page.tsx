"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Gift,
  Star,
  Sparkles,
  Clock,
  Bell,
  ArrowRight,
  Trophy,
  Zap,
  Crown,
  Gem,
  Plane,
  Users,
  Check,
  ChevronRight,
  Wallet,
  Ticket,
  MessageSquare,
  Award,
  History,
  Share2,
  Heart,
  MapPin,
  ArrowUpRight,
  Flame,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reward tier definitions
const rewardTiers = [
  {
    name: "Explorer",
    subtitle: "Silver",
    icon: Star,
    points: "0 - 500",
    minPoints: 0,
    maxPoints: 500,
    color: "from-slate-400 to-slate-300",
    bgColor: "bg-slate-400",
    lightBg: "bg-slate-50",
    textColor: "text-slate-500",
    borderColor: "border-slate-200",
    ringColor: "ring-slate-400",
    benefits: [
      "5% off on first booking",
      "Priority email support",
      "Early access to deals",
    ],
  },
  {
    name: "Adventurer",
    subtitle: "Gold",
    icon: Trophy,
    points: "501 - 2,000",
    minPoints: 501,
    maxPoints: 2000,
    color: "from-amber-500 to-yellow-400",
    bgColor: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    ringColor: "ring-amber-500",
    benefits: [
      "10% off on all bookings",
      "Free activity upgrade",
      "24/7 priority support",
      "Exclusive member rates",
    ],
  },
  {
    name: "Voyager",
    subtitle: "Diamond",
    icon: Crown,
    points: "2,001 - 5,000",
    minPoints: 2001,
    maxPoints: 5000,
    color: "from-cyan-400 to-blue-400",
    bgColor: "bg-linear-to-r from-cyan-400 to-blue-400",
    lightBg: "bg-cyan-50",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    ringColor: "ring-cyan-400",
    benefits: [
      "15% off on all bookings",
      "Complimentary hotel upgrade",
      "Exclusive members-only deals",
      "Birthday bonus points",
    ],
  },
  {
    name: "Elite",
    subtitle: "Platinum",
    icon: Gem,
    points: "5,000+",
    minPoints: 5001,
    maxPoints: 999999,
    color: "from-coral-500 to-coral-400",
    bgColor: "bg-coral-500",
    lightBg: "bg-coral-50",
    textColor: "text-coral-600",
    borderColor: "border-coral-200",
    ringColor: "ring-coral-500",
    benefits: ["20% off on all bookings", "VIP concierge service", "Complimentary premium add-ons", "Airport lounge access", "Surprise upgrades"],
  }
];

// Ways to earn points
const earnWays = [
  {
    icon: Plane,
    title: "Book Trips",
    points: "1 point per ₹100",
    description: "Earn points on every package you book",
    iconBg: "bg-coral-50 text-coral-600",
  },
  {
    icon: Users,
    title: "Refer Friends",
    points: "500 bonus points",
    description: "When your friend completes their first booking",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Leave Reviews",
    points: "50 points each",
    description: "Share your experience after every trip",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: Gift,
    title: "Special Events",
    points: "2x - 5x points",
    description: "Bonus multipliers during flash sales",
    iconBg: "bg-amber-50 text-amber-600",
  },
];

// Coming soon features
const comingSoonFeatures = [
  {
    icon: Wallet,
    title: "TripXplo Wallet",
    description: "Store and use your points like cash",
    status: "In Development",
  },
  {
    icon: Ticket,
    title: "Point Transfer",
    description: "Gift points to friends and family",
    status: "Coming Q2",
  },
  {
    icon: Zap,
    title: "Flash Rewards",
    description: "Limited-time point boosters",
    status: "Coming Q2",
  },
];

// Mock user rewards data (will be replaced with API data)
const mockUserRewards = {
  points: 1250,
  lifetimePoints: 2350,
  reviewsCount: 8,
  referralsCount: 3,
  bookingsCount: 5,
  memberSince: "2024-06-15",
  streakDays: 12,
  recentActivity: [
    {
      id: 1,
      type: "booking",
      title: "Booked Goa Beach Package",
      points: 450,
      date: "2024-12-08",
      icon: Plane,
    },
    {
      id: 2,
      type: "review",
      title: "Reviewed Kerala Backwaters",
      points: 50,
      date: "2024-12-05",
      icon: MessageSquare,
    },
    {
      id: 3,
      type: "referral",
      title: "Friend joined via referral",
      points: 500,
      date: "2024-11-28",
      icon: Users,
    },
    {
      id: 4,
      type: "bonus",
      title: "Weekly login bonus",
      points: 25,
      date: "2024-11-25",
      icon: Gift,
    },
    {
      id: 5,
      type: "booking",
      title: "Booked Rajasthan Heritage",
      points: 225,
      date: "2024-11-20",
      icon: Plane,
    },
  ],
  achievements: [
    {
      id: 1,
      title: "First Booking",
      description: "Completed your first trip",
      icon: Award,
      earned: true,
    },
    {
      id: 2,
      title: "Explorer",
      description: "Visited 3 destinations",
      icon: MapPin,
      earned: true,
    },
    {
      id: 3,
      title: "Reviewer",
      description: "Left 5 reviews",
      icon: MessageSquare,
      earned: true,
    },
    {
      id: 4,
      title: "Social Butterfly",
      description: "Referred 3 friends",
      icon: Share2,
      earned: true,
    },
    {
      id: 5,
      title: "Loyal Traveler",
      description: "10 bookings milestone",
      icon: Heart,
      earned: false,
    },
    {
      id: 6,
      title: "Elite Status",
      description: "Reach Elite tier",
      icon: Gem,
      earned: false,
    },
  ],
};

// Helper function to get user's current tier
function getUserTier(points: number) {
  for (let i = rewardTiers.length - 1; i >= 0; i--) {
    if (points >= rewardTiers[i].minPoints) {
      return { tier: rewardTiers[i], index: i };
    }
  }
  return { tier: rewardTiers[0], index: 0 };
}

// Helper to calculate progress to next tier
function getProgressToNextTier(points: number, currentTierIndex: number) {
  if (currentTierIndex >= rewardTiers.length - 1) {
    return { progress: 100, pointsNeeded: 0, nextTier: null };
  }

  const currentTier = rewardTiers[currentTierIndex];
  const nextTier = rewardTiers[currentTierIndex + 1];
  const pointsInCurrentTier = points - currentTier.minPoints;
  const pointsForNextTier = nextTier.minPoints - currentTier.minPoints;
  const progress = Math.min(
    (pointsInCurrentTier / pointsForNextTier) * 100,
    100
  );
  const pointsNeeded = nextTier.minPoints - points;

  return { progress, pointsNeeded, nextTier };
}

// Format date helper
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

// Loading skeleton for dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

// User Dashboard Component
function UserRewardsDashboard({ user }: { user: any }) {
  const userRewards = mockUserRewards;
  const { tier: currentTier, index: tierIndex } = getUserTier(
    userRewards.points
  );
  const { progress, pointsNeeded, nextTier } = getProgressToNextTier(
    userRewards.points,
    tierIndex
  );
  const TierIcon = currentTier.icon;
  const firstName = (user?.fullName || user?.name || "Traveler").split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Current Status Card */}
      <Card className="p-0 overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-0">
        <div className="relative p-6 lg:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* User welcome & tier */}
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center relative",
                    "bg-linear-to-br",
                    currentTier.color
                  )}
                >
                  <TierIcon className="w-10 h-10 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Welcome back, {firstName}!
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                    {currentTier.name}
                    <Badge
                      variant="glass"
                      size="sm"
                      className="bg-white/10 text-white border-white/20"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {currentTier.subtitle}
                    </Badge>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Member since{" "}
                    {new Date(userRewards.memberSince).toLocaleDateString(
                      "en-IN",
                      { month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              {/* Points display */}
              <div className="flex flex-col items-center lg:items-end">
                <p className="text-slate-400 text-sm mb-1">Available Points</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-coral-400 to-amber-400 bg-clip-text text-transparent">
                    {userRewards.points.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm">pts</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Lifetime: {userRewards.lifetimePoints.toLocaleString()} points
                </p>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    Progress to {nextTier.name}
                  </span>
                  <span className="text-sm font-medium text-coral-400">
                    {pointsNeeded.toLocaleString()} pts to go
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full bg-linear-to-r transition-all duration-1000",
                      nextTier.color
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    {currentTier.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {nextTier.name}
                  </span>
                </div>
              </div>
            )}

            {/* Quick earn CTA */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/destinations">
                <Button variant="primary" size="sm" className="group">
                  <Plane className="w-4 h-4 mr-2" />
                  Book & Earn
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Refer Friends
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plane className="w-5 h-5 text-coral-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {userRewards.bookingsCount}
          </p>
          <p className="text-sm text-slate-500">Total Bookings</p>
        </Card>

        <Card hoverable className="p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {userRewards.reviewsCount}
          </p>
          <p className="text-sm text-slate-500">Reviews Given</p>
        </Card>

        <Card hoverable className="p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {userRewards.referralsCount}
          </p>
          <p className="text-sm text-slate-500">Friends Referred</p>
        </Card>

        <Card hoverable className="p-5 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {userRewards.streakDays}
          </p>
          <p className="text-sm text-slate-500">Day Streak</p>
        </Card>
      </div>

      {/* Activity & Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">
                  Recent Activity
                </h3>
              </div>
              <Badge variant="default" size="sm">
                Last 30 days
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {userRewards.recentActivity.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      activity.type === "booking" &&
                        "bg-coral-50 text-coral-600",
                      activity.type === "review" && "bg-blue-50 text-blue-600",
                      activity.type === "referral" &&
                        "bg-emerald-50 text-emerald-600",
                      activity.type === "bonus" && "bg-amber-50 text-amber-600"
                    )}
                  >
                    <ActivityIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    +{activity.points}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <Button variant="ghost" size="sm" className="w-full text-slate-600">
              View All Activity
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Achievements */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Achievements</h3>
              </div>
              <Badge variant="coral" size="sm">
                {userRewards.achievements.filter((a) => a.earned).length}/
                {userRewards.achievements.length}
              </Badge>
            </div>
          </div>
          <div className="p-4 grid grid-cols-3 gap-3">
            {userRewards.achievements.map((achievement) => {
              const AchievementIcon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex flex-col items-center text-center p-3 rounded-xl transition-all",
                    achievement.earned
                      ? "bg-linear-to-br from-amber-50 to-amber-100 border border-amber-200"
                      : "bg-slate-50 opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                      achievement.earned
                        ? "bg-amber-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    <AchievementIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-900 line-clamp-1">
                    {achievement.title}
                  </p>
                  {achievement.earned && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Current Tier Benefits */}
      <Card className="p-6 bg-linear-to-br from-slate-50 to-white border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br",
              currentTier.color
            )}
          >
            <TierIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              Your {currentTier.name} Benefits
            </h3>
            <p className="text-sm text-slate-500">
              Exclusive perks for your tier
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentTier.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-700">{benefit}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Main Rewards Page Component
const Rewards = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isNotified, setIsNotified] = useState(false);

  // Get user tier for highlighting in tier cards
  const userTier = useMemo(() => {
    if (!isAuthenticated) return null;
    return getUserTier(mockUserRewards.points);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -right-32 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl" />
        <div className="absolute top-96 -left-20 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-coral-500 to-coral-600 pt-8 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <Badge
                variant="glass"
                className="mb-4 bg-white/20 border-white/30 text-white"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {isAuthenticated ? "Your Rewards" : "Coming Soon"}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                TripXplo Rewards
              </h1>
              <p className="text-coral-100 text-lg max-w-md mb-6">
                {isAuthenticated
                  ? "Track your points, unlock exclusive benefits, and get rewarded for every adventure."
                  : "Earn points on every trip and unlock exclusive benefits, discounts, and VIP perks."}
              </p>

              {/* Stats Preview */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {[
                  { value: "4", label: "Reward Tiers" },
                  { value: "20%", label: "Max Discount" },
                  { value: "∞", label: "Points to Earn" },
                ].map((stat, i) => (
                  <div key={i} className="text-center md:text-left">
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-coral-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-48 h-48 md:w-64 md:h-64 animate-float">
              <Image
                src="/reward.png"
                alt="Rewards"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-20 relative z-10">
        {/* User Dashboard (when logged in) */}
        {isLoading ? (
          <div className="mb-12">
            <DashboardSkeleton />
          </div>
        ) : (
          isAuthenticated && (
            <div className="mb-12 animate-slide-up">
              <UserRewardsDashboard user={user} />
            </div>
          )
        )}

        {/* Notify Card (only for non-authenticated users) */}
        {!isAuthenticated && (
          <Card className="p-6 lg:p-8 mb-8 bg-linear-to-r from-slate-900 to-slate-800 border-0 animate-slide-up">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Bell className="w-8 h-8 text-coral-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-white mb-1">
                  Be the first to know!
                </h2>
                <p className="text-slate-400">
                  Get notified when our rewards program launches and receive
                  early-bird bonus points.
                </p>
              </div>
              <Button
                onClick={() => setIsNotified(!isNotified)}
                variant={isNotified ? "outline" : "primary"}
                size="lg"
                className={cn(
                  "w-full md:w-auto",
                  isNotified &&
                    "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                )}
              >
                {isNotified ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    You&apos;ll be notified!
                  </>
                ) : (
                  <>
                    Notify Me
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Reward Tiers */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Reward Tiers</h2>
          </div>
          <p className="text-slate-500 mb-6 ml-12">
            Travel more, earn more, unlock bigger rewards
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewardTiers.map((tier, index) => {
              const isCurrentTier =
                isAuthenticated && userTier?.index === index;
              return (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    padding="none"
                    hoverable
                    className={cn(
                      "overflow-hidden h-full relative",
                      tier.borderColor,
                      isCurrentTier && "ring-2 ring-offset-2",
                      isCurrentTier && tier.ringColor
                    )}
                  >
                    {isCurrentTier && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="emerald"
                          size="sm"
                          className="shadow-lg"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      </div>
                    )}
                    <div
                      className={cn(
                        "bg-linear-to-br p-6 text-white",
                        tier.color
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <tier.icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{tier.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                          {tier.subtitle}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm">
                        {tier.points} points
                      </p>
                    </div>
                    <div className="p-4 bg-white">
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              How to Earn Points
            </h2>
          </div>
          <p className="text-slate-500 mb-6 ml-12">
            Multiple ways to stack up your rewards
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnWays.map((way, index) => (
              <Card
                key={index}
                hoverable
                className="animate-slide-up group"
                style={
                  { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    way.iconBg
                  )}
                >
                  <way.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {way.title}
                </h3>
                <p className="text-coral-500 font-bold text-sm mb-2">
                  {way.points}
                </p>
                <p className="text-slate-500 text-sm">{way.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <Card className="p-8 bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <Clock className="w-4 h-4" />
                {isAuthenticated ? "How It Works" : "Launching Q1 2025"}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {isAuthenticated ? "Earn, Unlock & Redeem" : "How It Will Work"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  {
                    step: "1",
                    title: "Book & Travel",
                    desc: "Earn 1 point per ₹100 spent",
                    icon: Plane,
                  },
                  {
                    step: "2",
                    title: "Level Up",
                    desc: "Unlock tiers with more points",
                    icon: Trophy,
                  },
                  {
                    step: "3",
                    title: "Redeem",
                    desc: "Use points for discounts & perks",
                    icon: Gift,
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-600">
                          {item.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-coral-50 rounded-xl">
              <Sparkles className="w-5 h-5 text-coral-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              What&apos;s Coming
            </h2>
          </div>
          <p className="text-slate-500 mb-6 ml-12">
            Exciting features we&apos;re building for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comingSoonFeatures.map((feature, index) => (
              <Card
                key={index}
                hoverable
                className="animate-slide-up group"
                style={
                  { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <Badge variant="default" size="sm">
                    {feature.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="p-8 bg-linear-to-r from-coral-500 to-coral-400 border-0 text-center mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              {isAuthenticated ? "Quick Actions" : "Early Bird Bonus"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {isAuthenticated
                ? "Start Earning More Points"
                : "Get 100 Bonus Points"}
            </h2>
            <p className="text-coral-100 mb-6">
              {isAuthenticated
                ? "Book your next adventure, leave reviews, or refer friends to earn bonus points!"
                : "Be among the first to join TripXplo Rewards and receive 100 bonus points to kickstart your journey."}
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/destinations">
                  <Button
                    size="lg"
                    className="bg-white text-coral-600 hover:bg-white/90 w-full sm:w-auto"
                  >
                    <Plane className="w-5 h-5 mr-2" />
                    Explore Packages
                  </Button>
                </Link>
                <Button
                  size="lg"
                  className="bg-white/20 border-2 border-white text-white hover:bg-white/30 w-full sm:w-auto"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Refer a Friend
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsNotified(!isNotified)}
                size="lg"
                className={cn(
                  "px-8",
                  isNotified
                    ? "bg-white/20 border-2 border-white text-white hover:bg-white/30"
                    : "bg-white text-coral-600 hover:bg-white/90 shadow-lg"
                )}
              >
                {isNotified ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    We&apos;ll notify you!
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    Notify Me When It Launches
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Rewards;
