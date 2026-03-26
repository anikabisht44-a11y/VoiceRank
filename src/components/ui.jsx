import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn("bg-brand-surface rounded-[16px] shadow-sm p-6 border border-gray-100", className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const Button = ({ children, variant = 'primary', className, isLoading, ...props }) => {
  const base = "inline-flex items-center justify-center font-inter font-semibold text-[14px] rounded-[8px] transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90",
    secondary: "bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary/5",
    link: "bg-transparent text-brand-secondary hover:underline p-0"
  };

  return (
    <button 
      className={cn(base, variants[variant], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" color={variant === 'primary' ? 'text-white' : 'text-brand-primary'} />
          Processing...
        </span>
      ) : children}
    </button>
  );
};

export const Tag = ({ children, className }) => {
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[14px] bg-gray-100 text-brand-text-secondary whitespace-nowrap", className)}>
      {children}
    </span>
  );
};

export const LoadingSpinner = ({ size = 'md', color = 'text-brand-primary', className }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  return (
    <svg 
      className={cn("animate-spin", sizeClasses[size], color, className)} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};
