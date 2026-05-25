import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import EditableChartCard from '@/src/components/EditableChartCard';
import { domainRecruitData, recruitTrendByDomain, reviewCycleData, topRecruitTasks, recruitTaskStatusData } from '@/src/data/mockData';
import { metricTip } from '@/src/data/metricDefinitions';
import { ArrowUpDown } from 'lucide-react';
import MetricCard from '@/src/components/MetricCard';
import MetricInfo from '@/src/components/MetricInfo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { useDashboard } from '@/src/context/DashboardContext';

export default function RecruitmentAnalysis() {
  const [viewMode, setViewMode] = useState<'domain' | 'task'>('domain');
  const [domainSortConfig, setDomainSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [taskSortConfig, setTaskSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const { isEditMode, chartLists, updateChartListItem, globalDomain } = useDashboard();
  const topRecruitTasksState = chartLists.topRecruitTasks || topRecruitTasks;
  const trendData = recruitTrendByDomain[globalDomain] || recruitTrendByDomain['全部领域'];
  const getApprovedWorkers = (task: any) => Number(task.approved ?? task.onboarded ?? 0);
  let filteredDomainRecruitData = domainRecruitData.filter(d => globalDomain === '全部领域' || d.domain === globalDomain);
  const filteredReviewCycleDomains = reviewCycleData.domains.filter(d => globalDomain === '全部领域' || d.name === globalDomain);

  let filteredTasks = topRecruitTasksState.filter(task => {
    return globalDomain === '全部领域' || task.domain === globalDomain;
  });

  const handleDomainSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (domainSortConfig && domainSortConfig.key === key && domainSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setDomainSortConfig({ key, direction });
  };

  const handleTaskSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (taskSortConfig && taskSortConfig.key === key && taskSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setTaskSortConfig({ key, direction });
  };

  if (domainSortConfig !== null) {
    filteredDomainRecruitData.sort((a, b) => {
      let aValue: any = a[domainSortConfig.key as keyof typeof a];
      let bValue: any = b[domainSortConfig.key as keyof typeof b];
      if (domainSortConfig.key === 'reviewCycle') {
        aValue = Number(reviewCycleData.domains.find(d => d.name === a.domain)?.days || 1.5);
        bValue = Number(reviewCycleData.domains.find(d => d.name === b.domain)?.days || 1.5);
      }
      if (aValue < bValue) {
        return domainSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return domainSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  if (taskSortConfig !== null) {
    filteredTasks.sort((a, b) => {
      let aValue: any = a[taskSortConfig.key as keyof typeof a];
      let bValue: any = b[taskSortConfig.key as keyof typeof b];
      if (taskSortConfig.key === 'reviewCycle') {
        aValue = Number(((a.target % 2) + 1.2).toFixed(1));
        bValue = Number(((b.target % 2) + 1.2).toFixed(1));
      } else if (taskSortConfig.key === 'approved') {
        aValue = getApprovedWorkers(a);
        bValue = getApprovedWorkers(b);
      } else if (taskSortConfig.key === 'completionRate') {
        aValue = a.target > 0 ? getApprovedWorkers(a) / a.target : 0;
        bValue = b.target > 0 ? getApprovedWorkers(b) / b.target : 0;
      }
      if (aValue < bValue) {
        return taskSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return taskSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard id="ra-s1" title="新增招募单" value={`${recruitTaskStatusData.new.value}个`} change={recruitTaskStatusData.new.change} changeLabel={recruitTaskStatusData.new.label} tooltip={metricTip('new_recruit_sheets')} />
        <MetricCard id="ra-s2" title="进行中招募单" value={`${recruitTaskStatusData.inProgress.value}个`} change={recruitTaskStatusData.inProgress.change} changeLabel={recruitTaskStatusData.inProgress.label} tooltip={metricTip('active_recruit_sheets')} />
        <MetricCard id="ra-s4" title="已完成招募单" value={`${recruitTaskStatusData.completed.value}个`} change={recruitTaskStatusData.completed.change} changeLabel={recruitTaskStatusData.completed.label} tooltip={metricTip('completed_recruit_sheets')} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard id="ra-2" title="目标招募总人数" value="13,665人" change={800} changeLabel="较上周" tooltip={metricTip('target_workers')} />
        <MetricCard id="ra-3" title="已到位总人数" value="7,394人" change={-200} changeLabel="较上周" isWarning tooltip={metricTip('onboarded_workers')} />
        <MetricCard id="ra-4" title="总缺口人数" value="6,271人" change={0} changeLabel="缺口率 45.9%" isDanger tooltip={metricTip('gap_workers', 'gap_rate', 'recruitment_supply_gap')} />
        <MetricCard id="ra-5" title="整体通过率" value="63.5%" change={-1.2} changeLabel="较上月" tooltip={metricTip('approval_rate', 'recruit_approval_rate')} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <EditableChartCard id="ra-c1" title="招募转化趋势" tooltip={metricTip('application_rate', 'approval_rate')} className="col-span-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="applyRate" name="申请率" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="passRate" name="通过率" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>
      </div>

      <div className="flex border-b border-slate-200 mt-8 mb-4">
        <button 
          onClick={() => setViewMode('domain')}
          className={`pb-2 px-4 font-medium text-sm transition-colors relative ${viewMode === 'domain' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          按领域查看
          {viewMode === 'domain' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
        <button 
          onClick={() => setViewMode('task')}
          className={`pb-2 px-4 font-medium text-sm transition-colors relative ${viewMode === 'task' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          明细招募单排行
          {viewMode === 'task' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
        </button>
      </div>

      {viewMode === 'domain' ? (
        <EditableChartCard id="ra-c3" title="各业务领域招募详情" showTitleTooltip={false}>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="pb-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('domain')}>
                    <div className="flex items-center">
                      领域
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'domain' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('tasks')}>
                    <div className="flex items-center justify-end">
                      招募单
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'tasks' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('target')}>
                    <div className="flex items-center justify-end">
                      目标人数
                      <MetricInfo tip={metricTip('target_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'target' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('applicants')}>
                    <div className="flex items-center justify-end">
                      申请人数
                      <MetricInfo tip={metricTip('applied_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'applicants' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('current')}>
                    <div className="flex items-center justify-end">
                      已到位
                      <MetricInfo tip={metricTip('onboarded_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'current' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('gap')}>
                    <div className="flex items-center justify-end">
                      缺口人数
                      <MetricInfo tip={metricTip('gap_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'gap' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('gapRate')}>
                    <div className="flex items-center justify-end">
                      缺口率
                      <MetricInfo tip={metricTip('gap_rate')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'gapRate' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleDomainSort('reviewCycle')}>
                    <div className="flex items-center justify-end">
                      平均审核周期
                      <MetricInfo tip={metricTip('avg_review_cycle_days')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'reviewCycle' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" style={{minWidth: '70px'}} onClick={() => handleDomainSort('applyRate')}>
                    <div className="flex items-center justify-end">
                      申请率
                      <MetricInfo tip={metricTip('application_rate')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'applyRate' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" style={{minWidth: '70px'}} onClick={() => handleDomainSort('passRate')}>
                    <div className="flex items-center justify-end">
                      通过率
                      <MetricInfo tip={metricTip('approval_rate')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'passRate' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" style={{minWidth: '70px'}} onClick={() => handleDomainSort('onboardRate')}>
                    <div className="flex items-center justify-end">
                      上岗率
                      <MetricInfo tip={metricTip('onboard_rate')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${domainSortConfig?.key === 'onboardRate' ? (domainSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDomainRecruitData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 text-sm">
                      没有匹配的领域数据
                    </td>
                  </tr>
                ) : filteredDomainRecruitData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 font-medium flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        row.status === 'danger' ? 'bg-red-500' : row.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {row.domain}
                    </td>
                    <td className="py-3 text-right text-slate-600">{row.tasks}</td>
                    <td className="py-3 text-right text-slate-600">{row.target.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-blue-600">{row.applicants.toLocaleString()}</td>
                    <td className="py-3 text-right text-slate-600">{row.current.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-slate-700">{row.gap.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end">
                        <span className={`mr-2 font-medium ${
                          row.gapRate > 50 ? 'text-red-600' : row.gapRate > 25 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{row.gapRate}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${row.gapRate > 50 ? 'bg-red-500' : row.gapRate > 25 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${row.gapRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-700">
                      {reviewCycleData.domains.find(d => d.name === row.domain)?.days || '1.5'}天
                    </td>
                    <td className="py-3 text-right text-slate-600">{row.applyRate}%</td>
                    <td className="py-3 text-right text-slate-600">{row.passRate}%</td>
                    <td className="py-3 text-right text-slate-600">{row.onboardRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </EditableChartCard>
      ) : (
      <EditableChartCard id="ra-c4" title="申请人数 TOP10 招募单" showTitleTooltip={false}>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="pb-3 font-medium w-12 text-center">排名</th>
                  <th className="pb-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('name')}>
                    <div className="flex items-center">
                      招募单名称
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'name' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('domain')}>
                    <div className="flex items-center">
                      业务领域
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'domain' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('target')}>
                    <div className="flex items-center justify-end">
                      目标人数
                      <MetricInfo tip={metricTip('target_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'target' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('applicants')}>
                    <div className="flex items-center justify-end">
                      申请人数
                      <MetricInfo tip={metricTip('applied_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'applicants' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('approved')}>
                    <div className="flex items-center justify-end">
                      招募通过人数
                      <MetricInfo tip={metricTip('approved_workers')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'approved' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('reviewCycle')}>
                    <div className="flex items-center justify-end">
                      平均审核周期
                      <MetricInfo tip={metricTip('avg_review_cycle_days')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'reviewCycle' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-right cursor-pointer hover:text-slate-700" onClick={() => handleTaskSort('completionRate')}>
                    <div className="flex items-center justify-end">
                      通过达成率
                      <MetricInfo tip={metricTip('recruit_progress_rate')} align="right" />
                      <ArrowUpDown className={`w-3.5 h-3.5 ml-1 ${taskSortConfig?.key === 'completionRate' ? (taskSortConfig.direction === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600') : 'text-slate-300'}`} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                      没有找到匹配的招募单
                    </td>
                  </tr>
                ) : filteredTasks.map((task, i) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3">
                      {isEditMode ? (
                        <input className="w-full font-medium text-slate-800 border rounded px-1" value={task.name} onChange={e => updateChartListItem('topRecruitTasks', task.id, { name: e.target.value })} />
                      ) : (
                        <div className="font-medium text-slate-800">{task.name}</div>
                      )}
                    </td>
                    <td className="py-3">
                      {isEditMode ? (
                        <input className="w-full border rounded px-1 py-0.5 text-xs text-slate-600 bg-slate-50" value={task.domain} onChange={e => updateChartListItem('topRecruitTasks', task.id, { domain: e.target.value })} />
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{task.domain}</span>
                      )}
                    </td>
                    <td className="py-3 pl-2 text-right text-slate-600">
                      {isEditMode ? <input type="number" className="w-full border rounded px-1 text-right" value={task.target} onChange={e => updateChartListItem('topRecruitTasks', task.id, { target: Number(e.target.value) })} /> : task.target.toLocaleString()}
                    </td>
                    <td className="py-3 pl-2 text-right font-bold text-blue-600">
                      {isEditMode ? <input type="number" className="w-full border rounded px-1 text-right" value={task.applicants} onChange={e => updateChartListItem('topRecruitTasks', task.id, { applicants: Number(e.target.value) })} /> : task.applicants.toLocaleString()}
                    </td>
                    <td className="py-3 pl-2 text-right text-emerald-600">
                      {isEditMode ? <input type="number" className="w-full border rounded px-1 text-right" value={getApprovedWorkers(task)} onChange={e => updateChartListItem('topRecruitTasks', task.id, { approved: Number(e.target.value) })} /> : getApprovedWorkers(task).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-700">
                      {((task.target % 2) + 1.2).toFixed(1)}天
                    </td>
                    <td className="py-3 text-right text-slate-600">{task.target > 0 ? ((getApprovedWorkers(task) / task.target) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </EditableChartCard>
      )}
    </div>
  );
}
