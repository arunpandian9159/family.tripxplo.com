import React from 'react';
import { Clock, Users, Building2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { PackDestination } from '@/app/types/pack';

interface PropsType {
  plan?: string;
  destinations?: PackDestination[];
  noOfDays?: number;
  noOfNights?: number;
  totalAdult?: number;
  totalChild?: number;
  hotelCount?: number;
  startsFrom?: string;
}

const PackageHighlight = ({
  plan = 'Standard',
  destinations = [],
  noOfDays = 0,
  noOfNights = 0,
  totalAdult = 2,
  totalChild = 0,
  hotelCount = 0,
  startsFrom = 'N/A',
}: PropsType) => {
  const safeDestinations = Array.isArray(destinations) ? destinations : [];

  // Plan badge colors
  const planColors: Record<string, string> = {
    gold: 'from-amber-500 to-orange-500',
    silver: 'from-slate-400 to-slate-500',
    platinum: 'from-rose-500 to-red-500',
    standard: 'from-emerald-500 to-teal-500',
  };

  const planGradient = planColors[plan?.toLowerCase()] || planColors.standard;

  // Stats data
  const stats = [
    {
      icon: Clock,
      label: 'Duration',
      value: `${noOfNights}N / ${noOfDays}D`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      label: 'Travelers',
      value: `${totalAdult} Adult${totalAdult > 1 ? 's' : ''}${
        totalChild > 0 ? `, ${totalChild} Child${totalChild > 1 ? 'ren' : ''}` : ''
      }`,
      color: 'text-violet-500',
      bgColor: 'bg-violet-50',
    },
    {
      icon: Building2,
      label: 'Hotels',
      value: `${hotelCount} ${hotelCount === 1 ? 'Stay' : 'Stays'}`,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Calendar,
      label: 'Starts From',
      value: startsFrom,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Plan Badge */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r ${planGradient} text-white text-sm font-semibold rounded-full shadow-md`}
        >
          <Sparkles size={14} />
          {plan} Plan
        </span>
      </div>

      {/* Destinations Strip */}
      {safeDestinations.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-linear-to-r from-slate-50 to-white rounded-2xl border border-slate-100">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <MapPin size={20} className="text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Destinations
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {safeDestinations
                .filter(dest => dest?.noOfNight > 0)
                .map((dest, i, arr) => (
                  <React.Fragment key={dest?._id || i}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-emerald-500 font-bold text-sm">{dest?.noOfNight}N</span>
                      <span className="text-slate-700 font-medium text-sm">
                        {dest?.destinationName || 'Destination'}
                      </span>
                    </div>
                    {i !== arr.length - 1 && <span className="text-slate-300 text-lg">→</span>}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
          >
            <div
              className={`inline-flex p-2.5 ${stat.bgColor} rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-sm font-semibold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageHighlight;
