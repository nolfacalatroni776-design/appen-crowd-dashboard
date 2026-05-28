import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { cohortData, platformOverviewData, userGrowthTrend } from '@/src/data/mockData';
import { metricTip } from '@/src/data/metricDefinitions';
import { Plus, Trash2 } from 'lucide-react';
import EditableChartCard from '@/src/components/EditableChartCard';
import MetricCard from '@/src/components/MetricCard';
import MetricInfo from '@/src/components/MetricInfo';
import { useDashboard } from '@/src/context/DashboardContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const toPercent = (value: number) => `${Number(value.toFixed(1))}%`;
const lifecycleStageTip = (stage: string) => {
  if (stage.includes('已流失')) return metricTip('lost_users_90d');
  return metricTip('lifecycle_stage_users');
};

export default function GrowthRetention() {
  const { isEditMode, chartLists, updateChartListItem, addChartListItem, removeChartListItem } = useDashboard();
  
  const getCohortColor = (val) => {
    if (!val) return 'bg-slate-50 text-slate-400';
    if (val > 50) return 'bg-emerald-500 text-white';
    if (val > 30) return 'bg-emerald-400 text-white';
    if (val > 15) return 'bg-amber-200 text-amber-900';
    return 'bg-red-200 text-red-900';
  };

  const lifecycleDataState = chartLists.lifecycle || [];
  const churnDataState = chartLists.churn || [];
  const lifecycleDurationDataState = chartLists.lifecycleDuration || [];
  const funnelDataState = chartLists.funnel || [];
  const funnelMetricKeys = [
    'funnel_new_registered_users',
    'funnel_applied_users_d30',
    'funnel_approved_users_d30',
    'funnel_task_started_users_d30',
    'funnel_d30_active_workers',
  ];
  const funnelBaseValue = Number(funnelDataState[0]?.value || 0);
  const funnelRows = funnelDataState.map((step, idx) => {
    const currentValue = Number(step.value || 0);
    const previousValue = Number(funnelDataState[idx - 1]?.value || currentValue);
    const stepRate = idx === 0 || previousValue === 0 ? 100 : (currentValue / previousValue) * 100;
    const cumulativeRate = funnelBaseValue === 0 ? 0 : (currentValue / funnelBaseValue) * 100;
    const loss = idx === 0 ? 0 : Math.max(previousValue - currentValue, 0);

    return {
      ...step,
      metricKey: funnelMetricKeys[idx] || 'funnel_step_conversion_rate',
      stepRate,
      cumulativeRate,
      loss,
    };
  });
  const largestLoss = funnelRows.slice(1).reduce((max, row) => row.loss > max.loss ? row : max, { loss: 0, name: '' } as any);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard id="gr-0" title="注册总用户数" value={platformOverviewData.totalUsers.toLocaleString()} change={0.08} changeLabel="较昨日" tooltip={metricTip('registered_users_total')} />
        <MetricCard id="gr-4" title="今日新增注册" value={`+${platformOverviewData.newUsers}`} change={platformOverviewData.newUsersChange} changeLabel="较昨日" tooltip={metricTip('new_registered_users')} />
        <MetricCard id="gr-5" title="DAU 今日活跃" value={platformOverviewData.dau.toLocaleString()} change={platformOverviewData.dauChange} changeLabel="较昨日" tooltip={metricTip('daily_active_users')} />
        <MetricCard id="gr-6" title="MAU 月活用户" value={platformOverviewData.mau.toLocaleString()} change={platformOverviewData.mauChange} changeLabel="较上月" isWarning tooltip={metricTip('monthly_active_users')} />
        <MetricCard id="gr-7" title="平台月活跃用户占比" value={`${platformOverviewData.activeRate}%`} change={-0.1} changeLabel="较上月" isWarning tooltip={metricTip('platform_active_rate')} />
        <MetricCard id="gr-1" title="新访客注册转化率" value="5.47%" change={-0.3} changeLabel="较昨日" isWarning tooltip={metricTip('registration_conversion_rate')} />
        <MetricCard id="gr-2" title="实名认证率" value="78.3%" change={-1.8} changeLabel="较昨日" isWarning tooltip={metricTip('real_name_verification_rate')} />
        <MetricCard id="gr-3" title="招募申请率" value="60.7%" change={-5.4} changeLabel="较昨日" isDanger tooltip={metricTip('recruit_apply_rate')} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <EditableChartCard id="gr-c0" title="用户增长趋势" tooltip={metricTip('new_registered_users', 'daily_active_users', 'inactive_90d_new_users')} className="col-span-1">
          <div className="h-64 w-full block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="new" name="新增注册" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="active" name="活跃用户" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="inactive90" name="90天未活跃用户" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>

        <EditableChartCard id="gr-funnel" title="新增用户 D30 转化漏斗" showTitleTooltip={false} className="col-span-1">
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="text-slate-400">入组用户</div>
                <div className="mt-0.5 font-semibold text-slate-700">近30天新增注册</div>
              </div>
              <div className="rounded border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="text-slate-400">观察窗口</div>
                <div className="mt-0.5 font-semibold text-slate-700">注册后30天</div>
              </div>
              <div className="rounded border border-amber-100 bg-amber-50 px-3 py-2">
                <div className="text-amber-600">最大流失</div>
                <div className="mt-0.5 font-semibold text-amber-700">
                  {largestLoss.name || '-'} {largestLoss.loss ? `-${Number(largestLoss.loss).toLocaleString()}人` : ''}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_76px_76px_76px_82px] items-center gap-2 text-[10px] font-medium text-slate-400">
              <div>阶段</div>
              <div className="text-right">人数</div>
              <div className="flex items-center justify-end">
                环节转化
                <MetricInfo tip={metricTip('funnel_step_conversion_rate')} align="right" />
              </div>
              <div className="flex items-center justify-end">
                累计转化
                <MetricInfo tip={metricTip('funnel_cumulative_conversion_rate')} align="right" />
              </div>
              <div className="flex items-center justify-end">
                较上一步
                <MetricInfo tip={metricTip('funnel_step_loss_users')} align="right" />
              </div>
            </div>

            {funnelRows.map((step, idx) => (
              <div key={step.id} className="relative group rounded-md border border-transparent p-2 -mx-2 hover:border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="grid grid-cols-[1fr_76px_76px_76px_82px] items-center gap-2 text-xs">
                  {isEditMode ? (
                    <div className="col-span-5 flex w-full gap-2 items-center">
                      <input className="font-medium text-slate-700 w-1/2 border rounded px-1 min-w-0" value={step.name} onChange={e => updateChartListItem('funnel', step.id, { name: e.target.value })} />
                      <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={step.value} onChange={e => updateChartListItem('funnel', step.id, { value: Number(e.target.value) })} />
                      <input className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={step.rate} onChange={e => updateChartListItem('funnel', step.id, { rate: e.target.value })} />
                      <button onClick={() => removeChartListItem('funnel', step.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="flex min-w-0 items-center font-medium text-slate-700">
                        <span className="mr-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-600">{idx + 1}</span>
                        <span className="truncate">{step.name}</span>
                        <MetricInfo tip={metricTip(funnelMetricKeys[idx] || 'registration_conversion_rate')} />
                      </span>
                      <span className="text-right font-semibold text-slate-700">{Number(step.value).toLocaleString()}人</span>
                      <span className="text-right text-slate-600">{toPercent(step.stepRate)}</span>
                      <span className="text-right font-semibold text-blue-600">{toPercent(step.cumulativeRate)}</span>
                      <span className={`text-right font-medium ${step.loss > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {idx === 0 ? '-' : `-${Number(step.loss).toLocaleString()}人`}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 h-2.5 bg-slate-100 rounded-sm overflow-hidden flex items-center">
                  <div 
                    className={`h-full transition-all duration-500 ${!isEditMode ? 'min-w-1' : ''}`} 
                    style={{ width: isEditMode ? '100%' : `${Math.max(step.cumulativeRate, 1)}%`, backgroundColor: step.color || '#3b82f6' }}
                  />
                </div>
              </div>
            ))}
            {isEditMode && (
              <button 
                onClick={() => addChartListItem('funnel', { name: '自定义阶段', value: 0, rate: '0%', color: '#94a3b8' })}
                className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 border border-dashed border-blue-300 rounded text-xs text-blue-500 hover:bg-blue-50"
              >
                <Plus className="w-3 h-3" /> 添加漏斗阶段
              </button>
            )}
          </div>
        </EditableChartCard>

        {/* Cohort Matrix */}
        <EditableChartCard id="gr-c1" title="用户留存矩阵 (Cohort)" showTitleTooltip={false} className="col-span-1">
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-500 border-b">
                    <th className="pb-2 font-medium">注册周期</th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center">
                        用户数
                        <MetricInfo tip={metricTip('cohort_users')} />
                      </div>
                    </th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center">
                        D1
                        <MetricInfo tip={metricTip('retention_d1')} />
                      </div>
                    </th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center">
                        D7
                        <MetricInfo tip={metricTip('retention_d7')} />
                      </div>
                    </th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center">
                        D14
                        <MetricInfo tip={metricTip('retention_d14')} />
                      </div>
                    </th>
                    <th className="pb-2 font-medium">
                      <div className="flex items-center">
                        D30
                        <MetricInfo tip={metricTip('retention_d30')} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cohortData.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-slate-700">{row.week}</td>
                      <td className="py-2 text-slate-600">{row.users}</td>
                      <td className="py-1"><div className={`px-2 py-1 rounded text-center ${getCohortColor(row.d1)}`}>{row.d1 ? `${row.d1}%` : '-'}</div></td>
                      <td className="py-1"><div className={`px-2 py-1 rounded text-center ${getCohortColor(row.d7)}`}>{row.d7 ? `${row.d7}%` : '-'}</div></td>
                      <td className="py-1"><div className={`px-2 py-1 rounded text-center ${getCohortColor(row.d14)}`}>{row.d14 ? `${row.d14}%` : '-'}</div></td>
                      <td className="py-1"><div className={`px-2 py-1 rounded text-center ${getCohortColor(row.d30)}`}>{row.d30 ? `${row.d30}%` : '-'}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-500">
              <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></div> {'>'}50%</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-emerald-400 rounded-sm mr-1"></div> 30-50%</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-amber-200 rounded-sm mr-1"></div> 15-30%</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-200 rounded-sm mr-1"></div> {'<'}15%</div>
            </div>
        </EditableChartCard>

        {/* Lifecycle */}
        <EditableChartCard id="gr-c2" title="用户生命周期阶段分布" showTitleTooltip={false} className="col-span-1">
            <div className="space-y-3 mt-2">
              {lifecycleDataState.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between text-xs hover:bg-slate-50 p-1 -mx-1 rounded-md transition-colors relative group">
                  {isEditMode ? (
                    <div className="flex w-full gap-2 items-center">
                      <input className="font-medium text-slate-700 w-1/3 border rounded px-1 min-w-0" value={item.stage || item.phase} onChange={e => updateChartListItem('lifecycle', item.id, { stage: e.target.value })} />
                      <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={item.count || item.users} onChange={e => updateChartListItem('lifecycle', item.id, { count: Number(e.target.value) })} />
                      <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={item.percent || 0} onChange={e => updateChartListItem('lifecycle', item.id, { percent: Number(e.target.value) })} />
                      <button onClick={() => removeChartListItem('lifecycle', item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <>
                      <div className="w-32 flex items-center font-medium text-slate-700">
                        {item.stage || item.phase}
                        <MetricInfo tip={lifecycleStageTip(item.stage || item.phase || '')} />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.status === 'warning' ? 'bg-amber-400' : item.status === 'danger' ? 'bg-red-400' : item.status === 'good' ? 'bg-emerald-400' : item.status === 'info' ? 'bg-slate-400' : 'bg-blue-400'}`}
                            style={{ width: `${Math.max(item.percent || 0, 1)}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right text-slate-500">{Number(item.count || item.users || 0).toLocaleString()}</div>
                      <div className="w-12 text-right font-medium">{item.percent || 0}%</div>
                    </>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button 
                  onClick={() => addChartListItem('lifecycle', { stage: '自定义阶段', count: 0, percent: 0, status: 'normal' })}
                  className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 border border-dashed border-blue-300 rounded text-xs text-blue-500 hover:bg-blue-50"
                >
                   <Plus className="w-3 h-3" /> 添加阶段
                </button>
              )}
            </div>
        </EditableChartCard>

        {/* Churn Analysis */}
        <EditableChartCard id="gr-c3" title="用户流失原因分析" showTitleTooltip={false} className="col-span-1">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-2xl font-bold text-slate-800">8.3%</div>
                <div className="flex items-center text-xs text-slate-500">
                  本月流失率
                  <MetricInfo tip={metricTip('stage_churn_rate')} />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-500 border-b">
                    <th className="pb-2 font-medium">跳出环节</th>
                    <th className="pb-2 font-medium text-right">
                      <div className="flex items-center justify-end">
                        流失人数
                        <MetricInfo tip={metricTip('stage_churn_users')} align="right" />
                      </div>
                    </th>
                    <th className="pb-2 font-medium text-right">
                      <div className="flex items-center justify-end">
                        流失率
                        <MetricInfo tip={metricTip('stage_churn_rate')} align="right" />
                      </div>
                    </th>
                    {isEditMode && <th className="pb-2 font-medium"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {churnDataState.map((row, i) => (
                    <tr key={row.id} className="hover:bg-slate-50 group">
                      {isEditMode ? (
                        <>
                          <td className="py-2"><input className="w-full border rounded px-1" value={row.stage} onChange={e => updateChartListItem('churn', row.id, { stage: e.target.value })} /></td>
                          <td className="py-2 pl-2"><input type="number" className="w-full border rounded px-1 text-right" value={row.count} onChange={e => updateChartListItem('churn', row.id, { count: Number(e.target.value) })} /></td>
                          <td className="py-2 pl-2"><input type="number" className="w-full border rounded px-1 text-right" value={row.rate} onChange={e => updateChartListItem('churn', row.id, { rate: Number(e.target.value) })} /></td>
                          <td className="py-2 text-right"><button onClick={() => removeChartListItem('churn', row.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button></td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 font-medium text-slate-700 whitespace-nowrap">{row.stage}</td>
                          <td className="py-2 text-right text-slate-600 whitespace-nowrap">{row.count}人</td>
                          <td className="py-2 pl-4 text-right">
                            <span className={`font-medium ${row.status === 'danger' ? 'text-red-600' : row.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {row.rate}%
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditMode && (
                <button 
                  onClick={() => addChartListItem('churn', { stage: '新环节', count: 0, rate: 0, status: 'normal' })}
                  className="w-full mt-2 py-1 flex items-center justify-center gap-1 border border-dashed border-blue-300 rounded text-xs text-blue-500 hover:bg-blue-50"
                >
                   <Plus className="w-3 h-3" /> 添加流失环节
                </button>
              )}
            </div>
        </EditableChartCard>

        {/* Average Lifecycle */}
        <EditableChartCard id="gr-c4" title="用户平均生命周期时长" showTitleTooltip={false} className="col-span-1">
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  平均生命周期
                  <MetricInfo tip={metricTip('avg_lifecycle_days')} />
                </div>
                <div className="text-lg font-bold text-slate-800">68.5天</div>
                <div className="text-[10px] text-emerald-600 mt-1">↑ 3天</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  注册→首单
                  <MetricInfo tip={metricTip('time_to_first_task_days')} />
                </div>
                <div className="text-lg font-bold text-slate-800">6.8天</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {lifecycleDurationDataState.map((item, i) => (
                <div key={item.id} className="relative group p-1 -mx-1 rounded-md hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center text-xs mb-1">
                    {isEditMode ? (
                      <div className="flex w-full gap-2 items-center">
                        <input className="font-medium text-slate-700 w-1/3 border rounded px-1 min-w-0" value={item.range} onChange={e => updateChartListItem('lifecycleDuration', item.id, { range: e.target.value })} />
                        <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={item.percent} onChange={e => updateChartListItem('lifecycleDuration', item.id, { percent: Number(e.target.value) })} />
                        <input className="text-slate-500 w-1/3 border rounded px-1 min-w-0" value={item.desc} onChange={e => updateChartListItem('lifecycleDuration', item.id, { desc: e.target.value })} />
                        <button onClick={() => removeChartListItem('lifecycleDuration', item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-slate-700">{item.range}</span>
                        <span className="text-slate-500">{item.percent}% <span className="text-slate-400 ml-1">({item.desc})</span></span>
                      </>
                    )}
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 min-w-1" 
                      style={{ width: isEditMode ? '100%' : `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              {isEditMode && (
                <button 
                  onClick={() => addChartListItem('lifecycleDuration', { range: '新时间段', percent: 0, desc: '描述' })}
                  className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 border border-dashed border-blue-300 rounded text-xs text-blue-500 hover:bg-blue-50"
                >
                   <Plus className="w-3 h-3" /> 添加占比区间
                </button>
              )}
            </div>
        </EditableChartCard>
      </div>
    </div>
  );
}
