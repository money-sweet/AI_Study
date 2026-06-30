import json

data = json.load(open('finebi_output.json','r',encoding='utf-8'))
items = data.get('data', [])
keywords = ['新产品推广专项','新产品推广','推广专项','新产品','推广']
results = []
for item in items:
    text = item.get('text','')
    for kw in keywords:
        if kw in text:
            results.append({
                'text': text,
                'path': item.get('path',''),
                'id': item.get('id'),
                'pId': item.get('pId'),
                'entryType': item.get('entryType'),
                'deviceType': item.get('deviceType')
            })
            break

open('entry_tree_matches.json','w',encoding='utf-8').write(json.dumps(results, ensure_ascii=False, indent=2))
print('found', len(results))
