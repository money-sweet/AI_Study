import hashlib
from typing import List, Dict
import chromadb
from chromadb.config import Settings

from config import (
    VECTOR_DB_DIR,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
    KIMI_API_KEY,
    KIMI_BASE_URL,
    KIMI_EMBED_MODEL,
)
from openai import OpenAI


class KnowledgeBase:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=str(VECTOR_DB_DIR),
            settings=Settings(anonymized_telemetry=False),
        )
        self.collection = self.client.get_or_create_collection(
            name="ai_product_kb",
            metadata={"hnsw:space": "cosine"},
        )
        self.embed_client = OpenAI(
            api_key=KIMI_API_KEY,
            base_url=KIMI_BASE_URL,
        )

    def _chunk_text(self, text: str) -> List[str]:
        """滑动窗口分块"""
        chunks = []
        start = 0
        while start < len(text):
            end = start + CHUNK_SIZE
            chunk = text[start:end]
            chunks.append(chunk)
            start += CHUNK_SIZE - CHUNK_OVERLAP
        return chunks

    def _get_embedding(self, texts: List[str]) -> List[List[float]]:
        """调用 Kimi Embedding API，自动分批"""
        all_embeddings = []
        batch_size = 50  # Kimi embedding 批量限制
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            resp = self.embed_client.embeddings.create(
                model=KIMI_EMBED_MODEL,
                input=batch,
            )
            all_embeddings.extend([item.embedding for item in resp.data])
        return all_embeddings

    def add_documents(self, docs: List[Dict]):
        """
        docs: [{"url": "...", "title": "...", "content": "..."}, ...]
        """
        all_ids, all_embeddings, all_metadatas, all_documents = [], [], [], []

        for doc in docs:
            if not doc.get("content") or not doc.get("success", True):
                continue

            chunks = self._chunk_text(doc["content"])
            print(f"[KB] {doc['url']} -> {len(chunks)} chunks")

            for idx, chunk in enumerate(chunks):
                chunk_id = hashlib.md5(
                    f"{doc['url']}#{idx}".encode()
                ).hexdigest()

                all_ids.append(chunk_id)
                all_metadatas.append({
                    "url": doc["url"],
                    "title": doc["title"],
                    "chunk_index": idx,
                })
                all_documents.append(chunk)

        if all_documents:
            print(f"[KB] Embedding {len(all_documents)} chunks...")
            embeddings = self._get_embedding(all_documents)

            self.collection.add(
                ids=all_ids,
                embeddings=embeddings,
                metadatas=all_metadatas,
                documents=all_documents,
            )
            print("[KB] Index built successfully.")
        else:
            print("[KB] No documents to index.")

    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """向量检索"""
        query_embed = self._get_embedding([query])[0]

        results = self.collection.query(
            query_embeddings=[query_embed],
            n_results=top_k,
        )

        hits = []
        for i in range(len(results["ids"][0])):
            hits.append({
                "id": results["ids"][0][i],
                "content": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
            })
        return hits

    def clear(self):
        """清空知识库"""
        try:
            self.client.delete_collection("ai_product_kb")
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name="ai_product_kb",
            metadata={"hnsw:space": "cosine"},
        )
