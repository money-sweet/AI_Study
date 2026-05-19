import json

with open('openapi_found.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 70)
print("API 端点列表")
print("=" * 70)
for path, methods in data['paths'].items():
    print(f"\n{path}")
    for method, details in methods.items():
        tags = details.get('tags', [])
        summary = details.get('summary', 'N/A')
        print(f"  {method.upper():6} | {', '.join(tags):15} | {summary}")
        # 打印参数
        params = details.get('parameters', [])
        for p in params:
            print(f"    Param: {p['name']} ({p.get('in', 'query')}, required={p.get('required', False)})")
        # 打印请求体schema引用
        req_body = details.get('requestBody', {})
        if req_body:
            content = req_body.get('content', {})
            for ct, ct_info in content.items():
                schema = ct_info.get('schema', {})
                if '$ref' in schema:
                    print(f"    Body: {schema['$ref']}")
                else:
                    print(f"    Body: {schema}")

print("\n" + "=" * 70)
print("Schema 定义")
print("=" * 70)
schemas = data.get('components', {}).get('schemas', {})
for name, schema in schemas.items():
    print(f"\n{name}:")
    print(f"  Type: {schema.get('type', 'N/A')}")
    props = schema.get('properties', {})
    if props:
        for prop_name, prop_info in props.items():
            prop_type = prop_info.get('type', 'N/A')
            if '$ref' in prop_info:
                prop_type = prop_info['$ref']
            print(f"    - {prop_name}: {prop_type}")
    required = schema.get('required', [])
    if required:
        print(f"  Required: {required}")
