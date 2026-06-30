import json, re, html
from collections import Counter

configs = json.load(open('embedded_design_configs.json','r',encoding='utf-8'))

def strip_html(s):
    s = html.unescape(s)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

texts = []
for key, cfg in configs.items():
    dc = cfg.get('designConfigure', {})
    def walk(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, str):
                    yield v
                else:
                    yield from walk(v)
        elif isinstance(obj, list):
            for v in obj:
                yield from walk(v)
    for s in walk(dc):
        s = strip_html(s)
        if re.search(r'[\u4e00-\u9fa5]', s):
            texts.append(s)

# Exclude terms that are clearly dimensions/non-metrics
exclude_dims = ['状态','标签','名称','日期','时间','战区','小组','行业','分类','分层','归属','LOG','值字段','记录数','占比','去重计数','求和']
# Wait: 占比 is often a metric. But also appears as '累计占比' etc. We'll handle separately.
exclude_phrases = ['客户归属战区','客户分层','客户一级行业','客户二级行业','客户三级行业','客户占比-大客户','新机会状态','机会状态分组','新复购标签','新老客及新复购分类','产品分类机会状态占比','整体完成率']

metric_tokens = ['额','金额','销售额','合同额','数','量','率','占比','完成率','覆盖率','增长率','GAP','差距','单价','人天','套数','折扣','目标','完成','业绩','签约','成交','概率','均价','覆盖率']

def is_metric(s):
    if len(s) < 2 or len(s) > 25:
        return False
    if not re.search(r'[\u4e00-\u9fa5]', s):
        return False
    # exclude if contains dimension-only words and no clear metric token
    if any(ex in s for ex in exclude_dims):
        return False
    if any(ex in s for ex in exclude_phrases):
        return False
    if not any(t in s for t in metric_tokens):
        return False
    # exclude widget/style stuff
    if any(p in s for p in ['组件','div','span','style','class','px','rgb','font','strong','align','背景','颜色',' Helvetica']):
        return False
    return True

metrics = [t for t in texts if is_metric(t)]
counter = Counter(metrics)
# Further clean: merge obviously similar terms? For now keep top.
final = [(k, v) for k, v in counter.most_common() if v >= 2]
open('metrics_count3.json','w',encoding='utf-8').write(json.dumps(final, ensure_ascii=False, indent=2))
print('texts', len(texts), 'metrics', len(final))
for k, v in final[:100]:
    print(v, k)
