/**
 * 将 records.json 中的用户勾选记录同步到 Confluence 页面。
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { loadConfluenceCredentials } = require('./credentials');

const RECORDS_FILE = path.join(__dirname, 'records.json');
const PAGE_ID = '1433406316';

function loadRecords() {
  if (!fs.existsSync(RECORDS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
  } catch (err) {
    console.error('读取 records.json 失败', err);
    return [];
  }
}

function groupRecordsByDate(records) {
  const groups = {};
  records.forEach(r => {
    const date = new Date(r.timestamp).toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(r);
  });
  return groups;
}

function buildConfluenceContent(records) {
  const groups = groupRecordsByDate(records);
  const dates = Object.keys(groups).sort().reverse();

  if (dates.length === 0) {
    return '<p>暂无使用记录。</p>';
  }

  let html = '<h2>用户使用记录</h2>';
  html += `<p>本页面由数小搭自动同步，最后更新于 ${new Date().toLocaleString('zh-CN')}。</p>`;

  dates.forEach(date => {
    html += `<h3>${date}</h3>`;
    html += '<table>';
    html += '<colgroup><col /><col /><col /><col /><col /><col /></colgroup>';
    html += '<tr><th>时间</th><th>分析主题</th><th>分析类型</th><th>输入主题/问题</th><th>勾选的模块</th><th>勾选的问题</th></tr>';

    groups[date].forEach(r => {
      const time = new Date(r.timestamp).toLocaleTimeString('zh-CN');
      const topic = escapeXml(r.topic || '-');
      const type = escapeXml(r.type || '-');
      const analysisTopic = escapeXml(r.analysisTopic || '-');
      const modules = r.checkedModules?.map(q => escapeXml(q)).join('<br/>') || '-';
      const questions = r.checkedQuestions?.map(q => escapeXml(q)).join('<br/>') || '-';

      html += `<tr><td>${time}</td><td>${topic}</td><td>${type}</td><td>${analysisTopic}</td><td>${modules}</td><td>${questions}</td></tr>`;
    });

    html += '</table>';
  });

  return html;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function syncToConfluence() {
  const records = loadRecords();
  const content = buildConfluenceContent(records);
  const { baseUrl, token, username } = loadConfluenceCredentials();

  // 获取当前页面信息以取得 version
  const getUrl = `${baseUrl}/rest/api/content/${PAGE_ID}?expand=version`;
  const getRes = await axios.get(getUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const page = getRes.data;
  const currentVersion = page.version?.number || 1;
  const title = page.title || '使用记录';

  // 更新页面
  const updateUrl = `${baseUrl}/rest/api/content/${PAGE_ID}`;
  const body = {
    id: PAGE_ID,
    type: 'page',
    title,
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    },
    version: {
      number: currentVersion + 1,
      message: `自动同步 ${records.length} 条使用记录`
    }
  };

  const updateRes = await axios.put(updateUrl, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return updateRes.data;
}

// 直接运行脚本时执行同步
if (require.main === module) {
  syncToConfluence()
    .then(data => {
      console.log('同步成功，页面版本：', data.version?.number);
    })
    .catch(err => {
      console.error('同步失败', err.response?.data || err.message);
      process.exit(1);
    });
}

module.exports = { syncToConfluence, loadRecords, buildConfluenceContent };
