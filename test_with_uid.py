import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {"Content-Type": "application/json"}

# 测试1: chat/completions 带 uid, name_en, token
print("=" * 70)
print("测试1: chat/completions 带认证参数")
print("=" * 70)
url = f"{BASE_URL}/server/chat/completions"
for uid in ["admin", "user", "1", "", None]:
    for name_en in ["admin", "user", "", None]:
        payload = {
            "messages": [{"role": "user", "content": "你好"}],
            "stream": False
        }
        if uid is not None:
            payload["uid"] = uid
        if name_en is not None:
            payload["name_en"] = name_en
        payload["token"] = API_KEY
        
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            if resp.status_code != 401 and resp.status_code != 422:
                print(f"\n[{resp.status_code}] uid={uid}, name_en={name_en}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
                except:
                    print(resp.text[:500])
                break
            elif resp.status_code == 200:
                print(f"\n[200] uid={uid}, name_en={name_en}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
                except:
                    print(resp.text[:500])
                break
            else:
                try:
                    err = resp.json()
                    if "Missing" not in str(err):
                        print(f"\n[{resp.status_code}] uid={uid}, name_en={name_en}: {err}")
                except:
                    pass
        except:
            pass

# 测试2: dataset/retrieval 带 uid, name_en, token
print("\n" + "=" * 70)
print("测试2: dataset/retrieval 带认证参数")
print("=" * 70)
url = f"{BASE_URL}/server/dataset/retrieval"
for uid in ["admin", "user", "1", ""]:
    for name_en in ["admin", "user", ""]:
        payload = {
            "question": "公司规章制度",
            "token": API_KEY,
            "uid": uid,
            "name_en": name_en
        }
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            if resp.status_code != 401:
                print(f"\n[{resp.status_code}] uid={uid}, name_en={name_en}")
                try:
                    print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
                except:
                    print(resp.text[:500])
                break
            else:
                try:
                    err = resp.json()
                    if "Invalid API Key" not in str(err):
                        print(f"\n[{resp.status_code}] uid={uid}, name_en={name_en}: {err}")
                except:
                    pass
        except:
            pass

# 测试3: 只带 token
print("\n" + "=" * 70)
print("测试3: 只带 token 参数")
print("=" * 70)
for endpoint in ["/server/dataset/retrieval", "/server/dataset/retrieval/format"]:
    url = f"{BASE_URL}{endpoint}"
    if "format" in endpoint:
        payload = {
            "items": [{"sourceName": "", "collectionId": "", "q": "test"}],
            "token": API_KEY
        }
    else:
        payload = {"question": "test", "token": API_KEY}
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        print(f"\n[{resp.status_code}] {endpoint}")
        try:
            print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
        except:
            print(resp.text[:500])
    except:
        pass

# 测试4: 尝试获取对话列表（不需要认证？）
print("\n" + "=" * 70)
print("测试4: GET /server/chat/conversations")
print("=" * 70)
url = f"{BASE_URL}/server/chat/conversations"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"[{resp.status_code}] {url}")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:1500])
    except:
        print(resp.text[:500])
except:
    pass

print("\n探测完成")
