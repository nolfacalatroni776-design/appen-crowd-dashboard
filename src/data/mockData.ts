export const platformOverviewData = {
  totalUsers: 320392,
  totalUsersChange: 247,
  dau: 915,
  dauChange: 12,
  newUsers: 247,
  newUsersChange: 8,
  mau: 12450,
  mauChange: -3,
  activeRate: 3.89,
  activeRateTarget: 4,
  dailySubmissions: 45023,
  dailySubmissionsChange: 8,
  qualityPassRate: 89.2,
  qualityPassRateChange: 1.3,
  recruitGap: 6271,
  recruitGapRate: 45.9,
};

export const funnelData = [
  { name: '新注册用户', value: 847, rate: 100 },
  { name: '完成实名认证', value: 612, rate: 72.3 },
  { name: '提交招募申请', value: 346, rate: 56.5 },
  { name: '招募通过', value: 214, rate: 61.8 },
  { name: '首次任务执行', value: 158, rate: 73.8 },
];

export const userGrowthTrend = [
  { date: '11/1', new: 150, active: 400, inactive90: 50 },
  { date: '11/2', new: 200, active: 450, inactive90: 60 },
  { date: '11/3', new: 180, active: 420, inactive90: 55 },
  { date: '11/4', new: 250, active: 500, inactive90: 70 },
  { date: '11/5', new: 300, active: 600, inactive90: 80 },
  { date: '11/6', new: 280, active: 580, inactive90: 75 },
  { date: '11/7', new: 350, active: 700, inactive90: 90 },
];

export const dataOutputTrend = [
  { date: '11/1', labelingSubmissions: 15600, collectionSubmissions: 4400 },
  { date: '11/2', labelingSubmissions: 18200, collectionSubmissions: 6800 },
  { date: '11/3', labelingSubmissions: 16400, collectionSubmissions: 5600 },
  { date: '11/4', labelingSubmissions: 22500, collectionSubmissions: 7500 },
  { date: '11/5', labelingSubmissions: 26700, collectionSubmissions: 8300 },
  { date: '11/6', labelingSubmissions: 24100, collectionSubmissions: 7900 },
  { date: '11/7', labelingSubmissions: 33800, collectionSubmissions: 11200 },
];

export const recruitTrend = [
  { date: '11/1', applyRate: 50, passRate: 55 },
  { date: '11/2', applyRate: 52, passRate: 58 },
  { date: '11/3', applyRate: 48, passRate: 54 },
  { date: '11/4', applyRate: 55, passRate: 60 },
  { date: '11/5', applyRate: 58, passRate: 62 },
  { date: '11/6', applyRate: 56, passRate: 61 },
  { date: '11/7', applyRate: 60.7, passRate: 62.9 },
];

export const qualityTrend = [
  { date: '11/1', followupQcPassRate: 94.0 },
  { date: '11/2', followupQcPassRate: 94.7 },
  { date: '11/3', followupQcPassRate: 93.6 },
  { date: '11/4', followupQcPassRate: 95.1 },
  { date: '11/5', followupQcPassRate: 95.7 },
  { date: '11/6', followupQcPassRate: 95.4 },
  { date: '11/7', followupQcPassRate: 96.0 },
];

export const cohortData = [
  { week: '10月 W1', users: 534, verified: 431, applied: 292, approved: 188, taskStarted: 154, d1: 52.1, d7: 28.3, d14: 18.5, d30: 12.1 },
  { week: '10月 W2', users: 612, verified: 479, applied: 315, approved: 197, taskStarted: 164, d1: 49.8, d7: 26.1, d14: 17.2, d30: 11.8 },
  { week: '10月 W3', users: 488, verified: 391, applied: 272, approved: 176, taskStarted: 147, d1: 55.3, d7: 30.2, d14: 19.8, d30: 12.5 },
  { week: '10月 W4', users: 723, verified: 552, applied: 337, approved: 211, taskStarted: 179, d1: 50.9, d7: 27.6, d14: 18.1, d30: null },
  { week: '11月 W1', users: 847, verified: 612, applied: 346, approved: 214, taskStarted: 158, d1: 53.4, d7: 29.1, d14: null, d30: null },
];

export const lifecycleData = [
  { stage: '新注册', count: 2474, percent: 0.77, trend: 15, status: 'normal' },
  { stage: '待实名认证', count: 538, percent: 0.17, trend: 8, status: 'normal' },
  { stage: '未申请过招募', count: 1399, percent: 0.44, trend: -5, status: 'warning' },
  { stage: '招募审核中', count: 1175, percent: 0.37, trend: 0, status: 'normal' },
  { stage: '招募申请通过', count: 739, percent: 0.23, trend: -12, status: 'warning' },
  { stage: '活跃执行中', count: 8245, percent: 2.57, trend: 3, status: 'good' },
  { stage: '30日未活跃', count: 45230, percent: 14.12, trend: 2, status: 'warning' },
  { stage: '60日沉睡', count: 127580, percent: 39.82, trend: 5, status: 'danger' },
  { stage: '已流失(90天未活跃)', count: 133012, percent: 41.51, trend: 1, status: 'info' },
];

export const domainRecruitData = [
  { domain: '医疗影像', tasks: 15, target: 2500, applicants: 1500, current: 900, gap: 1600, gapRate: 64.0, applyRate: 8.2, passRate: 58.3, onboardRate: 85.1, status: 'danger' },
  { domain: '语音合成', tasks: 12, target: 1800, applicants: 1200, current: 780, gap: 1020, gapRate: 56.7, applyRate: 10.1, passRate: 61.2, onboardRate: 88.4, status: 'danger' },
  { domain: '自动驾驶', tasks: 20, target: 3200, applicants: 2800, current: 1820, gap: 1380, gapRate: 43.1, applyRate: 12.3, passRate: 65.8, onboardRate: 91.2, status: 'warning' },
  { domain: '文本情感', tasks: 18, target: 2100, applicants: 1900, current: 1340, gap: 760, gapRate: 36.2, applyRate: 14.5, passRate: 68.1, onboardRate: 93.6, status: 'warning' },
  { domain: '图像标注', tasks: 22, target: 2800, applicants: 3100, current: 2250, gap: 550, gapRate: 19.6, applyRate: 18.2, passRate: 71.3, onboardRate: 95.8, status: 'good' },
  { domain: 'NLP任务', tasks: 11, target: 1265, applicants: 1800, current: 1304, gap: 0, gapRate: 0, applyRate: 22.4, passRate: 73.5, onboardRate: 98.6, status: 'good' },
];

export const topRecruitTasks = [
  { id: 'R-20261101', name: '自动驾驶街景3D点云标注', domain: '自动驾驶', recruitStatus: '招募中', target: 500, applicants: 1250, reviewed: 638, approved: 420, passRate: 65.8 },
  { id: 'R-20261102', name: '方言语音采集与转写', domain: '语音合成', recruitStatus: '审核中', target: 300, applicants: 980, reviewed: 458, approved: 280, passRate: 61.2 },
  { id: 'R-20261103', name: '医疗CT影像病灶框选', domain: '医疗影像', recruitStatus: '招募中', target: 400, applicants: 850, reviewed: 257, approved: 150, passRate: 58.3 },
  { id: 'R-20261104', name: '电商评论情感极性分类', domain: '文本情感', recruitStatus: '已完成', target: 200, applicants: 760, reviewed: 279, approved: 190, passRate: 68.1 },
  { id: 'R-20261105', name: '自动驾驶车辆行为预测', domain: '自动驾驶', recruitStatus: '已暂停', target: 600, applicants: 720, reviewed: 471, approved: 310, passRate: 65.8 },
  { id: 'R-20261106', name: '多语种机器翻译语料对齐', domain: 'NLP任务', recruitStatus: '招募中', target: 150, applicants: 650, reviewed: 163, approved: 120, passRate: 73.5 },
  { id: 'R-20261107', name: '商品图像多标签分类', domain: '图像标注', recruitStatus: '已完成', target: 250, applicants: 580, reviewed: 337, approved: 240, passRate: 71.3 },
  { id: 'R-20261108', name: '智能客服对话意图识别', domain: 'NLP任务', recruitStatus: '审核中', target: 200, applicants: 520, reviewed: 245, approved: 180, passRate: 73.5 },
  { id: 'R-20261109', name: '骨科X光片关键点标注', domain: '医疗影像', recruitStatus: '已暂停', target: 300, applicants: 490, reviewed: 189, approved: 110, passRate: 58.3 },
  { id: 'R-20261110', name: '车载语音指令唤醒词采集', domain: '语音合成', recruitStatus: '招募中', target: 400, applicants: 450, reviewed: 420, approved: 350, passRate: 83.3 },
];

export const domainEfficiencyData = [
  { domain: '文本情感', tasks: 285, users: 2120, output: 95400, efficiency: 45.0, passRate: 93.5, reworkRate: 3.8, status: 'good' },
  { domain: '图像标注', tasks: 423, users: 3450, output: 158430, efficiency: 45.9, passRate: 91.2, reworkRate: 5.2, status: 'good' },
  { domain: 'NLP任务', tasks: 156, users: 890, output: 31640, efficiency: 35.6, passRate: 87.4, reworkRate: 8.1, status: 'warning' },
  { domain: '自动驾驶', tasks: 185, users: 1120, output: 24640, efficiency: 22.0, passRate: 82.3, reworkRate: 12.5, status: 'danger' },
  { domain: '医疗影像', tasks: 78, users: 452, output: 4688, efficiency: 10.4, passRate: 88.5, reworkRate: 7.2, status: 'warning' },
  { domain: '语音合成', tasks: 42, users: 213, output: 363, efficiency: 1.7, passRate: 79.2, reworkRate: 15.3, status: 'danger' },
];

export const errorTypeData = [
  { type: '边界框不精确', percent: 40.0, count: 9832, group: '新用户占65%' },
  { type: '类别选择错误', percent: 30.0, count: 7374, group: '跨领域用户占48%' },
  { type: '属性漏标', percent: 15.0, count: 3687, group: '低活跃用户占52%' },
  { type: '规则理解错误', percent: 10.0, count: 2458, group: '各阶段均匀分布' },
  { type: '其他', percent: 5.0, count: 1231, group: '-' },
];

export const churnData = [
  { stage: '新注册→认证', count: 537, rate: 21.7, status: 'normal' },
  { stage: '认证→申请', count: 762, rate: 39.3, status: 'danger' },
  { stage: '申请→通过', count: 436, rate: 37.1, status: 'warning' },
  { stage: '通过→任务执行', count: 109, rate: 14.8, status: 'good' },
  { stage: '任务执行→7日活跃', count: 345, rate: 54.7, status: 'danger' },
];

export const lifecycleDurationData = [
  { range: '<7天(短暂)', percent: 38.2, desc: '一次性用户' },
  { range: '7-30天', percent: 26.5, desc: '短期参与' },
  { range: '30-90天', percent: 18.3, desc: '中期稳定' },
  { range: '90-180天', percent: 11.2, desc: '长期活跃' },
  { range: '>180天', percent: 5.8, desc: '核心留存' },
];

export const recruitTrendByDomain: Record<string, any[]> = {
  '全部领域': [
    { date: '11/1', applyRate: 14.2, passRate: 60.1, onboardRate: 80.5 },
    { date: '11/2', applyRate: 12.8, passRate: 61.5, onboardRate: 82.3 },
    { date: '11/3', applyRate: 12.5, passRate: 59.8, onboardRate: 81.2 },
    { date: '11/4', applyRate: 11.2, passRate: 62.4, onboardRate: 83.5 },
    { date: '11/5', applyRate: 10.8, passRate: 64.1, onboardRate: 85.6 },
    { date: '11/6', applyRate: 11.0, passRate: 63.5, onboardRate: 84.8 },
    { date: '11/7', applyRate: 11.7, passRate: 62.9, onboardRate: 84.9 },
  ],
  '医疗影像': [
    { date: '11/1', applyRate: 10.2, passRate: 56.1, onboardRate: 75.5 },
    { date: '11/2', applyRate: 9.8,  passRate: 57.5, onboardRate: 78.3 },
    { date: '11/3', applyRate: 8.5,  passRate: 55.8, onboardRate: 77.2 },
    { date: '11/4', applyRate: 7.2,  passRate: 58.4, onboardRate: 76.5 },
    { date: '11/5', applyRate: 6.8,  passRate: 59.1, onboardRate: 78.6 },
    { date: '11/6', applyRate: 7.0,  passRate: 58.5, onboardRate: 77.8 },
    { date: '11/7', applyRate: 8.2,  passRate: 58.3, onboardRate: 85.1 },
  ],
  '自动驾驶': [
    { date: '11/1', applyRate: 15.2, passRate: 65.1, onboardRate: 85.5 },
    { date: '11/2', applyRate: 14.8, passRate: 66.5, onboardRate: 86.3 },
    { date: '11/3', applyRate: 13.5, passRate: 63.8, onboardRate: 84.2 },
    { date: '11/4', applyRate: 12.2, passRate: 66.4, onboardRate: 86.5 },
    { date: '11/5', applyRate: 11.8, passRate: 68.1, onboardRate: 88.6 },
    { date: '11/6', applyRate: 12.0, passRate: 67.5, onboardRate: 89.8 },
    { date: '11/7', applyRate: 12.3, passRate: 65.8, onboardRate: 91.2 },
  ],
  '语音合成': [
    { date: '11/1', applyRate: 12.2, passRate: 58.1, onboardRate: 82.5 },
    { date: '11/2', applyRate: 11.8, passRate: 59.5, onboardRate: 84.3 },
    { date: '11/3', applyRate: 11.5, passRate: 57.8, onboardRate: 83.2 },
    { date: '11/4', applyRate: 10.2, passRate: 60.4, onboardRate: 85.5 },
    { date: '11/5', applyRate: 9.8,  passRate: 62.1, onboardRate: 87.6 },
    { date: '11/6', applyRate: 10.0, passRate: 61.5, onboardRate: 86.8 },
    { date: '11/7', applyRate: 10.1, passRate: 61.2, onboardRate: 88.4 },
  ],
  '文本情感': [
    { date: '11/1', applyRate: 16.2, passRate: 64.1, onboardRate: 88.5 },
    { date: '11/2', applyRate: 15.8, passRate: 65.5, onboardRate: 89.3 },
    { date: '11/3', applyRate: 14.5, passRate: 63.8, onboardRate: 87.2 },
    { date: '11/4', applyRate: 13.2, passRate: 66.4, onboardRate: 89.5 },
    { date: '11/5', applyRate: 12.8, passRate: 68.1, onboardRate: 91.6 },
    { date: '11/6', applyRate: 13.0, passRate: 67.5, onboardRate: 92.8 },
    { date: '11/7', applyRate: 14.5, passRate: 68.1, onboardRate: 93.6 },
  ],
  '图像标注': [
    { date: '11/1', applyRate: 19.2, passRate: 67.1, onboardRate: 90.5 },
    { date: '11/2', applyRate: 18.8, passRate: 68.5, onboardRate: 92.3 },
    { date: '11/3', applyRate: 17.5, passRate: 66.8, onboardRate: 91.2 },
    { date: '11/4', applyRate: 16.2, passRate: 69.4, onboardRate: 93.5 },
    { date: '11/5', applyRate: 15.8, passRate: 71.1, onboardRate: 95.6 },
    { date: '11/6', applyRate: 16.0, passRate: 70.5, onboardRate: 94.8 },
    { date: '11/7', applyRate: 18.2, passRate: 71.3, onboardRate: 95.8 },
  ],
  'NLP任务': [
    { date: '11/1', applyRate: 23.2, passRate: 69.1, onboardRate: 93.5 },
    { date: '11/2', applyRate: 22.8, passRate: 70.5, onboardRate: 95.3 },
    { date: '11/3', applyRate: 21.5, passRate: 68.8, onboardRate: 94.2 },
    { date: '11/4', applyRate: 20.2, passRate: 71.4, onboardRate: 96.5 },
    { date: '11/5', applyRate: 19.8, passRate: 73.1, onboardRate: 98.6 },
    { date: '11/6', applyRate: 20.0, passRate: 72.5, onboardRate: 97.8 },
    { date: '11/7', applyRate: 22.4, passRate: 73.5, onboardRate: 98.6 },
  ]
};

export const reviewCycleData = {
  average: 3.8,
  target: 3,
  domains: [
    { name: '医疗影像', days: 4.2, status: 'danger', desc: '最长，影响申请意愿' },
    { name: '自动驾驶', days: 4.0, status: 'warning', desc: '偏长' },
    { name: '语音合成', days: 3.5, status: 'warning', desc: '略偏长' },
    { name: '文本情感', days: 3.1, status: 'warning', desc: '平均值附近' },
    { name: '图像标注', days: 2.8, status: 'good', desc: '达标' },
    { name: 'NLP任务', days: 2.5, status: 'good', desc: '达标' },
  ]
};

export const trafficKpiData = {
  uv: 1550, uvChange: 12.5,
  pv: 5600, pvChange: 8.3,
  avgTime: '5m 42s', avgTimeChange: 15,
  bounceRate: 29.0, bounceRateChange: -2.1,
  recruitCtr: 42.5, recruitCtrChange: 3.2
};

export const trafficTrendData = [
  { date: '11/1', pv: 4500, uv: 1200 },
  { date: '11/2', pv: 4800, uv: 1350 },
  { date: '11/3', pv: 4200, uv: 1100 },
  { date: '11/4', pv: 5500, uv: 1450 },
  { date: '11/5', pv: 6200, uv: 1700 },
  { date: '11/6', pv: 5800, uv: 1600 },
  { date: '11/7', pv: 5600, uv: 1550 },
];

export const trafficSourceData = [
  { name: '直接访问', value: 4500, percent: 39.1, color: '#14b8a6' },
  { name: '搜索引擎', value: 3200, percent: 27.8, color: '#10b981' },
  { name: '外部链接', value: 1800, percent: 15.7, color: '#f59e0b' },
  { name: '社交媒体', value: 1200, percent: 10.4, color: '#2dd4bf' },
  { name: '邮件营销', value: 800, percent: 7.0, color: '#ef4444' },
];

export const topPagesData = [
  { name: '首页', path: '/home', pv: 12450, uv: 3200, time: '2m 15s', bounce: 24 },
  { name: '任务列表', path: '/tasks/list', pv: 8500, uv: 2100, time: '4m 30s', bounce: 15 },
  { name: '招募详情页', path: '/recruitment/detail', pv: 6200, uv: 1800, time: '3m 45s', bounce: 22 },
  { name: '个人中心', path: '/user/profile', pv: 4800, uv: 1500, time: '1m 20s', bounce: 12 },
  { name: '培训中心', path: '/training/center', pv: 3500, uv: 950, time: '8m 10s', bounce: 8 },
];

export const visitorDeviceData = {
  visitor: [
    { name: '新访客', value: 62, color: '#14b8a6' },
    { name: '老访客', value: 38, color: '#2dd4bf' },
  ],
  device: [
    { name: 'App', value: 32, color: '#10b981' },
    { name: 'Web', value: 68, color: '#14b8a6' },
  ]
};

export const domainTrafficData = [
  { domain: '自动驾驶', pv: 45200, uv: 12500 },
  { domain: '医疗影像', pv: 38100, uv: 9800 },
  { domain: '语音合成', pv: 32500, uv: 8500 },
  { domain: '文本情感', pv: 28400, uv: 7200 },
  { domain: '图像标注', pv: 21000, uv: 5600 },
  { domain: 'NLP任务', pv: 15600, uv: 4100 },
];

export const taskTrafficData = [
  { id: 'R-20261101', name: '自动驾驶街景3D点云标注', domain: '自动驾驶', pv: 12500, uv: 3200, clicks: 1440, ctr: 45.0 },
  { id: 'R-20261102', name: '方言语音采集与转写', domain: '语音合成', pv: 9800, uv: 2500, clicks: 1050, ctr: 42.0 },
  { id: 'R-20261103', name: '医疗CT影像病灶框选', domain: '医疗影像', pv: 8500, uv: 2100, clicks: 588, ctr: 28.0 },
  { id: 'R-20261104', name: '电商评论情感极性分类', domain: '文本情感', pv: 7600, uv: 1900, clicks: 817, ctr: 43.0 },
  { id: 'R-20261105', name: '自动驾驶车辆行为预测', domain: '自动驾驶', pv: 7200, uv: 1800, clicks: 882, ctr: 49.0 },
  { id: 'R-20261106', name: '多语种机器翻译语料对齐', domain: 'NLP任务', pv: 6500, uv: 1600, clicks: 656, ctr: 41.0 },
  { id: 'R-20261107', name: '商品图像多标签分类', domain: '图像标注', pv: 5800, uv: 1400, clicks: 644, ctr: 46.0 },
  { id: 'R-20261108', name: '智能客服对话意图识别', domain: 'NLP任务', pv: 5200, uv: 1300, clicks: 507, ctr: 39.0 },
  { id: 'R-20261109', name: '骨科X光片关键点标注', domain: '医疗影像', pv: 4900, uv: 1200, clicks: 312, ctr: 26.0 },
  { id: 'R-20261110', name: '车载语音指令唤醒词采集', domain: '语音合成', pv: 4500, uv: 1100, clicks: 528, ctr: 48.0 },
];

export const recruitTaskStatusData = {
  new: { value: 15, change: 3, label: '较前1日' },
  inProgress: { value: 98, change: 5, label: '较上周' },
  paused: { value: 8, change: -2, label: '较上周' },
  completed: { value: 45, change: 12, label: '本月累计' },
};
