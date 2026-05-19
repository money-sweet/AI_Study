import requests
import json

BASE_URL = "https://digitchat.fanruan.com/dataset"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 获取完整响应并保存到文件
url = f"{BASE_URL}/api/v1/retrieve"
payload = {
    "query": "零售行业的成功案例有哪些？",
    "retrieval_model": {
        "business_domain": "project",
        "datasets": "both",
        "rerank_enable": True,
        "top_k": 5,
        "vector_weight": 0.7,
        "rerank_blend_weight": 0.3
    }
}

try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    data = resp.json()
    
    # 保存到文件
    with open("api_response.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Status: {resp.status_code}")
    print(f"Keys: {list(data.keys())}")
    print(f"Total chunks: {len(data.get('chunks', []))}")
    
    # 分析每个 chunk 的结构
    for i, chunk in enumerate(data.get("chunks", [])[:3]):
        print(f"\n--- Chunk {i+1} ---")
        for key, value in chunk.items():
            if key == "content":
                print(f"  {key}: {value[:200]}...")
            else:
                print(f"  {key}: {value}")
    
except Exception as e:
    print(f"Error: {e}")
