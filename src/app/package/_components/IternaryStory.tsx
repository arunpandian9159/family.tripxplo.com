'use client';
import { Destination } from '@/app/types/package';
import Link from 'next/link';
import { Activity } from '@/app/types/pack';
import { Sunrise, Sun, Sunset, Moon, ChevronRight, MapPin, Calendar, Clock } from 'lucide-react';

export default function IternaryStory({
  destinations,
  activity,
}: {
  destinations?: Destination[];
  activity?: Activity[];
}) {
  const location = typeof window !== 'undefined' ? window.location.pathname : '';

  const activities = activity || [];

  // Time period icons and colors
  const timeConfig: Record<
    string,
    { icon: React.ComponentType<any>; color: string; bg: string; label: string }
  > = {
    morning: { icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Morning' },
    afternoon: { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Afternoon' },
    evening: { icon: Sunset, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Evening' },
    night: { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Night' },
  };

  const getTimeConfig = (timePeriod: string) => {
    const key = timePeriod?.toLowerCase() || 'morning';
    return timeConfig[key] || timeConfig.morning;
  };

  return (
    <div className="space-y-6">
      {/* Itinerary Preview Card */}
      <div className="bg-linear-to-br from-white to-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-linear-to-br from-emerald-500 to-rose-500 rounded-xl text-white shadow-lg shadow-emerald-500/25">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Day-wise Itinerary</h3>
                <p className="text-sm text-slate-500">Your planned activities</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              {activities.length} Day{activities.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Activities Content */}
        <div className="p-6">
          {activities.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                <Calendar size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No activities scheduled yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Activities will appear here once planned
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Show first day preview - sort by day to ensure Day 1 shows first */}
              {[...activities]
                .sort((a, b) => (a.day || 1) - (b.day || 1))
                .slice(0, 2)
                .map(dayActivity => {
                  if (!dayActivity) return null;
                  const events = Array.isArray(dayActivity.event) ? dayActivity.event : [];

                  return (
                    <div key={dayActivity._id || dayActivity.day} className="relative">
                      {/* Day Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/25">
                          {dayActivity.day || 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            Day {dayActivity.day || 1}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {events.length} activities planned
                          </p>
                        </div>
                      </div>

                      {/* Events Timeline */}
                      <div className="ml-5 pl-5 border-l-2 border-dashed border-slate-200 space-y-3">
                        {events.slice(0, 3).map((event, eventIndex) => {
                          if (!event) return null;
                          const config = getTimeConfig(event.timePeriod);
                          const IconComponent = config.icon;

                          return (
                            <div
                              key={event._id || eventIndex}
                              className="relative flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300"
                            >
                              {/* Timeline dot */}
                              <div className="absolute -left-[27px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full" />

                              <div className={`p-2 ${config.bg} rounded-lg shrink-0`}>
                                <IconComponent size={16} className={config.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`text-xs font-semibold ${config.color} uppercase tracking-wider`}
                                >
                                  {config.label}
                                </span>
                                <p className="text-sm font-medium text-slate-800 mt-0.5 line-clamp-1">
                                  {event.name || 'Activity'}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {/* More events indicator */}
                        {events.length > 3 && (
                          <div className="relative flex items-center gap-2 py-2 pl-3">
                            <div className="absolute -left-[27px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-200 rounded-full" />
                            <span className="text-sm text-slate-400">
                              +{events.length - 3} more activities
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* More days indicator */}
              {activities.length > 2 && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-500">
                    +{activities.length - 2} more day{activities.length - 2 !== 1 ? 's' : ''} in
                    your itinerary
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6">
          <Link
            href={`${location}/activities`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
          >
            <MapPin size={18} />
            View Full Itinerary
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
