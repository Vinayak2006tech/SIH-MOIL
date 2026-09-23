import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'switch' | 'compact' | 'sidebar';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  showLabel = false
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Sliding Mini Switch with Sun & Moon icons
  if (variant === 'switch') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-8 w-15 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer border ${
          isDark
            ? 'bg-[#161D22] border-[#26333B] text-amber-400 shadow-inner'
            : 'bg-slate-200 border-slate-300 text-teal-600 shadow-inner'
        } ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="sr-only">Toggle Theme</span>
        {/* Background icon indicators */}
        <div className="flex w-full justify-between px-1 pointer-events-none items-center">
          <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'text-slate-600 opacity-40' : 'text-amber-500 opacity-100'}`} />
          <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'text-teal-400 opacity-100' : 'text-slate-400 opacity-40'}`} />
        </div>
        {/* Sliding Thumb */}
        <span
          className={`absolute left-1 flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-all duration-300 ease-in-out ${
            isDark
              ? 'translate-x-7 bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950'
              : 'translate-x-0 bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
          )}
        </span>
      </button>
    );
  }

  // Pill with two clickable sides
  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-[#161D22] border border-[#26333B] ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            !isDark
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => !isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Switch to Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-teal-400" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Sidebar item format
  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-[#161D22] border border-transparent ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30 shrink-0">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-teal-600 transition-transform duration-300 hover:-rotate-12" />
          )}
        </div>
        {showLabel && (
          <div className="flex-1 flex items-center justify-between text-left">
            <span className="truncate font-medium">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1B2226] border border-[#26333B] text-slate-400">
              {theme}
            </span>
          </div>
        )}
      </button>
    );
  }

  // Default: 'icon' with glowing Sun/Moon icon and tooltip
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-200 cursor-pointer relative group flex items-center justify-center ${
        isDark
          ? 'bg-[#161D22] border-[#26333B] text-amber-400 hover:text-amber-300 hover:bg-[#1B2226] hover:border-amber-400/50 shadow-sm'
          : 'bg-white border-slate-200 text-teal-600 hover:text-teal-700 hover:bg-slate-50 hover:border-teal-400/50 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
        ) : (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
