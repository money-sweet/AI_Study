/**
 * 从 KMS 常用指标库页面抓取指标计算方式，生成前端可引用的 js/metrics_library.js。
 * 数据源：https://kms.fineres.com/pages/viewpage.action?pageId=1431797954
 */
const fs = require('fs');
const path = require('path');
const { loadConfluenceCredentials } = require('./credentials');

const PAGE_ID = '1431797954';
const OUTPUT_PATH = path.join(__dirname, '..', 'js', 'metrics_library.js');

async function fetchPageContent(pageId) {
  const { baseUrl, token } = loadConfluenceCredentials();
  const url = `${baseUrl}/rest/api/content/${pageId}?expand=body.storage,version,space`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Confluence API 请求失败：${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const html = data.body?.storage?.value || '';
  const title = data.title || '';
  const version = data.version?.number || '';
  const spaceKey = data.space?.key || '';

  return { title, version, spaceKey, html };
}

function decodeHtmlEntities(text) {
  const namedEntities = {
    'nbsp': ' ', 'lt': '<', 'gt': '>', 'amp': '&',
    'quot': '"', 'apos': "'", 'ldquo': '"', 'rdquo': '"',
    'lsquo': "'", 'rsquo': "'", 'hellip': '...', 'mdash': '—'
  };
  return text
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (match, name) => namedEntities[name] || match)
    .replace(/&#(\d+);/g, (match, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// 将 Confluence storage HTML 中的表格解析为二维数组
function parseHtmlTables(html) {
  const tables = [];
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  const cellRegex = /<t(?:h|d)[\s\S]*?<\/t(?:h|d)>/gi;

  const tableMatches = html.match(tableRegex) || [];
  tableMatches.forEach(tableHtml => {
    const rows = [];
    const rowMatches = tableHtml.match(rowRegex) || [];
    rowMatches.forEach(rowHtml => {
      const cells = [];
      const cellMatches = rowHtml.match(cellRegex) || [];
      cellMatches.forEach(cellHtml => {
        // 去掉标签并解码 HTML 实体
        let text = decodeHtmlEntities(cellHtml.replace(/<[^>]+>/g, ' ')).trim();
        cells.push(text);
      });
      if (cells.length > 0) rows.push(cells);
    });
    if (rows.length > 0) tables.push(rows);
  });

  return tables;
}

function parseMetricsLibrary(html, title, version) {
  const tables = parseHtmlTables(html);
  const summaryRows = tables[0] || [];

  // 汇总表：模块 | 细分内容 | 维度 | 指标
  const summary = summaryRows.slice(1).map(row => ({
    module: row[0] || '',
    content: row[1] || '',
    dimensions: row[2] || '',
    metrics: row[3] || ''
  })).filter(r => r.module);

  // 模块 -> 指标关键词，用于过滤复制粘贴导致的脏数据
  const moduleMetricKeywords = {
    '业绩分析': ['业绩', '目标', '完成率', '同比'],
    '线索分析': ['线索'],
    '机会分析': ['机会'],
    '合同分析': ['合同', '客户数', '客户'],
    '回款分析': ['回款', '到期', '待回'],
    '客户分析': ['覆盖', '客户', '商务'],
    '人效分析': ['能力', '意愿', '投产', '人效'],
    '商务行程分析': ['商务', '行程', '记录']
  };

  function isMetricMatchModule(metricName, moduleName) {
    const keywords = moduleMetricKeywords[moduleName] || [moduleName.replace('分析', '').replace('行程', '')];
    return keywords.some(kw => metricName.includes(kw));
  }

  // 后续每个表格对应一个模块，表头：指标 | 说明 | 计算公式 | 示例
  const details = [];
  for (let i = 1; i < tables.length; i++) {
    const rows = tables[i];
    if (rows.length < 2) continue;

    // 通过汇总表顺序推断模块名
    const moduleName = summary[i - 1]?.module || `模块${i}`;

    const headers = rows[0].map(h => h.replace(/\s/g, ''));
    const metricIndex = headers.findIndex(h => h.includes('指标'));
    const descIndex = headers.findIndex(h => h.includes('说明'));
    const formulaIndex = headers.findIndex(h => h.includes('计算'));
    const exampleIndex = headers.findIndex(h => h.includes('示例'));

    if (metricIndex === -1) continue;

    const metrics = rows.slice(1).map(row => ({
      metric: row[metricIndex] || '',
      description: descIndex >= 0 ? row[descIndex] : '',
      formula: formulaIndex >= 0 ? row[formulaIndex] : '',
      example: exampleIndex >= 0 ? row[exampleIndex] : ''
    })).filter(m => {
      // 保留有指标名和计算公式的行，并过滤掉明显属于其他模块的复制粘贴数据
      if (!m.metric || !m.formula) return false;
      return isMetricMatchModule(m.metric, moduleName);
    });

    if (metrics.length > 0) {
      details.push({ module: moduleName, metrics });
    }
  }

  return {
    source: {
      pageId: PAGE_ID,
      title,
      version,
      url: `https://kms.fineres.com/pages/viewpage.action?pageId=${PAGE_ID}`,
      fetchedAt: new Date().toISOString()
    },
    summary,
    details
  };
}

async function fetchMetricsLibrary() {
  console.log(`正在抓取 KMS 指标库页面 ${PAGE_ID}...`);
  const { title, version, html } = await fetchPageContent(PAGE_ID);
  const library = parseMetricsLibrary(html, title, version);

  const output = `/**
 * 常用指标库（自动从 KMS 抓取）
 * 来源：https://kms.fineres.com/pages/viewpage.action?pageId=1431797954
 * 标题：${title}
 * 版本：${version}
 * 抓取时间：${library.source.fetchedAt}
 *
 * 如需更新，请运行：node backend/fetch_metrics_library.js
 */
const METRICS_LIBRARY = ${JSON.stringify(library, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`已生成：${OUTPUT_PATH}`);
  console.log(`共 ${library.summary.length} 个汇总模块，${library.details.length} 个明细模块`);
  library.details.forEach(d => {
    console.log(`  - ${d.module}: ${d.metrics.length} 个指标`);
  });

  return library;
}

// 直接运行脚本时执行抓取
if (require.main === module) {
  fetchMetricsLibrary().catch(err => {
    console.error('抓取失败：', err.message);
    process.exit(1);
  });
}

module.exports = { fetchMetricsLibrary };
