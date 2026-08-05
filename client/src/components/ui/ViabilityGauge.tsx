import React from 'react';

interface ViabilityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ViabilityGauge: React.FC<ViabilityGaugeProps> = ({ score, size = 'md' }) => {
  const getStatus = (val: number) => {
    if (val >= 80) return { label: 'Optimal Viability', color: 'text-emerald-400', stroke: '#22c55e', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (val >= 60) return { label: 'Moderate Viability', color: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'High Risk / Caution', color: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const status = getStatus(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dim = size === 'lg' ? 140 : size === 'sm' ? 80 : 110;

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-md">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={status.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {score}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">/ 100</span>
        </div>
      </div>
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}>
        {status.label}
      </div>
    </div>
  );
};
