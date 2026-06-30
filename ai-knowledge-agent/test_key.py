#!/usr/bin/env python3
"""
Kimi API Key 诊断脚本
在你的环境里运行这个脚本，把完整输出截图/复制给我
"""
import requests
import json
import sys

KEY = "sk-kimi-zQtdR8hK7qpt605OjTR5D8prNCwCSHvnSgLhMKGz6QiewLKnMw9pA1dvScLX5nu3"
BASE_URL = "https://api.moonshot.cn/v1"

headers = {
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json"
}

print("=" * 50)
print("诊断 1: 模型列表")
print("=" * 50)
r1 = requests.get(f"{BASE_URL}/models", headers=headers, timeout=30)
print(f"状态码: {r1.status_code}")
print(f"响应体: {r1.text[:500]}")

print("\n" + "=" * 50)
print("诊断 2: Embedding 接口")
print("=" * 50)
r2 = requests.post(
    f"{BASE_URL}/embeddings",
    headers=headers,
    json={"model": "moonshot-v1-embedding", "input": ["测试文本"]},
    timeout=30
)
print(f"状态码: {r2.status_code}")
print(f"响应体: {r2.text[:500]}")

print("\n" + "=" * 50)
print("诊断 3: Chat 接口")
print("=" * 50)
r3 = requests.post(
    f"{BASE_URL}/chat/completions",
    headers=headers,
    json={
        "model": "moonshot-v1-8k",
        "messages": [{"role": "user", "content": "你好"}]
    },
    timeout=30
)
print(f"状态码: {r3.status_code}")
print(f"响应体: {r3.text[:500]}")

print("\n" + "=" * 50)
print("诊断 4: 响应头（排查限流/IP问题）")
print("=" * 50)
print(f"Request-Id: {r3.headers.get('Msh-Request-Id', 'N/A')}")
print(f"Trace-Mode: {r3.headers.get('Msh-Trace-Mode', 'N/A')}")

if r1.status_code == 200 and r2.status_code == 200 and r3.status_code == 200:
    print("\n✅ 全部通过！Key 在你当前网络环境下有效。")
    print("   如果在我这里不行，可能是 IP 地域/代理差异，不影响部署。")
else:
    print("\n❌ 有接口返回非 200，请检查：")
    print("   1. 账户是否欠费/无余额")
    print("   2. Key 是否被禁用/过期")
    print("   3. 是否开通过 API 服务（不是网页版 Kimi）")
