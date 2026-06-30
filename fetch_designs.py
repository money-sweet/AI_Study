import subprocess, json, shlex, time

dashboards = [
    ("新产品经营分析", "e1bedf43284a4a449db07f21fd7e4e48"),
    ("新产品作战地图", "7b9a499bc2674f0cb7b7f1db141a3002"),
    ("JDY", "54b7a8ec09c344c8806a8401d6208dc1"),
    ("续费", "e15638afd8424f2090c25dd7fd6b13bf"),
    ("能力意愿", "040587858d6f47098da5f5d4b9970706"),
    ("机会", "84046d2e349c4a0097fa07a60f507bc0"),
    ("FDL", "43c95b7548844fd3abcbde59d3bcf5e9"),
    ("合同", "243b6ef4e5d048ce86e72b36d3eb1f43"),
    ("BI经营分析", "4f10fe343f534534a47f4f3e14fbb33b"),
]

results = {}
for name, rid in dashboards:
    cmd_str = f"finebi-cli get-dashboard-design-configure --dashboard-id {rid}"
    result = subprocess.run(cmd_str, capture_output=True, shell=True)
    stdout = result.stdout.decode('utf-8', errors='replace')
    lines = stdout.splitlines()
    json_start = None
    for i, line in enumerate(lines):
        if line.startswith('https://'):
            for j in range(i+1, len(lines)):
                if lines[j].strip():
                    if lines[j].strip() in ('undefined', 'null'):
                        break
                    if lines[j].strip().startswith('{') or lines[j].strip().startswith('['):
                        json_start = '\n'.join(lines[j:])
                    break
            break
    if json_start:
        try:
            data = json.loads(json_start)
            results[name] = data
            print(f'{name}: ok')
        except Exception as e:
            print(f'{name}: parse failed {e}')
    else:
        print(f'{name}: no json')
    time.sleep(0.5)

open('design_configs.json','w',encoding='utf-8').write(json.dumps(results, ensure_ascii=False, indent=2))
print('saved designs')
