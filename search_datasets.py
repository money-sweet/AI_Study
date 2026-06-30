import json

data = json.load(open('finebi_output.json','r',encoding='utf-8'))
items = data.get('data', {}).get('items', [])
results = []
for item in items:
    pos = item.get('position','')
    if '新产品推广专项' in pos:
        results.append({
            'name': item.get('name'),
            'transferName': item.get('transferName'),
            'position': pos,
            'fields': item.get('fields',[]),
            'comment': item.get('comment')
        })

open('dataset_新产品推广专项.json','w',encoding='utf-8').write(json.dumps(results, ensure_ascii=False, indent=2))
print('found', len(results))
