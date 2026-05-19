"""
Knowhow 知识库 API Python SDK
封装了 digitchat.fanruan.com/dataset/api/v1 下的所有接口
"""
import requests
import json
import os
from typing import List, Dict, Optional, Any, Union
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class RetrievalModel:
    """检索模型配置"""
    business_domain: str = "project"  # "project" 或 "contract"
    datasets: str = "both"  # "summary" / "chunk" / "both"
    rerank_enable: bool = True
    top_k: int = 50  # 1-500
    score_threshold: Optional[float] = None
    vector_weight: Optional[float] = None  # 0-1
    rerank_blend_weight: Optional[float] = None  # 0-1

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        # 移除 None 值
        return {k: v for k, v in d.items() if v is not None}


@dataclass
class MetadataFilter:
    """元数据过滤条件"""
    key: str  # author, customer, industry, products, quality, tags, node_path
    value: Union[str, int, List[str]]
    operator: str  # equals, containsAny, in, gte, lte, gt, lt

    def to_dict(self) -> Dict[str, Any]:
        return {
            "value": self.value,
            "operator": self.operator
        }


class KnowhowClient:
    """Knowhow 知识库 API 客户端"""

    def __init__(self, api_key: str, base_url: str = "https://digitchat.fanruan.com/dataset"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def _request(self, method: str, path: str, **kwargs) -> Dict[str, Any]:
        """发送 HTTP 请求"""
        url = f"{self.base_url}{path}"
        resp = requests.request(method, url, headers=self.headers, timeout=30, **kwargs)

        if resp.status_code == 401:
            raise AuthenticationError("API Key 无效或已过期")
        elif resp.status_code == 404:
            raise NotFoundError(f"资源不存在: {path}")
        elif resp.status_code >= 500:
            raise ServerError(f"服务器错误 ({resp.status_code}): {resp.text[:200]}")

        resp.raise_for_status()
        return resp.json()

    def retrieve(
        self,
        query: str,
        retrieval_model: Optional[RetrievalModel] = None,
        metadata_filters: Optional[List[MetadataFilter]] = None
    ) -> Dict[str, Any]:
        """
        知识库检索（RAG）

        Args:
            query: 查询内容（为空字符串时退化为纯数据过滤）
            retrieval_model: 检索模型配置
            metadata_filters: 元数据过滤条件

        Returns:
            {"chunks": [...], "total": int}
        """
        payload: Dict[str, Any] = {"query": query}

        if retrieval_model:
            payload["retrieval_model"] = retrieval_model.to_dict()

        if metadata_filters:
            filters = {}
            for f in metadata_filters:
                filters[f.key] = f.to_dict()
            payload["metadata_filters"] = filters

        return self._request("POST", "/api/v1/retrieve", json=payload)

    def filter_documents(
        self,
        metadata_filters: List[MetadataFilter],
        business_domain: str = "project",
        datasets: str = "summary",
        top_k: int = 100
    ) -> Dict[str, Any]:
        """
        纯数据过滤（不按向量检索，仅按元数据筛选）

        Args:
            metadata_filters: 元数据过滤条件
            business_domain: 业务域
            datasets: 检索策略
            top_k: 返回数量上限

        Returns:
            {"chunks": [...], "total": int}
        """
        retrieval_model = RetrievalModel(
            business_domain=business_domain,
            datasets=datasets,
            rerank_enable=False,
            top_k=top_k
        )
        return self.retrieve(query="", retrieval_model=retrieval_model, metadata_filters=metadata_filters)

    def get_document(self, document_id: str) -> Dict[str, Any]:
        """
        获取文档详情

        Args:
            document_id: 文档 UUID

        Returns:
            文档详细信息
        """
        return self._request("GET", f"/api/v1/datasets/documents/{document_id}")

    def search_by_author(self, author: str, top_k: int = 100) -> Dict[str, Any]:
        """按作者筛选文档"""
        return self.filter_documents(
            metadata_filters=[MetadataFilter("author", author, "equals")],
            top_k=top_k
        )

    def search_by_customer(self, customer: str, top_k: int = 100) -> Dict[str, Any]:
        """按客户名称筛选文档"""
        return self.filter_documents(
            metadata_filters=[MetadataFilter("customer", customer, "equals")],
            top_k=top_k
        )

    def search_by_tags(self, tags: List[str], top_k: int = 100) -> Dict[str, Any]:
        """按标签筛选文档"""
        return self.filter_documents(
            metadata_filters=[MetadataFilter("tags", tags, "containsAny")],
            top_k=top_k
        )

    def search_by_industry(self, industries: List[str], top_k: int = 100) -> Dict[str, Any]:
        """按行业筛选文档"""
        return self.filter_documents(
            metadata_filters=[MetadataFilter("industry", industries, "containsAny")],
            top_k=top_k
        )

    def search_by_quality(self, quality: str, top_k: int = 100) -> Dict[str, Any]:
        """按内容质量筛选文档"""
        return self.filter_documents(
            metadata_filters=[MetadataFilter("quality", quality, "equals")],
            top_k=top_k
        )

    def rag_query(
        self,
        question: str,
        business_domain: str = "project",
        top_k: int = 10,
        rerank_enable: bool = True,
        **filters
    ) -> Dict[str, Any]:
        """
        RAG 查询（简化版）

        Args:
            question: 查询问题
            business_domain: 业务域
            top_k: 返回数量
            rerank_enable: 是否启用精排
            **filters: 可选过滤条件，如 author="张三", tags=["零售"]

        Returns:
            {"chunks": [...], "total": int}
        """
        retrieval_model = RetrievalModel(
            business_domain=business_domain,
            datasets="both",
            rerank_enable=rerank_enable,
            top_k=top_k
        )

        metadata_filters = []
        for key, value in filters.items():
            if key in ["author", "customer", "quality"]:
                metadata_filters.append(MetadataFilter(key, value, "equals"))
            elif key in ["tags", "industry", "products", "node_path"]:
                if isinstance(value, str):
                    value = [value]
                metadata_filters.append(MetadataFilter(key, value, "containsAny"))

        return self.retrieve(
            query=question,
            retrieval_model=retrieval_model,
            metadata_filters=metadata_filters if metadata_filters else None
        )


# 异常类
class AuthenticationError(Exception):
    """认证失败"""
    pass


class NotFoundError(Exception):
    """资源不存在"""
    pass


class ServerError(Exception):
    """服务器错误"""
    pass


if __name__ == "__main__":
    # 快速测试
    client = KnowhowClient(api_key="frg_PWo94DnefT7_EiaBTF6waWap4TkY6JqvFUzFaO09ys32A-RDkessKQ")

    print("=" * 60)
    print("测试1: RAG 检索")
    print("=" * 60)
    result = client.rag_query("零售行业的成功案例有哪些？", top_k=3)
    print(f"返回数量: {result['total']}")
    for chunk in result["chunks"]:
        print(f"\n- [{chunk['doc_id']}] {chunk['title']}")
        print(f"  Score: {chunk['score']:.3f}")
        print(f"  Author: {chunk['metadata'].get('author', 'N/A')}")
        print(f"  Link: {chunk['metadata'].get('link', 'N/A')}")
        print(f"  Content: {chunk['content'][:100]}...")

    print("\n" + "=" * 60)
    print("测试2: 按作者过滤")
    print("=" * 60)
    result = client.search_by_author("张三", top_k=5)
    print(f"返回数量: {result['total']}")
