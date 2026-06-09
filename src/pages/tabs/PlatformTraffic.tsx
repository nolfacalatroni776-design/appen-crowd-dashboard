import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import EditableChartCard from '@/src/components/EditableChartCard';
import { trafficKpiData, trafficTrendData, trafficSourceData, topPagesData, visitorDeviceData, domainTrafficData, taskTrafficData } from '@/src/data/mockData';
import { metricTip } from '@/src/data/metricDefinitions';
import MetricCard from '@/src/components/MetricCard';
import MetricInfo from '@/src/components/MetricInfo';
import TimeRangeControl, { defaultTimeRange, getTimeRangeDayCount, getTimeRangeMeta } from '@/src/components/TimeRangeControl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Download, Info } from 'lucide-react';

import { useDashboard } from '@/src/context/DashboardContext';

type TrafficDeviceFilter = 'total' | 'app' | 'web';

const trafficDeviceOptions: { value: TrafficDeviceFilter; label: string }[] = [
  { value: 'total', label: '设备端：总计' },
  { value: 'app', label: '设备端：App' },
  { value: 'web', label: '设备端：Web' },
];

const deviceProfiles: Record<TrafficDeviceFilter, {
  label: string;
  share: number;
  avgTime: string;
  uvChange: number;
  pvChange: number;
  avgTimeChange: number;
  bounceRate: number;
  bounceRateChange: number;
  recruitCtr: number;
  recruitCtrChange: number;
  actionMultiplier: number;
  recruitClickMultiplier: number;
  newVisitorShare: number;
  sourceMultipliers: Record<string, number>;
}> = {
  total: {
    label: '总计',
    share: 1,
    avgTime: trafficKpiData.avgTime,
    uvChange: trafficKpiData.uvChange,
    pvChange: trafficKpiData.pvChange,
    avgTimeChange: trafficKpiData.avgTimeChange,
    bounceRate: trafficKpiData.bounceRate,
    bounceRateChange: trafficKpiData.bounceRateChange,
    recruitCtr: trafficKpiData.recruitCtr,
    recruitCtrChange: trafficKpiData.recruitCtrChange,
    actionMultiplier: 1,
    recruitClickMultiplier: 1,
    newVisitorShare: 62,
    sourceMultipliers: {},
  },
  app: {
    label: 'App',
    share: 0.32,
    avgTime: '6m 18s',
    uvChange: 15.8,
    pvChange: 10.4,
    avgTimeChange: 18.6,
    bounceRate: 24.8,
    bounceRateChange: -3.0,
    recruitCtr: 46.7,
    recruitCtrChange: 4.1,
    actionMultiplier: 1.12,
    recruitClickMultiplier: 1.08,
    newVisitorShare: 58,
    sourceMultipliers: {
      直接访问: 0.86,
      搜索引擎: 0.78,
      外部链接: 0.82,
      社交媒体: 1.38,
      邮件营销: 0.95,
    },
  },
  web: {
    label: 'Web',
    share: 0.68,
    avgTime: '5m 25s',
    uvChange: 11.1,
    pvChange: 7.4,
    avgTimeChange: 13.2,
    bounceRate: 31.0,
    bounceRateChange: -1.6,
    recruitCtr: 40.5,
    recruitCtrChange: 2.8,
    actionMultiplier: 0.95,
    recruitClickMultiplier: 0.96,
    newVisitorShare: 64,
    sourceMultipliers: {
      直接访问: 1.06,
      搜索引擎: 1.09,
      外部链接: 1.07,
      社交媒体: 0.82,
      邮件营销: 1.02,
    },
  },
};

const scaleCount = (value: number, factor: number) => Math.max(0, Math.round(value * factor));
const clampPercent = (value: number) => Math.min(100, Math.max(0, Number(value.toFixed(1))));
const buildRangeTrend = (data: typeof trafficTrendData, dayCount: number, deviceShare: number) => {
  const rows = dayCount <= 7 ? data : Array.from({ length: Math.min(dayCount, 30) }, (_, idx) => {
    const base = data[idx % data.length];
    const cycle = Math.floor(idx / data.length);

    return {
      ...base,
      date: `${idx + 1}日`,
      pv: Math.round(base.pv * (1 + cycle * 0.06)),
      uv: Math.round(base.uv * (1 + cycle * 0.05)),
    };
  });

  return rows.map(item => ({
    ...item,
    pv: scaleCount(item.pv, deviceShare),
    uv: scaleCount(item.uv, deviceShare),
  }));
};

const buildScaledSourceData = (deviceFilter: TrafficDeviceFilter, share: number) => {
  const multipliers = deviceProfiles[deviceFilter].sourceMultipliers;
  const scaled = trafficSourceData.map(item => ({
    ...item,
    value: scaleCount(item.value, share * (multipliers[item.name] ?? 1)),
  }));
  const total = scaled.reduce((sum, item) => sum + item.value, 0);

  return scaled.map(item => ({
    ...item,
    percent: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
  }));
};

export default function PlatformTraffic() {
  const { isEditMode, chartLists, updateChartListItem } = useDashboard();
  const [deviceFilter, setDeviceFilter] = React.useState<TrafficDeviceFilter>('total');
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange);
  const deviceProfile = deviceProfiles[deviceFilter];
  const timeMeta = getTimeRangeMeta(timeRange);
  const dayCount = getTimeRangeDayCount(timeRange);
  const rangeFactor = dayCount;
  const topPagesDataState = chartLists.topPages || topPagesData;
  const trafficKpi = {
    uv: scaleCount(trafficKpiData.uv, deviceProfile.share * rangeFactor),
    pv: scaleCount(trafficKpiData.pv, deviceProfile.share * rangeFactor),
    avgTime: deviceProfile.avgTime,
    uvChange: deviceProfile.uvChange,
    pvChange: deviceProfile.pvChange,
    avgTimeChange: deviceProfile.avgTimeChange,
    bounceRate: deviceProfile.bounceRate,
    bounceRateChange: deviceProfile.bounceRateChange,
    recruitCtr: deviceProfile.recruitCtr,
    recruitCtrChange: deviceProfile.recruitCtrChange,
    recruitChannelClicks: scaleCount(2860, deviceProfile.share * deviceProfile.actionMultiplier * rangeFactor),
    recruitSearchSubmits: scaleCount(742, deviceProfile.share * deviceProfile.actionMultiplier * rangeFactor),
    loginIntentClicks: scaleCount(1126, deviceProfile.share * deviceProfile.actionMultiplier * rangeFactor),
  };
  const trafficTrendDataByDevice = buildRangeTrend(trafficTrendData, dayCount, deviceProfile.share);
  const trafficSourceDataByDevice = buildScaledSourceData(deviceFilter, deviceProfile.share);
  const topPagesDataByDevice = topPagesDataState.map(row => ({
    ...row,
    pv: isEditMode ? row.pv : scaleCount(row.pv, deviceProfile.share * rangeFactor),
    uv: isEditMode ? row.uv : scaleCount(row.uv, deviceProfile.share * rangeFactor),
    bounce: isEditMode ? row.bounce : clampPercent(row.bounce + (deviceProfile.bounceRate - trafficKpiData.bounceRate)),
  }));
  const visitorDataByDevice = [
    { ...visitorDeviceData.visitor[0], value: deviceProfile.newVisitorShare },
    { ...visitorDeviceData.visitor[1], value: 100 - deviceProfile.newVisitorShare },
  ];
  const deviceDistributionData = deviceFilter === 'total'
    ? visitorDeviceData.device
    : visitorDeviceData.device
        .filter(item => item.name.toLowerCase() === deviceFilter)
        .map(item => ({ ...item, value: 100 }));
  const domainTrafficDataByDevice = domainTrafficData.map(row => ({
    ...row,
    pv: scaleCount(row.pv, deviceProfile.share * rangeFactor),
    uv: scaleCount(row.uv, deviceProfile.share * rangeFactor),
  }));
  const taskTrafficDataByDevice = taskTrafficData.map(task => {
    const pv = scaleCount(task.pv, deviceProfile.share * rangeFactor);
    const uv = scaleCount(task.uv, deviceProfile.share * rangeFactor);
    const clicks = scaleCount(task.clicks, deviceProfile.share * deviceProfile.recruitClickMultiplier * rangeFactor);
    const ctr = pv > 0 ? (clicks / pv) * 100 : 0;

    return { ...task, pv, uv, clicks, ctr };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">平台流量统计</h2>
          <p className="text-sm text-slate-500 mt-1">按所选统计时间查看平台页面访问量、用户行为及来源分布 · 当前设备端：{deviceProfile.label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <TimeRangeControl value={timeRange} onChange={setTimeRange} />
          <select
            className="h-9 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm outline-none transition hover:border-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            value={deviceFilter}
            onChange={(event) => setDeviceFilter(event.target.value as TrafficDeviceFilter)}
            aria-label="设备端筛选"
          >
            {trafficDeviceOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard id="pt-1" title="UV (独立访客)" value={trafficKpi.uv.toLocaleString()} change={trafficKpi.uvChange} changeLabel={timeMeta.compareLabel} tooltip={metricTip('unique_visitors')} />
        <MetricCard id="pt-2" title="PV (页面浏览量)" value={trafficKpi.pv.toLocaleString()} change={trafficKpi.pvChange} changeLabel={timeMeta.compareLabel} tooltip={metricTip('page_views')} />
        <MetricCard id="pt-3" title="人均停留时长" value={trafficKpi.avgTime} change={trafficKpi.avgTimeChange} changeLabel={timeMeta.compareLabel} tooltip={metricTip('avg_session_duration')} />
        <MetricCard id="pt-4" title="整体跳出率" value={`${trafficKpi.bounceRate}%`} change={trafficKpi.bounceRateChange} changeLabel={timeMeta.compareLabel} tooltip={metricTip('bounce_rate')} />
        <MetricCard id="pt-5" title="招募单点击率" value={`${trafficKpi.recruitCtr}%`} change={trafficKpi.recruitCtrChange} changeLabel={timeMeta.compareLabel} tooltip={metricTip('recruit_sheet_ctr')} />
        <MetricCard id="pt-6" title="招募频道点击" value={`${trafficKpi.recruitChannelClicks.toLocaleString()}次`} change={9.6} changeLabel={timeMeta.compareLabel} tooltip={metricTip('recruit_channel_tab_clicks')} />
        <MetricCard id="pt-7" title="招募单搜索次数" value={`${trafficKpi.recruitSearchSubmits.toLocaleString()}次`} change={6.4} changeLabel={timeMeta.compareLabel} tooltip={metricTip('recruit_search_submits')} />
        <MetricCard id="pt-8" title="登录意向点击" value={`${trafficKpi.loginIntentClicks.toLocaleString()}次`} change={11.8} changeLabel={timeMeta.compareLabel} tooltip={metricTip('login_intent_clicks')} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <EditableChartCard id="pt-c1" title="流量趋势分析" tooltip={metricTip('page_views', 'unique_visitors', 'bounce_rate')} className="col-span-2">
          <div className="flex justify-end mb-2">
              <div className="flex space-x-2 text-xs">
                <button className="px-2 py-1 bg-teal-50 text-teal-700 rounded font-medium">PV/UV趋势</button>
                <button className="px-2 py-1 text-slate-500 hover:bg-slate-50 rounded">跳出率趋势</button>
              </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficTrendDataByDevice} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} verticalAlign="bottom" height={36} />
                <Line type="monotone" dataKey="pv" name="PV" stroke="#14b8a6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="uv" name="UV" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>

        <EditableChartCard id="pt-c2" title="流量来源分布" tooltip={metricTip('traffic_source_share')} className="col-span-1">
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceDataByDevice}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {trafficSourceDataByDevice.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {trafficSourceDataByDevice.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-slate-800">{item.value.toLocaleString()}</span>
                    <span className="text-slate-500 w-8 text-right">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
        </EditableChartCard>

        <EditableChartCard id="pt-c3" title="受访页面排行" showTitleTooltip={false} className="col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-500 border-b">
                    <th className="pb-3 font-medium">页面名称</th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        浏览量(PV)
                        <MetricInfo tip={metricTip('page_views')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        访客数(UV)
                        <MetricInfo tip={metricTip('unique_visitors')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        平均停留
                        <MetricInfo tip={metricTip('avg_session_duration')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        跳出率
                        <MetricInfo tip={metricTip('bounce_rate')} align="right" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topPagesDataByDevice.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="py-3">
                        {isEditMode ? (
                          <div className="flex flex-col gap-1">
                            <input className="font-medium text-slate-800 border rounded px-1" value={row.name} onChange={e => updateChartListItem('topPages', row.id, { name: e.target.value })} />
                            <input className="text-xs text-slate-400 border rounded px-1" value={row.path} onChange={e => updateChartListItem('topPages', row.id, { path: e.target.value })} />
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-slate-800">{row.name}</div>
                            <div className="text-xs text-slate-400">{row.path}</div>
                          </>
                        )}
                      </td>
                      <td className="py-3 pl-2 text-right font-medium text-slate-700">
                        {isEditMode ? <input type="number" className="w-full border rounded px-1 text-right" value={row.pv} onChange={e => updateChartListItem('topPages', row.id, { pv: Number(e.target.value) })} /> : row.pv.toLocaleString()}
                      </td>
                      <td className="py-3 pl-2 text-right text-slate-600">
                        {isEditMode ? <input type="number" className="w-full border rounded px-1 text-right" value={row.uv} onChange={e => updateChartListItem('topPages', row.id, { uv: Number(e.target.value) })} /> : row.uv.toLocaleString()}
                      </td>
                      <td className="py-3 pl-2 text-right text-slate-600">
                        {isEditMode ? <input className="w-full border rounded px-1 text-right" value={row.time} onChange={e => updateChartListItem('topPages', row.id, { time: e.target.value })} /> : row.time}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <div className="flex items-center justify-end whitespace-nowrap">
                          {isEditMode ? (
                            <input type="number" className="w-16 border rounded px-1 text-right ml-2" value={row.bounce} onChange={e => updateChartListItem('topPages', row.id, { bounce: Number(e.target.value) })} />
                          ) : (
                            <>
                              <span className="mr-2 text-slate-600">{row.bounce}%</span>
                              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500"
                                  style={{ width: `${row.bounce}%` }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </EditableChartCard>

        <EditableChartCard id="pt-c4" title="访客 & 设备分析" tooltip={metricTip('new_returning_visitor_share', 'device_share', 'unique_visitors')} className="col-span-1">
            <div className="mb-6">
              <div className="mb-2 flex items-center text-xs font-medium text-slate-500">
                新老访客比例
                <MetricInfo tip={metricTip('new_returning_visitor_share')} />
              </div>
              <div className="flex items-center">
                <div className="w-24 h-24 relative mr-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitorDataByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {visitorDataByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 flex-1">
                  {visitorDataByDevice.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center text-xs font-medium text-slate-500">
                设备终端分布
                <MetricInfo tip={metricTip('device_share')} />
              </div>
              <div className="space-y-4">
                {deviceDistributionData.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </EditableChartCard>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <EditableChartCard id="pt-c5" title="各领域招募单访问情况" tooltip={metricTip('page_views', 'unique_visitors')} className="col-span-1">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainTrafficDataByDevice} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="pv" name="PV (浏览量)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="uv" name="UV (独立访客)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </EditableChartCard>

        <EditableChartCard id="pt-c6" title="招募单访问情况 TOP10" showTitleTooltip={false} className="col-span-1">
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-500 border-b">
                    <th className="pb-3 font-medium w-12 text-center">排名</th>
                    <th className="pb-3 font-medium">招募单名称</th>
                    <th className="pb-3 font-medium">业务领域</th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        PV
                        <MetricInfo tip={metricTip('page_views')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        UV
                        <MetricInfo tip={metricTip('unique_visitors')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        点击量
                        <MetricInfo tip={metricTip('recruit_card_clicks')} align="right" />
                      </div>
                    </th>
                    <th className="pb-3 font-medium text-right">
                      <div className="flex items-center justify-end">
                        转化率
                        <MetricInfo tip={metricTip('recruit_sheet_ctr')} align="right" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {taskTrafficDataByDevice.map((task, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${i < 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="font-medium text-slate-800 truncate max-w-[150px]" title={task.name}>{task.name}</div>
                        <div className="text-xs text-slate-400">{task.id}</div>
                      </td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{task.domain}</span>
                      </td>
                      <td className="py-2 text-right font-medium text-slate-700">{task.pv.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-teal-700">{task.uv.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-slate-700">{task.clicks.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-emerald-600">{task.ctr.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </EditableChartCard>
      </div>
    </div>
  );
}
