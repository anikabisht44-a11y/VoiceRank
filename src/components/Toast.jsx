import React, { useEffect, useState } from 'react';
import { cn } from './ui';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-brand-success',
    error: 'bg-brand-error',
    info: 'bg-brand-primary'
  };

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all duration-300 z-50 flex items-center gap-2",
      bgColors[type],
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {type === 'success' && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {message}
    </div>
  );
};
