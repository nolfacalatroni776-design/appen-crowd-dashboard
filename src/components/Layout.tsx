import React, { useState } from 'react';
import { Bell, Search, Filter, Calendar, ChevronDown, Edit3, Check } from 'lucide-react';
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
  const { isEditMode, setIsEditMode, globalDomain, setGlobalDomain } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-slate-800">澳鹏众包运营数据看板</h1>
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isEditMode ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {isEditMode ? <Check className="w-4 h-4 mr-1.5" /> : <Edit3 className="w-4 h-4 mr-1.5" />}
            {isEditMode ? '完成编辑' : '编辑模式'}
          </button>
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            OP
          </div>
        </div>
      </header>

      {/* Global Filters */}
      <div className="bg-white border-b px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-slate-500 font-medium mr-2">
            <Filter className="w-4 h-4 mr-2" />
            全局筛选
          </div>
          <button className="flex items-center px-3 py-1.5 border rounded-md hover:bg-slate-50 text-slate-700">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            近30天
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>
          
          {activeTab === 'recruitment' && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-2"></div>
              
              <select 
                className="flex items-center px-3 py-1.5 border rounded-md hover:bg-slate-50 text-slate-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            </>
          )}

          {activeTab === 'task' && (
            <>
              <div className="h-4 w-px bg-slate-200 mx-2"></div>
              <select 
                className="flex items-center px-3 py-1.5 border rounded-md hover:bg-slate-50 text-slate-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {/* Main Content */}
      <main className="flex-1 p-6 flex gap-6 overflow-x-hidden">
        <div className="flex-1 space-y-6 min-w-0">
          {activeTab === 'traffic' && <PlatformTraffic />}
          {activeTab === 'growth' && <GrowthRetention />}
          {activeTab === 'recruitment' && <RecruitmentAnalysis />}
          {activeTab === 'task' && <TaskQuality />}
        </div>
      </main>
    </div>
  );
}
