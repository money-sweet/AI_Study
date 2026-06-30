/**
 * 数小搭 - 数据分析提示词生成器 - 配置数据
 * 集中维护主题、分析类型、推荐模块、组件样式、结论样式。
 * 智能推荐的指标、维度、建议问题均来自内置业务知识库，无需访问外部 KMS 指标库。
 */

const TOPICS = [
  {
    id: 'new_product',
    name: '新产品',
    icon: '🚀',
    desc: '围绕新产品的市场表现、用户反馈、销售漏斗等进行分析。'
  },
  {
    id: 'industry',
    name: '行业分析',
    icon: '🏭',
    desc: '聚焦行业规模、竞争格局、趋势变化、政策影响等宏观视角。'
  }
];

const ANALYSIS_TYPES = [
  {
    id: 'dashboard',
    name: '看板',
    icon: '📊',
    desc: '一页式可视化大屏，强调 KPI 与图表展示。'
  },
  {
    id: 'analysis',
    name: '分析',
    icon: '📑',
    desc: '结构化分析报告，聚焦数据解读、根因剖析与行动建议。'
  }
];

// 组件样式模板
const COMPONENT_STYLES = {
  kpi_card: {
    id: 'kpi_card',
    name: 'KPI 卡片',
    icon: '📊',
    category: '核心指标',
    desc: '顶部展示核心指标，配合同比/环比箭头和简洁数值。',
    tags: ['dashboard', 'analysis']
  },
  line_chart: {
    id: 'line_chart',
    name: '折线图',
    icon: '📈',
    category: '趋势对比',
    desc: '展示指标随时间变化的趋势，线条平滑、标注关键节点。',
    tags: ['dashboard', 'analysis']
  },
  bar_chart: {
    id: 'bar_chart',
    name: '柱状图',
    icon: '📊',
    category: '趋势对比',
    desc: '用于类别对比，柱体间距适中，支持横向或纵向排列。',
    tags: ['dashboard', 'analysis']
  },
  pie_chart: {
    id: 'pie_chart',
    name: '饼图 / 环形图',
    icon: '🍩',
    category: '结构分布',
    desc: '展示占比结构，图例清晰，突出最大占比项。',
    tags: ['dashboard', 'analysis']
  },
  funnel: {
    id: 'funnel',
    name: '漏斗图',
    icon: '🔻',
    category: '结构分布',
    desc: '展示转化路径，逐层收窄，标注每步转化率。',
    tags: ['dashboard', 'analysis']
  },
  table: {
    id: 'table',
    name: '明细表格',
    icon: '📋',
    category: '明细定位',
    desc: '行列对齐，表头高亮，关键数据使用条件格式着色。',
    tags: ['dashboard', 'analysis']
  },
  map: {
    id: 'map',
    name: '地图',
    icon: '🗺️',
    category: '明细定位',
    desc: '按地域热力或气泡展示分布，颜色区分密集程度。',
    tags: ['dashboard', 'analysis']
  },
  text_card: {
    id: 'text_card',
    name: '文本卡片',
    icon: '📝',
    category: '核心指标',
    desc: '用简短文字呈现定义、背景或核心观点，留白充足。',
    tags: ['dashboard', 'analysis']
  },
  radar: {
    id: 'radar',
    name: '雷达图',
    icon: '🕸️',
    category: '多维评估',
    desc: '多维度能力对比，轴线清晰、填充半透明。',
    tags: ['dashboard', 'analysis']
  },
  waterfall: {
    id: 'waterfall',
    name: '瀑布图',
    icon: '🌊',
    category: '结构分布',
    desc: '展示累计变化过程，正向负向用不同颜色区分。',
    tags: ['dashboard', 'analysis']
  }
};

// 视觉风格模板
const VISUAL_STYLES = {
  professional_blue: {
    id: 'professional_blue',
    name: '专业蓝',
    desc: '以深蓝、天蓝、白色为主，冷静理性，适合企业汇报。'
  },
  warm: {
    id: 'warm',
    name: '暖色调',
    desc: '橙红、暖黄为主，活泼醒目，适合营销与增长场景。'
  },
  cool: {
    id: 'cool',
    name: '冷色调',
    desc: '青绿、薄荷绿为主，清新自然，适合健康与环保主题。'
  },
  monochrome: {
    id: 'monochrome',
    name: '单色灰',
    desc: '黑白灰阶，低调稳重，适合极简商务风格。'
  },
  high_contrast: {
    id: 'high_contrast',
    name: '高对比',
    desc: '深色背景配亮色图表，视觉冲击力强的数据大屏风格。'
  }
};

// 布局风格模板
const LAYOUT_STYLES = {
  grid: {
    id: 'grid',
    name: '网格布局',
    desc: '等分卡片网格，整齐划一，适合看板。'
  },
  left_right: {
    id: 'left_right',
    name: '左右分栏',
    desc: '左侧核心指标，右侧详细图表，主次分明。'
  },
  top_down: {
    id: 'top_down',
    name: '上下分层',
    desc: '顶部总览，中部趋势，底部明细，符合阅读顺序。'
  },
  card_flow: {
    id: 'card_flow',
    name: '卡片流式',
    desc: '模块以卡片形式依次展开，适合报告式阅读。'
  }
};

// 结论样式模板
const CONCLUSION_STYLES = {
  summary: {
    id: 'summary',
    name: '执行摘要',
    icon: '📝',
    desc: '用 2-3 句话概括模块核心发现，突出关键数字。'
  },
  bullet: {
    id: 'bullet',
    name: '要点列表',
    icon: '📌',
    desc: '3-5 条 bullet points，每条包含结论与数据支撑。'
  },
  swot: {
    id: 'swot',
    name: 'SWOT 分析',
    icon: '🎯',
    desc: '从优势、劣势、机会、威胁四象限输出结论。'
  },
  suggestion: {
    id: 'suggestion',
    name: '建议清单',
    icon: '💡',
    desc: '列出可落地的 3-5 条行动建议，按优先级排列。'
  },
  interpretation: {
    id: 'interpretation',
    name: '数据解读段落',
    icon: '🔍',
    desc: '以连贯段落说明数据背后的业务含义。'
  }
};

// 默认全局样式选择
const DEFAULT_GLOBAL_STYLES = {
  visual: 'professional_blue',
  layout: 'grid'
};

// 框架主题与细分模块库（基于内置业务知识梳理）
const MODULE_TEMPLATES = {
  // 一、业绩 / 组织绩效分析
  org_performance: {
    id: 'org_performance',
    theme: '业绩 / 组织绩效分析',
    name: '组织绩效达成',
    desc: '年度/月度销售额-D、目标完成率、进度追踪。',
    components: ['kpi_card', 'bar_chart', 'line_chart'],
    conclusion: ['summary', 'bullet']
  },
  region_performance: {
    id: 'region_performance',
    theme: '业绩 / 组织绩效分析',
    name: '战区业绩',
    desc: '各大区销售额、目标达成、同比/环比。',
    components: ['bar_chart', 'map', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  team_performance: {
    id: 'team_performance',
    theme: '业绩 / 组织绩效分析',
    name: '小组业绩',
    desc: '销售小组/售前小组的业绩排名与贡献。',
    components: ['bar_chart', 'table', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  individual_performance: {
    id: 'individual_performance',
    theme: '业绩 / 组织绩效分析',
    name: '个人业绩',
    desc: '销售个人销售额、签单数、回款额。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  performance_comparison: {
    id: 'performance_comparison',
    theme: '业绩 / 组织绩效分析',
    name: '绩效横向对比',
    desc: '战区间、小组间、个人间的业绩对比。',
    components: ['bar_chart', 'radar', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  order_structure: {
    id: 'order_structure',
    theme: '业绩 / 组织绩效分析',
    name: '签单结构',
    desc: '新购/升级/续费/流失的结构占比。',
    components: ['pie_chart', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  historical_order_structure: {
    id: 'historical_order_structure',
    theme: '业绩 / 组织绩效分析',
    name: '历史签单结构',
    desc: '多年度签单趋势与构成变化。',
    components: ['line_chart', 'bar_chart', 'pie_chart'],
    conclusion: ['interpretation', 'bullet']
  },

  // 二、合同与签单分析
  contract_management: {
    id: 'contract_management',
    theme: '合同与签单分析',
    name: '合同管理',
    desc: '合同签订、合同产品线、合同总额。',
    components: ['table', 'kpi_card', 'bar_chart'],
    conclusion: ['summary', 'bullet']
  },
  order_new_upgrade: {
    id: 'order_new_upgrade',
    theme: '合同与签单分析',
    name: '签单分析-新购升级',
    desc: '新客签单、老客升级签单的金额与数量。',
    components: ['bar_chart', 'line_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  order_renewal: {
    id: 'order_renewal',
    theme: '合同与签单分析',
    name: '签单分析-Name续费',
    desc: 'Name客户续费签单、续费率。',
    components: ['bar_chart', 'pie_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  contract_caliber: {
    id: 'contract_caliber',
    theme: '合同与签单分析',
    name: '合同口径分析',
    desc: '合同额按不同口径（关联/非关联、产品线）拆分。',
    components: ['pie_chart', 'bar_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  product_coverage: {
    id: 'product_coverage',
    theme: '合同与签单分析',
    name: '合作客户产品覆盖',
    desc: '存量客户购买产品线的覆盖情况。',
    components: ['table', 'bar_chart', 'pie_chart'],
    conclusion: ['bullet', 'suggestion']
  },
  key_customer_order: {
    id: 'key_customer_order',
    theme: '合同与签单分析',
    name: '重点客户签单',
    desc: '大客户/标杆客户的签单跟踪。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['summary', 'bullet']
  },

  // 三、机会管理
  opportunity_forecast: {
    id: 'opportunity_forecast',
    theme: '机会管理',
    name: '机会预测',
    desc: '基于机会金额与成交概率的销售额预测。',
    components: ['line_chart', 'waterfall', 'kpi_card'],
    conclusion: ['summary', 'bullet']
  },
  opportunity_pipeline: {
    id: 'opportunity_pipeline',
    theme: '机会管理',
    name: '机会储备',
    desc: '跟进中机会的金额、数量、阶段分布。',
    components: ['funnel', 'bar_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  opportunity_followup: {
    id: 'opportunity_followup',
    theme: '机会管理',
    name: '机会跟进',
    desc: '机会的创建、修改、关闭时间线。',
    components: ['line_chart', 'table', 'text_card'],
    conclusion: ['bullet', 'interpretation']
  },
  ltc_process: {
    id: 'ltc_process',
    theme: '机会管理',
    name: 'LTC过程',
    desc: '线索→机会→合同的全流程转化。',
    components: ['funnel', 'line_chart', 'bar_chart'],
    conclusion: ['bullet', 'suggestion']
  },
  opportunity_loss: {
    id: 'opportunity_loss',
    theme: '机会管理',
    name: '机会丢失分析',
    desc: '跟进失败原因、竞争对手分析。',
    components: ['pie_chart', 'bar_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },

  // 四、客户运营分析
  customer_segmentation: {
    id: 'customer_segmentation',
    theme: '客户运营分析',
    name: '客户分层/分群',
    desc: '按规模、行业、价值等维度划分客户。',
    components: ['pie_chart', 'bar_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  sp_customer_operation: {
    id: 'sp_customer_operation',
    theme: '客户运营分析',
    name: 'SP客群运营',
    desc: '战略/重点客群的签单、机会、名单管理。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'suggestion']
  },
  benchmark_customers: {
    id: 'benchmark_customers',
    theme: '客户运营分析',
    name: '标杆客户',
    desc: '标杆案例、(准)标杆客户跟踪。',
    components: ['table', 'text_card', 'bar_chart'],
    conclusion: ['bullet', 'summary']
  },
  key_customer_analysis: {
    id: 'key_customer_analysis',
    theme: '客户运营分析',
    name: '重点客户分析',
    desc: '大客户集中度、贡献度分析。',
    components: ['bar_chart', 'pie_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  customer_health_score: {
    id: 'customer_health_score',
    theme: '客户运营分析',
    name: '客户健康分',
    desc: '客户活跃度、使用健康度评分。',
    components: ['radar', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  customer_trend: {
    id: 'customer_trend',
    theme: '客户运营分析',
    name: '客户数趋势',
    desc: '新增客户、流失客户、净增客户趋势。',
    components: ['line_chart', 'waterfall', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  new_customers: {
    id: 'new_customers',
    theme: '客户运营分析',
    name: '新购客户',
    desc: '新客户获取数量、来源、行业分布。',
    components: ['bar_chart', 'pie_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },
  customer_churn: {
    id: 'customer_churn',
    theme: '客户运营分析',
    name: '客户流失',
    desc: '流失客户识别、流失原因、应续未续。',
    components: ['table', 'bar_chart', 'pie_chart'],
    conclusion: ['bullet', 'suggestion']
  },

  // 五、收入与回款
  arr_analysis: {
    id: 'arr_analysis',
    theme: '收入与回款',
    name: 'ARR分析',
    desc: '年度经常性收入、NDR（净收入留存率）。',
    components: ['kpi_card', 'line_chart', 'waterfall'],
    conclusion: ['summary', 'bullet']
  },
  renewal_rate: {
    id: 'renewal_rate',
    theme: '收入与回款',
    name: '续约率/续费率',
    desc: '到期客户续约情况、续费金额。',
    components: ['kpi_card', 'bar_chart', 'line_chart'],
    conclusion: ['bullet', 'interpretation']
  },
  renewal_amount_distribution: {
    id: 'renewal_amount_distribution',
    theme: '收入与回款',
    name: '应续金额分布',
    desc: '未来到期金额、客户分布、风险分层。',
    components: ['bar_chart', 'pie_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },
  receivable_analysis: {
    id: 'receivable_analysis',
    theme: '收入与回款',
    name: '应收分析',
    desc: '应回款、已回款、待回款、逾期金额。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'interpretation']
  },
  collection_overview: {
    id: 'collection_overview',
    theme: '收入与回款',
    name: '回款概况',
    desc: '回款率、回款挑战、回款预测。',
    components: ['kpi_card', 'line_chart', 'bar_chart'],
    conclusion: ['summary', 'bullet']
  },
  net_collection: {
    id: 'net_collection',
    theme: '收入与回款',
    name: '净回款',
    desc: '扣除退款后的实际回款。',
    components: ['kpi_card', 'waterfall', 'line_chart'],
    conclusion: ['bullet', 'interpretation']
  },

  // 六、行业 / 客群专题分析
  industry_segmentation: {
    id: 'industry_segmentation',
    theme: '行业 / 客群专题分析',
    name: '细分行业分析',
    desc: '按一/二/三级行业拆分的销售额与机会。',
    components: ['bar_chart', 'table', 'pie_chart'],
    conclusion: ['bullet', 'interpretation']
  },
  industry_penetration: {
    id: 'industry_penetration',
    theme: '行业 / 客群专题分析',
    name: '行业渗透',
    desc: '目标行业的客户覆盖率、渗透率。',
    components: ['map', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'suggestion']
  },
  industry_personalized: {
    id: 'industry_personalized',
    theme: '行业 / 客群专题分析',
    name: '行业个性化分析',
    desc: '针对特定行业的定制化分析。',
    components: ['text_card', 'bar_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  four_elements: {
    id: 'four_elements',
    theme: '行业 / 客群专题分析',
    name: '四要素分析',
    desc: '客户、销售、产品、场景四维度交叉分析。',
    components: ['radar', 'table', 'bar_chart'],
    conclusion: ['bullet', 'interpretation']
  },
  finance_breakthrough: {
    id: 'finance_breakthrough',
    theme: '行业 / 客群专题分析',
    name: '财务破圈',
    desc: '针对财务/金融客群的专项经营分析。',
    components: ['bar_chart', 'table', 'text_card'],
    conclusion: ['bullet', 'suggestion']
  },
  vertical_customer_operation: {
    id: 'vertical_customer_operation',
    theme: '行业 / 客群专题分析',
    name: '垂直客群运营',
    desc: 'SP客群、体系客户、子公司名单等。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'suggestion']
  },

  // 七、过程与行为分析
  business_trip: {
    id: 'business_trip',
    theme: '过程与行为分析',
    name: '商务行程分析',
    desc: '销售/售前的客户拜访、现场商务记录。',
    components: ['map', 'bar_chart', 'table'],
    conclusion: ['bullet', 'interpretation']
  },
  activity_management: {
    id: 'activity_management',
    theme: '过程与行为分析',
    name: '活动管理',
    desc: '市场活动、沙龙、培训的执行与效果。',
    components: ['bar_chart', 'line_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },
  ability_willingness: {
    id: 'ability_willingness',
    theme: '过程与行为分析',
    name: '能力意愿分析',
    desc: '销售/售前人员的能力与意愿评估。',
    components: ['radar', 'bar_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },
  data_quality: {
    id: 'data_quality',
    theme: '过程与行为分析',
    name: '数据质量监控',
    desc: '合同、客户、机会等数据的完整性与准确性。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['bullet', 'suggestion']
  },
  region_strategy: {
    id: 'region_strategy',
    theme: '过程与行为分析',
    name: '战区自主策略',
    desc: '战区自定义策略、关键任务执行跟踪。',
    components: ['text_card', 'bar_chart', 'table'],
    conclusion: ['bullet', 'suggestion']
  },

  // 八、明细数据与清单
  performance_detail: {
    id: 'performance_detail',
    theme: '明细数据与清单',
    name: '绩效明细',
    desc: '销售额-D、回款、签单的明细记录。',
    components: ['table', 'kpi_card', 'bar_chart'],
    conclusion: ['bullet', 'summary']
  },
  contract_detail: {
    id: 'contract_detail',
    theme: '明细数据与清单',
    name: '合同明细',
    desc: '合同列表、产品线、金额、时间。',
    components: ['table', 'bar_chart'],
    conclusion: ['summary', 'bullet']
  },
  opportunity_detail: {
    id: 'opportunity_detail',
    theme: '明细数据与清单',
    name: '机会明细',
    desc: '机会列表、阶段、预计金额、负责人。',
    components: ['table', 'funnel', 'bar_chart'],
    conclusion: ['summary', 'bullet']
  },
  receivable_detail: {
    id: 'receivable_detail',
    theme: '明细数据与清单',
    name: '应收明细',
    desc: '回款计划、实际回款、逾期明细。',
    components: ['table', 'bar_chart', 'kpi_card'],
    conclusion: ['summary', 'bullet']
  },
  customer_list: {
    id: 'customer_list',
    theme: '明细数据与清单',
    name: '客户表/名单',
    desc: '客户基础信息、归属、合作状态。',
    components: ['table', 'text_card'],
    conclusion: ['summary', 'bullet']
  },
  renewal_customer_detail: {
    id: 'renewal_customer_detail',
    theme: '明细数据与清单',
    name: '续费客户明细',
    desc: '到期/已续/未续客户的明细。',
    components: ['table', 'bar_chart', 'pie_chart'],
    conclusion: ['summary', 'bullet']
  },

  // 九、经营概览与结构
  business_overview: {
    id: 'business_overview',
    theme: '经营概览与结构',
    name: '经营概览',
    desc: '核心指标一览、总体经营健康度。',
    components: ['kpi_card', 'text_card', 'bar_chart'],
    conclusion: ['summary', 'bullet']
  },
  business_structure: {
    id: 'business_structure',
    theme: '经营概览与结构',
    name: '经营结构图',
    desc: '业务结构、产品结构、客户结构可视化。',
    components: ['pie_chart', 'bar_chart', 'text_card'],
    conclusion: ['interpretation', 'bullet']
  },
  growth_composition: {
    id: 'growth_composition',
    theme: '经营概览与结构',
    name: '增长构成',
    desc: '收入增长来源拆分（新购、升级、续费）。',
    components: ['waterfall', 'pie_chart', 'bar_chart'],
    conclusion: ['interpretation', 'bullet']
  },
  core_kpis: {
    id: 'core_kpis',
    theme: '经营概览与结构',
    name: '核心指标',
    desc: 'KPI总览、关键结果指标监控。',
    components: ['kpi_card', 'line_chart', 'table'],
    conclusion: ['summary', 'bullet']
  }
};

// 新产品分析数据集说明（内置数据集清单）
const NEW_PRODUCT_DATASETS = [
  {
    table: '【新产品】明细-线索',
    attachment: '线索.xlsx',
    attachmentId: '1432242762',
    desc: '新产品线索明细数据'
  },
  {
    table: '【新产品】明细-客户宽表',
    attachment: '客户.xlsx',
    attachmentId: '1432244920',
    desc: '新产品客户宽表数据'
  },
  {
    table: '【新产品】明细-近2年商务明细',
    attachment: '商务.xlsx',
    attachmentId: '1432244927',
    desc: '近2年商务行程明细'
  },
  {
    table: '【新产品】明细-机会',
    attachment: '机会.xlsx',
    attachmentId: '1432244930',
    desc: '新产品机会明细数据'
  },
  {
    table: '【新产品】明细-合同(1个合同1条数据)',
    attachment: '合同.xlsx',
    attachmentId: '1432244934',
    desc: '合同主表，1个合同1条数据'
  },
  {
    table: '【新产品】明细-合同&标的(1个合同多条数据)',
    attachment: '合同标的.xlsx',
    attachmentId: '1432244944',
    desc: '合同与标的明细，1个合同多条数据'
  },
  {
    table: '【新产品】明细-绩效时序目标&达成',
    attachment: '绩效明细.xlsx',
    attachmentId: '1432244948',
    desc: '绩效时序目标与达成明细'
  },
  {
    table: '【新产品】汇总-绩效时序目标&达成',
    attachment: '绩效汇总.xlsx',
    attachmentId: '1432244953',
    desc: '绩效时序目标与达成汇总'
  },
  {
    table: '【新产品】明细-JDY到期Name账号续费',
    attachment: 'JDY续费.xlsx',
    attachmentId: '1432244956',
    desc: 'JDY到期账号续费明细'
  }
];

// 主题与类型对应的推荐模块
const TOPIC_MODULE_MAP = {
  new_product: [
    'business_overview', 'core_kpis', 'growth_composition',
    'org_performance', 'region_performance', 'performance_comparison',
    'contract_management', 'order_new_upgrade', 'product_coverage',
    'opportunity_forecast', 'opportunity_pipeline', 'ltc_process',
    'customer_segmentation', 'new_customers', 'customer_health_score',
    'arr_analysis', 'renewal_rate', 'collection_overview'
  ],
  industry: [
    'business_overview', 'core_kpis', 'business_structure',
    'industry_segmentation', 'industry_penetration', 'industry_personalized',
    'four_elements', 'finance_breakthrough', 'vertical_customer_operation',
    'customer_segmentation', 'key_customer_analysis', 'sp_customer_operation',
    'business_trip', 'activity_management', 'data_quality',
    'performance_detail', 'contract_detail', 'customer_list'
  ]
};

// 根据主题+类型生成推荐模块
function getRecommendedModules(topicId, typeId) {
  const moduleIds = TOPIC_MODULE_MAP[topicId] || [];

  const modules = moduleIds.map(id => {
    const base = { ...MODULE_TEMPLATES[id] };
    if (!base) return null;

    if (typeId === 'dashboard') {
      // 看板更强调 KPI 与图表，结论简短
      base.components = [...new Set(['kpi_card', ...base.components])].slice(0, 3);
      base.conclusion = base.conclusion.filter(c => c === 'summary' || c === 'bullet').slice(0, 2);
    } else if (typeId === 'analysis') {
      // 分析报告更强调表格、解读与建议
      base.components = [...new Set([...base.components, 'table'])].slice(0, 3);
      base.conclusion = [...new Set([...base.conclusion, 'interpretation', 'suggestion'])].slice(0, 2);
    }
    return base;
  }).filter(Boolean);

  return modules;
}

// 根据类型推荐全局布局
function getRecommendedLayout(typeId) {
  if (typeId === 'dashboard') return 'grid';
  if (typeId === 'analysis') return 'top_down';
  return 'card_flow';
}

// 业务知识库（来自 KMS 业务规则文档）
const BUSINESS_KNOWLEDGE = {
  new_product: {
    dataTables: [
      { name: '【明细 - 线索】', usage: '线索量、分配、消化；按「线索是否包含 JDY/FineBI/FDL」拆分产品线' },
      { name: '【明细 - 客户宽表】', usage: '客户基础信息与指标汇总，用于跨表口径校验' },
      { name: '【明细 - 近 2 年商务记录】', usage: '商务行为明细、客户分类、各产品线商务记录' },
      { name: '【明细 - 机会】', usage: '全量机会数据、概率金额、预计成交时间、状态' },
      { name: '【明细 - 合同】', usage: '完整合同、合同总产品线、客户分类' },
      { name: '【明细 - 合同 & 标的】', usage: '合同分产品分标的明细、产品合同额、订阅类型' },
      { name: '【明细 - 绩效时序目标 & 达成】', usage: 'JDY/FDL/FineBI 目标与达成时序数据' },
      { name: '【汇总 - 绩效时序目标 & 达成】', usage: '仅用于校验目标与达成数据准确性' },
      { name: '【明细 - JDY 到期 Name 账号续费】', usage: 'JDY Name 客户本年计入绩效的续费数据' }
    ],
    coreRules: [
      '同期/年同比：指同一时间段，不强制自然年全年。',
      '战区归属口径：所有合同类统计统一按「客户归属战区」计算，忽略合同归属战区。',
      '单品机会金额：预测时仅使用单品机会金额，禁止用总机会金额反推。',
      '机会成交时间：预测仅统计预计当年成交的机会，跨年机会剔除。',
      '绩效过滤：涉及业绩计算时，过滤「预计机会成交后是否计入绩效」，仅保留计入绩效的数据。',
      '绩效统计日期：按「统计日期」计算。',
      '合同维度下沉：异常波动必须下沉到合同维度，列出大额订单客户及合同额。',
      '业绩与合同关系：签单计入业绩；未系统下单扣除；下单后加回；未回款扣除。同一合同可能分配多个战区。'
    ],
    metrics: [
      { name: '销售额-D', desc: '当期实际签约销售额-D，即实际业绩' },
      { name: '年目标完成率', formula: '销售额-D ÷ 全年目标' },
      { name: '预计全年完成率', formula: '(销售额-D + 当年待成交机会概率金额) ÷ 全年目标' }
    ],
    warZones: ['华南大区', '北京大区', '上海大区', '苏皖大区', '浙闽大区', '西南大区', '华北大区', '华中大区', '西北大区', '东北大区'],
    opportunityStates: { '跟进中-碗里': 0.8, '跟进中-锅里': 0.5, '跟进中-田里': 0.2 }
  },
  industry: {
    dataTables: [
      { name: '客户一级/二级/三级行业标签', usage: '行业判定依据，采用包含匹配逻辑' },
      { name: '【SP客群标签】', usage: 'SP行业客户唯一判定依据，严禁用二级行业划分' },
      { name: '【行业-行业目标】', usage: 'SP行业客户年度目标，字段：26年SP行业目标' },
      { name: '【行业-售前目标】', usage: '非SP行业客户年度目标，字段：售前行业运营目标' },
      { name: '【明细 - 合同】 / 【明细 - 合同 & 标的】', usage: '行业合同额、产品线、客户分类' },
      { name: '【明细 - 机会】', usage: '行业机会金额、概率、预计成交时间' },
      { name: '【明细 - 绩效时序目标 & 达成】', usage: '行业业绩目标与达成' }
    ],
    coreRules: [
      'SP客群判定：唯一依据是【SP客群标签】字段，严禁用二级行业划分。',
      '行业判定：依托客户一级/二级/三级行业标签，采用包含匹配逻辑。',
      '战区归属口径：所有合同类数据统一按「客户归属战区」计算。',
      '机会预测：必须校验【机会预计成交时间】，仅统计当年成交机会。',
      '年度目标：SP行业取自【行业-行业目标】；非SP取自【行业-售前目标】，禁止混用。',
      '同期同比：对比同一段自然时间段，不强制自然年全年。'
    ],
    metrics: [
      { name: '销售额-D', desc: '当期实际签约销售额-D，即实际业绩' },
      { name: '年目标完成率', formula: '销售额-D ÷ 全年目标' },
      { name: '预计全年完成率', formula: '(销售额-D + 当年待成交机会概率金额) ÷ 全年目标' }
    ],
    warZones: ['华南大区', '北京大区', '上海大区', '苏皖大区', '浙闽大区', '西南大区', '华北大区', '华中大区', '西北大区', '东北大区'],
    opportunityStates: { '跟进中-碗里': 0.8, '跟进中-锅里': 0.5, '跟进中-田里': 0.2 }
  }
};

// 分析框架库：按主题维护可勾选的分析模块与拆解内容
const ANALYSIS_FRAMEWORK_LIBRARY = {
  new_product: [
    {
      id: 'performance',
      module: '业绩达成分析',
      breakdown: '销售额-D、全年目标、年目标完成率、预计全年完成率；按战区/小组/个人下钻，识别达成缺口与同比变化。',
      keywords: ['业绩', '销售', '目标', '完成率', '同比', '达成', '绩效', '销售额', '战区业绩', '人均', '没完成', '未达标', '差多少', '年目标', '月度业绩', '季度业绩', '华南', 'JDY', '大区', '为什么', '原因', '差', '下降', '下滑'],
      relatedTables: ['【明细 - 绩效时序目标 & 达成】', '【明细 - 机会】']
    },
    {
      id: 'contract',
      module: '合同签单分析',
      breakdown: '合同额/合同数、产品线结构（JDY/FineBI/FDL）、新老客户结构、订阅方式、大单明细与异常波动。',
      keywords: ['合同', '签单', '签约', '订单', '产品线', '大单', '结构', '合同额', '新购', '升级', '签了多少', '合同数', '产品结构'],
      relatedTables: ['【明细 - 合同】', '【明细 - 合同 & 标的】']
    },
    {
      id: 'opportunity',
      module: '机会储备分析',
      breakdown: '跟进中机会金额、阶段分布（碗里/锅里/田里）、概率金额、预计成交时间、缺口预测。',
      keywords: ['机会', '商机', 'pipeline', '储备', '预测', '成交', '机会金额', '碗里', '锅里', '田里', '概率金额', '预计成交', '缺口', '全年能完成'],
      relatedTables: ['【明细 - 机会】']
    },
    {
      id: 'customer',
      module: '客户运营分析',
      breakdown: '客户数趋势、新增/流失、产品覆盖度、客户分类（JDY/FineBI/FDL）、标杆/重点客户。',
      keywords: ['客户', '客群', '流失', '新增', '覆盖', '分类', '客户数', '拉新', '产品覆盖', '新客户', '老客户', '客户增长'],
      relatedTables: ['【明细 - 客户宽表】', '【明细 - 合同】']
    },
    {
      id: 'collection',
      module: '回款应收分析',
      breakdown: '已回款、待回款、已到期、逾期金额、回款率、回款预测与合同生命周期。',
      keywords: ['回款', '应收', '收款', '到账', '逾期', '回款额', '待回款', '欠款', '未回款', '逾期金额', '回款率'],
      relatedTables: ['【明细 - 合同】', '【明细 - 合同 & 标的】']
    },
    {
      id: 'lead',
      module: '线索转化分析',
      breakdown: '线索量、分配线索数、消化线索数、线索等级、转化率、各产品线线索。',
      keywords: ['线索', 'leads', '分配', '消化', '转化', '线索量', '线索转化', '线索数', '有多少线索'],
      relatedTables: ['【明细 - 线索】']
    },
    {
      id: 'business_trip',
      module: '商务行为分析',
      breakdown: '商务记录数、现场/非现场拜访、客户覆盖、拜访频次与业绩关联。',
      keywords: ['行程', '拜访', '商务', '现场', '活动', '覆盖', '商务记录', '外访', '拜访量', '客户拜访', '拜访频次'],
      relatedTables: ['【明细 - 近 2 年商务记录】']
    },
    {
      id: 'renewal',
      module: '续费续约分析',
      breakdown: 'JDY Name 客户到期账号续费、续约率、应续金额分布、续费客户明细。',
      keywords: ['续费', '续约', '到期', 'JDY', '续费率', 'Name账号', '到期客户', '应续', '续费金额'],
      relatedTables: ['【明细 - JDY 到期 Name 账号续费】']
    },
    {
      id: 'anomaly',
      module: '异常波动定位',
      breakdown: '合同维度下沉、识别大额订单影响、列出异常客户与合同额、排除一次性因素。',
      keywords: ['异常', '波动', '大单', '下降', '为什么', '原因', '差', '这么差', '不好', '差在哪', '出了什么', '下跌', '根因', '定位', '下滑', '突然', '为何'],
      relatedTables: ['【明细 - 合同】', '【明细 - 合同 & 标的】']
    }
  ],
  industry: [
    {
      id: 'industry_performance',
      module: '行业业绩达成',
      breakdown: '销售额-D、全年目标、年目标完成率、预计全年完成率；按行业/战区/SP vs 非SP下钻。',
      keywords: ['业绩', '销售', '目标', '完成率', '行业业绩', '行业达成', '行业目标', '没完成', '差多少', '华南', '大区', 'JDY', '为什么', '原因', '差', '下降', '下滑'],
      relatedTables: ['行业-行业目标', '行业-售前目标', '【明细 - 绩效时序目标 & 达成】']
    },
    {
      id: 'industry_penetration',
      module: '行业客户渗透',
      breakdown: '行业客户数、客户覆盖率、SP客群分布、行业标签匹配、新增/流失行业客户。',
      keywords: ['客户', '渗透', '覆盖', 'SP', '行业客户', 'SP客户', '行业覆盖', '潜在客户', '行业渗透率'],
      relatedTables: ['【明细 - 客户宽表】', '【SP客群标签】']
    },
    {
      id: 'industry_contract',
      module: '行业签单结构',
      breakdown: '各行业合同额/合同数、产品线结构、新老客户结构、行业标签分布。',
      keywords: ['合同', '签单', '行业', '产品线', '行业合同', '合同额', '行业签单'],
      relatedTables: ['【明细 - 合同】', '【明细 - 合同 & 标的】']
    },
    {
      id: 'industry_opportunity',
      module: '行业机会储备',
      breakdown: '各行业跟进中机会、概率金额、预计成交时间、行业机会缺口。',
      keywords: ['机会', '商机', '储备', '行业机会', '碗里', '锅里', '预计成交', '行业缺口'],
      relatedTables: ['【明细 - 机会】']
    },
    {
      id: 'industry_collection',
      module: '行业回款健康',
      breakdown: '各行业已回款、待回款、逾期金额、回款率、合同回款周期。',
      keywords: ['回款', '应收', '逾期', '行业回款', '欠款', '到期', '行业收款'],
      relatedTables: ['【明细 - 合同】']
    },
    {
      id: 'industry_comparison',
      module: '行业对比分析',
      breakdown: '行业间业绩对比、梯队对比（一/二/三/四梯队）、SP vs 非SP对比。',
      keywords: ['对比', '梯队', '行业对比', 'SP', '排名', '哪个行业', '各行业', '差距', '比较'],
      relatedTables: ['【明细 - 绩效时序目标 & 达成】']
    },
    {
      id: 'industry_anomaly',
      module: '行业异常定位',
      breakdown: '合同维度下沉、识别行业异常波动、大额订单影响、客户/合同明细。',
      keywords: ['异常', '波动', '下降', '为什么', '原因', '差', '这么差', '不好', '行业', '根因', '下滑', '行业异常', '为何'],
      relatedTables: ['【明细 - 合同】', '【明细 - 合同 & 标的】']
    }
  ]
};

// 意图识别规则：理解问题类型（诊断/预测/对比/运营/趋势）
const INTENT_RULES = [
  {
    id: 'diagnostic',
    triggers: ['为什么', '为何', '原因', '下降', '下跌', '减少', '差', '这么差', '差在哪', '波动', '异常', '下滑', '不达标', '低于', '跌了', '出了什么', '没达到', '没完成', '哪里出了', '不好'],
    moduleBonus: {
      new_product: { anomaly: 5, contract: 2, performance: 2 },
      industry: { industry_anomaly: 5, industry_contract: 2, industry_performance: 2 }
    }
  },
  {
    id: 'predictive',
    triggers: ['预测', '预计', '全年能', '下半年', '缺口', '能完成', '展望', '还差多少', '完成全年', '完成率预测', '年底', '能不能完成'],
    moduleBonus: {
      new_product: { opportunity: 5, performance: 3 },
      industry: { industry_opportunity: 5, industry_performance: 3 }
    }
  },
  {
    id: 'comparative',
    triggers: ['对比', '比较', '排名', '各战区', '各大区', '各行业', '哪个', '差距', '横向', '谁好', '谁强', '第一', '最高', '最低'],
    moduleBonus: {
      new_product: { performance: 4, contract: 2 },
      industry: { industry_comparison: 5, industry_performance: 2 }
    }
  },
  {
    id: 'operational',
    triggers: ['覆盖', '渗透', '跟进', '运营', '健康', '活跃', '盘活', '管理', '维护客户', '激活'],
    moduleBonus: {
      new_product: { customer: 4, opportunity: 2, business_trip: 2 },
      industry: { industry_penetration: 5, industry_contract: 2 }
    }
  },
  {
    id: 'trend',
    triggers: ['趋势', '变化', '历史', '走势', '月度', '季度', '同比', '环比', '这个月', '上个月', '逐月', '按月'],
    moduleBonus: {
      new_product: { performance: 2, customer: 2, contract: 2 },
      industry: { industry_performance: 2, industry_contract: 2 }
    }
  }
];

// 实体识别规则：识别业务对象（合同/机会/回款/线索/续费等）
const ENTITY_MODULE_MAP = {
  new_product: [
    { pattern: /合同|签单|签约|订单|产品线结构/, modules: ['contract', 'anomaly'], bonus: 3 },
    { pattern: /机会|商机|pipeline|储备|漏斗|LTC/, modules: ['opportunity'], bonus: 3 },
    { pattern: /回款|应收|收款|逾期|欠款/, modules: ['collection'], bonus: 4 },
    { pattern: /线索|leads|分配|消化/, modules: ['lead'], bonus: 4 },
    { pattern: /续费|续约|JDY续费|Name账号|到期账号/, modules: ['renewal'], bonus: 4 },
    { pattern: /客户流失|流失客户|应续未续/, modules: ['customer', 'renewal'], bonus: 3 },
    { pattern: /新增客户|新客|拉新|客户新增/, modules: ['customer'], bonus: 3 },
    { pattern: /商务|拜访|外访|行程|客户拜访/, modules: ['business_trip'], bonus: 4 },
    { pattern: /大单|异常|波动|下滑|突然/, modules: ['anomaly'], bonus: 4 }
  ],
  industry: [
    { pattern: /合同|签单|签约/, modules: ['industry_contract', 'industry_anomaly'], bonus: 3 },
    { pattern: /机会|商机|储备/, modules: ['industry_opportunity'], bonus: 3 },
    { pattern: /回款|应收|逾期/, modules: ['industry_collection'], bonus: 4 },
    { pattern: /SP客户|SP客群|战略客户/, modules: ['industry_penetration', 'industry_contract'], bonus: 4 },
    { pattern: /覆盖|渗透|行业客户/, modules: ['industry_penetration'], bonus: 3 },
    { pattern: /对比|梯队|排名|哪个行业/, modules: ['industry_comparison'], bonus: 3 },
    { pattern: /大单|异常|波动|下滑/, modules: ['industry_anomaly'], bonus: 4 }
  ]
};

// 智能推荐：关键词匹配 + 意图识别 + 实体识别三层叠加评分
function recommendFrameworkByTopic(topicText, topicId) {
  if (!topicText || !topicId) return [];

  const text = topicText;
  const library = ANALYSIS_FRAMEWORK_LIBRARY[topicId] || [];

  // 初始化得分表
  const scoreMap = {};
  library.forEach(item => { scoreMap[item.id] = 0; });

  // 第一层：关键词匹配（基础分）
  library.forEach(item => {
    item.keywords.forEach(kw => {
      if (text.includes(kw)) scoreMap[item.id] += 1;
    });
  });

  // 第二层：意图识别（理解问题类型，大幅加权）
  INTENT_RULES.forEach(rule => {
    const matched = rule.triggers.some(t => text.includes(t));
    if (matched && rule.moduleBonus[topicId]) {
      Object.entries(rule.moduleBonus[topicId]).forEach(([moduleId, bonus]) => {
        if (scoreMap[moduleId] !== undefined) scoreMap[moduleId] += bonus;
      });
    }
  });

  // 第三层：实体识别（识别业务对象，精准加权）
  (ENTITY_MODULE_MAP[topicId] || []).forEach(rule => {
    if (rule.pattern.test(text)) {
      rule.modules.forEach(moduleId => {
        if (scoreMap[moduleId] !== undefined) scoreMap[moduleId] += rule.bonus;
      });
    }
  });

  // 排序并取前 5 个得分最高的模块
  let matched = library
    .map(item => ({ ...item, score: scoreMap[item.id] }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // 兜底：如果没有匹配到任何模块，返回前 2 个默认模块
  if (matched.length === 0) {
    matched = library.slice(0, 2).map(item => ({ ...item, score: 0 }));
  }

  return matched.map(item => ({
    id: item.id,
    module: item.module,
    breakdown: item.breakdown,
    relatedTables: item.relatedTables,
    checked: true
  }));
}

// 常见问题库（来源：KMS 常见业务问题 pageId=1433414931）
const QUESTION_LIBRARY = {
  performance: {
    name: '业绩分析类问题',
    keywords: ['业绩', '达成', '完成率', '目标', '同比', '销售额', '绩效', '销售', '没完成', '未达标', '差多少', '大区', '战区', '贡献', '构成', '结构'],
    questions: [
      '本年度整体业绩达成率是多少？',
      '今年业绩较去年同期变化情况？',
      '客群业绩贡献对比？',
      'JDY业绩构成中，新购&升级 vs 续费各占多少比例？结构是否合理？',
      '业绩绝对值增长/下降的原因是什么？是客单价变化还是客户数量变化驱动？',
      '是否存在个别大额订单对整体业绩产生显著影响？对应客户和合同额分别是？',
      '预计本年度全年的业绩达成率是多少？'
    ]
  },
  anomaly: {
    name: '异常波动定位',
    keywords: ['异常', '波动', '下降', '下跌', '下滑', '原因', '根因', '定位', '为什么', '差', '不好', '影响', '贡献', '大额订单', '客户', '合同'],
    questions: [
      '业绩下降/波动的主要原因是什么？是客单价下降、客户数减少，还是产品结构变化导致？',
      '哪些客户或合同对业绩波动贡献最大？具体客户名称和金额分别是多少？',
      '是否存在大额订单丢失、延期或一次性因素影响？对应原因是什么？',
      '波动是否集中在特定战区、行业、产品线或销售团队？',
      '与去年同期/上期相比，客群结构、签单结构发生了哪些变化？'
    ]
  },
  lead: {
    name: 'LTC - 线索',
    keywords: ['线索', 'leads', '分配', '消化', '验证', '等级', 'A+', 'A级', 'B级', '转化', '转客户', '推广', '主动推广'],
    questions: [
      '本期线索总量及同比变化？各等级（A+/A/B/C）占比？',
      '销售跟进验证线索的平均验证周期？',
      '线索是否存在长期未跟进？',
      '线索转客户率情况？',
      '转客户的线索，主要是新客还是已合作客户？',
      '是否存在销售主动推广（无线索触发）带来的业绩？占比多少？'
    ]
  },
  opportunity: {
    name: 'LTC - 机会',
    keywords: ['机会', '商机', 'pipeline', '储备', '预测', '成交', '概率金额', '碗里', '锅里', '田里', '预计成交', '签单率', '成功率', '关闭', '新建', '偏差', '准确率', '僵尸'],
    questions: [
      '当年预计成交的机会金额及概率金额？',
      '跟进中机会的预计成交时间分布？',
      '碗里/锅里/田里机会的金额及数量分布？',
      '今年新建和今年关闭机会的机会数和机会金额？',
      '机会成功签单率是多少？失败原因分类？',
      '机会预计成交时间与实际成交时间的偏差？预测准确率？',
      '是否存在创建已久但无成交希望的机会仍在跟进中？僵尸机会清理？'
    ]
  },
  contract_customer: {
    name: 'LTC - 客户 & 合同',
    keywords: ['合同', '签单', '签约', '订单', '客户数', '客单价', '客群', '订阅', '买断', 'ARR', '周期', '大单', '合同额'],
    questions: [
      '合同签单客户数变化情况？',
      '合同签单客单价变化？',
      '合同数和合同额的客群分布情况？',
      '合同订阅类型（订阅 vs 买断）的客户数和金额占比？ARR趋势如何？',
      '机会到合同签单的周期时长？',
      '大单合同数多少？有哪些？对应客户和合同具体内容？'
    ]
  },
  collection: {
    name: 'LTC - 回款',
    keywords: ['回款', '应收', '收款', '到账', '逾期', '待回', '已到期', '未回'],
    questions: [
      '今年已回款金额多少？',
      '今年剩余待回金额多少？',
      '今年已到期未回金额多少？'
    ]
  },
  customer_new: {
    name: '客群 - 新客',
    keywords: ['新客', '新客户', '新增客户', '拉新', '首次', '新客业绩', '新客质量'],
    questions: [
      '今年新客数量是多少？同比变化如何？',
      '新客线索数量、质量（A+/A/B/C等级分布）及销售跟进情况如何？',
      '新客从首次接触到签单的平均周期是多长？',
      '各战区新客业绩贡献及新客经营质量对比？'
    ]
  },
  customer_existing: {
    name: '客群 - 老客',
    keywords: ['老客', '老客户', '续费', '续约', '续费率', '新购', '升级', '年费', '买断', '到期', '预警'],
    questions: [
      '老客续费率是多少？',
      '老客新购&升级业绩有多少？增量贡献度如何？',
      '各老客账号的订阅到期时间分布？',
      '未来3/6个月到期需预警的重要客户有哪些？',
      '老客是否存在年费转买断的情况？金额及占比？低价买断是否过多？'
    ]
  },
  customer_referral: {
    name: '客群 - 老客推新',
    keywords: ['老客推新', '推荐', '转介绍', '推新', '推新业绩', '转化'],
    questions: [
      '老客推新的业绩规模及占比？同比变化？',
      '老客客群基础大小、客户质量如何？',
      '老客推新销售推广力度如何？',
      '老客推新的成单转化情况如何？'
    ]
  },
  sales_management: {
    name: '销售管理分析',
    keywords: ['销售', '战区', '精力', '投入', '能力', '意愿', '产出', 'ROI', '效率', '拜访', '跟进', '投入产出'],
    questions: [
      '战区精力投入情况对比？',
      '战区/销售在各类客群的精力投入对比分析？',
      '销售能力和意愿情况分析？',
      '销售能力意愿是否在提升进步？',
      '销售投入产出情况分析？'
    ]
  },
  business_operations: {
    name: '经营分析',
    keywords: ['经营', '增长', '健康', 'ARR', '年度经常性收入', '留存', 'NDR'],
    questions: [
      '业务增长是否健康？',
      '订阅模式ARR的年度增长趋势？'
    ]
  }
};

// 分析模块 → 问题类别映射（每个模块只关联最相关的问题类别，避免列出全部问题）
const FRAMEWORK_QUESTION_MAP = {
  new_product: {
    performance: ['performance'],
    contract: ['contract_customer'],
    opportunity: ['opportunity'],
    customer: ['customer_new', 'customer_existing', 'customer_referral'],
    collection: ['collection'],
    lead: ['lead'],
    business_trip: ['sales_management'],
    renewal: ['customer_existing'],
    anomaly: ['anomaly', 'performance', 'contract_customer']
  },
  industry: {
    industry_performance: ['performance'],
    industry_contract: ['contract_customer'],
    industry_opportunity: ['opportunity'],
    industry_penetration: ['customer_new', 'customer_existing', 'customer_referral'],
    industry_collection: ['collection'],
    industry_comparison: ['performance', 'sales_management'],
    industry_anomaly: ['anomaly', 'performance', 'contract_customer']
  }
};

// 根据模块名称/拆解内容自动匹配最相关的问题类别（用于自定义模块）
function recommendQuestionCategoriesByKeywords(moduleName, breakdown) {
  const text = ((moduleName || '') + ' ' + (breakdown || '')).toLowerCase();
  const scores = [];

  Object.entries(QUESTION_LIBRARY).forEach(([catId, cat]) => {
    if (!cat.keywords || cat.keywords.length === 0) return;
    let score = 0;
    cat.keywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) score += 1;
    });
    if (score > 0) scores.push({ catId, score, name: cat.name });
  });

  scores.sort((a, b) => b.score - a.score);
  // 取 Top 3；若完全未命中，则默认使用经营分析兜底
  const result = scores.slice(0, 3);
  if (result.length === 0) {
    result.push({ catId: 'business_operations', score: 0, name: QUESTION_LIBRARY.business_operations.name });
  }
  return result;
}

// 为指定模块生成默认问题结构（所有问题默认不勾选）
function buildDefaultQuestionsForModule(moduleItem, topicId) {
  const moduleId = moduleItem?.id;
  // 优先使用框架模块的显式映射
  let categoryIds = (FRAMEWORK_QUESTION_MAP[topicId] || {})[moduleId] || [];

  // 自定义模块或未命中显式映射时，根据模块名称/拆解内容关键词匹配问题库
  if (categoryIds.length === 0 && moduleItem) {
    const matched = recommendQuestionCategoriesByKeywords(moduleItem.module || '', moduleItem.breakdown || '');
    categoryIds = matched.map(m => m.catId);
  }

  const categories = categoryIds.map(catId => {
    const cat = QUESTION_LIBRARY[catId];
    if (!cat) return null;
    return {
      id: catId,
      name: cat.name,
      questions: cat.questions.map(text => ({ text, checked: false }))
    };
  }).filter(Boolean);

  return {
    categories,
    customQuestions: []
  };
}

// 获取所有可选样式列表
function getStyleOptions() {
  return {
    components: Object.values(COMPONENT_STYLES),
    visuals: Object.values(VISUAL_STYLES),
    layouts: Object.values(LAYOUT_STYLES),
    conclusions: Object.values(CONCLUSION_STYLES)
  };
}

// 获取所有框架主题（用于分组展示）
function getAllThemes() {
  return [...new Set(Object.values(MODULE_TEMPLATES).map(m => m.theme))];
}
