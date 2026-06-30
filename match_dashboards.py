import json

children = json.load(open('children_新产品推广专项.json','r',encoding='utf-8'))
user_info = json.load(open('user_info.json','r',encoding='utf-8'))
dashboards = user_info.get('dashboards', [])

# Try exact and partial match on text (without suffix)
matches = []
for c in children:
    text = c['text']
    # remove suffix like -Kitty.Qian
    base = text.split('-')[0].strip()
    found = []
    for d in dashboards:
        name = d.get('name','')
        if name == text or name == base or base in name or name in base:
            found.append(d)
    matches.append({'entry': text, 'base': base, 'matches': found})

open('dashboard_matches.json','w',encoding='utf-8').write(json.dumps(matches, ensure_ascii=False, indent=2))
print('saved')
