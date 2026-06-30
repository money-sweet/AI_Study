# 数小搭 - 数据分析提示词生成器

面向非数据分析专业人士的 Agent 工具，通过「选择主题 → 选择类型 → 按类型确认细节 → 生成提示词」三步纵向配置，一键生成可复制的「纯样式提示词」，结果以弹窗形式展示，粘贴到 AI 工具即可还原专业图表。

## 使用流程

页面将三步纵向排列，按顺序完成即可：

1. **选择分析主题**
   - 选择分析主题：新产品 / 行业分析。
2. **选择分析类型**
   - 选择分析类型：看板 / 分析。
3. **确认分析框架**（根据第二步选择差异化展示）
   - **看板**：展示「看板框架&组件确认」。确认推荐的看板框架模块，并可勾选启用、修改名称描述、添加自定义模块；同时为每个模块配置组件样式（KPI 卡片、折线图、漏斗图等）和结论样式，同时设置全局视觉与布局。
   - **分析**：展示「分析主题&分析框架确认」。输入想分析的主题或问题（如三月份合同额为什么下降），系统会结合新产品/行业业务知识，以「模块 + 拆解分析内容」表格形式智能推荐分析模块；用户通过复选框勾选想分析的模块。
4. **选择具体问题**（仅「分析」类型）
   - 针对第三步勾选的每个分析模块，按类别（业绩/LTC/客群/销售管理等）列出常见业务问题，用户勾选想回答的问题。
   - 每个模块内支持添加自定义问题。

配置会自动保存到浏览器本地（localStorage），刷新页面后不会丢失。

框架与问题确定后，点击页面底部「🔍 预览报告效果」，在弹窗中确认预估生成的报告效果；确认后点击「✨ 生成提示词」，结果以弹窗形式展示，可一键复制 Markdown 格式的纯样式提示词，粘贴到 Kimi、ChatGPT、Claude 等 AI 工具中使用。

## 数据源参考

- 新产品分析：[https://kms.fineres.com/pages/viewpage.action?pageId=1430716018](https://kms.fineres.com/pages/viewpage.action?pageId=1430716018)
- 行业分析：[https://kms.fineres.com/pages/viewpage.action?pageId=1430716145](https://kms.fineres.com/pages/viewpage.action?pageId=1430716145)

## 本地启动

首次启动前，请先安装后端依赖：

```bash
cd data-analysis-prompt-generator/backend
npm install
```

### Windows

双击运行：

```bash
start.bat
```

### macOS / Linux

```bash
bash start.sh
```

### 手动启动

```bash
cd data-analysis-prompt-generator/backend
node server.js
```

然后在浏览器打开：http://localhost:8080

## 项目结构

```
data-analysis-prompt-generator/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式
├── js/
│   ├── data.js         # 主题、类型、模块、样式配置
│   ├── app.js          # 向导交互逻辑
│   └── promptBuilder.js# 提示词生成逻辑
├── README.md
├── start.bat
└── start.sh
```

## 扩展指南

- 新增分析主题或类型：修改 `js/data.js` 中的 `TOPICS` / `ANALYSIS_TYPES`。
- 新增推荐模块：在 `js/data.js` 的 `MODULE_TEMPLATES` 中定义，并在 `getRecommendedModules` 中关联。
- 新增组件/结论样式：在 `js/data.js` 的 `COMPONENT_STYLES` / `CONCLUSION_STYLES` 中扩展。
- 调整提示词模板：修改 `js/promptBuilder.js` 中的输出格式。

## 设计原则

- **不主动要求字段名**：所有输入仅为勾选和少量文案自定义。
- **推荐优先**：系统根据主题+类型智能推荐框架与样式。
- **纯样式提示词**：不绑定具体数据字段，通用可复用。
