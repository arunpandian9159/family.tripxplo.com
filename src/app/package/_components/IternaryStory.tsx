'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Camera, Utensils, Car } from 'lucide-react';
import type { Activity } from '@/lib/types';

interface IternaryStoryProps {
  destinations?: Array<{ destinationId: string; destinationName: string; noOfNight: number }>;
  activity?: Activity[];
}

// Activity type icons
const activityIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="w-4 h-4" />,
  meal: <Utensils className="w-4 h-4" />,
  transfer: <Car className="w-4 h-4" />,
  default: <MapPin className="w-4 h-4" />,
};

export default function IternaryStory({ activity }: IternaryStoryProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([0]); // First day expanded by default

  const toggleDay = (index: number) => {
    setExpandedDays(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500">Itinerary details will be updated soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activity.map((day, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300"
        >
          {/* Day Header */}
          <button
            onClick={() => toggleDay(idx)}
            className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Day Number Circle */}
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#15ab8b] to-[#1ec9a5] text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20">
                {day.day}
              </div>

              <div className="text-left">
                <p className="text-lg font-bold text-slate-900">Day {day.day}</p>
                {day.fullStartDate && (
                  <p className="text-sm text-slate-500">
                    {new Date(day.fullStartDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Activity count badge */}
              {day.event && day.event.length > 0 && (
                <span className="px-3 py-1 bg-emerald-50 text-[#15ab8b] text-sm font-medium rounded-full">
                  {day.event.length} {day.event.length === 1 ? 'Activity' : 'Activities'}
                </span>
              )}

              {/* Expand/Collapse Icon */}
              {expandedDays.includes(idx) ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </button>

          {/* Day Activities (Expandable) */}
          {expandedDays.includes(idx) && day.event && day.event.length > 0 && (
            <div className="px-4 md:px-5 pb-5 space-y-3">
              {day.event.map((evt, evtIdx) => (
                <div
                  key={evtIdx}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  {/* Activity Icon */}
                  <div className="w-10 h-10 rounded-lg bg-[#15ab8b]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#15ab8b]">
                      {activityIcons[evt.activityType?.toLowerCase() || 'default'] ||
                        activityIcons.default}
                    </span>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {evt.activityName || `Activity ${evtIdx + 1}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {evt.timePeriod && (
                        <span className="text-xs text-slate-500 capitalize bg-white px-2 py-1 rounded">
                          {evt.timePeriod.replace('-', ' ')}
                        </span>
                      )}
                      {evt.activityType && (
                        <span className="text-xs text-[#15ab8b] font-medium capitalize bg-emerald-50 px-2 py-1 rounded">
                          {evt.activityType}
                        </span>
                      )}
                    </div>

                    {evt.description && (
                      <p className="text-sm text-slate-600 mt-2">{evt.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
