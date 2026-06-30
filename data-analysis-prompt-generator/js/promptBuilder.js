/**
 * 数小搭 - 数据分析提示词生成器 - 提示词构建器
 * 根据用户最终确认的状态生成「纯样式提示词」。
 */

function buildPrompt(state) {
  const { topic, type, analysisTopic, recommendedFramework, analysisQuestions, globalStyles, modules } = state;

  const visual = VISUAL_STYLES[globalStyles.visual] || VISUAL_STYLES.professional_blue;
  const layout = LAYOUT_STYLES[globalStyles.layout] || LAYOUT_STYLES.grid;

  const lines = [];

  // 标题
  if (type.id === 'analysis') {
    lines.push(`# ${analysisTopic} — 纯样式提示词`);
  } else {
    lines.push(`# ${topic.name} · ${type.name} — 纯样式提示词`);
  }
  lines.push('');

  // 角色与目标
  lines.push('## 角色与目标');
  if (type.id === 'analysis') {
    lines.push(`你是一位资深数据分析师与可视化专家。请根据以下样式要求，为我生成一份专业的「${analysisTopic}」分析报告。`);
    lines.push(`分析主题背景：${topic ? topic.desc.replace(/[。\s]+$/, '') : '请根据指标库推荐内容展开分析'}。`);
  } else {
    lines.push(`你是一位资深数据分析师与可视化专家。请根据以下样式要求，为我生成一份专业的「${topic.name}」${type.name}。`);
  }
  lines.push(`生成报告时必须基于真实业务数据，禁止使用虚构示例数据。若缺少关键数据，或无法按上述口径/公式计算某个指标，请在报告中明确标注，并列出需要向用户确认的数据项，而不是自行编造数据。`);
  lines.push('');

  // 整体风格
  lines.push('## 整体视觉与布局');
  lines.push(`- **主题色调**：${visual.name} — ${visual.desc}`);
  lines.push(`- **页面布局**：${layout.name} — ${layout.desc}`);
  lines.push(`- **分析类型**：${type.name} — ${type.desc}`);
  if (type.id === 'analysis') {
    lines.push(`- **分析主题**：${analysisTopic}`);
  } else {
    lines.push(`- **分析主题**：${topic.desc}`);
  }
  lines.push('');

  // 通用样式规范
  lines.push('## 通用样式规范');
  lines.push('- 字体：中文使用「Microsoft YaHei / PingFang SC / Noto Sans SC」，英文使用「Inter / Arial」。');
  lines.push('- 标题层级清晰，主标题 20-24px，模块标题 16-18px，正文 13-14px。');
  lines.push('- 图表留白充足，网格线使用浅灰色虚线或隐藏，避免视觉噪音。');
  lines.push('- 数据标签使用千分位、百分比或合适的小数位数，单位明确。');
  lines.push('- 所有图表需包含标题、图例、坐标轴标签（必要时）。');
  lines.push('');

  if (type.id === 'analysis') {
    // 分析类型：基于业务知识的分析框架
    const bk = BUSINESS_KNOWLEDGE[topic.id];

    lines.push('## 业务知识前置规则');
    lines.push('');

    if (bk) {
      lines.push('### 核心口径');
      bk.coreRules.forEach(rule => lines.push(`- ${rule}`));
      lines.push('');

      lines.push('### 关键指标');
      bk.metrics.forEach(m => {
        lines.push(`- **${m.name}**：${m.desc || ''}${m.formula ? `（公式：${m.formula}）` : ''}`);
      });
      lines.push('');

      lines.push('### 主要数据表');
      bk.dataTables.forEach(t => {
        lines.push(`- **${t.name}**：${t.usage}`);
      });
      lines.push('');
    }

    lines.push('## 指标计算口径');
    lines.push('以下指标计算方式来自 KMS「常用指标库」（pageId=1431797954），生成报告时请严格遵循，确保数据计算准确。');
    lines.push('');

    const metricsLibrary = typeof METRICS_LIBRARY !== 'undefined' ? METRICS_LIBRARY : null;
    if (metricsLibrary && metricsLibrary.details && metricsLibrary.details.length > 0) {
      metricsLibrary.details.forEach(section => {
        lines.push(`### ${section.module}`);
        section.metrics.forEach(m => {
          let line = `- **${m.metric}**`;
          if (m.description) line += `：${m.description}`;
          line += `（公式：${m.formula}）`;
          if (m.example) line += ` 示例：${m.example}`;
          lines.push(line);
        });
        lines.push('');
      });
    } else {
      lines.push('> 暂无可用指标计算口径数据。');
      lines.push('');
    }

    lines.push('## 建议分析框架');
    lines.push('');

    const selectedItems = (recommendedFramework || []).filter(item => item.checked);
    if (selectedItems.length === 0) {
      lines.push('> 未选择具体模块，请围绕主题自由发挥。');
      lines.push('');
    } else {
      selectedItems.forEach(item => {
        lines.push(`### ${item.module}`);
        lines.push(`- **拆解分析内容**：${item.breakdown}`);
        if (item.relatedTables && item.relatedTables.length > 0) {
          lines.push(`- **参考数据表**：${item.relatedTables.join('、')}`);
        }
        lines.push('');
      });
    }

    const hasModuleQuestions = Object.values(analysisQuestions || {}).some(mq =>
      mq.categories.some(cat => cat.questions.some(q => q.checked)) ||
      mq.customQuestions.some(q => q.checked)
    );

    lines.push('## 需要回答的具体问题');
    lines.push('');
    selectedItems.forEach(item => {
      const mq = analysisQuestions[item.id];
      const checkedQs = [];
      if (mq) {
        mq.categories.forEach(cat => {
          cat.questions.filter(q => q.checked).forEach(q => checkedQs.push(q.text));
        });
        mq.customQuestions.filter(q => q.checked).forEach(q => checkedQs.push(`${q.text}（自定义）`));
      }

      lines.push(`### ${item.module}`);
      if (checkedQs.length > 0) {
        checkedQs.forEach((text, idx) => {
          lines.push(`${idx + 1}. ${text}`);
        });
      } else {
        lines.push('> 用户未指定具体问题，请根据该模块主题自行生成 2–4 个关键分析问题并展开回答。');
      }
      lines.push('');
    });

    lines.push('## 分析框架要求');
    lines.push('- 报告以「背景说明 → 数据呈现 → 根因解读 → 行动建议」为主线展开。');
    lines.push('- 每个分析模块至少配合一种合适的图表（折线、柱状、饼图、表格等）进行呈现。');
    lines.push('- 严格遵循上述业务口径与计算公式，不得自行变更数据取数来源或计算逻辑。');
    lines.push('- 异常波动必须下沉到合同/客户维度，识别大额订单影响并列出客户名称与合同额。');
    lines.push('- 围绕建议分析框架与勾选问题组织内容，对关键波动、异常点给出业务层面的解读。');
    lines.push('- 针对用户勾选或自定义的问题，需逐一给出明确的分析结论与数据支撑；对未指定具体问题的模块，请自行生成关键问题并回答。');
    lines.push('- 必须使用真实业务数据生成图表与结论；若缺少数据或无法计算某指标，应标注「待确认」并向用户说明需要补充什么，禁止编造数据。');
    lines.push('- 报告末尾需有「核心结论」与「下一步行动建议」独立章节。');
    lines.push('');
  } else {
    // 看板类型：模块配置与要求
    lines.push('## 模块配置与要求');
    lines.push('');

    modules.forEach((mod, index) => {
      lines.push(`### ${index + 1}. ${mod.name}`);
      lines.push(`> ${mod.desc}`);
      lines.push('');

      if (mod.selectedComponents && mod.selectedComponents.length > 0) {
        lines.push('**推荐组件样式：**');
        mod.selectedComponents.forEach(cid => {
          const comp = COMPONENT_STYLES[cid];
          if (comp) {
            lines.push(`- ${comp.name}：${comp.desc}`);
          }
        });
        lines.push('');
      }

      if (mod.selectedConclusions && mod.selectedConclusions.length > 0) {
        lines.push('**结论输出样式：**');
        mod.selectedConclusions.forEach(cid => {
          const con = CONCLUSION_STYLES[cid];
          if (con) {
            lines.push(`- ${con.name}：${con.desc}`);
          }
        });
        lines.push('');
      }
    });
  }

  // 输出格式要求
  lines.push('## 输出格式要求');
  if (type.id === 'dashboard') {
    lines.push('- 以可视化看板形式输出，整体为一页式布局。');
    lines.push('- 每个模块使用卡片容器，包含标题、图表/组件、结论三部分。');
    lines.push('- 图表之间对齐整齐，支持响应式宽度。');
  } else if (type.id === 'analysis') {
    lines.push('- 以结构化分析报告形式输出，包含背景、数据回顾、根因剖析、行动建议。');
    lines.push('- 每个模块先呈现图表，再输出数据解读、关键发现与改进建议。');
    lines.push('- 报告末尾需有「核心结论」与「下一步行动建议」独立章节。');
  } else {
    lines.push('- 根据上述模块与样式，输出清晰、专业的分析呈现。');
    lines.push('- 图表与结论交替出现，保持可读性。');
  }
  lines.push('- 使用 Markdown 或 HTML 格式均可，确保可直接复制到 AI 对话中使用。');
  lines.push('');

  lines.push('## 数据使用要求');
  lines.push('- 报告中的图表与结论必须基于真实业务数据，严禁使用虚构示例数据。');
  lines.push('- 如果缺少某些指标所需的数据，或无法按上述口径/公式准确计算，请在报告中以「待确认数据」形式列出，说明缺什么、为什么缺、需要用户提供什么。');
  lines.push('- 在数据缺口解决前，不允许为了图表完整而编造数据；可以暂时跳过该指标或留白说明。');
  lines.push('- 数据单位、时间范围、类别名称需与分析主题保持一致。');
  lines.push('- 结论中的数字需与图表数据相互呼应。');

  return lines.join('\n');
}
