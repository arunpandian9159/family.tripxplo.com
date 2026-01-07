'use client';

import React from 'react';
import { Heart, Users, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ThemeType = 'Honeymoon' | 'Couple' | 'Family' | 'Friends';

interface Theme {
  name: ThemeType;
  icon: React.ElementType;
  defaultAdults: number;
  defaultChildren: number;
}

const themes: Theme[] = [
  { name: 'Honeymoon', icon: Heart, defaultAdults: 2, defaultChildren: 0 },
  { name: 'Couple', icon: Sparkles, defaultAdults: 2, defaultChildren: 0 },
  { name: 'Family', icon: Home, defaultAdults: 2, defaultChildren: 2 },
  { name: 'Friends', icon: Users, defaultAdults: 4, defaultChildren: 0 },
];

interface PackageThemesProps {
  selectedTheme: ThemeType;
  onThemeChange: (theme: ThemeType, defaults: { adults: number; children: number }) => void;
  className?: string;
}

const PackageThemes = ({ selectedTheme, onThemeChange, className }: PackageThemesProps) => {
  const handleThemeClick = (theme: Theme) => {
    onThemeChange(theme.name, {
      adults: theme.defaultAdults,
      children: theme.defaultChildren,
    });
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {themes.map(theme => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.name;

          return (
            <button
              key={theme.name}
              onClick={() => handleThemeClick(theme)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 border font-semibold text-sm',
                isSelected
                  ? 'bg-linear-to-r from-[#15ab8b] to-[#1ec9a5] text-white border-transparent shadow-lg shadow-[#15ab8b]/30 scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#15ab8b]/50 hover:bg-[#e8f8f5] active:scale-95'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-all',
                  isSelected ? 'text-white' : 'text-[#15ab8b]'
                )}
              />
              <span>{theme.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PackageThemes;
