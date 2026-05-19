import requests
import json

BASE = "https://digitchat.fanruan.com"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 用飞书文档中的参数构建请求
print("=" * 70)
print("测试: 使用文档中的参数调用 dataset/retrieval")
print("=" * 70)

payloads = [
    {
        "question": "公司规章制度",
        "business_domain": "project",
        "datasets": "both",
        "rerank_enable": True,
        "top_k": 50,
        "score_threshold": 0.5,
        "vector_weight": 0.7,
        "rerank_blend_weight": 0.6
    },
    {
        "question": "test",
        "business_domain": "contract",
        "datasets": "summary",
        "rerank_enable": False,
        "top_k": 10
    },
    {
        "query": "公司规章制度",
        "business_domain": "project",
        "datasets": "both",
        "top_k": 50
    },
]

for i, payload in enumerate(payloads):
    url = f"{BASE}/server/dataset/retrieval"
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        print(f"\n[{resp.status_code}] Payload {i+1}: {list(payload.keys())}")
        try:
            data = resp.json()
            print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
        except:
            print(resp.text[:500])
    except Exception as e:
        print(f"Error: {e}")

# 测试 contract 路径
print("\n" + "=" * 70)
print("测试: /server/contract/dataset/retrieval/format")
print("=" * 70)

url = f"{BASE}/server/contract/dataset/retrieval/format"
payload = {
    "items": [
        {
            "sourceName": "",
            "collectionId": "",
            "q": "公司规章制度"
        }
    ],
    "business_domain": "contract",
    "datasets": "both",
    "top_k": 50
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=15)
    print(f"[{resp.status_code}] contract/format")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:500])
except Exception as e:
    print(f"Error: {e}")

# 测试 culture 路径
print("\n" + "=" * 70)
print("测试: /server/culture/dataset/retrieval/format")
print("=" * 70)

url = f"{BASE}/server/culture/dataset/retrieval/format"
payload = {
    "items": [
        {
            "sourceName": "",
            "collectionId": "",
            "q": "公司规章制度"
        }
    ],
    "business_domain": "project",
    "datasets": "both"
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=15)
    print(f"[{resp.status_code}] culture/format")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:500])
except Exception as e:
    print(f"Error: {e}")

# 测试 chat completions 使用文档参数
print("\n" + "=" * 70)
print("测试: chat/completions 带完整参数")
print("=" * 70)

url = f"{BASE}/server/chat/completions"
payload = {
    "messages": [{"role": "user", "content": "公司规章制度是什么？"}],
    "business_domain": "project",
    "datasets": "both",
    "rerank_enable": True,
    "top_k": 50,
    "stream": False
}
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"[{resp.status_code}] chat/completions")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:500])
except Exception as e:
    print(f"Error: {e}")

print("\n完成")
