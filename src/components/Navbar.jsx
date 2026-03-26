import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn } from './ui';

export const Navbar = () => {
  const { state } = useAppContext();

  return (
    <nav className="w-full border-b-3 border-[var(--color-brand-text)] bg-[var(--color-brand-surface)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Brutalist Typography */}
        <div className="flex items-center gap-3">
          <span className="font-heading font-black text-2xl tracking-tighter text-[var(--color-brand-text)] uppercase">
            VOICERANK
          </span>
        </div>

        {/* Desktop Nav - Editorial Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({isActive}) => cn(
              "text-xs font-black tracking-widest uppercase transition-all pb-1", 
              isActive ? "text-[var(--color-brand-text)] border-b-2 border-[var(--color-brand-text)]" 
                       : "text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)]"
            )}
          >
            Voice Profile
          </NavLink>
          <NavLink 
            to="/generate" 
            className={({isActive}) => cn(
              "text-xs font-black tracking-widest uppercase transition-all pb-1", 
              isActive ? "text-[var(--color-brand-text)] border-b-2 border-[var(--color-brand-text)]" 
                       : "text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)]"
            )}
          >
            SEO Research
          </NavLink>
          <NavLink 
            to="/editor" 
            className={({isActive}) => cn(
              "text-xs font-black tracking-widest uppercase transition-all pb-1", 
              isActive ? "text-[var(--color-brand-text)] border-b-2 border-[var(--color-brand-text)]" 
                       : "text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)]"
            )}
          >
            Editor Console
          </NavLink>
          <NavLink 
            to="/distribution" 
            className={({isActive}) => cn(
              "text-xs font-black tracking-widest uppercase transition-all pb-1", 
              isActive ? "text-[var(--color-brand-text)] border-b-2 border-[var(--color-brand-text)]" 
                       : "text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)]"
            )}
          >
            Distribution
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => cn(
              "text-xs font-black tracking-widest uppercase transition-all pb-1", 
              isActive ? "text-[var(--color-brand-text)] border-b-2 border-[var(--color-brand-text)]" 
                       : "text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)]"
            )}
          >
            Analytics
          </NavLink>
        </div>

        {/* Profile Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-brand-text)] flex items-center justify-center bg-white cursor-pointer hover:bg-[var(--color-brand-gray)]">
          <svg className="w-4 h-4 text-[var(--color-brand-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

      </div>
    </nav>
  );
};
