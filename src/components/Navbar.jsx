import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn } from './ui';

export const Navbar = () => {
  const { state, dispatch } = useAppContext();

  return (
    <nav className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-inter font-bold text-xl tracking-tight text-brand-primary">
            VOICERANK
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({isActive}) => cn("text-sm font-semibold transition-colors hover:text-brand-primary", isActive ? "text-brand-primary" : "text-brand-text-secondary")}
          >
            Voice Setup
          </NavLink>
          <NavLink 
            to="/generate" 
            className={({isActive}) => cn("text-sm font-semibold transition-colors hover:text-brand-primary", isActive ? "text-brand-primary" : "text-brand-text-secondary")}
          >
            Generate
          </NavLink>
          
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Demo Mode</span>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_DEMO_MODE' })}
              className={cn("w-10 h-5 rounded-full transition-colors relative", state.demoMode ? "bg-brand-success" : "bg-gray-300")}
            >
              <div className={cn("absolute top-0.5 mt-px left-1 bg-white w-4 h-4 rounded-full transition-transform", state.demoMode ? "translate-x-4" : "translate-x-0")} />
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};
