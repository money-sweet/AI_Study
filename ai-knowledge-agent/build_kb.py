#!/usr/bin/env python3
"""
独立脚本：构建知识库
用法：
    1. 配置 urls.txt（每行一个链接）
    2. 设置环境变量 KIMI_API_KEY
    3. python build_kb.py

如果 KMS 需要登录，可以通过环境变量传入 Cookie：
    $env:KMS_COOKIES='{"JSESSIONID":"xxx","seraph.confluence":"xxx"}'
"""

import os
import sys
import json

if not os.getenv("KIMI_API_KEY"):
    print("❌ 请设置环境变量 KIMI_API_KEY")
    sys.exit(1)

from crawler import WebCrawler
from knowledge_base import KnowledgeBase
from config import URL_LIST_FILE

# 读取 URL 列表
if URL_LIST_FILE.exists():
    urls = [
        line.strip() for line in URL_LIST_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.startswith("#")
    ]
else:
    print("❌ 未找到 urls.txt，请创建并写入网页链接")
    sys.exit(1)

print(f"📄 读取到 {len(urls)} 个起始 URL")

# 读取 Cookie（可选）
cookies = {}
cookie_env = os.getenv("KMS_COOKIES", "")
if cookie_env:
    try:
        cookies = json.loads(cookie_env)
        print(f"🍪 使用 Cookie 登录: {list(cookies.keys())}")
    except Exception as e:
        print(f"⚠️ Cookie 解析失败: {e}")

crawler = WebCrawler(cookies=cookies)

# 提取下级链接
all_urls = set(urls)
print("🔍 提取下级链接...")
for url in urls:
    children = crawler.extract_child_links(url)
    all_urls.update(children)
    print(f"  {url} -> +{len(children)} 个子链接")

all_urls = sorted(all_urls)
print(f"\n📊 共 {len(all_urls)} 个页面待爬取\n")

# 爬取
docs = crawler.fetch_all(all_urls, delay=1.5)

success = [d for d in docs if d["success"]]
failed = [d for d in docs if not d["success"]]

print(f"\n✅ 成功: {len(success)} | ❌ 失败: {len(failed)}")
if failed:
    print("\n失败链接：")
    for d in failed:
        print(f"  - {d['url']}: {d['error']}")

# 入库
kb = KnowledgeBase()
kb.clear()
kb.add_documents(success)

print("\n🎉 知识库构建完成！")
