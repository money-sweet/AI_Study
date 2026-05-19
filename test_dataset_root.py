import requests
import json

API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
BASE = "https://digitchat.fanruan.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 测试 /dataset/ 作为端点
print("=" * 70)
print("测试 /dataset/ 根作为端点")
print("=" * 70)
for method in ["GET", "POST", "PUT"]:
    url = f"{BASE}/dataset/"
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json={"query": "test"}, timeout=10)
        else:
            resp = requests.put(url, headers=headers, json={}, timeout=10)
        print(f"[{resp.status_code}] {method} /dataset/")
        try:
            print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
        except:
            print(resp.text[:300])
    except Exception as e:
        print(f"Error: {e}")

# 尝试各种 /dataset/ 子路径
print("\n" + "=" * 70)
print("测试 /dataset/ 子路径")
print("=" * 70)
subs = [
    "query", "search", "ask", "chat", "completions",
    "list", "documents", "files", "nodes", "items",
    "knowledge", "wiki", "rag", "retrieve", "retrieval",
    "download", "export", "content", "data",
    "v1/query", "v1/search", "v1/documents",
    "api/query", "api/search", "api/documents",
]
for sub in subs:
    url = f"{BASE}/dataset/{sub}"
    try:
        resp = requests.post(url, headers=headers, json={"query": "test", "question": "test"}, timeout=10)
        if resp.status_code != 404 and resp.status_code != 405:
            print(f"\n[{resp.status_code}] POST /dataset/{sub}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

# 测试 /dataset 不带斜杠
print("\n" + "=" * 70)
print("测试 /dataset 不带斜杠")
print("=" * 70)
for method in ["GET", "POST"]:
    url = f"{BASE}/dataset"
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=10, allow_redirects=False)
        else:
            resp = requests.post(url, headers=headers, json={"query": "test"}, timeout=10, allow_redirects=False)
        print(f"[{resp.status_code}] {method} /dataset")
        try:
            print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
        except:
            print(resp.text[:300])
    except:
        pass

# 尝试不同的认证头
print("\n" + "=" * 70)
print("尝试不同认证头 + /dataset/ 路径")
print("=" * 70)
auth_methods = [
    ("Bearer", {"Authorization": f"Bearer {API_KEY}"}),
    ("API-Key", {"API-Key": API_KEY}),
    ("X-API-Key", {"X-API-Key": API_KEY}),
    ("Token", {"Token": API_KEY}),
]
for name, h in auth_methods:
    url = f"{BASE}/dataset/query"
    try:
        resp = requests.post(url, headers={**h, "Content-Type": "application/json"}, json={"query": "test"}, timeout=10)
        if resp.status_code != 404 and resp.status_code != 405:
            print(f"\n[{resp.status_code}] {name} /dataset/query")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

print("\n完成")
