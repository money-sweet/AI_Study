/**
 * 数小搭 - 数据分析提示词生成器 - 应用主逻辑
 * 三步纵向排列，支持本地数据持久化，结果以弹窗形式展示。
 */

// 主题对应的数据源链接
const DATA_SOURCE_LINKS = {
  new_product: 'https://kms.fineres.com/pages/viewpage.action?pageId=1430716018',
  industry: 'https://kms.fineres.com/pages/viewpage.action?pageId=1430716145'
};

// localStorage 键名
const STORAGE_KEY = 'shuxiaoda_state_v2';

// 应用状态
const state = {
  topic: null,
  type: null,
  analysisTopic: '',
  recommendedFramework: [],
  analysisQuestions: {},
  effectConfirmed: false,
  globalStyles: {
    visual: 'professional_blue',
    layout: 'grid'
  },
  modules: []
};

// DOM 元素
const els = {
  stepContent: document.getElementById('stepContent'),
  previewBtn: document.getElementById('previewBtn'),
  generateBtn: document.getElementById('generateBtn'),
  resetBtn: document.getElementById('resetBtn'),
  previewModal: document.getElementById('previewModal'),
  previewBody: document.getElementById('previewBody'),
  closePreviewBtn: document.getElementById('closePreviewBtn'),
  backToEditBtn: document.getElementById('backToEditBtn'),
  confirmEffectBtn: document.getElementById('confirmEffectBtn'),
  resultModal: document.getElementById('resultModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  closeModalBtn2: document.getElementById('closeModalBtn2'),
  copyBtn: document.getElementById('copyBtn'),
  promptOutput: document.getElementById('promptOutput'),
  toast: document.getElementById('toast')
};

function init() {
  loadState();
  bindEvents();
  render();
}

function bindEvents() {
  els.previewBtn.addEventListener('click', openPreviewModal);
  els.generateBtn.addEventListener('click', generatePrompt);
  els.resetBtn.addEventListener('click', resetApp);

  els.closePreviewBtn.addEventListener('click', closePreviewModal);
  els.backToEditBtn.addEventListener('click', closePreviewModal);
  els.confirmEffectBtn.addEventListener('click', confirmEffect);
  els.previewModal.addEventListener('click', e => {
    if (e.target === els.previewModal) closePreviewModal();
  });

  els.closeModalBtn.addEventListener('click', closeModal);
  els.closeModalBtn2.addEventListener('click', closeModal);
  els.copyBtn.addEventListener('click', copyPrompt);
  els.resultModal.addEventListener('click', e => {
    if (e.target === els.resultModal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (els.resultModal.style.display !== 'none') closeModal();
      if (els.previewModal.style.display !== 'none') closePreviewModal();
    }
  });
}

// 兼容旧版本数据结构
function migrateState(parsed) {
  // v2 旧结构：recommendedMetrics（含 per-module customQuestions）-> 新结构 recommendedFramework + 全局 customQuestions
  if (parsed.recommendedMetrics && Array.isArray(parsed.recommendedMetrics)) {
    parsed.recommendedFramework = parsed.recommendedMetrics.map(g => ({
      id: g.module,
      module: g.module,
      breakdown: [
        g.metrics?.filter(m => m.checked).map(m => m.name).join('、'),
        g.dimensions?.filter(d => d.checked).map(d => d.name).join('、'),
        g.questions?.filter(q => q.checked).map(q => q.text).join('；')
      ].filter(Boolean).join('；'),
      relatedTables: [],
      checked: true
    }));
    delete parsed.recommendedMetrics;
  }
  if (!Array.isArray(parsed.recommendedFramework)) parsed.recommendedFramework = [];
  if (typeof parsed.analysisQuestions !== 'object' || parsed.analysisQuestions === null) {
    parsed.analysisQuestions = {};
  }
  // 旧全局 customQuestions 迁移到第一个模块的自定义问题（如存在）
  if (Array.isArray(parsed.customQuestions) && parsed.customQuestions.length > 0) {
    const firstModule = parsed.recommendedFramework[0];
    if (firstModule) {
      if (!parsed.analysisQuestions[firstModule.id]) {
        parsed.analysisQuestions[firstModule.id] = { categories: [], customQuestions: [] };
      }
      parsed.customQuestions.filter(q => q.checked).forEach(q => {
        parsed.analysisQuestions[firstModule.id].customQuestions.push(q);
      });
    }
    delete parsed.customQuestions;
  }
  return parsed;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    let parsed = JSON.parse(saved);
    parsed = migrateState(parsed);

    if (parsed.topic) state.topic = TOPICS.find(t => t.id === parsed.topic) || null;
    if (parsed.type) state.type = ANALYSIS_TYPES.find(t => t.id === parsed.type) || null;
    if (parsed.analysisTopic !== undefined) state.analysisTopic = parsed.analysisTopic;
    if (parsed.recommendedFramework) state.recommendedFramework = parsed.recommendedFramework;
    if (parsed.analysisQuestions) state.analysisQuestions = parsed.analysisQuestions;
    if (parsed.effectConfirmed !== undefined) state.effectConfirmed = parsed.effectConfirmed;
    if (parsed.globalStyles) state.globalStyles = parsed.globalStyles;
    if (parsed.modules) state.modules = parsed.modules;
  } catch (err) {
    console.warn('加载本地配置失败', err);
  }
}

function saveState() {
  try {
    const toSave = {
      topic: state.topic?.id || null,
      type: state.type?.id || null,
      analysisTopic: state.analysisTopic,
      recommendedFramework: state.recommendedFramework,
      analysisQuestions: state.analysisQuestions,
      effectConfirmed: state.effectConfirmed,
      globalStyles: state.globalStyles,
      modules: state.modules
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('保存本地配置失败', err);
  }
}

function resetApp() {
  state.topic = null;
  state.type = null;
  state.analysisTopic = '';
  state.recommendedFramework = [];
  state.analysisQuestions = {};
  state.effectConfirmed = false;
  state.globalStyles = { visual: 'professional_blue', layout: 'grid' };
  state.modules = [];
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  renderButtons();
  els.stepContent.innerHTML = '';

  const topRow = document.createElement('div');
  topRow.className = 'steps-row';
  topRow.appendChild(renderStep1());
  topRow.appendChild(renderStep2());
  els.stepContent.appendChild(topRow);

  renderStep3();

  if (state.type?.id === 'analysis') {
    updateAnalysisQuestions();
    renderStep4();
  }

  saveState();
}

function updateAnalysisQuestions() {
  const selectedItems = state.recommendedFramework.filter(item => item.checked);
  const topicId = state.topic?.id;
  const newQuestions = {};

  selectedItems.forEach(item => {
    if (state.analysisQuestions[item.id]) {
      newQuestions[item.id] = state.analysisQuestions[item.id];
    } else if (topicId) {
      newQuestions[item.id] = buildDefaultQuestionsForModule(item, topicId);
    }
  });

  state.analysisQuestions = newQuestions;
}

function renderButtons() {
  const valid = isValid();

  if (state.effectConfirmed) {
    els.previewBtn.style.display = 'none';
    els.generateBtn.style.display = 'inline-flex';
  } else if (valid) {
    els.previewBtn.style.display = 'inline-flex';
    els.generateBtn.style.display = 'none';
  } else {
    els.previewBtn.style.display = 'none';
    els.generateBtn.style.display = 'none';
  }
}

function createSection(title, number) {
  const section = document.createElement('div');
  section.className = 'step-section';
  section.dataset.step = number;
  section.innerHTML = `<h3 class="step-section-title"><span class="step-number">${number}</span>${title}</h3>`;
  return section;
}

function createCompactCard(item, selected, onClick) {
  const div = document.createElement('div');
  div.className = `option-card compact ${selected ? 'selected' : ''}`;
  div.innerHTML = `
    <div class="card-icon">${item.icon || '•'}</div>
    <div class="card-title">${item.name}</div>
  `;
  div.addEventListener('click', onClick);
  return div;
}

// 步骤 1：主题选择
function renderStep1() {
  const section = createSection('选择分析主题', 1);

  const cardsBox = document.createElement('div');
  cardsBox.className = 'topic-cards-box';
  TOPICS.forEach(topic => {
    cardsBox.appendChild(createCompactCard(topic, state.topic?.id === topic.id, () => {
      state.topic = topic;
      state.effectConfirmed = false;
      updateModulesFromSelection();
      render();
    }));
  });
  section.appendChild(cardsBox);

  return section;
}

// 步骤 2：分析类型选择
function renderStep2() {
  const section = createSection('选择分析类型', 2);

  const typeGrid = document.createElement('div');
  typeGrid.className = 'option-grid type-grid compact-grid';
  ANALYSIS_TYPES.forEach(type => {
    typeGrid.appendChild(createCompactCard(type, state.type?.id === type.id, () => {
      state.type = type;
      state.effectConfirmed = false;
      state.globalStyles.layout = getRecommendedLayout(type.id);
      updateModulesFromSelection();
      if (type.id !== 'analysis') {
        state.analysisTopic = '';
        state.recommendedFramework = [];
        state.analysisQuestions = {};
      }
      render();
    }));
  });
  section.appendChild(typeGrid);

  return section;
}

// 步骤 3：根据类型差异化渲染
function renderStep3() {
  const section = createSection('确认细节', 3);
  els.stepContent.appendChild(section);

  if (!state.type) {
    const placeholder = document.createElement('div');
    placeholder.className = 'module-placeholder';
    placeholder.textContent = '请先选择分析类型，系统将为您展示对应的配置项。';
    section.appendChild(placeholder);
    return;
  }

  if (state.type.id === 'dashboard') {
    renderDashboardConfig(section);
  } else if (state.type.id === 'analysis') {
    renderAnalysisConfig(section);
  }
}

function updateModulesFromSelection() {
  if (!state.topic || !state.type) return;

  const recommended = getRecommendedModules(state.topic.id, state.type.id);
  const existingMap = new Map(state.modules.map(m => [m.id, m]));

  state.modules = recommended.map(m => {
    const existing = existingMap.get(m.id);
    if (existing) {
      return {
        ...m,
        enabled: existing.enabled !== false,
        customName: existing.customName || existing.name || m.name,
        customDesc: existing.customDesc || existing.desc || m.desc,
        selectedComponents: [...new Set([...(existing.selectedComponents || []), ...m.components])].filter(c =>
          m.components.includes(c)
        ).slice(0, 3),
        selectedConclusions: [...new Set([...(existing.selectedConclusions || []), ...m.conclusion])].filter(c =>
          m.conclusion.includes(c)
        ).slice(0, 2)
      };
    }
    return {
      ...m,
      enabled: true,
      customName: m.name,
      customDesc: m.desc,
      selectedComponents: [...m.components],
      selectedConclusions: [...m.conclusion]
    };
  });
}

// 看板配置
function renderDashboardConfig(section) {
  const { visuals, layouts } = getStyleOptions();

  const globalSection = document.createElement('div');
  globalSection.className = 'style-section';
  globalSection.innerHTML = `
    <h4>🎨 全局视觉与布局</h4>
    <div class="style-group">
      <label>视觉风格</label>
      <div class="chip-group" id="visualChips">
        ${visuals.map(v => `
          <button class="chip ${state.globalStyles.visual === v.id ? 'active' : ''}" data-id="${v.id}" data-type="visual">
            <strong>${v.name}</strong><br><small>${v.desc}</small>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="style-group">
      <label>页面布局</label>
      <div class="chip-group" id="layoutChips">
        ${layouts.map(l => `
          <button class="chip ${state.globalStyles.layout === l.id ? 'active' : ''}" data-id="${l.id}" data-type="layout">
            <strong>${l.name}</strong><br><small>${l.desc}</small>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  section.appendChild(globalSection);

  const moduleSection = document.createElement('div');
  moduleSection.className = 'selection-group';
  moduleSection.innerHTML = `<h4>📐 看板框架模块确认</h4>`;

  if (state.topic) {
    updateModulesFromSelection();

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
      <button class="btn secondary" id="selectAllModules">全选</button>
      <button class="btn secondary" id="deselectAllModules">取消全选</button>
      <button class="btn secondary" id="resetModules">恢复默认</button>
      <button class="btn secondary" id="addCustomModule">+ 添加自定义模块</button>
    `;
    moduleSection.appendChild(toolbar);

    const list = document.createElement('div');
    list.className = 'module-list';

    const grouped = {};
    state.modules.forEach((mod, idx) => {
      const theme = mod.theme || '其他';
      if (!grouped[theme]) grouped[theme] = [];
      grouped[theme].push({ mod, idx });
    });

    Object.keys(grouped).forEach(theme => {
      const themeHeader = document.createElement('div');
      themeHeader.className = 'module-theme-header';
      themeHeader.textContent = theme;
      list.appendChild(themeHeader);

      grouped[theme].forEach(({ mod, idx }) => {
        const row = document.createElement('div');
        row.className = `module-row ${mod.enabled ? '' : 'disabled'}`;
        row.innerHTML = `
          <div class="module-header">
            <label class="checkbox-label">
              <input type="checkbox" data-idx="${idx}" class="module-enable" ${mod.enabled ? 'checked' : ''}>
              <span class="checkmark"></span>
            </label>
            <div class="module-fields">
              <input type="text" class="module-name" data-idx="${idx}" value="${mod.customName}" placeholder="模块名称">
              <input type="text" class="module-desc" data-idx="${idx}" value="${mod.customDesc}" placeholder="模块描述">
            </div>
            <button class="btn icon" data-idx="${idx}" title="删除">🗑️</button>
          </div>
        `;
        list.appendChild(row);
      });
    });
    moduleSection.appendChild(list);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'module-placeholder';
    placeholder.textContent = '请先选择分析主题，系统将为您推荐默认框架模块。';
    moduleSection.appendChild(placeholder);
  }

  section.appendChild(moduleSection);

  const enabledModules = state.modules.filter(m => m.enabled);
  const { components, conclusions } = getStyleOptions();

  enabledModules.forEach(mod => {
    const modSection = document.createElement('div');
    modSection.className = 'style-section module-style';
    modSection.dataset.moduleId = mod.id;

    const groupedComponents = {};
    components.filter(c => c.tags.includes('dashboard')).forEach(c => {
      const cat = c.category || '其他';
      if (!groupedComponents[cat]) groupedComponents[cat] = [];
      groupedComponents[cat].push(c);
    });

    const compHtml = Object.entries(groupedComponents).map(([category, items]) => `
      <div class="chip-category">
        <div class="chip-category-label">${category}</div>
        <div class="chip-group">
          ${items.map(c => `
            <label class="check-chip ${mod.selectedComponents.includes(c.id) ? 'checked' : ''}">
              <input type="checkbox" value="${c.id}" data-module="${mod.id}" data-kind="component" ${mod.selectedComponents.includes(c.id) ? 'checked' : ''}>
              <span>
                <span class="chip-icon">${c.icon || ''}</span>
                <strong>${c.name}</strong><br><small>${c.desc}</small>
              </span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    const conHtml = conclusions.map(c => `
      <label class="check-chip ${mod.selectedConclusions.includes(c.id) ? 'checked' : ''}">
        <input type="checkbox" value="${c.id}" data-module="${mod.id}" data-kind="conclusion" ${mod.selectedConclusions.includes(c.id) ? 'checked' : ''}>
        <span>
          <span class="chip-icon">${c.icon || ''}</span>
          <strong>${c.name}</strong><br><small>${c.desc}</small>
        </span>
      </label>
    `).join('');

    modSection.innerHTML = `
      <h4>🔧 ${mod.customName}：组件与结论样式</h4>
      <p class="section-desc">${mod.customDesc}</p>
      <div class="style-group">
        <label>组件样式（可多选）</label>
        ${compHtml}
      </div>
      <div class="style-group">
        <label>结论样式（可多选）</label>
        <div class="chip-group">${conHtml}</div>
      </div>
    `;

    section.appendChild(modSection);
  });

  const visualChips = document.getElementById('visualChips');
  if (visualChips) {
    visualChips.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.globalStyles.visual = btn.dataset.id;
        state.effectConfirmed = false;
        render();
      });
    });
  }

  const layoutChips = document.getElementById('layoutChips');
  if (layoutChips) {
    layoutChips.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.globalStyles.layout = btn.dataset.id;
        state.effectConfirmed = false;
        render();
      });
    });
  }

  if (state.topic) {
    document.getElementById('selectAllModules').addEventListener('click', () => {
      state.modules.forEach(m => m.enabled = true);
      state.effectConfirmed = false;
      render();
    });
    document.getElementById('deselectAllModules').addEventListener('click', () => {
      state.modules.forEach(m => m.enabled = false);
      state.effectConfirmed = false;
      render();
    });
    document.getElementById('resetModules').addEventListener('click', () => {
      state.modules = getRecommendedModules(state.topic.id, state.type.id).map(m => ({
        ...m,
        enabled: true,
        customName: m.name,
        customDesc: m.desc,
        selectedComponents: [...m.components],
        selectedConclusions: [...m.conclusion]
      }));
      state.effectConfirmed = false;
      render();
    });
    document.getElementById('addCustomModule').addEventListener('click', () => {
      state.modules.push({
        id: 'custom_' + Date.now(),
        name: '自定义模块',
        desc: '请补充该模块的分析要点。',
        components: ['text_card'],
        conclusion: ['bullet'],
        enabled: true,
        customName: '自定义模块',
        customDesc: '请补充该模块的分析要点。',
        selectedComponents: ['text_card'],
        selectedConclusions: ['bullet']
      });
      state.effectConfirmed = false;
      render();
    });

    const listEl = moduleSection.querySelector('.module-list');
    listEl.querySelectorAll('.module-enable').forEach(cb => {
      cb.addEventListener('change', e => {
        const idx = Number(e.target.dataset.idx);
        state.modules[idx].enabled = e.target.checked;
        state.effectConfirmed = false;
        render();
      });
    });

    listEl.querySelectorAll('.module-name').forEach(input => {
      input.addEventListener('input', e => {
        const idx = Number(e.target.dataset.idx);
        state.modules[idx].customName = e.target.value;
      });
    });

    listEl.querySelectorAll('.module-desc').forEach(input => {
      input.addEventListener('input', e => {
        const idx = Number(e.target.dataset.idx);
        state.modules[idx].customDesc = e.target.value;
      });
    });

    listEl.querySelectorAll('.btn.icon').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = Number(e.currentTarget.dataset.idx);
        state.modules.splice(idx, 1);
        state.effectConfirmed = false;
        render();
      });
    });
  }

  document.querySelectorAll('.check-chip input').forEach(cb => {
    cb.addEventListener('change', e => {
      const mod = state.modules.find(m => m.id === e.target.dataset.module);
      const kind = e.target.dataset.kind;
      const list = kind === 'component' ? mod.selectedComponents : mod.selectedConclusions;
      const val = e.target.value;
      if (e.target.checked) {
        if (!list.includes(val)) list.push(val);
      } else {
        const idx = list.indexOf(val);
        if (idx !== -1) list.splice(idx, 1);
      }
      state.effectConfirmed = false;
      e.target.closest('.check-chip').classList.toggle('checked', e.target.checked);
    });
  });
}

// 分析配置
function renderAnalysisConfig(section) {
  const topicSection = document.createElement('div');
  topicSection.className = 'selection-group';
  topicSection.innerHTML = `
    <h4>📝 输入想分析的主题或问题</h4>
    <div class="analysis-topic-box">
      <input type="text" id="analysisTopicInput" class="analysis-topic-input" 
        placeholder="例如：三月份合同额为什么下降、各战区业绩对比、JDY客户覆盖情况..." 
        value="${escapeHtml(state.analysisTopic)}">
      <button class="btn primary" id="recommendFrameworkBtn">💡 智能推荐</button>
    </div>
    <p class="input-hint">输入分析主题或具体问题后，系统将结合新产品/行业业务知识，智能推荐可勾选的分析模块。</p>
  `;
  section.appendChild(topicSection);

  if (Array.isArray(state.recommendedFramework) && state.recommendedFramework.length > 0) {
    const recSection = document.createElement('div');
    recSection.className = 'selection-group';
    recSection.innerHTML = `<h4>📊 智能推荐分析框架</h4>`;

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
      <button class="btn secondary" id="selectAllFramework">全选</button>
      <button class="btn secondary" id="deselectAllFramework">取消全选</button>
    `;
    recSection.appendChild(toolbar);

    const table = document.createElement('table');
    table.className = 'framework-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th class="col-drag"></th>
          <th class="col-check">选择</th>
          <th class="col-module">分析模块</th>
          <th class="col-breakdown">拆解分析内容</th>
          <th class="col-action"></th>
        </tr>
      </thead>
      <tbody>
        ${state.recommendedFramework.map((item, idx) => `
          <tr class="${item.checked ? 'selected-row' : ''}" draggable="true" data-idx="${idx}">
            <td class="col-drag">
              <span class="drag-handle" title="拖拽调整顺序">≡</span>
            </td>
            <td class="col-check">
              <label class="checkbox-label">
                <input type="checkbox" class="framework-check" data-idx="${idx}" ${item.checked ? 'checked' : ''}>
                <span class="checkmark"></span>
              </label>
            </td>
            <td class="col-module">
              <input type="text" class="module-name-edit" data-idx="${idx}" value="${escapeHtml(item.module)}" placeholder="模块名称">
            </td>
            <td class="col-breakdown">
              <input type="text" class="module-breakdown-edit" data-idx="${idx}" value="${escapeHtml(item.breakdown)}" placeholder="拆解分析内容">
            </td>
            <td class="col-action">
              <button class="btn icon delete-module" data-idx="${idx}" title="删除模块">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    recSection.appendChild(table);

    const addCustomSection = document.createElement('div');
    addCustomSection.className = 'add-custom-module';
    addCustomSection.innerHTML = `
      <div class="custom-module-inline">
        <input type="text" id="customModuleName" placeholder="自定义模块名称">
        <input type="text" id="customModuleBreakdown" placeholder="拆解分析内容（可选）">
        <button class="btn primary" id="addCustomModuleBtn">+ 新增模块</button>
      </div>
    `;
    recSection.appendChild(addCustomSection);

    section.appendChild(recSection);

    document.getElementById('selectAllFramework').addEventListener('click', () => {
      state.recommendedFramework.forEach(item => item.checked = true);
      state.effectConfirmed = false;
      render();
    });
    document.getElementById('deselectAllFramework').addEventListener('click', () => {
      state.recommendedFramework.forEach(item => item.checked = false);
      state.effectConfirmed = false;
      render();
    });

    table.querySelectorAll('.framework-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const idx = Number(e.target.dataset.idx);
        state.recommendedFramework[idx].checked = e.target.checked;
        state.effectConfirmed = false;
        render();
      });
    });

    table.querySelectorAll('.module-name-edit').forEach(input => {
      input.addEventListener('change', e => {
        const idx = Number(e.target.dataset.idx);
        state.recommendedFramework[idx].module = e.target.value.trim();
        state.effectConfirmed = false;
        saveState();
      });
    });

    table.querySelectorAll('.module-breakdown-edit').forEach(input => {
      input.addEventListener('change', e => {
        const idx = Number(e.target.dataset.idx);
        state.recommendedFramework[idx].breakdown = e.target.value.trim();
        state.effectConfirmed = false;
        saveState();
      });
    });

    table.querySelectorAll('.delete-module').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = Number(btn.dataset.idx);
        state.recommendedFramework.splice(idx, 1);
        state.effectConfirmed = false;
        render();
      });
    });

    // 拖拽排序
    let dragSrcIdx = null;
    table.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('dragstart', e => {
        dragSrcIdx = Number(row.dataset.idx);
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        dragSrcIdx = null;
        table.querySelectorAll('tbody tr').forEach(r => r.classList.remove('drag-over'));
      });
      row.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('drag-over');
      });
      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over');
      });
      row.addEventListener('drop', e => {
        e.preventDefault();
        row.classList.remove('drag-over');
        const dragDstIdx = Number(row.dataset.idx);
        if (dragSrcIdx === null || dragSrcIdx === dragDstIdx) return;
        const moved = state.recommendedFramework.splice(dragSrcIdx, 1)[0];
        state.recommendedFramework.splice(dragDstIdx, 0, moved);
        state.effectConfirmed = false;
        render();
      });
    });

    document.getElementById('addCustomModuleBtn').addEventListener('click', () => {
      const nameInput = document.getElementById('customModuleName');
      const breakdownInput = document.getElementById('customModuleBreakdown');
      const name = nameInput.value.trim();
      const breakdown = breakdownInput.value.trim();
      if (!name) {
        showToast('请输入模块名称');
        return;
      }
      state.recommendedFramework.push({
        id: 'custom_' + Date.now(),
        module: name,
        breakdown: breakdown || '自定义分析模块，请结合业务场景补充拆解内容。',
        relatedTables: [],
        checked: true
      });
      state.effectConfirmed = false;
      render();
    });

    document.getElementById('customModuleName').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('customModuleBreakdown').focus();
      }
    });

    document.getElementById('customModuleBreakdown').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('addCustomModuleBtn').click();
      }
    });
  } else if (state.analysisTopic.trim()) {
    const emptySection = document.createElement('div');
    emptySection.className = 'selection-group';
    emptySection.innerHTML = `
      <div class="module-placeholder">
        未找到与「${escapeHtml(state.analysisTopic)}」高度匹配的分析模块，请尝试输入更明确的关键词（如：合同、业绩、客户、回款等）。
      </div>
    `;
    section.appendChild(emptySection);
  }

  const topicInput = document.getElementById('analysisTopicInput');
  const recommendBtn = document.getElementById('recommendFrameworkBtn');

  topicInput.addEventListener('input', e => {
    state.analysisTopic = e.target.value;
    state.effectConfirmed = false;
    saveState();
  });

  topicInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      refreshRecommendedFramework();
    }
  });

  recommendBtn.addEventListener('click', () => {
    refreshRecommendedFramework();
  });
}

function refreshRecommendedFramework() {
  const input = document.getElementById('analysisTopicInput');
  state.analysisTopic = input.value.trim();
  if (!state.topic?.id) {
    showToast('请先选择分析主题');
    scrollToStep(1);
    return;
  }
  state.recommendedFramework = recommendFrameworkByTopic(state.analysisTopic, state.topic.id) || [];
  state.analysisQuestions = {};
  state.effectConfirmed = false;
  render();
  // 推荐完成后自动滚动到第三步结果区域
  setTimeout(() => {
    const frameworkTable = document.querySelector('.framework-table');
    if (frameworkTable) {
      frameworkTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollToStep(3);
    }
  }, 100);
}

// 步骤 4：针对每个分析模块选择具体问题
function renderStep4() {
  const section = createSection('选择具体问题', 4);

  const selectedFramework = state.recommendedFramework.filter(item => item.checked);
  if (selectedFramework.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'module-placeholder';
    placeholder.textContent = '请先在第三步勾选至少一个分析模块，再选择具体问题。';
    section.appendChild(placeholder);
    els.stepContent.appendChild(section);
    return;
  }

  const headerInfo = document.createElement('div');
  headerInfo.className = 'step4-header-info';
  headerInfo.innerHTML = `
    <p class="input-hint">
      以下问题已根据第三步勾选的 <strong>${selectedFramework.length}</strong> 个分析模块进行过滤，请勾选想回答的问题。
    </p>
  `;
  section.appendChild(headerInfo);

  selectedFramework.forEach(item => {
    const moduleQuestions = state.analysisQuestions[item.id];
    if (!moduleQuestions) return;

    const moduleSection = document.createElement('div');
    moduleSection.className = 'module-question-section';

    let moduleHtml = `
      <div class="module-question-header">
        <strong>${escapeHtml(item.module)}</strong>
        <span>${escapeHtml(item.breakdown)}</span>
      </div>
    `;

    const allQuestions = [];
    moduleQuestions.categories.forEach((cat, catIdx) => {
      cat.questions.forEach((q, qIdx) => {
        allQuestions.push({ text: q.text, checked: q.checked, catIdx, qIdx, isCustom: false });
      });
    });

    if (allQuestions.length > 0) {
      moduleHtml += `
        <div class="question-list flat-question-list">
          ${allQuestions.map(q => `
            <label class="question-item ${q.checked ? 'checked' : ''}">
              <input type="checkbox" class="question-check" data-module="${item.id}" data-cat="${q.catIdx}" data-idx="${q.qIdx}" ${q.checked ? 'checked' : ''}>
              <input type="text" class="question-text-edit" data-module="${item.id}" data-cat="${q.catIdx}" data-idx="${q.qIdx}" value="${escapeHtml(q.text)}">
              <button class="btn icon delete-question" data-module="${item.id}" data-cat="${q.catIdx}" data-idx="${q.qIdx}" title="删除">🗑️</button>
            </label>
          `).join('')}
        </div>
      `;
    } else if (item.id.startsWith('custom_')) {
      moduleHtml += `
        <div class="module-no-questions-hint">
          自定义模块暂无预设问题，AI 将基于模块主题自行生成分析角度；你也可以在下方添加具体想分析的问题。
        </div>
      `;
    }

    moduleHtml += `
      <div class="module-question-hint">
        💡 如果以上问题不能覆盖你的分析诉求，可以在下方补充自定义问题。
      </div>
      <div class="module-custom-add">
        <div class="custom-question-inline">
          <input type="text" class="custom-q-input" data-module="${item.id}" placeholder="添加该模块的自定义问题...">
          <button class="btn primary add-module-custom-q" data-module="${item.id}">添加</button>
        </div>
      </div>
    `;

    if (moduleQuestions.customQuestions.length > 0) {
      moduleHtml += `
        <div class="custom-question-list">
          ${moduleQuestions.customQuestions.map((q, qIdx) => `
            <label class="question-item ${q.checked ? 'checked' : ''}">
              <input type="checkbox" class="module-custom-q-check" data-module="${item.id}" data-idx="${qIdx}" ${q.checked ? 'checked' : ''}>
              <input type="text" class="custom-q-text-edit" data-module="${item.id}" data-idx="${qIdx}" value="${escapeHtml(q.text)}">
              <button class="btn icon module-custom-q-delete" data-module="${item.id}" data-idx="${qIdx}" title="删除">🗑️</button>
            </label>
          `).join('')}
        </div>
      `;
    }

    moduleSection.innerHTML = moduleHtml;
    section.appendChild(moduleSection);

    moduleSection.querySelectorAll('.question-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const moduleId = e.target.dataset.module;
        const catIdx = Number(e.target.dataset.cat);
        const qIdx = Number(e.target.dataset.idx);
        state.analysisQuestions[moduleId].categories[catIdx].questions[qIdx].checked = e.target.checked;
        state.effectConfirmed = false;
        render();
      });
    });

    moduleSection.querySelectorAll('.question-text-edit').forEach(input => {
      input.addEventListener('change', e => {
        const moduleId = e.target.dataset.module;
        const catIdx = Number(e.target.dataset.cat);
        const qIdx = Number(e.target.dataset.idx);
        state.analysisQuestions[moduleId].categories[catIdx].questions[qIdx].text = e.target.value.trim();
        state.effectConfirmed = false;
        saveState();
      });
    });

    moduleSection.querySelectorAll('.delete-question').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const moduleId = btn.dataset.module;
        const catIdx = Number(btn.dataset.cat);
        const qIdx = Number(btn.dataset.idx);
        state.analysisQuestions[moduleId].categories[catIdx].questions.splice(qIdx, 1);
        state.effectConfirmed = false;
        render();
      });
    });

    const addCustomQ = () => {
      const input = moduleSection.querySelector(`.custom-q-input[data-module="${item.id}"]`);
      const text = input.value.trim();
      if (!text) {
        showToast('请先输入问题内容');
        return;
      }
      state.analysisQuestions[item.id].customQuestions.push({ text, checked: true });
      state.effectConfirmed = false;
      render();
    };

    moduleSection.querySelector('.add-module-custom-q').addEventListener('click', addCustomQ);
    moduleSection.querySelector('.custom-q-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomQ();
      }
    });

    moduleSection.querySelectorAll('.module-custom-q-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const moduleId = e.target.dataset.module;
        const qIdx = Number(e.target.dataset.idx);
        state.analysisQuestions[moduleId].customQuestions[qIdx].checked = e.target.checked;
        state.effectConfirmed = false;
        render();
      });
    });

    moduleSection.querySelectorAll('.custom-q-text-edit').forEach(input => {
      input.addEventListener('change', e => {
        const moduleId = e.target.dataset.module;
        const qIdx = Number(e.target.dataset.idx);
        state.analysisQuestions[moduleId].customQuestions[qIdx].text = e.target.value.trim();
        state.effectConfirmed = false;
        saveState();
      });
    });

    moduleSection.querySelectorAll('.module-custom-q-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const moduleId = btn.dataset.module;
        const qIdx = Number(btn.dataset.idx);
        state.analysisQuestions[moduleId].customQuestions.splice(qIdx, 1);
        state.effectConfirmed = false;
        render();
      });
    });
  });

  els.stepContent.appendChild(section);
}

function isValid() {
  if (!state.topic) return false;
  if (!state.type) return false;

  if (state.type.id === 'dashboard') {
    return state.modules.filter(m => m.enabled).length > 0;
  } else if (state.type.id === 'analysis') {
    if (!state.analysisTopic.trim()) return false;
    if (!state.recommendedFramework.some(item => item.checked)) return false;
    return Object.values(state.analysisQuestions).some(mq =>
      mq.categories.some(cat => cat.questions.some(q => q.checked)) ||
      mq.customQuestions.some(q => q.checked)
    );
  }
  return false;
}

function validate() {
  if (!state.topic) {
    showToast('请先选择一个分析主题');
    scrollToStep(1);
    return false;
  }
  if (!state.type) {
    showToast('请先选择一种分析类型');
    scrollToStep(2);
    return false;
  }
  if (state.type.id === 'dashboard') {
    const enabled = state.modules.filter(m => m.enabled);
    if (enabled.length === 0) {
      showToast('请至少勾选一个看板模块');
      scrollToStep(3);
      return false;
    }
  } else if (state.type.id === 'analysis') {
    if (!state.analysisTopic.trim()) {
      showToast('请输入想分析的主题');
      scrollToStep(3);
      return false;
    }
    const selectedFramework = state.recommendedFramework.filter(item => item.checked);
    if (selectedFramework.length === 0) {
      showToast('请至少勾选一个分析模块');
      scrollToStep(3);
      return false;
    }
    const hasQuestion = Object.values(state.analysisQuestions).some(mq =>
      mq.categories.some(cat => cat.questions.some(q => q.checked)) ||
      mq.customQuestions.some(q => q.checked)
    );
    if (!hasQuestion) {
      showToast('请至少勾选一个具体分析问题，或在模块内添加自定义问题');
      scrollToStep(4);
      return false;
    }
  }
  return true;
}

function scrollToStep(stepNumber) {
  const section = document.querySelector(`.step-section[data-step="${stepNumber}"]`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    section.classList.add('highlight');
    setTimeout(() => section.classList.remove('highlight'), 1500);
  }
}

// 预览弹窗
function openPreviewModal() {
  if (!validate()) return;
  renderPreviewContent();
  els.previewModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  els.previewModal.style.display = 'none';
  document.body.style.overflow = '';
}

function confirmEffect() {
  state.effectConfirmed = true;
  saveState();
  closePreviewModal();
  renderButtons();
  showToast('效果已确认，点击「生成提示词」获取最终结果');
}

function renderPreviewContent() {
  const lines = [];

  lines.push(`<div class="preview-summary">`);
  lines.push(`<div class="preview-row"><span class="preview-label">分析主题</span><span class="preview-value">${escapeHtml(state.topic.name)}</span></div>`);
  lines.push(`<div class="preview-row"><span class="preview-label">分析类型</span><span class="preview-value">${escapeHtml(state.type.name)}</span></div>`);

  if (state.type.id === 'analysis') {
    lines.push(`<div class="preview-row"><span class="preview-label">分析主题/问题</span><span class="preview-value">${escapeHtml(state.analysisTopic)}</span></div>`);
  }
  lines.push(`</div>`);

  if (state.type.id === 'dashboard') {
    const enabledModules = state.modules.filter(m => m.enabled);
    lines.push(`<div class="preview-block"><h5>📐 已选看板模块（${enabledModules.length}）</h5>`);
    lines.push(`<ul class="preview-list">`);
    enabledModules.forEach(mod => {
      lines.push(`<li><strong>${escapeHtml(mod.customName)}</strong>：${escapeHtml(mod.customDesc)}`);
      lines.push(`<br><small>组件：${mod.selectedComponents.map(c => COMPONENT_STYLES[c]?.name || c).join('、')}</small>`);
      lines.push(`<br><small>结论：${mod.selectedConclusions.map(c => CONCLUSION_STYLES[c]?.name || c).join('、')}</small></li>`);
    });
    lines.push(`</ul></div>`);

    const visual = VISUAL_STYLES[state.globalStyles.visual];
    const layout = LAYOUT_STYLES[state.globalStyles.layout];
    lines.push(`<div class="preview-block"><h5>🎨 全局样式</h5>`);
    lines.push(`<ul class="preview-list"><li>视觉风格：${escapeHtml(visual.name)} — ${escapeHtml(visual.desc)}</li>`);
    lines.push(`<li>页面布局：${escapeHtml(layout.name)} — ${escapeHtml(layout.desc)}</li></ul></div>`);
  } else if (state.type.id === 'analysis') {
    const selectedItems = state.recommendedFramework.filter(item => item.checked);

    // 以「模块 + 具体问题」的方式展示预估报告结构，不单独列模块说明，不写问题分类大标题
    const modulesWithQuestions = selectedItems.map(item => {
      const mq = state.analysisQuestions[item.id];
      const checkedQs = [];
      if (mq) {
        mq.categories.forEach(cat => {
          cat.questions.filter(q => q.checked).forEach(q => checkedQs.push(q.text));
        });
        mq.customQuestions.filter(q => q.checked).forEach(q => checkedQs.push(`${q.text}（自定义）`));
      }
      return { item, checkedQs };
    }).filter(({ checkedQs }) => checkedQs.length > 0);

    if (modulesWithQuestions.length > 0) {
      lines.push(`<div class="preview-block"><h5>📋 预估报告结构（按模块组织）</h5>`);
      modulesWithQuestions.forEach(({ item, checkedQs }) => {
        lines.push(`<div class="preview-subblock">`);
        lines.push(`<div class="preview-subblock-title">${escapeHtml(item.module)}</div>`);
        lines.push(`<ol class="preview-question-list">`);
        checkedQs.forEach(text => lines.push(`<li>${escapeHtml(text)}</li>`));
        lines.push(`</ol>`);
        lines.push(`</div>`);
      });
      lines.push(`</div>`);
    }
  }

  lines.push(`<div class="preview-block preview-effect"><h5>🎯 预估生成效果</h5>`);
  if (state.type.id === 'dashboard') {
    lines.push(`<p>将生成一页式可视化看板，包含上述 ${state.modules.filter(m => m.enabled).length} 个模块，每个模块以卡片形式展示，配合选定的组件样式与结论样式，整体采用 ${escapeHtml(VISUAL_STYLES[state.globalStyles.visual].name)} 色调与 ${escapeHtml(LAYOUT_STYLES[state.globalStyles.layout].name)}。</p>`);
  } else {
    lines.push(`<p>将生成一份结构化分析报告，围绕「${escapeHtml(state.analysisTopic)}」展开，基于新产品/行业业务知识，对勾选的每个分析模块回答具体业务问题，输出背景说明、数据图表、根因解读、核心结论与下一步行动建议。</p>`);
  }
  lines.push(`</div>`);

  els.previewBody.innerHTML = lines.join('');
}

// 结果弹窗
async function generatePrompt() {
  if (!validate()) return;

  saveRecordToBackend().catch(err => console.warn('保存使用记录失败', err));

  const promptText = buildPrompt({
    topic: state.topic,
    type: state.type,
    analysisTopic: state.analysisTopic,
    recommendedFramework: state.recommendedFramework,
    analysisQuestions: state.analysisQuestions,
    globalStyles: state.globalStyles,
    modules: state.modules.filter(m => m.enabled).map(m => ({
      ...m,
      name: m.customName,
      desc: m.customDesc
    }))
  });

  els.promptOutput.value = promptText;
  openModal();
}

async function saveRecordToBackend() {
  const checkedModules = [];
  const checkedQuestions = [];

  if (state.type?.id === 'analysis') {
    state.recommendedFramework.filter(item => item.checked).forEach(item => {
      checkedModules.push(`[${item.module}] ${item.breakdown}`);
    });
    Object.entries(state.analysisQuestions).forEach(([moduleId, mq]) => {
      const moduleName = state.recommendedFramework.find(item => item.id === moduleId)?.module || moduleId;
      mq.categories.forEach(cat => {
        cat.questions.filter(q => q.checked).forEach(q => {
          checkedQuestions.push(`[${moduleName} · ${cat.name}] ${q.text}`);
        });
      });
      mq.customQuestions.filter(q => q.checked).forEach(q => {
        checkedQuestions.push(`[${moduleName}] ${q.text}（自定义）`);
      });
    });
  }

  const record = {
    topic: state.topic?.name || '',
    type: state.type?.name || '',
    analysisTopic: state.analysisTopic,
    checkedModules,
    checkedQuestions
  };

  const res = await fetch('/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

function openModal() {
  els.resultModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  els.resultModal.style.display = 'none';
  document.body.style.overflow = '';
}

async function copyPrompt() {
  await copyText(els.promptOutput.value);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('提示词已复制到剪贴板');
  } catch (err) {
    showToast('复制失败，请手动复制');
  }
}

function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  setTimeout(() => els.toast.classList.remove('show'), 2500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

init();
