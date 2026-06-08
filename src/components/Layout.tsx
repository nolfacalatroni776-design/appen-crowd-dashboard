import React, { useState } from 'react';
import { Bell, Edit3, Check, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useDashboard } from '@/src/context/DashboardContext';
import GrowthRetention from '@/src/pages/tabs/GrowthRetention';
import RecruitmentAnalysis from '@/src/pages/tabs/RecruitmentAnalysis';
import TaskQuality from '@/src/pages/tabs/TaskQuality';
import PlatformTraffic from '@/src/pages/tabs/PlatformTraffic';

const tabs = [
  { id: 'traffic', label: '平台流量' },
  { id: 'growth', label: '增长&留存' },
  { id: 'recruitment', label: '招募分析' },
  { id: 'task', label: '任务&质量' },
];

export default function Layout() {
  const [activeTab, setActiveTab] = useState('traffic');
  const { isEditMode, setIsEditMode } = useDashboard();
  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen bg-[#eef8f4] flex flex-col font-sans text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-6 py-4 shadow-sm shadow-teal-900/5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-600">EliteAI Operations</div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">澳鹏众包运营数据看板</h1>
            </div>
          </div>

          <nav className="flex flex-wrap rounded-full border border-slate-200 bg-slate-100/70 p-1 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-white text-teal-700 shadow-sm ring-1 ring-teal-100"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 md:block">
              {activeTabLabel}
            </div>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                "flex items-center rounded-full px-3 py-2 text-sm font-semibold transition-all",
                isEditMode ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {isEditMode ? <Check className="w-4 h-4 mr-1.5" /> : <Edit3 className="w-4 h-4 mr-1.5" />}
              {isEditMode ? '完成编辑' : '编辑模式'}
            </button>
            <button className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/10">
              OP
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden px-6 py-6">
        <div className="mx-auto min-w-0 max-w-[1480px] flex-1 space-y-6 rounded-[28px] border border-white/80 bg-white/45 p-5 shadow-2xl shadow-teal-950/5">
          {activeTab === 'traffic' && <PlatformTraffic />}
          {activeTab === 'growth' && <GrowthRetention />}
          {activeTab === 'recruitment' && <RecruitmentAnalysis />}
          {activeTab === 'task' && <TaskQuality />}
        </div>
      </main>
    </div>
  );
}
