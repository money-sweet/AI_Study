import json, re

configs = json.load(open('design_configs.json','r',encoding='utf-8'))

urls = []
def walk(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                if v.startswith('http') or 'webroot/decision' in v or 'app/package' in v:
                    urls.append((path + '.' + k, v))
            else:
                walk(v, path + '.' + k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            walk(v, path + f'[{i}]')

for name, cfg in configs.items():
    walk(cfg, name)

open('web_urls.json','w',encoding='utf-8').write(json.dumps(urls, ensure_ascii=False, indent=2))
print('found', len(urls))
for p, u in urls[:50]:
    print(p, u[:200])
