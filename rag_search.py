"""
RAG 检索演示脚本
演示如何使用 Knowhow API 进行知识库检索
"""
from knowhow_client import KnowhowClient, RetrievalModel, MetadataFilter


def demo_rag_search():
    """演示 RAG 检索"""
    client = KnowhowClient(api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ")

    print("=" * 70)
    print("Knowhow RAG 检索演示")
    print("=" * 70)

    # Demo 1: 基础检索
    print("\n【演示1】基础 RAG 检索")
    print("-" * 70)
    result = client.rag_query(
        question="零售行业的成功案例有哪些？",
        top_k=5
    )
    print_results(result)

    # Demo 2: 带元数据过滤的检索
    print("\n【演示2】按行业过滤")
    print("-" * 70)
    result = client.rag_query(
        question="数字化转型方案",
        top_k=5,
        industry=["零售"]
    )
    print_results(result)

    # Demo 3: 按质量等级过滤
    print("\n【演示3】按质量等级过滤（严选）")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("quality", "严选", "equals"),
            MetadataFilter("tags", ["案例"], "containsAny")
        ],
        top_k=5
    )
    print_results(result)

    # Demo 4: 按客户筛选
    print("\n【演示4】按客户名称筛选")
    print("-" * 70)
    result = client.search_by_customer("零售客户示例", top_k=5)
    print_results(result)

    # Demo 5: 纯数据过滤（不按向量检索）
    print("\n【演示5】纯数据过滤：查找所有 FineBI 相关文档")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("products", ["FineBI"], "containsAny")
        ],
        top_k=10
    )
    print_results(result)

    # Demo 6: 高级检索（混合检索 + Rerank）
    print("\n【演示6】高级检索：混合检索 + Rerank 精排")
    print("-" * 70)
    retrieval_model = RetrievalModel(
        business_domain="project",
        datasets="both",
        rerank_enable=True,
        top_k=10,
        vector_weight=0.7,
        rerank_blend_weight=0.3
    )
    result = client.retrieve(
        query="如何搭建企业级数据仓库？",
        retrieval_model=retrieval_model
    )
    print_results(result)

    # Demo 7: 多条件组合过滤
    print("\n【演示7】多条件组合：行业=零售 + 质量=严选 + 产品线=FineReport")
    print("-" * 70)
    result = client.filter_documents(
        metadata_filters=[
            MetadataFilter("industry", ["零售"], "containsAny"),
            MetadataFilter("quality", "严选", "equals"),
            MetadataFilter("products", ["FineReport"], "containsAny")
        ],
        top_k=10
    )
    print_results(result)


def print_results(result: dict):
    """打印检索结果"""
    chunks = result.get("chunks", [])
    total = result.get("total", 0)

    print(f"共找到 {total} 条结果\n")

    for i, chunk in enumerate(chunks, 1):
        doc_id = chunk.get("doc_id", "N/A")
        title = chunk.get("title", "无标题")
        score = chunk.get("score", 0)
        content = chunk.get("content", "")
        summary = chunk.get("summary", "")
        meta = chunk.get("metadata", {})

        print(f"  [{i}] {title}")
        print(f"      ID: {doc_id} | Score: {score:.3f}")
        print(f"      作者: {meta.get('author', 'N/A')} | 客户: {meta.get('customer', 'N/A')}")
        print(f"      质量: {meta.get('quality', 'N/A')} | 行业: {', '.join(meta.get('industry', []))}")
        print(f"      链接: {meta.get('link', 'N/A')}")

        # 显示摘要或内容
        display_text = summary if summary else content
        if display_text:
            display_text = display_text.replace("\n", " ").strip()
            print(f"      内容: {display_text[:150]}...")

        print()


def interactive_search():
    """交互式检索"""
    client = KnowhowClient(api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ")

    print("\n" + "=" * 70)
    print("交互式 RAG 检索 (输入 'quit' 退出)")
    print("=" * 70)
    print("提示: 可以输入自然语言问题，如'零售行业案例'、'BI实施方案'等")

    while True:
        query = input("\n🔍 请输入查询: ").strip()
        if query.lower() in ["quit", "exit", "q"]:
            break
        if not query:
            continue

        try:
            result = client.rag_query(question=query, top_k=10)
            print_results(result)
        except Exception as e:
            print(f"检索失败: {e}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_search()
    else:
        demo_rag_search()
        print("\n" + "=" * 70)
        print("演示完成！")
        print("运行 'python rag_search.py --interactive' 进入交互模式")
        print("=" * 70)
