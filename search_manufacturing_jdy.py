"""
搜索 Knowhow 中制造业相关的 JDY 客户案例
"""
from knowhow_client import KnowhowClient, RetrievalModel, MetadataFilter


def search_manufacturing_jdy():
    client = KnowhowClient(
        api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
    )

    print("=" * 70)
    print("搜索 Knowhow - 制造业 + JDY 客户案例")
    print("=" * 70)

    # 策略1: RAG 检索 "JDY 制造业"
    print("\n【策略1】RAG 检索: 'JDY 制造业 案例'")
    print("-" * 70)
    result = client.rag_query(
        question="JDY 制造业 客户案例",
        top_k=20,
        industry=["制造业"],
        products=["JDY"]
    )
    print_results(result, limit=10)

    # 策略2: 纯过滤 - 行业=制造业 + 产品线=JDY
    print("\n【策略2】纯过滤: industry=制造业 + products=JDY")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("industry", ["制造业"], "containsAny"),
            MetadataFilter("products", ["JDY"], "containsAny")
        ],
        top_k=50
    )
    print_results(result, limit=15)

    # 策略3: 仅按产品线过滤 JDY
    print("\n【策略3】按产品线过滤: products=JDY")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("products", ["JDY"], "containsAny")
        ],
        top_k=30
    )
    print_results(result, limit=10)

    # 策略4: 检索 "制造" 关键词 + JDY
    print("\n【策略4】关键词检索: '制造' + JDY")
    print("-" * 70)
    result = client.retrieve(
        query="制造 JDY 案例",
        retrieval_model=RetrievalModel(
            business_domain="project",
            datasets="both",
            rerank_enable=True,
            top_k=20
        ),
        metadata_filters=[
            MetadataFilter("products", ["JDY"], "containsAny")
        ]
    )
    print_results(result, limit=10)

    # 策略5: 按标签过滤（资料类型=客户案例）+ JDY
    print("\n【策略5】按标签过滤: tags=客户案例 + products=JDY")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("tags", ["客户案例"], "containsAny"),
            MetadataFilter("products", ["JDY"], "containsAny")
        ],
        top_k=30
    )
    print_results(result, limit=10)


def print_results(result: dict, limit: int = 10):
    """打印检索结果"""
    chunks = result.get("chunks", [])
    total = result.get("total", 0)

    if not chunks:
        print("  (无结果)")
        return

    print(f"  共找到 {total} 条结果，显示前 {min(limit, len(chunks))} 条:\n")

    for i, chunk in enumerate(chunks[:limit], 1):
        doc_id = chunk.get("doc_id", "N/A")
        title = chunk.get("title", "无标题")
        score = chunk.get("score", 0)
        meta = chunk.get("metadata", {})

        print(f"  [{i}] {title}")
        print(f"      Score: {score:.3f} | ID: {doc_id}")
        print(f"      客户: {meta.get('customer', 'N/A')}")
        print(f"      作者: {meta.get('author', 'N/A')}")
        print(f"      行业: {', '.join(meta.get('industry', [])) or 'N/A'}")
        print(f"      产品线: {', '.join(meta.get('products', [])) or 'N/A'}")
        print(f"      质量: {meta.get('quality', 'N/A')}")
        print(f"      标签: {', '.join(meta.get('tags', [])) or 'N/A'}")
        print(f"      链接: {meta.get('link', 'N/A')}")

        # 显示内容摘要
        content = chunk.get("content", "").replace("\n", " ").strip()
        if content:
            print(f"      摘要: {content[:120]}...")
        print()


def export_to_file():
    """将搜索结果导出到文件"""
    client = KnowhowClient(
        api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
    )

    print("\n正在导出所有制造业+JDY案例到文件...")

    # 获取尽可能多的结果
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("products", ["JDY"], "containsAny")
        ],
        top_k=500
    )

    chunks = result.get("chunks", [])

    # 按文档去重
    seen_docs = {}
    for chunk in chunks:
        doc_id = chunk.get("doc_id")
        if doc_id and doc_id not in seen_docs:
            seen_docs[doc_id] = chunk

    # 保存到文件
    import json
    from datetime import datetime

    output = {
        "search_time": datetime.now().isoformat(),
        "query": "制造业 + JDY",
        "total_documents": len(seen_docs),
        "documents": list(seen_docs.values())
    }

    filename = "manufacturing_jdy_cases.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[OK] 已导出 {len(seen_docs)} 个文档到 {filename}")

    # 同时输出 Markdown
    md_lines = ["# 制造业 + JDY 客户案例\n\n"]
    md_lines.append(f"> 搜索时间: {datetime.now().isoformat()}\n")
    md_lines.append(f"> 共找到 {len(seen_docs)} 个文档\n\n")
    md_lines.append("---\n\n")

    for i, (doc_id, chunk) in enumerate(seen_docs.items(), 1):
        title = chunk.get("title", "无标题")
        meta = chunk.get("metadata", {})

        md_lines.append(f"## {i}. {title}\n\n")
        md_lines.append(f"- **客户**: {meta.get('customer', 'N/A')}\n")
        md_lines.append(f"- **作者**: {meta.get('author', 'N/A')}\n")
        md_lines.append(f"- **行业**: {', '.join(meta.get('industry', [])) or 'N/A'}\n")
        md_lines.append(f"- **产品线**: {', '.join(meta.get('products', [])) or 'N/A'}\n")
        md_lines.append(f"- **质量**: {meta.get('quality', 'N/A')}\n")
        md_lines.append(f"- **标签**: {', '.join(meta.get('tags', [])) or 'N/A'}\n")
        md_lines.append(f"- **链接**: {meta.get('link', 'N/A')}\n\n")

        content = chunk.get("content", "").strip()
        if content:
            md_lines.append(f"{content}\n\n")

        md_lines.append("---\n\n")

    md_file = "manufacturing_jdy_cases.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("".join(md_lines))

    print(f"[OK] 已导出 Markdown 到 {md_file}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--export":
        export_to_file()
    else:
        search_manufacturing_jdy()
        print("\n" + "=" * 70)
        print("提示: 运行 'python search_manufacturing_jdy.py --export'")
        print("可将所有结果导出为 JSON 和 Markdown 文件")
        print("=" * 70)
