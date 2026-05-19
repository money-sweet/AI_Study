import requests
import json

BASE_URL = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 测试1: dataset/retrieval - RAG检索
print("=" * 70)
print("测试1: POST /server/dataset/retrieval")
print("=" * 70)
url = f"{BASE_URL}/server/dataset/retrieval"
payload = {
    "question": "公司规章制度",
    "agent_type": ""
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:3000])
    except:
        print(resp.text[:2000])
except Exception as e:
    print(f"Error: {e}")

# 测试2: dataset/retrieval/format - 格式化检索
print("\n" + "=" * 70)
print("测试2: POST /server/dataset/retrieval/format")
print("=" * 70)
url = f"{BASE_URL}/server/dataset/retrieval/format"
payload = {
    "items": [
        {
            "sourceName": "",
            "collectionId": "",
            "q": "公司规章制度"
        }
    ]
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:3000])
    except:
        print(resp.text[:2000])
except Exception as e:
    print(f"Error: {e}")

# 测试3: 尝试不同的检索问题
print("\n" + "=" * 70)
print("测试3: 测试不同检索问题")
print("=" * 70)
for question in ["test", "hello", "你好", "产品介绍"]:
    url = f"{BASE_URL}/server/dataset/retrieval"
    payload = {"question": question}
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"\nQ: '{question}' -> Status: {resp.status_code}")
        try:
            data = resp.json()
            print(json.dumps(data, indent=2, ensure_ascii=False)[:1500])
        except:
            print(resp.text[:500])
    except Exception as e:
        print(f"Error: {e}")
