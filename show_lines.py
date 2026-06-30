import json
s = open('dataset_search.json','r',encoding='utf-16-le').read()
idx = s.find('"success"')
brace_idx = s.rfind('{', 0, idx)
raw = s[brace_idx:]
try:
    json.loads(raw)
except json.JSONDecodeError as e:
    pos = e.pos
    print('error pos', pos)
    for i in range(pos-10, pos+10):
        if 0 <= i < len(raw):
            c = raw[i]
            o = ord(c)
            print(f'{i}: ord={o}')
