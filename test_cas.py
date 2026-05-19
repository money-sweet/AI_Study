import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {"Content-Type": "application/json"}

# 测试1: 用 API Key 作为 ticket 调用 CAS login
print("=" * 70)
print("测试1: CAS Login with API Key as ticket")
print("=" * 70)
url = f"{BASE_URL}/server/cas/login?ticket={API_KEY}"
try:
    resp = requests.get(url, headers=headers, timeout=15, allow_redirects=False)
    print(f"[{resp.status_code}] GET /server/cas/login?ticket=API_KEY")
    print(f"Headers: {dict(resp.headers)}")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:1000])
except Exception as e:
    print(f"Error: {e}")

# 测试2: 尝试一些常见的 CAS ticket 前缀
print("\n" + "=" * 70)
print("测试2: CAS Login with different ticket formats")
print("=" * 70)
for ticket in [API_KEY, f"ST-{API_KEY}", f"TGT-{API_KEY}"]:
    url = f"{BASE_URL}/server/cas/login?ticket={ticket}"
    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=False)
        if resp.status_code != 422:
            print(f"\n[{resp.status_code}] ticket={ticket[:30]}...")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
            except:
                print(resp.text[:500])
            print(f"Set-Cookie: {resp.headers.get('Set-Cookie')}")
    except:
        pass

# 测试3: 检查是否有 cookie/session 认证
print("\n" + "=" * 70)
print("测试3: 尝试获取 session/cookie")
print("=" * 70)

# 先不带认证访问，看有没有设置cookie
url = f"{BASE_URL}/"
try:
    resp = requests.get(url, timeout=10)
    print(f"[{resp.status_code}] GET /")
    print(f"Set-Cookie: {resp.headers.get('Set-Cookie')}")
except:
    pass

# 测试4: 尝试 OPTIONS 请求看 CORS 头
print("\n" + "=" * 70)
print("测试4: OPTIONS 请求")
print("=" * 70)
url = f"{BASE_URL}/server/dataset/retrieval"
try:
    resp = requests.options(url, headers={
        "Origin": "https://digitchat.fanruan.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Authorization, Content-Type"
    }, timeout=10)
    print(f"[{resp.status_code}] OPTIONS /server/dataset/retrieval")
    print(f"Allow: {resp.headers.get('Allow')}")
    print(f"Access-Control-Allow-Headers: {resp.headers.get('Access-Control-Allow-Headers')}")
except:
    pass

# 测试5: 尝试不同的 base path
print("\n" + "=" * 70)
print("测试5: 尝试其他可能的路径前缀")
print("=" * 70)
paths = [
    "/api/server/dataset/retrieval",
    "/v1/server/dataset/retrieval",
    "/api/v1/server/dataset/retrieval",
    "/dataset/server/dataset/retrieval",
]
for path in paths:
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.post(url, headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}, json={"question": "test"}, timeout=10)
        if resp.status_code != 404:
            print(f"\n[{resp.status_code}] {path}")
            try:
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1000])
            except:
                print(resp.text[:300])
    except:
        pass

print("\n完成")
