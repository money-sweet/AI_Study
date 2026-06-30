import json

data = json.load(open('user_info.json','r',encoding='utf-8'))
dashboards = data.get('dashboards', [])
keywords = ['新产品经营分析看板','新产品作战地图','JDY作战地图','新产品推广专项']
results = []
for d in dashboards:
    name = d.get('name','')
    for kw in keywords:
        if kw in name:
            results.append(d)
            break

open('user_info_matches.json','w',encoding='utf-8').write(json.dumps(results, ensure_ascii=False, indent=2))
print('found', len(results))
