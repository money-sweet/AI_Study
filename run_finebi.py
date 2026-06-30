import subprocess, json, sys, shlex

args = sys.argv[1:]
cmd_list = ['finebi-cli'] + args
cmd_str = ' '.join(shlex.quote(a) for a in cmd_list)
print('running:', cmd_str)
result = subprocess.run(cmd_str, capture_output=True, shell=True)
stdout = result.stdout.decode('utf-8', errors='replace')
stderr = result.stderr.decode('utf-8', errors='replace')
open('finebi_stdout.txt','w',encoding='utf-8').write(stdout)
open('finebi_stderr.txt','w',encoding='utf-8').write(stderr)
print('returncode', result.returncode)
print('stdout length', len(stdout))
print('stderr length', len(stderr))
# Extract JSON: skip injected env log, find URL line, then JSON
lines = stdout.splitlines()
json_start = None
for i, line in enumerate(lines):
    if line.startswith('https://'):
        # JSON starts at next non-empty line
        for j in range(i+1, len(lines)):
            if lines[j].strip():
                if lines[j].strip() in ('undefined', 'null'):
                    print('response is', lines[j].strip())
                    sys.exit(0)
                if lines[j].strip().startswith('{') or lines[j].strip().startswith('['):
                    json_start = '\n'.join(lines[j:])
                break
        break
if json_start is None:
    # fallback: find first '{' not in log
    idx = stdout.find('{')
    if idx >= 0:
        json_start = stdout[idx:]
if json_start:
    try:
        data = json.loads(json_start)
        open('finebi_output.json','w',encoding='utf-8').write(json.dumps(data, ensure_ascii=False, indent=2))
        print('json extracted ok')
    except Exception as e:
        print('json extract failed', e)
else:
    print('no json found')
