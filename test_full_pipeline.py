"""
完整流程测试
验证 SDK、检索、同步功能的正确性
"""
import sys
from pathlib import Path

# 确保当前目录在路径中
sys.path.insert(0, str(Path(__file__).parent))

from knowhow_client import KnowhowClient, RetrievalModel, MetadataFilter


def test_sdk():
    """测试 SDK 基本功能"""
    print("=" * 70)
    print("测试1: SDK 基本功能")
    print("=" * 70)

    client = KnowhowClient(
        api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
    )

    # 测试 RAG 检索
    result = client.rag_query("零售行业案例", top_k=3)
    assert "chunks" in result
    assert "total" in result
    print(f"[OK] RAG 检索成功: {result['total']} 条结果")

    # 测试纯过滤
    result = client.filter_documents(
        metadata_filters=[MetadataFilter("quality", "普通", "equals")],
        top_k=5
    )
    print(f"[OK] 纯过滤成功: {result['total']} 条结果")

    # 测试文档详情
    if result["chunks"]:
        doc_id = result["chunks"][0]["doc_id"]
        doc = client.get_document(doc_id)
        assert "id" in doc
        assert "title" in doc
        print(f"[OK] 文档详情成功: {doc['title']}")

    return True


def test_sync():
    """测试同步功能"""
    print("\n" + "=" * 70)
    print("测试2: 同步功能")
    print("=" * 70)

    from sync_knowledge_base import KnowledgeBaseSync

    syncer = KnowledgeBaseSync(
        api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ",
        output_dir="./knowhow_data_test"
    )

    # 测试发现文档
    doc_ids = syncer.discover_documents(strategies=[
        {"query": "零售", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=10)}
    ])
    print(f"[OK] 文档发现成功: {len(doc_ids)} 个文档")

    # 测试同步单个文档
    if doc_ids:
        doc_id = list(doc_ids)[0]
        success = syncer.sync_document(doc_id)
        if success:
            print(f"[OK] 文档同步成功: {doc_id}")

            # 验证文件存在
            filepath = syncer._get_doc_filename(doc_id)
            assert filepath.exists(), "同步文件不存在"
            print(f"[OK] 文件验证成功: {filepath}")
        else:
            print(f"[WARN] 文档同步失败: {doc_id}")

    return True


def test_rag_demo():
    """测试 RAG 演示"""
    print("\n" + "=" * 70)
    print("测试3: RAG 演示")
    print("=" * 70)

    client = KnowhowClient(
        api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
    )

    # 高级检索
    result = client.retrieve(
        query="企业数字化转型",
        retrieval_model=RetrievalModel(
            business_domain="project",
            datasets="both",
            rerank_enable=True,
            top_k=5,
            vector_weight=0.7,
            rerank_blend_weight=0.3
        ),
        metadata_filters=[
            MetadataFilter("tags", ["案例"], "containsAny")
        ]
    )
    print(f"[OK] 高级检索成功: {result['total']} 条结果")
    for chunk in result["chunks"][:3]:
        print(f"    - [{chunk['score']:.3f}] {chunk['title']}")

    return True


if __name__ == "__main__":
    try:
        test_sdk()
        test_sync()
        test_rag_demo()

        print("\n" + "=" * 70)
        print("[PASS] 所有测试通过！")
        print("=" * 70)
    except Exception as e:
        print(f"\n[FAIL] 测试失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
