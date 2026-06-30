import json

data = json.load(open('entry_tree_output.json','r',encoding='utf-8'))
items = data.get('data', [])
children = [i for i in items if i.get('pId') == '89470b55-286b-4881-82f9-df0e85331253']
out = []
for c in children:
    out.append({
        'text': c.get('text'),
        'entryType': c.get('entryType'),
        'id': c.get('id'),
        'path': c.get('path')
    })
open('children_新产品推广专项.json','w',encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=2))
print('saved', len(out))
