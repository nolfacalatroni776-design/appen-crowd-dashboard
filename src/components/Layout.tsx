import React, { useState } from 'react';
import { Bell, Filter, Calendar, ChevronDown, Edit3, Check, Sparkles } from 'lucide-react';
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

const recruitStatusOptions = ['全部招募单状态', '招募中', '审核中', '已暂停', '已完成'];

export default function Layout() {
  const [activeTab, setActiveTab] = useState('traffic');
  const [recruitStatusFilter, setRecruitStatusFilter] = useState('全部招募单状态');
  const { isEditMode, setIsEditMode, globalDomain, setGlobalDomain } = useDashboard();
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

      <div className="border-b border-white/70 bg-[#f8fcfa]/80 px-6 py-3 text-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center gap-3">
          <div className="flex items-center text-slate-500 font-semibold mr-1">
            <Filter className="w-4 h-4 mr-2" />
            全局筛选
          </div>
          <button className="flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            近30天
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>
          
          {activeTab === 'recruitment' && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1"></div>
              
              <select 
                className="h-9 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm outline-none transition hover:border-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                value={globalDomain}
                onChange={(e) => setGlobalDomain(e.target.value)}
              >
                <option value="全部领域">全部领域</option>
                <option value="自动驾驶">自动驾驶</option>
                <option value="医疗影像">医疗影像</option>
                <option value="语音合成">语音合成</option>
                <option value="文本情感">文本情感</option>
                <option value="图像标注">图像标注</option>
                <option value="NLP任务">NLP任务</option>
              </select>
              <select
                className="h-9 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm outline-none transition hover:border-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                value={recruitStatusFilter}
                onChange={(e) => setRecruitStatusFilter(e.target.value)}
              >
                {recruitStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </>
          )}

          {activeTab === 'task' && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-1"></div>
              <select 
                className="h-9 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm outline-none transition hover:border-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                defaultValue="全部任务类型"
              >
                <option value="全部任务类型">全部任务类型</option>
                <option value="标注任务">标注任务</option>
                <option value="采集任务">采集任务</option>
                <option value="审核任务">审核任务</option>
                <option value="质检任务">质检任务</option>
              </select>
            </>
          )}

        </div>
      </div>

      <main className="flex-1 overflow-x-hidden px-6 py-6">
        <div className="mx-auto min-w-0 max-w-[1480px] flex-1 space-y-6 rounded-[28px] border border-white/80 bg-white/45 p-5 shadow-2xl shadow-teal-950/5">
          {activeTab === 'traffic' && <PlatformTraffic />}
          {activeTab === 'growth' && <GrowthRetention />}
          {activeTab === 'recruitment' && <RecruitmentAnalysis recruitStatusFilter={recruitStatusFilter} />}
          {activeTab === 'task' && <TaskQuality />}
        </div>
      </main>
    </div>
  );
}
