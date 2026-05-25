import React from 'react';
import { Info } from 'lucide-react';

interface MetricInfoProps {
  tip?: string;
  align?: 'left' | 'right';
  className?: string;
}

export default function MetricInfo({ tip, align = 'left', className = '' }: MetricInfoProps) {
  if (!tip) return null;

  const panelPosition = align === 'right' ? 'right-0' : 'left-0';
  const arrowPosition = align === 'right' ? 'right-3' : 'left-3';

  return (
    <span
      className={`relative ml-1 inline-flex items-center align-middle group/metric-info ${className}`}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
      <span className={`absolute top-full ${panelPosition} mt-2 hidden w-64 p-3 bg-slate-800 text-white text-xs rounded shadow-lg z-[60] whitespace-pre-line leading-relaxed text-left font-normal group-hover/metric-info:block`}>
        {tip}
        <span className={`absolute ${arrowPosition} bottom-full w-2 h-2 bg-slate-800 transform rotate-45 -mb-1`} />
      </span>
    </span>
  );
}
