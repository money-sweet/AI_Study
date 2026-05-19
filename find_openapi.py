import requests

headers = {'Authorization': 'Bearer frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ'}
paths = [
    '/openapi.json', '/api/openapi.json', '/v1/openapi.json',
    '/swagger.json', '/api/swagger.json', '/swagger-ui.json',
    '/api.json', '/api/v1/openapi.json', '/openapi.yaml',
    '/api/openapi.yaml', '/swagger.yaml'
]
for path in paths:
    url = f'https://digitchat.fanruan.com{path}'
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            print(f'FOUND: {url}')
            ct = resp.headers.get('Content-Type')
            print(f'Content-Type: {ct}')
            print(f'Size: {len(resp.text)}')
            print(resp.text[:3000])
            # 保存完整内容
            ext = 'json' if 'json' in ct else 'yaml'
            fname = f'openapi_found.{ext}'
            with open(fname, 'w', encoding='utf-8') as f:
                f.write(resp.text)
            print(f'Saved to {fname}')
            break
    except Exception as e:
        pass
else:
    print('No openapi.json/yaml found')
