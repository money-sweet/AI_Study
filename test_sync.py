import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {"Content-Type": "application/json"}

# 测试 /server/sync
print("=" * 70)
print("测试 /server/sync")
print("=" * 70)
url = f"{BASE_URL}/server/sync"
payload = {
    "id": "test-doc-1",
    "type": "doc",
    "name": "测试文档",
    "link": "https://example.com/doc1"
}
# 尝试不同的认证方式
for auth_name, h in [
    ("no_auth", headers),
    ("Bearer", {**headers, "Authorization": f"Bearer {API_KEY}"}),
    ("token_in_body", {**headers}),
]:
    test_payload = payload.copy()
    if auth_name == "token_in_body":
        test_payload["token"] = API_KEY
    try:
        resp = requests.post(url, headers=h, json=test_payload, timeout=10)
        print(f"\n[{resp.status_code}] {auth_name}")
        try:
            print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
        except:
            print(resp.text[:500])
    except Exception as e:
        print(f"Error: {e}")

# 测试 CAS 登录
print("\n" + "=" * 70)
print("测试 CAS 相关接口")
print("=" * 70)

# GET /server/cas/login
url = f"{BASE_URL}/server/cas/login"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"\n[{resp.status_code}] GET /server/cas/login")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
    except:
        print(resp.text[:500])
except:
    pass

# GET /server/cas/user
url = f"{BASE_URL}/server/cas/user"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"\n[{resp.status_code}] GET /server/cas/user")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
    except:
        print(resp.text[:500])
except:
    pass

# 尝试更多认证方式
print("\n" + "=" * 70)
print("尝试更多 dataset/retrieval 认证组合")
print("=" * 70)
url = f"{BASE_URL}/server/dataset/retrieval"

# 尝试把 API Key 拆分成不同部分（frg_ 前缀可能是某种标识）
key_parts = API_KEY.split("_", 1)
print(f"Key prefix: {key_parts[0]}")
print(f"Key body: {key_parts[1][:30]}...")

# 尝试 frg_ 作为某种标识符，后面是真正的 key
for token_val in [API_KEY, key_parts[1] if len(key_parts) > 1 else API_KEY]:
    for payload in [
        {"question": "test", "token": token_val},
        {"question": "test", "api_key": token_val},
        {"question": "test", "key": token_val},
        {"question": "test", "access_token": token_val},
    ]:
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=10)
            if resp.status_code != 401:
                print(f"\n[{resp.status_code}] token={token_val[:20]}..., payload={list(payload.keys())}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
                except:
                    print(resp.text[:500])
                break
        except:
            pass

print("\n完成")
