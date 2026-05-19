import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

print("=" * 70)
print("系统性探测 /dataset/ 路径下的所有可能端点")
print("=" * 70)

# 测试 /dataset 和 /dataset/ 作为端点本身
for path in ["/dataset", "/dataset/"]:
    url = f"{BASE_URL}{path}"
    for method in ["GET", "POST", "PUT", "PATCH"]:
        try:
            if method == "GET":
                resp = requests.get(url, headers=headers, timeout=10)
            elif method == "POST":
                resp = requests.post(url, headers=headers, json={"query": "test"}, timeout=10)
            elif method == "PUT":
                resp = requests.put(url, headers=headers, json={}, timeout=10)
            else:
                resp = requests.patch(url, headers=headers, json={}, timeout=10)
            
            if resp.status_code not in [301, 404, 405]:
                print(f"\n[{resp.status_code}] {method} {path}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
                except:
                    print(resp.text[:500])
        except:
            pass

# 测试 /dataset/ 下的子路径
print("\n" + "=" * 70)
print("探测 /dataset/ 下的各种子路径")
print("=" * 70)

sub_paths = [
    "retrieval", "retrieve", "search", "query", "ask",
    "chat", "completions", "completion",
    "sync", "upload", "update", "delete",
    "documents", "docs", "files", "nodes", "items",
    "list", "get", "fetch",
    "knowledge", "wiki", "kb",
    "rag", "vector", "embedding",
    "v1/retrieval", "v1/search", "v1/query",
    "api/retrieval", "api/search", "api/query",
]

for sub in sub_paths:
    url = f"{BASE_URL}/dataset/{sub}"
    for method in ["POST", "GET"]:
        try:
            if method == "POST":
                payload = {
                    "query": "test",
                    "question": "test",
                    "business_domain": "project",
                    "datasets": "both",
                    "top_k": 10
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=10)
            else:
                resp = requests.get(url, headers=headers, timeout=10)
            
            if resp.status_code not in [404, 405]:
                print(f"\n[{resp.status_code}] {method} /dataset/{sub}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
                except:
                    print(resp.text[:500])
        except:
            pass

# 尝试把 API Key 放在 URL 中
print("\n" + "=" * 70)
print("尝试 URL 参数认证")
print("=" * 70)

for sub in ["retrieval", "query", "search"]:
    url = f"{BASE_URL}/dataset/{sub}?api_key={API_KEY}"
    try:
        resp = requests.post(url, headers={"Content-Type": "application/json"}, json={"query": "test"}, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] POST /dataset/{sub}?api_key=...")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:300])
    except:
        pass

# 尝试不带任何认证头
print("\n" + "=" * 70)
print("尝试不带认证头")
print("=" * 70)

for sub in ["retrieval", "query", "search", "chat"]:
    url = f"{BASE_URL}/dataset/{sub}"
    try:
        resp = requests.post(url, headers={"Content-Type": "application/json"}, json={"query": "test"}, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] POST /dataset/{sub} (no auth)")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:300])
    except:
        pass

# 尝试 WebSocket 升级
print("\n" + "=" * 70)
print("尝试 WebSocket 连接")
print("=" * 70)

try:
    import websocket
    ws_url = "wss://digitchat.fanruan.com/dataset/ws"
    ws = websocket.create_connection(ws_url, header=[f"Authorization: Bearer {API_KEY}"], timeout=5)
    print("WebSocket connected!")
    ws.close()
except ImportError:
    print("websocket-client not installed, skipping")
except Exception as e:
    print(f"WebSocket failed: {e}")

print("\n探测完成")
