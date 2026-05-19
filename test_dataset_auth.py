import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Content-Type": "application/json"
}

# 测试1: 把 API Key 放在请求体中
test_payloads = [
    {"question": "test", "api_key": API_KEY},
    {"question": "test", "key": API_KEY},
    {"question": "test", "token": API_KEY},
    {"question": "test", "auth": API_KEY},
    {"question": "test", "apiKey": API_KEY},
]

print("测试1: API Key 放在请求体中")
for payload in test_payloads:
    url = f"{BASE_URL}/server/dataset/retrieval"
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        if resp.status_code != 401:
            print(f"[{resp.status_code}] Payload keys: {list(payload.keys())}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:500])
            print()
    except:
        pass

# 测试2: 带 Authorization header
print("\n测试2: 各种 Authorization header")
auth_headers_list = [
    ("Bearer", f"Bearer {API_KEY}"),
    ("Plain", API_KEY),
    ("ApiKey", f"ApiKey {API_KEY}"),
    ("Basic", f"Basic {API_KEY}"),
]

for name, auth_val in auth_headers_list:
    h = {**headers, "Authorization": auth_val}
    url = f"{BASE_URL}/server/dataset/retrieval"
    try:
        resp = requests.post(url, headers=h, json={"question": "test"}, timeout=10)
        if resp.status_code != 401:
            print(f"[{resp.status_code}] {name}: {auth_val[:30]}...")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:500])
            print()
    except:
        pass

# 测试3: 尝试 /dataset/ 路径下的 retrieval
print("\n测试3: /dataset/ 路径")
for path in ["/dataset/retrieval", "/dataset/server/dataset/retrieval", "/api/server/dataset/retrieval"]:
    url = f"{BASE_URL}{path}"
    h = {**headers, "Authorization": f"Bearer {API_KEY}"}
    try:
        resp = requests.post(url, headers=h, json={"question": "test"}, timeout=10)
        if resp.status_code != 404:
            print(f"[{resp.status_code}] {path}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:500])
            except:
                print(resp.text[:300])
            print()
    except:
        pass

# 测试4: 测试 contract 和 culture 端点
print("\n测试4: 其他 dataset 相关端点")
endpoints = [
    "/server/contract/dataset/retrieval/format",
    "/server/culture/dataset/retrieval/format",
    "/server/dataset/permission/filter",
]
for ep in endpoints:
    url = f"{BASE_URL}{ep}"
    h = {**headers, "Authorization": f"Bearer {API_KEY}"}
    payload = {"items": [{"sourceName": "", "collectionId": "", "q": "test"}]} if "filter" in ep or "format" in ep else {"question": "test"}
    try:
        resp = requests.post(url, headers=h, json=payload, timeout=10)
        if resp.status_code != 401 and resp.status_code != 404:
            print(f"[{resp.status_code}] {ep}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:500])
            print()
    except:
        pass

# 测试5: chat completions 正确调用
print("\n测试5: 正确调用 chat completions")
url = f"{BASE_URL}/server/chat/completions"
payload = {
    "messages": [{"role": "user", "content": "你好"}],
    "stream": False
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"[{resp.status_code}] chat/completions")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:1000])
except Exception as e:
    print(f"Error: {e}")

print("\n探测完成")
