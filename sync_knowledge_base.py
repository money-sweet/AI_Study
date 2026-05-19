"""
知识库同步脚本
将 Knowhow 知识库文档批量同步到本地
"""
import json
import os
from pathlib import Path
from datetime import datetime
from typing import Set, List, Dict, Any
from knowhow_client import KnowhowClient, RetrievalModel, MetadataFilter


class KnowledgeBaseSync:
    """知识库同步器"""

    def __init__(self, api_key: str, output_dir: str = "./knowhow_data"):
        self.client = KnowhowClient(api_key)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.docs_dir = self.output_dir / "documents"
        self.docs_dir.mkdir(exist_ok=True)
        self.index_file = self.output_dir / "index.json"
        self.metadata_file = self.output_dir / "metadata.json"

    def _load_index(self) -> Dict[str, Any]:
        """加载本地索引"""
        if self.index_file.exists():
            with open(self.index_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"documents": {}, "last_sync": None}

    def _save_index(self, index: Dict[str, Any]):
        """保存本地索引"""
        with open(self.index_file, "w", encoding="utf-8") as f:
            json.dump(index, f, indent=2, ensure_ascii=False)

    def _get_doc_filename(self, doc_id: str) -> Path:
        """获取文档存储路径"""
        return self.docs_dir / f"{doc_id}.json"

    def discover_documents(self, strategies: List[Dict] = None) -> Set[str]:
        """
        发现所有文档 ID
        通过多种检索策略批量获取文档列表
        """
        if strategies is None:
            strategies = [
                {"query": "", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "", "retrieval_model": RetrievalModel(business_domain="contract", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "案例", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "方案", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "行业", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "数字化", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "报表", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "BI", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "数据", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "FineReport", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "FineBI", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "JDY", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "", "metadata_filters": [MetadataFilter("quality", "严选", "equals")], "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "", "metadata_filters": [MetadataFilter("quality", "普通", "equals")], "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "零售", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "制造", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "医疗", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
                {"query": "金融", "retrieval_model": RetrievalModel(business_domain="project", datasets="summary", rerank_enable=False, top_k=500)},
            ]

        doc_ids: Set[str] = set()
        total_chunks = 0

        print(f"开始发现文档，共 {len(strategies)} 种检索策略...")

        for i, strategy in enumerate(strategies, 1):
            try:
                query = strategy.get("query", "")
                filters = strategy.get("metadata_filters", [])
                desc = query if query else f"filter:{[f.key for f in filters]}"
                print(f"\n  策略 {i}/{len(strategies)}: {desc} ...", end=" ")

                result = self.client.retrieve(**strategy)
                chunks = result.get("chunks", [])
                total_chunks += len(chunks)

                for chunk in chunks:
                    doc_id = chunk.get("doc_id")
                    if doc_id:
                        doc_ids.add(doc_id)

                print(f"发现 {len(chunks)} 个 chunk，累计 {len(doc_ids)} 个唯一文档")
            except Exception as e:
                print(f"失败: {e}")
                continue

        print(f"\n[OK] 文档发现完成: 共 {len(doc_ids)} 个唯一文档，{total_chunks} 个 chunk")
        return doc_ids

    def sync_document(self, doc_id: str) -> bool:
        """
        同步单个文档
        通过 get_document API 获取完整文档
        """
        try:
            doc = self.client.get_document(doc_id)

            # 添加同步时间戳
            doc["synced_at"] = datetime.now().isoformat()

            # 保存到本地
            filepath = self._get_doc_filename(doc_id)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(doc, f, indent=2, ensure_ascii=False)

            return True
        except Exception as e:
            print(f"  同步文档 {doc_id} 失败: {e}")
            return False

    def sync_all(self, incremental: bool = True):
        """
        同步所有文档

        Args:
            incremental: 是否增量同步（只同步新文档）
        """
        index = self._load_index()
        existing_ids = set(index.get("documents", {}).keys())

        # 发现所有文档
        doc_ids = self.discover_documents()

        # 筛选需要同步的文档
        if incremental:
            to_sync = doc_ids - existing_ids
            print(f"\n增量同步: 发现 {len(doc_ids)} 个文档，其中 {len(to_sync)} 个为新文档")
        else:
            to_sync = doc_ids
            print(f"\n全量同步: 共 {len(to_sync)} 个文档需要同步")

        if not to_sync:
            print("没有需要同步的文档")
            return

        # 同步每个文档
        success = 0
        failed = 0

        for i, doc_id in enumerate(sorted(to_sync), 1):
            print(f"\n  [{i}/{len(to_sync)}] 同步文档 {doc_id} ...", end=" ")
            if self.sync_document(doc_id):
                success += 1
                # 更新索引
                filepath = self._get_doc_filename(doc_id)
                index["documents"][doc_id] = {
                    "synced_at": datetime.now().isoformat(),
                    "filepath": str(filepath.relative_to(self.output_dir))
                }
                print("[OK]")
            else:
                failed += 1
                print("[FAIL]")

        # 保存索引
        index["last_sync"] = datetime.now().isoformat()
        self._save_index(index)

        # 保存元数据汇总
        self._save_metadata_summary(index)

        print(f"\n{'='*60}")
        print(f"同步完成: 成功 {success}，失败 {failed}")
        print(f"数据目录: {self.output_dir.absolute()}")
        print(f"{'='*60}")

    def _save_metadata_summary(self, index: Dict):
        """保存元数据汇总"""
        summary = {
            "total_documents": len(index.get("documents", {})),
            "last_sync": index.get("last_sync"),
            "customers": set(),
            "authors": set(),
            "industries": set(),
            "products": set(),
            "tags": set()
        }

        for doc_id in index.get("documents", {}):
            filepath = self._get_doc_filename(doc_id)
            if filepath.exists():
                with open(filepath, "r", encoding="utf-8") as f:
                    doc = json.load(f)
                meta = doc.get("metadata", {})
                summary["customers"].add(meta.get("customer", ""))
                summary["authors"].add(meta.get("author", ""))
                summary["industries"].update(meta.get("industry", []))
                summary["products"].update(meta.get("products", []))
                summary["tags"].update(meta.get("tags", []))

        # 转换为列表并保存
        summary["customers"] = sorted([c for c in summary["customers"] if c])
        summary["authors"] = sorted([a for a in summary["authors"] if a])
        summary["industries"] = sorted([i for i in summary["industries"] if i])
        summary["products"] = sorted([p for p in summary["products"] if p])
        summary["tags"] = sorted([t for t in summary["tags"] if t])

        with open(self.metadata_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

    def export_to_markdown(self, output_file: str = "knowhow_export.md"):
        """将所有同步的文档导出为 Markdown 格式"""
        index = self._load_index()
        docs = index.get("documents", {})

        if not docs:
            print("没有已同步的文档")
            return

        md_lines = ["# Knowhow 知识库导出\n", f"\n> 导出时间: {datetime.now().isoformat()}\n"]
        md_lines.append(f"> 文档总数: {len(docs)}\n\n")
        md_lines.append("---\n\n")

        for doc_id in sorted(docs.keys()):
            filepath = self._get_doc_filename(doc_id)
            if not filepath.exists():
                continue

            with open(filepath, "r", encoding="utf-8") as f:
                doc = json.load(f)

            title = doc.get("title", "无标题")
            meta = doc.get("metadata", {})
            chunks = doc.get("chunks", [])
            full_summary = doc.get("full_summary", "")

            md_lines.append(f"## {title}\n\n")
            md_lines.append(f"- **文档 ID**: `{doc_id}`\n")
            md_lines.append(f"- **作者**: {meta.get('author', 'N/A')}\n")
            md_lines.append(f"- **客户**: {meta.get('customer', 'N/A')}\n")
            md_lines.append(f"- **行业**: {', '.join(meta.get('industry', []))}\n")
            md_lines.append(f"- **产品线**: {', '.join(meta.get('products', []))}\n")
            md_lines.append(f"- **标签**: {', '.join(meta.get('tags', []))}\n")
            md_lines.append(f"- **质量**: {meta.get('quality', 'N/A')}\n")
            md_lines.append(f"- **链接**: {meta.get('link', 'N/A')}\n")
            md_lines.append(f"- **同步时间**: {doc.get('synced_at', 'N/A')}\n\n")

            # 添加完整摘要
            if full_summary:
                md_lines.append("### 摘要\n\n")
                md_lines.append(full_summary)
                md_lines.append("\n\n")

            # 合并所有 chunk 的内容
            if chunks:
                md_lines.append("### 内容\n\n")
                for chunk in chunks:
                    content = chunk.get("content", "").strip()
                    if content:
                        md_lines.append(content)
                        md_lines.append("\n\n")

            md_lines.append("---\n\n")

        output_path = self.output_dir / output_file
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("".join(md_lines))

        print(f"\n[OK] Markdown 导出完成: {output_path.absolute()}")


if __name__ == "__main__":
    API_KEY = "frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ"
    syncer = KnowledgeBaseSync(API_KEY)

    print("=" * 60)
    print("Knowhow 知识库同步工具")
    print("=" * 60)
    print("\n请选择操作:")
    print("  1. 增量同步所有文档")
    print("  2. 全量同步所有文档")
    print("  3. 导出为 Markdown")
    print("  4. 仅发现文档（不下载）")

    choice = input("\n输入选项 (1/2/3/4): ").strip()

    if choice == "1":
        syncer.sync_all(incremental=True)
    elif choice == "2":
        confirm = input("全量同步会覆盖已有数据，确认吗？(y/N): ").strip().lower()
        if confirm == "y":
            syncer.sync_all(incremental=False)
    elif choice == "3":
        syncer.export_to_markdown()
    elif choice == "4":
        doc_ids = syncer.discover_documents()
        print(f"\n发现 {len(doc_ids)} 个文档")
    else:
        print("无效选项")
