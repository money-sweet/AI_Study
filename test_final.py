import requests
import json

API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
BASE = "https://digitchat.fanruan.com"

# 尝试所有可能的 /dataset/ 组合
print("=" * 70)
print("最终探测: /dataset/ 作为资源ID的各种组合")
print("=" * 70)

# 也许 /dataset/ 后面需要跟一个 dataset ID
# 尝试把 API Key 或其中一部分作为 dataset ID
for dataset_id in ["default", "main", "kb", "1", "test", ""]:
    for endpoint in ["query", "search", "ask", "retrieve", "retrieval", "chat", "completions"]:
        url = f"{BASE}/dataset/{dataset_id}/{endpoint}".rstrip("/")
        try:
            resp = requests.post(url, headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            }, json={"query": "test", "question": "test"}, timeout=10)
            if resp.status_code != 404 and resp.status_code != 405:
                print(f"\n[{resp.status_code}] {url}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
                except:
                    print(resp.text[:500])
        except:
            pass

# 尝试 /dataset 作为查询参数
print("\n" + "=" * 70)
print("尝试 dataset 作为查询参数")
print("=" * 70)
for ep in ["/server/dataset/retrieval", "/server/chat/completions"]:
    url = f"{BASE}{ep}?dataset=default&api_key={API_KEY}"
    try:
        resp = requests.post(url, headers={"Content-Type": "application/json"}, json={"question": "test", "messages": [{"role": "user", "content": "test"}]}, timeout=10)
        if resp.status_code != 401 and resp.status_code != 404:
            print(f"\n[{resp.status_code}] {url}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
    except:
        pass

# 尝试访问可能的管理/配置端点
print("\n" + "=" * 70)
print("探测其他可能的管理端点")
print("=" * 70)
paths = [
    "/health", "/status", "/info", "/version",
    "/api/health", "/api/status",
    "/server/health", "/server/status",
]
for path in paths:
    url = f"{BASE}{path}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] {path}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:300])
    except:
        pass

print("\n探测完成")
