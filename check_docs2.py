import requests

headers = {'Authorization': 'Bearer frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ'}
for path in ['/openapi/', '/swagger/', '/docs/']:
    url = f'https://digitchat.fanruan.com{path}'
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        print(f'=== {path} ===')
        print(f'Status: {resp.status_code}')
        ct = resp.headers.get('Content-Type')
        print(f'Content-Type: {ct}')
        print(f'Body length: {len(resp.text)}')
        # 保存到文件
        fname = path.replace('/', '_') + 'response.html'
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(resp.text)
        print(f'Saved to {fname}')
        print('\n')
    except Exception as e:
        print(f'{path}: Error - {e}')
