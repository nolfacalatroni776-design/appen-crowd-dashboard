import React, { createContext, useContext, useEffect, useState } from 'react';
import { funnelData, lifecycleData, churnData, errorTypeData, lifecycleDurationData, topPagesData, topRecruitTasks } from '@/src/data/mockData';
import { sourceDashboardState } from '@/src/data/defaultDashboardState';

export const STORAGE_KEY = 'appen-crowd-dashboard-edit-state-v2';

const withIds = (listKey: string, arr: any[]) => arr.map((item, idx) => ({ ...item, id: item.id ?? `${listKey}-${idx}` }));

const initialChartLists: Record<string, any[]> = {
  funnel: withIds('funnel', funnelData),
  lifecycle: withIds('lifecycle', lifecycleData),
  churn: withIds('churn', churnData),
  errorType: withIds('errorType', errorTypeData),
  lifecycleDuration: withIds('lifecycleDuration', lifecycleDurationData),
  topPages: withIds('topPages', topPagesData),
  topRecruitTasks: withIds('topRecruitTasks', topRecruitTasks),
};

const mergeStoredChartLists = (storedChartLists?: Record<string, any[]>) => {
  const merged = {
    ...initialChartLists,
    ...(storedChartLists ?? {}),
  };

  merged.funnel = initialChartLists.funnel.map((defaultItem, idx) => ({
    ...defaultItem,
    ...(merged.funnel?.[idx] ?? {}),
    id: defaultItem.id,
    name: idx === initialChartLists.funnel.length - 1 ? defaultItem.name : (merged.funnel?.[idx]?.name ?? defaultItem.name),
  }));

  merged.lifecycle = initialChartLists.lifecycle.map((defaultItem, idx) => ({
    ...defaultItem,
    ...(merged.lifecycle?.[idx] ?? {}),
    id: defaultItem.id,
    stage: String(defaultItem.stage).includes('已流失') ? defaultItem.stage : (merged.lifecycle?.[idx]?.stage ?? defaultItem.stage),
  }));

  merged.topRecruitTasks = initialChartLists.topRecruitTasks.map((defaultItem, idx) => ({
    ...defaultItem,
    ...(merged.topRecruitTasks?.[idx] ?? {}),
    id: defaultItem.id,
    recruitStatus: merged.topRecruitTasks?.[idx]?.recruitStatus ?? defaultItem.recruitStatus,
  }));

  return merged;
};

interface WidgetConfig {
  title?: string;
  tooltip?: string;
  visible?: boolean;
  value?: string | number;
  change?: string | number;
}

interface CustomMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  tooltip: string;
}

interface StoredDashboardState {
  widgetConfigs?: Record<string, WidgetConfig>;
  customMetrics?: Record<string, CustomMetric[]>;
  chartLists?: Record<string, any[]>;
  systemTexts?: Record<string, string>;
}

interface DashboardContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  globalDomain: string;
  setGlobalDomain: (val: string) => void;
  widgetConfigs: Record<string, WidgetConfig>;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  customMetrics: Record<string, CustomMetric[]>;
  addCustomMetric: (tabId: string) => void;
  removeCustomMetric: (tabId: string, metricId: string) => void;
  updateCustomMetric: (tabId: string, metricId: string, updates: Partial<CustomMetric>) => void;
  chartLists: Record<string, any[]>;
  updateChartListItem: (listKey: string, itemId: string, updates: any) => void;
  addChartListItem: (listKey: string, newItem: any) => void;
  removeChartListItem: (listKey: string, itemId: string) => void;
  systemTexts: Record<string, string>;
  updateSystemText: (key: string, value: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const readStoredDashboardState = (): StoredDashboardState => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredDashboardState : sourceDashboardState;
  } catch {
    return {};
  }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedState] = useState<StoredDashboardState>(() => readStoredDashboardState());
  const [isEditMode, setIsEditMode] = useState(false);
  const [globalDomain, setGlobalDomain] = useState('全部领域');
  const [widgetConfigs, setWidgetConfigs] = useState<Record<string, WidgetConfig>>(() => storedState.widgetConfigs ?? {});
  const [customMetrics, setCustomMetrics] = useState<Record<string, CustomMetric[]>>(() => storedState.customMetrics ?? {});
  const [chartLists, setChartLists] = useState<Record<string, any[]>>(() => mergeStoredChartLists(storedState.chartLists));
  const [systemTexts, setSystemTexts] = useState<Record<string, string>>(() => storedState.systemTexts ?? {});
  const [hasLocalEdits, setHasLocalEdits] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasLocalEdits) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        widgetConfigs,
        customMetrics,
        chartLists,
        systemTexts,
      }));
    } catch {
      // localStorage can be unavailable or full; keep the dashboard usable in-memory.
    }
  }, [widgetConfigs, customMetrics, chartLists, systemTexts, hasLocalEdits]);

  const updateSystemText = (key: string, value: string) => {
    setHasLocalEdits(true);
    setSystemTexts(prev => ({ ...prev, [key]: value }));
  };

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setHasLocalEdits(true);
    setWidgetConfigs(prev => {
      const existing = prev[id] || {};
      return { ...prev, [id]: { ...existing, ...updates } };
    });
  };

  const addCustomMetric = (tabId: string) => {
    setHasLocalEdits(true);
    setCustomMetrics(prev => {
      const existing = prev[tabId] || [];
      const newMetric: CustomMetric = {
        id: `custom-metric-${Date.now()}`,
        title: '新增自定义指标',
        value: '0',
        change: 0,
        changeLabel: '较昨日',
        tooltip: '自定义指标说明',
      };
      return { ...prev, [tabId]: [...existing, newMetric] };
    });
  };

  const removeCustomMetric = (tabId: string, metricId: string) => {
    setHasLocalEdits(true);
    setCustomMetrics(prev => {
      const existing = prev[tabId] || [];
      return { ...prev, [tabId]: existing.filter(m => m.id !== metricId) };
    });
  };

  const updateCustomMetric = (tabId: string, metricId: string, updates: Partial<CustomMetric>) => {
    setHasLocalEdits(true);
    setCustomMetrics(prev => {
      const existing = prev[tabId] || [];
      return {
        ...prev,
        [tabId]: existing.map(m => m.id === metricId ? { ...m, ...updates } : m)
      };
    });
  };

  const updateChartListItem = (listKey: string, itemId: string, updates: any) => {
    setHasLocalEdits(true);
    setChartLists(prev => ({
      ...prev,
      [listKey]: (prev[listKey] || []).map(item => item.id === itemId ? { ...item, ...updates } : item)
    }));
  };

  const addChartListItem = (listKey: string, newItem: any) => {
    setHasLocalEdits(true);
    setChartLists(prev => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), { id: `item-${Date.now()}-${Math.random()}`, ...newItem }]
    }));
  };

  const removeChartListItem = (listKey: string, itemId: string) => {
    setHasLocalEdits(true);
    setChartLists(prev => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter(item => item.id !== itemId)
    }));
  };

  return (
    <DashboardContext.Provider value={{ 
      isEditMode, 
      setIsEditMode, 
      globalDomain,
      setGlobalDomain,
      widgetConfigs, 
      updateWidget,
      customMetrics,
      addCustomMetric,
      removeCustomMetric,
      updateCustomMetric,
      chartLists,
      addChartListItem,
      updateChartListItem,
      removeChartListItem,
      systemTexts,
      updateSystemText
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
