import json
import sys

input_file = sys.argv[1] if len(sys.argv) > 1 else 'dataset_search.json'
output_file = sys.argv[2] if len(sys.argv) > 2 else 'dataset_search_clean.json'

s = open(input_file, 'r', encoding='utf-16-le').read()
idx = s.find('"success"')
print('idx', idx)
if idx < 0:
    print('no success found')
    sys.exit(1)
brace_idx = s.rfind('{', 0, idx)
print('brace_idx', brace_idx)
raw = s[brace_idx:]
raw_clean = ''.join(c if (ord(c) >= 32 or c in '\t\n\r') else ' ' for c in raw)
raw_clean = raw_clean.replace('\ufffd', ' ')
data = json.loads(raw_clean)
out = json.dumps(data, ensure_ascii=False, indent=2)
open(output_file, 'w', encoding='utf-8').write(out)
print('written', len(out))
