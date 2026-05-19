import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

# 各种认证方式
auth_methods = {
    "Bearer": {"Authorization": f"Bearer {API_KEY}"},
    "Bearer_no_prefix": {"Authorization": API_KEY},
    "X-API-Key": {"X-API-Key": API_KEY},
    "api-key": {"api-key": API_KEY},
    "x-auth-token": {"x-auth-token": API_KEY},
    "X-Auth-Token": {"X-Auth-Token": API_KEY},
    "api_key": {"api_key": API_KEY},
    "token": {"token": API_KEY},
    "Token": {"Token": API_KEY},
}

# 测试几个端点
test_cases = [
    ("GET", "/server/cas/user", {}),
    ("GET", "/server/chat/conversations", {}),
    ("POST", "/server/dataset/retrieval", {"question": "test"}),
    ("POST", "/server/chat/completions", {"message": "hello", "messages": [{"role": "user", "content": "hello"}]}),
]

for auth_name, auth_headers in auth_methods.items():
    headers = {**auth_headers, "Content-Type": "application/json"}
    for method, path, payload in test_cases:
        url = f"{BASE_URL}{path}"
        try:
            if method == "GET":
                resp = requests.get(url, headers=headers, timeout=10)
            else:
                resp = requests.post(url, headers=headers, json=payload, timeout=10)
            
            if resp.status_code != 401 and resp.status_code != 404 and resp.status_code != 405:
                print(f"[{resp.status_code}] {auth_name} {method} {path}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
                except:
                    print(resp.text[:500])
                print()
            elif resp.status_code == 200:
                print(f"[{resp.status_code}] {auth_name} {method} {path}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
                except:
                    print(resp.text[:500])
                print()
        except Exception as e:
            pass

# 尝试 query param 认证
print("\n" + "=" * 50)
print("测试 Query Param 认证")
print("=" * 50)
for method, path, payload in test_cases:
    url = f"{BASE_URL}{path}?api_key={API_KEY}"
    try:
        if method == "GET":
            resp = requests.get(url, headers={"Content-Type": "application/json"}, timeout=10)
        else:
            resp = requests.post(url, headers={"Content-Type": "application/json"}, json=payload, timeout=10)
        
        if resp.status_code != 401 and resp.status_code != 404 and resp.status_code != 405:
            print(f"[{resp.status_code}] query_api_key {method} {path}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
            print()
        elif resp.status_code == 200:
            print(f"[{resp.status_code}] query_api_key {method} {path}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
            print()
    except:
        pass

print("探测完成")
