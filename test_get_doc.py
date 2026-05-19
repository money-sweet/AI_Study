import requests
import json

BASE = "https://digitchat.fanruan.com/dataset"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 先用检索获取一个真实的 doc_id
url = f"{BASE}/api/v1/retrieve"
payload = {
    "query": "零售行业",
    "retrieval_model": {
        "business_domain": "project",
        "datasets": "both",
        "rerank_enable": True,
        "top_k": 3
    }
}
resp = requests.post(url, headers=headers, json=payload, timeout=30)
data = resp.json()

if data.get("chunks"):
    doc_id = data["chunks"][0]["doc_id"]
    print(f"使用 doc_id: {doc_id}")
    
    # 测试 get_document
    url2 = f"{BASE}/api/v1/datasets/documents/{doc_id}"
    resp2 = requests.get(url2, headers=headers, timeout=15)
    print(f"\nStatus: {resp2.status_code}")
    try:
        doc_data = resp2.json()
        print(json.dumps(doc_data, indent=2, ensure_ascii=False)[:5000])
    except:
        print(resp2.text[:1000])
else:
    print("没有获取到文档")
