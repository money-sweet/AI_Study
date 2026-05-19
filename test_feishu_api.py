"""
测试飞书知识库 API 连通性和权限
"""
import requests
import json

# 配置
WIKU_URL = "https://sxl1sy41rw.feishu.cn/wiki/NeRCwvSsKiGhRSk6nzfcJwYvnUg"
API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"

# 从 URL 提取 wiki token
# URL 格式: https://xxx.feishu.cn/wiki/{wiki_token}
wiku_token = WIKU_URL.split("/wiki/")[-1].split("?")[0]
print(f"提取的 Wiki Token: {wiku_token}")

# 尝试1: 直接使用 API Key 作为 Tenant Access Token 调用 API
print("\n" + "="*60)
print("测试1: 使用 API Key 作为 Tenant Access Token")
print("="*60)

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json; charset=utf-8"
}

# 测试获取知识库信息
url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/{wiku_token}"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"URL: {url}")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text[:500]}")
except Exception as e:
    print(f"请求失败: {e}")

# 尝试2: 获取知识库下的节点列表
print("\n" + "="*60)
print("测试2: 获取知识库节点列表")
print("="*60)

url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/{wiku_token}/nodes"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"URL: {url}")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text[:1000]}")
except Exception as e:
    print(f"请求失败: {e}")

# 尝试3: 使用 API Key 作为 App Access Token（另一种认证方式）
print("\n" + "="*60)
print("测试3: 检查 API Key 是否为 App ID/Secret 格式")
print("="*60)

# 飞书标准流程: 用 App ID + App Secret 获取 Tenant Access Token
# 尝试看看 API Key 是否包含了某种凭证信息
print(f"API Key 长度: {len(API_KEY)}")
print(f"API Key 前缀: {API_KEY[:20]}...")

# 尝试4: 如果是 App Access Token，尝试获取用户信息
print("\n" + "="*60)
print("测试4: 尝试获取当前用户信息（验证 Token 有效性）")
print("="*60)

url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
# 有些 API key 可能是直接可用的 tenant_access_token
url_user = "https://open.feishu.cn/open-apis/authen/v1/user_info"
try:
    resp = requests.get(url_user, headers=headers, timeout=10)
    print(f"URL: {url_user}")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text[:500]}")
except Exception as e:
    print(f"请求失败: {e}")

# 尝试5: 检查是否为 Personal Access Token (PAT) 格式
print("\n" + "="*60)
print("测试5: 检查文档元数据接口")
print("="*60)

# wiki v1 API (旧版)
url = f"https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token={wiku_token}"
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print(f"URL: {url}")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text[:1000]}")
except Exception as e:
    print(f"请求失败: {e}")

print("\n" + "="*60)
print("测试完成")
print("="*60)
