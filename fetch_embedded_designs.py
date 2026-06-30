import subprocess, json, re, time

urls = json.load(open('web_urls.json','r',encoding='utf-8'))
report_ids = []
for path, url in urls:
    m = re.search(r'/report/([a-f0-9]+)/view', url)
    if m:
        rid = m.group(1)
        if rid not in report_ids:
            report_ids.append((path.split('.')[0], rid))

results = {}
for dashboard_name, rid in report_ids:
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
            key = f"{dashboard_name}_{rid}"
            results[key] = data
            print(f'{key}: ok')
        except Exception as e:
            print(f'{rid}: parse failed {e}')
    else:
        print(f'{rid}: no json')
    time.sleep(0.3)

open('embedded_design_configs.json','w',encoding='utf-8').write(json.dumps(results, ensure_ascii=False, indent=2))
print('saved embedded designs')
