import React, { useEffect, useState } from 'react';
import { cn } from './ui';

export const ScoreMeter = ({ score, size = 160, maxScore = 100 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Calculations for SVG circle
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference;

  let colorClass = "text-brand-error";
  if (score >= 70) colorClass = "text-brand-success";
  else if (score >= 50) colorClass = "text-brand-warning";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", colorClass)}
        />
      </svg>
      {/* Inner text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-inter text-brand-primary">{animatedScore}%</span>
        {score >= 70 && <span className="text-sm font-medium text-brand-text-secondary mt-1 tracking-wide">Top 5<br/>Eligible</span>}
      </div>
    </div>
  );
};
