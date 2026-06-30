import json, re

# Load design configs
configs = json.load(open('design_configs.json','r',encoding='utf-8'))

# Metric keywords heuristic
metric_keywords = [
    '额', '金额', '数', '量', '率', '占比', '完成率', '达成率', '增长率',
    '销售', '合同', '回款', '客户', '商机', '签单', '复购', '推广', '新购',
    '机会', '项目', '人天', '套数', '折扣', '收入', '业绩', '目标', '实际',
    '激活', '覆盖', '转化', '流失', '留存', '付费', '续费', '订阅',
    'FR', 'BI', 'FDL', 'FVS', 'JDY', 'FineBI', 'FineReport', 'FineDataLink',
    '简道云', 'FCB', 'FineChatBI'
]

# Patterns that look like metric names: contain keyword and not too long
metric_pattern = re.compile(r'[\u4e00-\u9fa5a-zA-Z0-9_\-·/%]+')

def is_metric(s):
    if len(s) < 2 or len(s) > 30:
        return False
    # Must contain at least one metric keyword
    if not any(kw in s for kw in metric_keywords):
        return False
    # Exclude common non-metric terms
    exclude = ['分析', '看板', '仪表板', '组件', 'Tab', 'Web', '年月', '日期', '时间', '名称', 'ID', '英文名', '中英文']
    if any(ex in s for ex in exclude):
        return False
    # Must contain at least one Chinese character or known product abbreviation
    if not re.search(r'[\u4e00-\u9fa5]', s):
        return False
    return True

all_metrics = []
for dashboard_name, config in configs.items():
    text = json.dumps(config, ensure_ascii=False)
    # Extract candidate strings
    candidates = metric_pattern.findall(text)
    metrics = [c for c in candidates if is_metric(c)]
    all_metrics.extend(metrics)

# Count
from collections import Counter
counter = Counter(all_metrics)
# Filter: at least 2 occurrences or single occurrence but highly metric-like
final = [(k, v) for k, v in counter.most_common() if v >= 1]

open('metrics_count.json','w',encoding='utf-8').write(json.dumps(final, ensure_ascii=False, indent=2))
print('total metric strings', len(all_metrics))
print('unique metrics', len(final))
for k, v in final[:50]:
    print(v, k)
