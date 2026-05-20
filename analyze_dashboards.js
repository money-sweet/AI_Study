const XLSX = require('C:/Users/qian_/AppData/Roaming/npm/node_modules/xlsx');
const fs = require('fs');

const wb = XLSX.readFile('D:/AI开发&学习/other/看板2026年使用情况.xlsx');
const ws = wb.Sheets['组件'];
const rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});

const usageMap = {};
for (let i = 1; i < rows.length - 1; i++) {
  const [name, id, serial, p3, p4, uv, pv] = rows[i];
  if (name) usageMap[name] = { uv: uv||0, pv: pv||0, serial };
}

function excelDate(serial) {
  if (!serial) return '';
  const d = new Date((serial - 25569) * 86400 * 1000);
  return d.toISOString().slice(0,10);
}

const dashboards = [
  {name:'【量化目标】战区售前组织绩效看板-Jams.Cai', cat:'部门绩效', path:null},
  {name:'【量化目标】顾问调用出差分析', cat:'部门绩效', path:'有'},
  {name:'【量化目标】行业销售额-D-2025', cat:'部门绩效', path:'有'},
  {name:'【量化目标】KH平台活跃看板-2025-Miya.Ming', cat:'部门绩效', path:'有'},
  {name:'【量化目标】大客户准标杆数_Candy.lixin', cat:'部门绩效', path:'有'},
  {name:'【量化目标】大客户BA&成单客户数_Candy.lixin', cat:'部门绩效', path:'有'},
  {name:'【量化目标】售前行业销售额-D-Kitty.Qian', cat:'部门绩效', path:'有'},
  {name:'【临时】目标测算看板', cat:'部门绩效', path:null},
  {name:'失败关单分析(竞争等维度)-Jams.Cai', cat:'竞争管理', path:'有'},
  {name:'数据地图-Candy.lixin', cat:'数据应用', path:'有'},
  {name:'CRMBI数据集运营分析-Candy.lixin', cat:'数据应用', path:'有'},
  {name:'四大平台浏览情况-Cencil', cat:'数据应用', path:'有'},
  {name:'数知鸟需求分析-Cencil', cat:'数据应用', path:'有'},
  {name:'数仓月度任务分析-Christal', cat:'数据应用', path:'有'},
  {name:'数仓表数据质量分析-hammer', cat:'数据应用', path:'有'},
  {name:'数仓分类分级看板-Chauncey.Li', cat:'数据应用', path:null},
  {name:'JDY作战地图使用记录-Kitty.Qian', cat:'数据应用', path:'有'},
  {name:'JDY定向营销策略效果复盘-Kitty.Qian', cat:'数据应用', path:'有'},
  {name:'数据应用需求看板-Cencil', cat:'数据应用', path:'有'},
  {name:'顾问行程及调用流程分析', cat:'顾问行程', path:'有'},
  {name:'行业顾问近两周出差日程一览', cat:'顾问行程', path:'有'},
  {name:'【knowhow】用户运营仪表板', cat:'内容平台', path:'有'},
  {name:'2025资产贡献激励-Miya.Ming', cat:'内容平台', path:'有'},
  {name:'售前画像看板-Connie.Du', cat:'售前画像', path:'有'},
  {name:'售前画像看板（1-3以下）-Connie.Du', cat:'售前画像', path:'有'},
  {name:'LTC看板访问量统计-Cencil', cat:'售前画像', path:'有'},
  {name:'简道云售卖分析-Kitty', cat:'售前画像', path:'有'},
  {name:'2025年_售前行程分析-Jams.Cai', cat:'LTC管理', path:'有'},
  {name:'简道云未下单业绩扣减分析-Cencil', cat:'LTC管理', path:'有'},
  {name:'售前销售任务完成统计-Jams.Cai', cat:'LTC管理', path:'有'},
  {name:'机会特殊部署架构分析看板-Connie', cat:'LTC管理', path:'有'},
  {name:'POC行程分析看板-Leon.Zhang', cat:'LTC管理', path:'有'},
  {name:'机会到签单商务记录分析-Jams.Cai', cat:'LTC管理', path:'有'},
  {name:'管理问答BI机会分析看板-Connie', cat:'LTC管理', path:'有'},
  {name:'简道云独享版本机会分析-Connie', cat:'LTC管理', path:'有'},
  {name:'售前机会管理分析_Cencil', cat:'LTC管理', path:'有'},
  {name:'销售售前各业绩类别明细数据-Cencil', cat:'LTC管理', path:'有'},
  {name:'合同调整和折扣分析-Cencil', cat:'LTC管理', path:'有'},
  {name:'售前对接签单分析-Cencil', cat:'LTC管理', path:'有'},
  {name:'产品签单全量数据明细_Cencil', cat:'LTC管理', path:'有'},
  {name:'大客户差异分析-Jams.Cai', cat:'LTC管理', path:'有'},
  {name:'年费BI交接看板-Jams.Cai', cat:'LTC管理', path:'有'},
  {name:'机会售前与责任售前不一致分析看板', cat:'LTC管理', path:'有'},
  {name:'FineBI专项分析看板', cat:'LTC管理', path:'有'},
  {name:'2025年_行业客户自动分配分析看板', cat:'LTC管理', path:'有'},
  {name:'FineBI专项分析看板-2026', cat:'LTC管理', path:'有'},
  {name:'【量化目标】价值场景合同数-2023', cat:'价值场景', path:'有'},
  {name:'【价值场景】战区价值场景推广分析', cat:'价值场景', path:'有'},
  {name:'【价值场景】信息总览-may.ren', cat:'价值场景', path:'有'},
  {name:'【价值场景】合同分析-pello', cat:'价值场景', path:'有'},
  {name:'【价值场景】机会分析-may.ren', cat:'价值场景', path:'有'},
  {name:'供应链看板-Drew.Sun', cat:'价值场景', path:null},
  {name:'行业场景标签应用分析看板', cat:'价值场景', path:'有'},
  {name:'【业务破圈】财务和供应链业务破圈分析-candy.lixin', cat:'价值场景', path:null},
  {name:'客群筛选-Harvey.Sun', cat:'标杆管理', path:null},
  {name:'客户案例行程分析-Harvey.Sun', cat:'标杆管理', path:null},
  {name:'FDL准标杆/标杆梳理-Marjorie', cat:'标杆管理', path:null},
  {name:'央企体系客户准标杆/标杆-Harvey.Sun', cat:'标杆管理', path:'有'},
  {name:'标杆执行客群选择-Harvey.Sun', cat:'标杆管理', path:'有'},
  {name:'【标签管理】行业解决方案标签确认进度分析-pello', cat:'行业标签', path:'有'},
  {name:'【细分客群】成熟度评估与洞察', cat:'大行业分析>大制造', path:'有'},
  {name:'【大制造】2024新能源整车业绩监控', cat:'大行业分析>大制造', path:'有'},
  {name:'细分客群覆盖率', cat:'大行业分析>大制造', path:null},
  {name:'大制造区域目标看板', cat:'大行业分析>大制造', path:'有'},
  {name:'行业内价值场景机会数', cat:'大行业分析>大制造', path:'有'},
  {name:'Top客户看板-Long.Zhang', cat:'大行业分析>大制造', path:'有'},
  {name:'金融客户分布看板', cat:'大行业分析>大金融', path:null},
  {name:'【非银】金融客户情况分析', cat:'大行业分析>大金融>非银金融', path:'有'},
  {name:'【非银】历年销售额分析看板', cat:'大行业分析>大金融>非银金融', path:'有'},
  {name:'全国银行客户合作及未合作情况', cat:'大行业分析>大金融>银行', path:'有'},
  {name:'银行合同结构分析', cat:'大行业分析>大金融>银行', path:'有'},
  {name:'银行客户分级看板', cat:'大行业分析>大金融>银行', path:'有'},
  {name:'【银行特战队】产品需求分析-bain', cat:'大行业分析>大金融>银行特战队', path:null},
  {name:'银行特战队作战地图_nice_2026', cat:'大行业分析>大金融>银行特战队', path:null},
  {name:'01-商务记录看板-大消费', cat:'大行业分析>大消费', path:'有'},
  {name:'02-客户机会看板-大消费', cat:'大行业分析>大消费', path:'有'},
  {name:'04-签单分析看板-大消费', cat:'大行业分析>大消费', path:'有'},
  {name:'EC销售机会管理看板', cat:'大行业分析>大消费', path:'有'},
  {name:'大消费出差人天看板', cat:'大行业分析>大消费', path:'有'},
  {name:'大消费合作客户分析', cat:'大行业分析>大消费', path:'有'},
  {name:'行业化（按客户标签）销售额分析看板_2023_三级细分', cat:'大行业分析>大消费', path:'有'},
  {name:'EC电商相关商务记录', cat:'大行业分析>大消费', path:'有'},
  {name:'合同标签变动查询', cat:'大行业分析>大民生', path:'有'},
  {name:'高校销售情况看板', cat:'大行业分析>大民生', path:'有'},
  {name:'仪表板', cat:'大行业分析>大民生', path:'有'},
  {name:'行业化历史合作数据分析', cat:'大行业分析>泛地产', path:'有'},
  {name:'帆软·启城智慧运营', cat:'大行业分析>泛地产', path:'有'},
  {name:'2025年_行业售前能力意愿模型-Jams.Cai', cat:'行业运营', path:'有'},
  {name:'2025年_三级细分行业分析看板-Jams.Cai', cat:'行业运营', path:'有'},
  {name:'整车产业链情况_上海', cat:'行业运营', path:'有'},
  {name:'细分行业分析-Kitty.Qian', cat:'行业运营', path:'有'},
  {name:'细分客群作战地图-Jams.Cai', cat:'行业运营', path:'有'},
  {name:'大民生行业客户战略分析-Candy.lixin', cat:'行业运营', path:'有'},
  {name:'高校24年战略全景分析-Leo.Tao', cat:'行业运营', path:'有'},
  {name:'医疗卫生24年战略全景分析（三甲医院）-Dank', cat:'行业运营', path:'有'},
  {name:'行业化25年大客户名单_Candy.lixin', cat:'行业运营', path:'有'},
  {name:'军工研究所运营分析看板-Sunlight', cat:'行业运营', path:'有'},
  {name:'数据治理场景分析-Candy.lixin', cat:'行业运营', path:'有'},
  {name:'财务分析看板_Candy.lixin', cat:'行业运营', path:'有'},
  {name:'财务业务市场空间测算-Candy.lixin', cat:'行业运营', path:'有'},
  {name:'财务破圈经营概览-Lucan', cat:'行业运营', path:null},
  {name:'华南泛半导体经营-Kitty.Qian', cat:'行业运营', path:'有'},
  {name:'建筑体系客群运营分析-Dave.Guo', cat:'行业运营', path:'有'},
  {name:'战区财务市场空间测算-Lucan', cat:'行业运营', path:'有'},
  {name:'【客户侧】行业客户复购率看板', cat:'行业运营>待完善', path:'有'},
  {name:'【客户侧】行业top占有率看板', cat:'行业运营>待完善', path:'有'},
  {name:'【战区侧】行业区域签单', cat:'行业运营>待完善', path:'有'},
  {name:'LTC-复购分析', cat:'行业运营>待完善', path:'有'},
  {name:'LTC-市场运营', cat:'行业运营>待完善', path:'有'},
];

function analyze(d) {
  const usage = usageMap[d.name] || {uv:0, pv:0, serial:null};
  const uv = usage.uv;
  const pv = usage.pv;
  const dateStr = excelDate(usage.serial);
  const name = d.name;

  const isOldYear = name.includes('2022') || name.includes('2023') || name.includes('24年') || name.includes('2024');
  const isNullPath = d.path === null;
  const isWaiting = d.cat.includes('待完善');
  const isTemp = name.includes('【临时】');
  const isZeroUV = uv === 0;
  const isVeryLow = uv <= 2;
  const isLowUVLowPV = uv <= 3 && pv <= 10;
  const isLow = uv <= 5;

  let recommend = '';
  let reasons = [];

  if (isTemp) {
    recommend = '建议下线';
    reasons.push('名称含【临时】标记，为临时性看板');
  } else if (isZeroUV && isOldYear) {
    recommend = '建议下线';
    reasons.push('2026年零访问');
    reasons.push('内容为旧年份数据（2022-2024）');
  } else if (isZeroUV && isNullPath) {
    recommend = '建议下线';
    reasons.push('2026年零访问');
    reasons.push('无数据源路径，看板未正常配置');
  } else if (isZeroUV && isWaiting) {
    recommend = '建议下线';
    reasons.push('2026年零访问');
    reasons.push('长期挂在"待完善"目录，未被维护');
  } else if (isZeroUV) {
    recommend = '建议下线';
    reasons.push('2026年全年无任何访问记录');
  } else if (isLowUVLowPV) {
    recommend = '建议下线';
    reasons.push('2026年UV≤3且访问次数≤10，实际使用频次极低');
  } else if (isVeryLow && isOldYear) {
    recommend = '建议下线';
    reasons.push('2026年访问极少(UV≤2)');
    reasons.push('内容为旧年份数据，已缺乏时效性');
  } else if (isVeryLow && isNullPath) {
    recommend = '建议下线';
    reasons.push('2026年访问极少(UV≤2)');
    reasons.push('无数据源路径，数据来源不明');
  } else if (isLow && isWaiting) {
    recommend = '观察/待评估';
    reasons.push('2026年访问量偏低(UV≤5)');
    reasons.push('在"待完善"目录下，建议确认是否仍维护');
  } else if (isLow && isOldYear) {
    recommend = '观察/待评估';
    reasons.push('2026年访问量偏低(UV≤5)');
    reasons.push('内容含旧年份，需确认数据是否仍更新');
  } else if (isLow && isNullPath) {
    recommend = '观察/待评估';
    reasons.push('2026年访问量偏低(UV≤5)');
    reasons.push('无数据源路径，需确认数据配置');
  } else if (isLow) {
    recommend = '观察/待评估';
    reasons.push('2026年访问量偏低(UV≤5)，建议评估业务使用价值');
  } else {
    recommend = '建议保留';
    reasons.push('2026年有正常访问量(UV>5)，数据使用活跃');
  }

  return { uv, pv, dateStr, recommend, reason: reasons.join('；') };
}

const csvRows = [['看板名称','所属分类','挂出时间','2026年UV','2026年访问次数','数据路径配置','是否建议下线','理由']];

for (const d of dashboards) {
  const a = analyze(d);
  csvRows.push([
    d.name,
    d.cat,
    a.dateStr,
    a.uv,
    a.pv,
    d.path ? '已配置' : '无路径',
    a.recommend,
    a.reason
  ]);
}

const csvContent = csvRows.map(r =>
  r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')
).join('\n');

fs.writeFileSync('D:/AI开发&学习/other/看板下线分析报告.csv', '﻿' + csvContent, 'utf8');

const offline = csvRows.slice(1).filter(r => r[6]==='建议下线').length;
const watch = csvRows.slice(1).filter(r => r[6]==='观察/待评估').length;
const keep = csvRows.slice(1).filter(r => r[6]==='建议保留').length;
console.log('总看板数:', dashboards.length);
console.log('建议下线:', offline);
console.log('观察/待评估:', watch);
console.log('建议保留:', keep);
console.log('已输出: D:/AI开发&学习/other/看板下线分析报告.csv');
