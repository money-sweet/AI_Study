import requests
import json

API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

# 尝试在 /dataset/ 路径下的各种端点
base_paths = [
    "https://digitchat.fanruan.com/dataset",
    "https://digitchat.fanruan.com/dataset/",
]

endpoints = [
    "retrieval", "retrieval/format", "sync", "chat/completions",
    "", "list", "documents", "files", "nodes", "spaces",
    "search", "query", "ask"
]

headers_bearer = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

headers_apikey = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

headers_token = {
    "Token": API_KEY,
    "Content-Type": "application/json"
}

for base in base_paths:
    for ep in endpoints:
        url = f"{base}/{ep}".rstrip("/")
        for header_name, headers in [("Bearer", headers_bearer), ("X-API-Key", headers_apikey), ("Token", headers_token)]:
            try:
                method = "POST" if ep in ["retrieval", "retrieval/format", "sync", "chat/completions", "search", "query", "ask"] else "GET"
                if method == "POST":
                    payload = {"question": "test"} if "retrieval" in ep or ep in ["search", "query", "ask"] else {}
                    resp = requests.post(url, headers=headers, json=payload, timeout=10)
                else:
                    resp = requests.get(url, headers=headers, timeout=10)
                
                if resp.status_code != 404 and resp.status_code != 405:
                    print(f"[{resp.status_code}] {header_name} {method} {url}")
                    try:
                        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
                    except:
                        print(resp.text[:500])
                    print()
            except:
                pass

print("探测完成")
