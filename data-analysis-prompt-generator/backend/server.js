/**
 * 数小搭后端服务
 * - 提供静态资源访问
 * - 接收前端发送的使用记录
 * - 每日自动同步到 Confluence
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { syncToConfluence, loadRecords } = require('./sync_to_confluence');
const { fetchMetricsLibrary } = require('./fetch_metrics_library');

const app = express();
const PORT = process.env.PORT || 8080;
const RECORDS_FILE = path.join(__dirname, 'records.json');

app.use(express.json());

// 静态资源
app.use(express.static(path.join(__dirname, '..')));

// 保存记录
app.post('/api/records', (req, res) => {
  try {
    const record = {
      timestamp: new Date().toISOString(),
      topic: req.body.topic,
      type: req.body.type,
      analysisTopic: req.body.analysisTopic,
      checkedModules: req.body.checkedModules || [],
      checkedQuestions: req.body.checkedQuestions || []
    };

    const records = loadRecords();
    records.push(record);
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');

    res.json({ success: true, count: records.length });
  } catch (err) {
    console.error('保存记录失败', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 获取记录
app.get('/api/records', (req, res) => {
  try {
    const records = loadRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 手动触发同步
app.post('/api/sync', async (req, res) => {
  try {
    const data = await syncToConfluence();
    res.json({ success: true, version: data.version?.number });
  } catch (err) {
    console.error('手动同步失败', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 每天凌晨 2 点自动同步
// cron 表达式：秒 分 时 日 月 周（node-cron 支持 6 位）
cron.schedule('0 0 2 * * *', async () => {
  console.log('开始每日自动同步...', new Date().toISOString());
  try {
    const data = await syncToConfluence();
    console.log('每日同步成功，版本：', data.version?.number);
  } catch (err) {
    console.error('每日同步失败', err);
  }
});

async function startServer() {
  // 启动时自动刷新 KMS 指标库，失败不影响服务启动
  try {
    await fetchMetricsLibrary();
  } catch (err) {
    console.error('启动时刷新指标库失败，将使用本地缓存：', err.message);
  }

  app.listen(PORT, () => {
    console.log(`数小搭后端服务已启动：http://localhost:${PORT}`);
    console.log('每日自动同步时间：02:00:00');
  });
}

startServer();
