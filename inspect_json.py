import sys
input_file = sys.argv[1]
s = open(input_file, 'r', encoding='utf-16-le').read()
idx = s.find('"success"')
brace_idx = s.rfind('{', 0, idx)
raw = s[brace_idx:]
print('total chars', len(raw))
for i in range(1235, 1280):
    c = raw[i]
    o = ord(c)
    status = 'CTRL' if (o < 32 and c not in '\t\n\r') else ''
    print(f'{i}: ord={o} {status}')
