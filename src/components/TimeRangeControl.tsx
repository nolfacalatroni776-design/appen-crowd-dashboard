import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type TimeGranularity = 'last7' | 'last30' | 'day' | 'week' | 'month' | 'custom';

export type TimeRangeState = {
  granularity: TimeGranularity;
  offset: number;
};

export const defaultTimeRange: TimeRangeState = {
  granularity: 'day',
  offset: 0,
};

const options: Array<{ value: TimeGranularity; label: string }> = [
  { value: 'last7', label: '7天' },
  { value: 'last30', label: '30天' },
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'custom', label: '自定义' },
];

const dayMs = 24 * 60 * 60 * 1000;

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * dayMs);

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatPeriodLabel = (start: Date, end: Date) =>
  formatDate(start) === formatDate(end)
    ? formatDate(end)
    : `${formatDate(start)} ~ ${formatDate(end)}`;

const getLatestStatDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return addDays(today, -1);
};

const getLastCompletedWeek = (latestStatDate: Date) => {
  const day = latestStatDate.getDay();
  const daysSinceSunday = day === 0 ? 0 : day;
  const end = addDays(latestStatDate, -daysSinceSunday);
  const start = addDays(end, -6);
  return { start, end };
};

const getLastCompletedMonth = (latestStatDate: Date) => {
  const lastDayOfMonth = new Date(latestStatDate.getFullYear(), latestStatDate.getMonth() + 1, 0).getDate();
  if (latestStatDate.getDate() === lastDayOfMonth) {
    return {
      start: new Date(latestStatDate.getFullYear(), latestStatDate.getMonth(), 1),
      end: latestStatDate,
    };
  }

  const previousMonth = new Date(latestStatDate.getFullYear(), latestStatDate.getMonth(), 0);
  return {
    start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
    end: previousMonth,
  };
};

export const getTimeRangeMeta = (state: TimeRangeState) => {
  const latestStatDate = getLatestStatDate();
  let start: Date;
  let end: Date;
  let compareLabel: string;

  if (state.granularity === 'day') {
    start = addDays(latestStatDate, state.offset);
    end = start;
    compareLabel = '较前1日';
  } else if (state.granularity === 'week') {
    const base = getLastCompletedWeek(latestStatDate);
    start = addDays(base.start, state.offset * 7);
    end = addDays(base.end, state.offset * 7);
    compareLabel = '较上周';
  } else if (state.granularity === 'month') {
    const base = getLastCompletedMonth(latestStatDate);
    start = new Date(base.start.getFullYear(), base.start.getMonth() + state.offset, 1);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    compareLabel = '较上月';
  } else if (state.granularity === 'last7') {
    end = addDays(latestStatDate, state.offset * 7);
    start = addDays(end, -6);
    compareLabel = '较前7天';
  } else if (state.granularity === 'last30') {
    end = addDays(latestStatDate, state.offset * 30);
    start = addDays(end, -29);
    compareLabel = '较前30天';
  } else {
    const rangeDays = 30;
    const baseEnd = latestStatDate;
    const baseStart = addDays(baseEnd, -(rangeDays - 1));
    start = addDays(baseStart, state.offset * rangeDays);
    end = addDays(baseEnd, state.offset * rangeDays);
    const compareEnd = addDays(start, -1);
    const compareStart = addDays(compareEnd, -(rangeDays - 1));
    compareLabel = `较上一周期（${formatPeriodLabel(compareStart, compareEnd)}）`;
  }

  const periodLabel = formatPeriodLabel(start, end);

  return {
    start,
    end,
    periodLabel,
    compareLabel,
  };
};

export const getTimeRangeDayCount = (state: TimeRangeState) => {
  const meta = getTimeRangeMeta(state);
  return Math.max(1, Math.round((meta.end.getTime() - meta.start.getTime()) / dayMs) + 1);
};

type TimeRangeControlProps = {
  value: TimeRangeState;
  onChange: (next: TimeRangeState) => void;
  label?: string;
  className?: string;
};

export default function TimeRangeControl({
  value,
  onChange,
  label = '统计时间',
  className,
}: TimeRangeControlProps) {
  const meta = getTimeRangeMeta(value);
  const isNextDisabled = value.offset >= 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 text-sm', className)}>
      <div className="flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm">
        <span className="mr-1 text-slate-400">{label}</span>
        <span className="font-medium text-slate-700">{meta.periodLabel}</span>
      </div>
      <div className="inline-flex h-9 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ granularity: option.value, offset: 0 })}
            className={cn(
              'border-r border-slate-100 px-3 text-sm font-medium transition last:border-r-0',
              value.granularity === option.value
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="inline-flex h-9 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          className="flex w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          onClick={() => onChange({ ...value, offset: value.offset - 1 })}
          aria-label="查看上一统计周期"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            'flex w-9 items-center justify-center border-l border-slate-100 transition',
            isNextDisabled
              ? 'cursor-not-allowed text-slate-300'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          )}
          onClick={() => !isNextDisabled && onChange({ ...value, offset: value.offset + 1 })}
          disabled={isNextDisabled}
          aria-label="查看下一统计周期"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
