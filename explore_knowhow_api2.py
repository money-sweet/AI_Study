"""
更系统地探测 Knowhow API
"""
import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 探测 /dataset 根路径
print("=" * 70)
print("1. 访问 /dataset/ 根路径")
print("=" * 70)
url = f"{BASE_URL}/dataset/"
try:
    resp = requests.get(url, headers=headers, timeout=15)
    print(f"Status: {resp.status_code}")
    print(f"Headers: {dict(resp.headers)}")
    print(f"Body: {resp.text[:2000]}")
except Exception as e:
    print(f"Error: {e}")

# 探测 /dataset 不带斜杠
print("\n" + "=" * 70)
print("2. 访问 /dataset (不带斜杠)")
print("=" * 70)
url = f"{BASE_URL}/dataset"
try:
    resp = requests.get(url, headers=headers, timeout=15, allow_redirects=False)
    print(f"Status: {resp.status_code}")
    print(f"Headers: {dict(resp.headers)}")
    print(f"Body: {resp.text[:2000]}")
except Exception as e:
    print(f"Error: {e}")

# 探测 /api 路径
print("\n" + "=" * 70)
print("3. 访问 /api/ 路径")
print("=" * 70)
for path in ["/api/", "/api/v1/", "/api/v2/", "/openapi/", "/swagger/", "/docs/"]:
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] {url}")
            print(resp.text[:1000])
    except:
        pass

# 探测 dataset 下的子路径
print("\n" + "=" * 70)
print("4. 探测 /dataset/ 下可能的子路径")
print("=" * 70)
sub_paths = [
    "list", "items", "files", "documents", "docs", "nodes",
    "spaces", "wiki", "tables", "data", "contents",
    "get", "fetch", "download", "export",
    "chat", "completions", "ask", "query"
]
for sub in sub_paths:
    url = f"{BASE_URL}/dataset/{sub}"
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] GET {url}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

    # 也尝试 POST
    try:
        resp = requests.post(url, headers=headers, json={}, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] POST {url}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

# 尝试直接访问飞书知识库相关接口（可能通过 knowhow 代理）
print("\n" + "=" * 70)
print("5. 尝试知识库相关的可能端点")
print("=" * 70)
wiki_paths = [
    "/dataset/space", "/dataset/space/nodes", "/dataset/wiki",
    "/dataset/wiki/nodes", "/dataset/knowledge", "/dataset/kb"
]
for path in wiki_paths:
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] {url}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

print("\n探测完成")
