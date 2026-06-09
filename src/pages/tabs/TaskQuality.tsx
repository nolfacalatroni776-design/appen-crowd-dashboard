import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { dataOutputTrend, qualityTrend } from '@/src/data/mockData';
import { metricTip } from '@/src/data/metricDefinitions';
import { Plus, Trash2 } from 'lucide-react';
import MetricCard from '@/src/components/MetricCard';
import EditableChartCard from '@/src/components/EditableChartCard';
import MetricInfo from '@/src/components/MetricInfo';
import TimeRangeControl, { defaultTimeRange, getTimeRangeDayCount, getTimeRangeMeta } from '@/src/components/TimeRangeControl';
import { useDashboard } from '@/src/context/DashboardContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TaskQuality() {
  const { isEditMode, chartLists, updateChartListItem, addChartListItem, removeChartListItem } = useDashboard();
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const timeMeta = getTimeRangeMeta(timeRange);
  const dayCount = getTimeRangeDayCount(timeRange);
  const rangeFactor = dayCount;
  const errorTypeDataState = chartLists.errorType || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">任务&质量</h2>
          <p className="text-sm text-slate-500 mt-1">提交类指标按所选统计时间计算，质量类指标按质检完成时间统计，状态类指标展示统计期末快照</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <TimeRangeControl value={timeRange} onChange={setTimeRange} />
          <select
            className="h-9 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm outline-none transition hover:border-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            defaultValue="全部任务类型"
            aria-label="任务类型筛选"
          >
            <option value="全部任务类型">全部任务类型</option>
            <option value="标注任务">标注任务</option>
            <option value="采集任务">采集任务</option>
            <option value="审核任务">审核任务</option>
            <option value="质检任务">质检任务</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard id="tq-1" title="进行中任务数" value="1,169个" change={0} changeLabel="占任务总量30%" tooltip={metricTip('active_tasks')} />
        <MetricCard id="tq-2" title="参与人数" value="8,245人" change={10} changeLabel="较上周" tooltip={metricTip('task_participants')} />
        <MetricCard id="tq-3" title="提交量" value={`${Math.round(45023 * rangeFactor).toLocaleString()}条`} change={12} changeLabel={timeMeta.compareLabel} tooltip={metricTip('total_submissions')} />
        <MetricCard id="tq-4" title="标注质检通过率" value="89.2%" change={1.3} changeLabel={timeMeta.compareLabel} tooltip={metricTip('labeling_qc_pass_rate')} />

        <MetricCard id="tq-5" title="返工率" value="7.8%" change={0} changeLabel={timeMeta.compareLabel} isWarning tooltip={metricTip('rework_rate')} />
        <MetricCard id="tq-7" title="人均日产能" value="38.2条" change={-4.5} changeLabel={timeMeta.compareLabel} isWarning tooltip={metricTip('avg_daily_output_per_worker')} />
        <MetricCard id="tq-8" title="采集质检通过率" value="85.2%" change={2.1} changeLabel={timeMeta.compareLabel} tooltip={metricTip('collection_qc_pass_rate')} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <EditableChartCard id="tq-c0" title="数据产出趋势" tooltip={metricTip('labeling_submissions', 'collection_submissions')} className="col-span-1">
          <div className="h-72 w-full block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataOutputTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="labelingSubmissions" name="标注提交数据条数" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="collectionSubmissions" name="采集提交数据条数" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>

        <EditableChartCard id="tq-c3" title="后续质检通过率趋势" tooltip={metricTip('followup_qc_pass_rate')} className="col-span-1">
          <div className="h-72 w-full block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="followupQcPassRate" name="后续质检通过率" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>

        <EditableChartCard id="tq-c2" title="错误类型分布" showTitleTooltip={false} className="col-span-1">
            <div className="space-y-4 mt-2">
              {errorTypeDataState.map((item, i) => (
                <div key={item.id} className="relative group p-1 -mx-1 rounded-md hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center text-xs mb-1">
                    {isEditMode ? (
                      <div className="flex w-full gap-2 items-center">
                        <input className="font-medium text-slate-700 w-1/3 border rounded px-1 min-w-0" value={item.type} onChange={e => updateChartListItem('errorType', item.id, { type: e.target.value })} />
                        <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={item.percent} onChange={e => updateChartListItem('errorType', item.id, { percent: Number(e.target.value) })} />
                        <input type="number" className="text-slate-500 w-1/4 border rounded px-1 text-right min-w-0" value={item.count} onChange={e => updateChartListItem('errorType', item.id, { count: Number(e.target.value) })} />
                        <button onClick={() => removeChartListItem('errorType', item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="flex items-center font-medium text-slate-700">
                          {item.type}
                          <MetricInfo tip={metricTip('error_type_rate')} />
                        </span>
                        <span className="flex items-center text-slate-500">
                          {item.percent}% ({Number(item.count).toLocaleString()}条)
                          <MetricInfo tip={metricTip('error_type_rate')} align="right" />
                        </span>
                      </>
                    )}
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 min-w-1"
                      style={{ width: isEditMode ? '100%' : `${item.percent}%` }}
                    />
                  </div>
                  {isEditMode ? (
                    <div className="mt-1 flex items-center text-[10px]">
                      <span className="text-slate-400 mr-2">主要责任:</span>
                      <input className="flex-1 border rounded px-1" value={item.group} onChange={e => updateChartListItem('errorType', item.id, { group: e.target.value })} />
                    </div>
                  ) : (
                    <div className="flex items-center text-[10px] text-slate-400 mt-1">
                      主要责任: {item.group}
                      <MetricInfo tip={metricTip('new_worker_error_share')} />
                    </div>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button
                  onClick={() => addChartListItem('errorType', { type: '新错误类型', percent: 0, count: 0, group: '描述' })}
                  className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 border border-dashed border-teal-300 rounded text-xs text-teal-600 hover:bg-teal-50"
                >
                   <Plus className="w-3 h-3" /> 添加错误类型
                </button>
              )}
            </div>
        </EditableChartCard>
      </div>
    </div>
  );
}
