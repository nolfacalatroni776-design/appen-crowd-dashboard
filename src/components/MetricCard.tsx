import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useDashboard } from '@/src/context/DashboardContext';
import MetricInfo from '@/src/components/MetricInfo';

export default function MetricCard({ 
  id, 
  title: defaultTitle, 
  value, 
  change, 
  changeLabel, 
  isWarning = false, 
  isDanger = false, 
  tooltip: defaultTooltip = '',
  isCustom = false,
  onDelete
}: any) {
  const { isEditMode, widgetConfigs, updateWidget } = useDashboard();
  
  const config = { title: defaultTitle, tooltip: defaultTooltip, visible: true, ...widgetConfigs[id] };

  const [localTitle, setLocalTitle] = useState(config.title);
  const [localTooltip, setLocalTooltip] = useState(config.tooltip);
  const [localValue, setLocalValue] = useState(config.value ?? value);
  const [localChange, setLocalChange] = useState(config.change ?? change);

  useEffect(() => {
    setLocalTitle(config.title);
    setLocalTooltip(config.tooltip);
    if (config.value !== undefined) setLocalValue(config.value);
    if (config.change !== undefined) setLocalChange(config.change);
  }, [config.title, config.tooltip, config.value, config.change]);

  const handleBlur = () => {
    updateWidget(id, { 
      title: localTitle, 
      tooltip: localTooltip,
      value: typeof localValue === 'string' ? localValue : Number(localValue),
      change: typeof localChange === 'string' ? localChange : Number(localChange)
    });
  };

  const toggleVisibility = () => {
    updateWidget(id, { visible: !config.visible });
  };

  if (!config.visible && !isEditMode) return null;

  const displayValue = config.value ?? value;
  const displayChange = config.change ?? change;
  const numChange = Number(displayChange);

  return (
    <Card className={`relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.08)] ${isEditMode ? "ring-2 ring-teal-300 ring-offset-2 transition-all" : ""} ${!config.visible ? "opacity-50 grayscale" : ""}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-300 via-emerald-300 to-lime-200" />
      {isEditMode && (
        <div className="absolute -top-3 -right-3 flex space-x-1 z-20">
          <button 
            onClick={toggleVisibility}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full shadow-sm"
            title={config.visible ? '隐藏该指标' : '显示该指标'}
          >
            {config.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          {isCustom && onDelete && (
            <button 
              onClick={onDelete}
              className="p-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-full shadow-sm"
              title="删除该指标"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center group relative w-full">
            {isEditMode ? (
              <div className="w-full space-y-2 pr-2">
                <input 
                  type="text" 
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="text-sm font-medium text-slate-700 bg-teal-50 border border-teal-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="指标名称"
                />
                <input 
                  type="text" 
                  value={localTooltip}
                  onChange={(e) => setLocalTooltip(e.target.value)}
                  onBlur={handleBlur}
                  className="text-xs text-slate-600 bg-teal-50 border border-teal-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="指标说明 Tip"
                />
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-slate-500">{config.title}</h3>
                <MetricInfo tip={config.tooltip} />
              </>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          {isEditMode ? (
            <input 
              type="text" 
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-teal-50 border border-teal-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          ) : (
            displayValue
          )}
        </div>
        <div className="flex items-center text-xs">
          {isEditMode ? (
            <div className="flex items-center gap-2 w-full">
              <input 
                type="text" 
                value={localChange}
                onChange={(e) => setLocalChange(e.target.value)}
                onBlur={handleBlur}
                className="w-20 bg-teal-50 border border-teal-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-slate-400">{changeLabel}</span>
            </div>
          ) : (
            <>
              {numChange > 0 ? (
                <span className="flex items-center text-emerald-600 font-medium">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {numChange}{typeof displayChange === 'number' && !String(changeLabel).includes('%') && !String(changeLabel).includes('条') && !String(changeLabel).includes('人') && !String(changeLabel).includes('个') ? '%' : ''}
                </span>
              ) : numChange < 0 ? (
                <span className="flex items-center text-red-600 font-medium">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  {Math.abs(numChange)}{typeof displayChange === 'number' && !String(changeLabel).includes('%') && !String(changeLabel).includes('条') && !String(changeLabel).includes('人') && !String(changeLabel).includes('个') ? '%' : ''}
                </span>
              ) : (
                <span className="text-slate-500 font-medium">
                  {displayChange !== 0 && displayChange !== '0' && isNaN(numChange) ? displayChange : '持平'}
                </span>
              )}
              <span className="text-slate-400 ml-1.5">{changeLabel}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
