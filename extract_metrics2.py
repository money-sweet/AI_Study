import json, re, html
from collections import Counter

# Load embedded configs (and maybe top-level too)
configs = json.load(open('embedded_design_configs.json','r',encoding='utf-8'))

def strip_html(s):
    s = html.unescape(s)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

# Extract titles and tab names
texts = []
for key, cfg in configs.items():
    dc = cfg.get('designConfigure', {})
    # top-level report widgets
    for wid, w in dc.get('reportWidgets', {}).items():
        title = w.get('title','')
        if title:
            texts.append(strip_html(title))
        # widget name
        name = w.get('widgetBean', {}).get('name','')
        if name:
            texts.append(name)
        # tab names
        tabs = w.get('widgetBean', {}).get('tabs', [])
        for tab in tabs:
            show = tab.get('showName','')
            if show:
                texts.append(show)
        # chart fields may be in widgetBean -> some fields; not sure structure, dump all Chinese strings
    # also dump all Chinese-like strings from entire config
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
        # keep strings that are likely Chinese labels
        s = strip_html(s)
        if re.search(r'[\u4e00-\u9fa5]', s):
            texts.append(s)

# Now identify metric-like strings
# Heuristic: contains Chinese and one of metric tokens, length 2-20, not pure dimension labels
metric_tokens = ['额','金额','数','量','率','占比','完成率','达成率','销售额','合同额','回款',
                 '客户','商机','签单','复购','推广','新购','机会','项目','人天','套数','折扣',
                 '收入','业绩','目标','实际','激活','覆盖','转化','流失','留存','付费','续费',
                 '订阅','签约','成交','概率','均价','计数','去重','求和','环比','同比','增长率']

def is_metric(s):
    if len(s) < 2 or len(s) > 25:
        return False
    if not re.search(r'[\u4e00-\u9fa5]', s):
        return False
    # must contain a metric token
    if not any(t in s for t in metric_tokens):
        return False
    # exclude widget names
    exclude_parts = ['组件','div','span','style','class','px','rgb','font','strong','align','背景','颜色']
    if any(p in s for p in exclude_parts):
        return False
    # exclude pure date/segment labels
    if re.match(r'^\d+[年月]$', s):
        return False
    return True

metrics = [t for t in texts if is_metric(t)]
counter = Counter(metrics)
# Filter out very rare and obvious noise
final = [(k, v) for k, v in counter.most_common() if v >= 1]
open('metrics_count2.json','w',encoding='utf-8').write(json.dumps(final, ensure_ascii=False, indent=2))
print('texts', len(texts), 'metrics', len(final))
for k, v in final[:80]:
    print(v, k)
