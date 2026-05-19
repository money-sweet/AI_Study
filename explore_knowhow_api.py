"""
探测 Knowhow API 接口结构
"""
import requests
import json

BASE_URL = "https://digitchat.fanruan.com/dataset"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 尝试各种常见端点
endpoints = [
    "/",
    "/documents",
    "/docs",
    "/files",
    "/datasets",
    "/spaces",
    "/wiki",
    "/nodes",
    "/search",
    "/query",
    "/api/documents",
    "/api/files",
    "/api/datasets",
    "/api/v1/documents",
    "/api/v1/datasets",
    "/v1/documents",
    "/v1/datasets",
]

print("=" * 70)
print("探测 Knowhow API 可用端点")
print("=" * 70)

for ep in endpoints:
    url = f"{BASE_URL}{ep}"
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        status = resp.status_code
        # 只显示有意义的响应
        if status != 404:
            print(f"\n[{status}] {url}")
            try:
                data = resp.json()
                print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except Exception as e:
        pass  # 忽略连接错误

# 尝试 POST 搜索
print("\n" + "=" * 70)
print("尝试 POST /search")
print("=" * 70)
for ep in ["/search", "/api/search", "/v1/search", "/query", "/api/query"]:
    url = f"{BASE_URL}{ep}"
    try:
        resp = requests.post(url, headers=headers, json={"query": "test", "limit": 5}, timeout=15)
        status = resp.status_code
        if status != 404:
            print(f"\n[{status}] {url}")
            try:
                data = resp.json()
                print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except Exception as e:
        pass

print("\n探测完成")
