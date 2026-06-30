import json

s = open('finebi_stdout.txt','r',encoding='utf-8').read()
idx = s.find('{\n  "userInfo"')
print('idx', idx)
if idx >= 0:
    data = json.loads(s[idx:])
    open('user_info.json','w',encoding='utf-8').write(json.dumps(data, ensure_ascii=False, indent=2))
    print('dashboards count', len(data.get('dashboards',[])))
