import requests
import json

BASE_URL = "https://digitchat.fanruan.com/dataset"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 测试1: 正确的检索端点
print("=" * 70)
print("测试1: POST /dataset/api/v1/retrieve")
print("=" * 70)

url = f"{BASE_URL}/api/v1/retrieve"
payload = {
    "query": "零售行业的成功案例有哪些？",
    "retrieval_model": {
        "business_domain": "project",
        "datasets": "both",
        "rerank_enable": True,
        "top_k": 20,
        "vector_weight": 0.7,
        "rerank_blend_weight": 0.3
    }
}

try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:3000])
    except:
        print(resp.text[:1000])
except Exception as e:
    print(f"Error: {e}")

# 测试2: 纯数据过滤（query为空）
print("\n" + "=" * 70)
print("测试2: POST /dataset/api/v1/retrieve (纯过滤)")
print("=" * 70)

payload2 = {
    "query": "",
    "retrieval_model": {
        "business_domain": "project",
        "datasets": "summary",
        "rerank_enable": False,
        "top_k": 100
    },
    "metadata_filters": {
        "author": {
            "value": "张三",
            "operator": "equals"
        }
    }
}

try:
    resp = requests.post(url, headers=headers, json=payload2, timeout=30)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:3000])
    except:
        print(resp.text[:1000])
except Exception as e:
    print(f"Error: {e}")

# 测试3: 文档详情
print("\n" + "=" * 70)
print("测试3: GET /dataset/api/v1/datasets/documents/{id}")
print("=" * 70)

# 先用一个测试ID
test_doc_id = "test-doc-id"
url = f"{BASE_URL}/api/v1/datasets/documents/{test_doc_id}"
try:
    resp = requests.get(url, headers=headers, timeout=15)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
    except:
        print(resp.text[:500])
except Exception as e:
    print(f"Error: {e}")

# 测试4: 不带认证头
print("\n" + "=" * 70)
print("测试4: 不带认证头")
print("=" * 70)

url = f"{BASE_URL}/api/v1/retrieve"
try:
    resp = requests.post(url, headers={"Content-Type": "application/json"}, json=payload, timeout=15)
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False)[:1000])
    except:
        print(resp.text[:300])
except Exception as e:
    print(f"Error: {e}")

print("\n完成")
