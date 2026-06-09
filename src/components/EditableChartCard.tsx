import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '@/src/context/DashboardContext';
import MetricInfo from '@/src/components/MetricInfo';

export default function EditableChartCard({ id, title: defaultTitle, tooltip: defaultTooltip = '', children, className = '', showTitleTooltip = true }: any) {
  const { isEditMode, widgetConfigs, updateWidget } = useDashboard();

  const config = { title: defaultTitle, tooltip: defaultTooltip, visible: true, ...widgetConfigs[id] };
  const displayTooltip = showTitleTooltip ? config.tooltip : '';

  const [localTitle, setLocalTitle] = useState(config.title);
  const [localTooltip, setLocalTooltip] = useState(config.tooltip);

  useEffect(() => {
    setLocalTitle(config.title);
    setLocalTooltip(config.tooltip);
  }, [config.title, config.tooltip]);

  const handleBlur = () => {
    updateWidget(id, { title: localTitle, tooltip: localTooltip });
  };

  const toggleVisibility = () => {
    updateWidget(id, { visible: !config.visible });
  };

  if (!config.visible && !isEditMode) return null;

  return (
    <Card className={`relative ${className} ${isEditMode ? "ring-2 ring-teal-300 ring-offset-2 transition-all" : ""} ${!config.visible ? "opacity-50 grayscale" : ""}`}>
      {isEditMode && (
        <div className="absolute -top-3 -right-3 flex space-x-1 z-20">
          <button
            onClick={toggleVisibility}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full shadow-sm"
            title={config.visible ? '隐藏该图表' : '显示该图表'}
          >
            {config.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      <CardHeader className="pb-2">
        {isEditMode ? (
          <div className="space-y-2 pr-8">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleBlur}
              className="font-semibold text-sm bg-teal-50 border border-teal-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="图表标题"
            />
            {showTitleTooltip && (
              <input
                type="text"
                value={localTooltip}
                onChange={(e) => setLocalTooltip(e.target.value)}
                onBlur={handleBlur}
                className="text-xs text-slate-600 bg-teal-50 border border-teal-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="图表说明 Tip..."
              />
            )}
          </div>
        ) : (
          <div className="flex items-center w-full">
            <CardTitle className="text-sm font-bold tracking-tight text-slate-900 flex items-center">
              {config.title}
              <MetricInfo tip={displayTooltip} className="ml-2" iconClassName="w-4 h-4" />
            </CardTitle>
          </div>
        )}
      </CardHeader>
      <CardContent className={className.includes('h-') ? className.match(/(h-\w+|h-\[\d+px\])/)?.[0] : ''}>
        {children}
      </CardContent>
    </Card>
  );
}
