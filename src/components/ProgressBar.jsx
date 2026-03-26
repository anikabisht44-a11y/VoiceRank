import React from 'react';
import { cn } from './ui';

export const ProgressBar = ({ percentage, lowIsGood = false, label }) => {
  // Determine color based on whether a high score is good or bad
  let colorClass = "bg-brand-success";
  
  if (lowIsGood) {
    if (percentage > 50) colorClass = "bg-brand-error";
    else if (percentage >= 20) colorClass = "bg-brand-warning";
  } else {
    if (percentage < 50) colorClass = "bg-brand-error";
    else if (percentage < 70) colorClass = "bg-brand-warning";
  }

  return (
    <div className="w-full">
      {label && <div className="text-sm font-semibold mb-2 text-brand-primary">{label}</div>}
      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-brand-text-secondary">
        <span>{percentage}%</span>
        {lowIsGood ? (
          <span>{percentage < 20 ? 'Human-like' : 'Likely AI'}</span>
        ) : null}
      </div>
    </div>
  );
};
